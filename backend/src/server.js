import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { comparePassword, hashPassword, authenticate, signAccessToken, signRefreshToken } from './utils/auth.js';
import prisma from './prismaClient.js';
import { getWeekStart } from './utils/date.js';
import { lessonPath, lessonById } from './data/lessons.js';
import { SHOP_ITEMS } from './data/shop.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const QUEST_TEMPLATES = [
  {
    code: 'daily-lesson-1',
    title: 'Complete 1 lesson',
    description: 'Finish a single biology lesson today.',
    target: 1,
    rewardXp: 10,
    rewardGems: 20,
    questType: 'lesson-complete'
  },
  {
    code: 'daily-gems-earn',
    title: 'Earn 30 XP',
    description: 'Stack up 30 XP across any lessons.',
    target: 30,
    rewardXp: 0,
    rewardGems: 15,
    questType: 'xp-earn'
  }
];

function sanitizeUser(user) {
  const { passwordHash, refreshToken, ...rest } = user;
  return rest;
}

async function ensureDefaultQuests() {
  await Promise.all(
    QUEST_TEMPLATES.map((quest) =>
      prisma.quest.upsert({
        where: { code: quest.code },
        update: quest,
        create: quest
      })
    )
  );
}

async function ensureQuestProgress(userId) {
  await ensureDefaultQuests();
  const quests = await prisma.quest.findMany({ where: { active: true } });
  await Promise.all(
    quests.map((quest) =>
      prisma.questProgress.upsert({
        where: { userId_questId: { userId, questId: quest.id } },
        update: {},
        create: { userId, questId: quest.id }
      })
    )
  );
}

async function ensureWeeklyXp(userId) {
  const weekStart = getWeekStart();
  const existing = await prisma.weeklyXp.findUnique({ where: { userId } });
  if (!existing) {
    return prisma.weeklyXp.create({ data: { userId, weekStart, xp: 0 } });
  }
  if (existing.weekStart.getTime() !== weekStart.getTime()) {
    return prisma.weeklyXp.update({ where: { userId }, data: { weekStart, xp: 0 } });
  }
  return existing;
}

function buildTokens(userId) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  return { accessToken, refreshToken };
}

async function persistRefreshToken(userId, token) {
  await prisma.user.update({ where: { id: userId }, data: { refreshToken: token } });
}

async function cleanExpiredBoosts(userId) {
  await prisma.boost.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } });
}

async function getActiveBoostMultiplier(userId) {
  await cleanExpiredBoosts(userId);
  const boosts = await prisma.boost.findMany({ where: { userId, expiresAt: { gt: new Date() } } });
  if (!boosts.length) return 1;
  return boosts.reduce((acc, b) => Math.max(acc, b.multiplier), 1);
}

async function applyQuestProgress(userId, xpEarned) {
  const questProgress = await prisma.questProgress.findMany({
    where: { userId },
    include: { quest: true }
  });
  const updates = [];
  for (const qp of questProgress) {
    if (qp.completed) continue;
    if (qp.quest.questType === 'lesson-complete') {
      updates.push(
        prisma.questProgress.update({
          where: { id: qp.id },
          data: {
            progress: { increment: 1 },
            completed: qp.progress + 1 >= qp.quest.target
          }
        })
      );
    }
    if (qp.quest.questType === 'xp-earn') {
      updates.push(
        prisma.questProgress.update({
          where: { id: qp.id },
          data: {
            progress: { increment: xpEarned },
            completed: qp.progress + xpEarned >= qp.quest.target
          }
        })
      );
    }
  }
  const results = await Promise.all(updates);
  const completed = results.filter((r) => r.completed);
  if (completed.length) {
    const questIds = completed.map((c) => c.questId);
    const quests = await prisma.quest.findMany({ where: { id: { in: questIds } } });
    let rewardXp = 0;
    let rewardGems = 0;
    quests.forEach((q) => {
      rewardXp += q.rewardXp;
      rewardGems += q.rewardGems;
    });
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: rewardXp }, gems: { increment: rewardGems } }
    });
    await ensureWeeklyXp(userId);
    if (rewardXp > 0) {
      await prisma.weeklyXp.update({ where: { userId }, data: { xp: { increment: rewardXp } } });
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      xp: 0,
      gems: 0,
      streak: 0,
      profile: { create: { displayName: displayName || email.split('@')[0] } },
      weeklyXp: { create: { weekStart: getWeekStart(), xp: 0 } }
    },
    include: { profile: true, weeklyXp: true }
  });
  await ensureQuestProgress(user.id);
  const { accessToken, refreshToken } = buildTokens(user.id);
  await persistRefreshToken(user.id, refreshToken);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: sanitizeUser(user), accessToken, refreshToken });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true, weeklyXp: true } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  await ensureQuestProgress(user.id);
  await ensureWeeklyXp(user.id);
  const { accessToken, refreshToken } = buildTokens(user.id);
  await persistRefreshToken(user.id, refreshToken);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: sanitizeUser(user), accessToken, refreshToken });
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  await ensureWeeklyXp(req.user.id);
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { profile: true, weeklyXp: true } });
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/logout', authenticate, async (req, res) => {
  await prisma.user.update({ where: { id: req.user.id }, data: { refreshToken: null } });
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

app.get('/api/lessons', authenticate, async (req, res) => {
  const completions = await prisma.progress.findMany({ where: { userId: req.user.id } });
  const completedSet = new Set(completions.map((c) => c.lessonId));
  const lessons = lessonPath.map((lesson) => ({
    ...lesson,
    locked: lesson.prerequisites.some((prereq) => !completedSet.has(prereq)),
    completed: completedSet.has(lesson.id)
  }));
  res.json({ lessons });
});

app.post('/api/lessons/:lessonId/complete', authenticate, async (req, res) => {
  const lesson = lessonById(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const completions = await prisma.progress.findMany({ where: { userId: req.user.id } });
  const completedSet = new Set(completions.map((c) => c.lessonId));
  const locked = lesson.prerequisites.some((p) => !completedSet.has(p));
  if (locked) return res.status(400).json({ error: 'Complete prerequisites first' });

  const multiplier = await getActiveBoostMultiplier(req.user.id);
  const xpEarned = Math.round(lesson.xp * multiplier);
  const gemEarned = 10;

  const progress = await prisma.progress.create({
    data: {
      userId: req.user.id,
      lessonId: lesson.id,
      xpEarned,
      gemsEarned: gemEarned
    }
  });

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      xp: { increment: xpEarned },
      gems: { increment: gemEarned },
      streak: { increment: 1 },
      lastLessonAt: new Date()
    },
    include: { profile: true }
  });

  await ensureWeeklyXp(req.user.id);
  await prisma.weeklyXp.update({ where: { userId: req.user.id }, data: { xp: { increment: xpEarned } } });
  await ensureQuestProgress(req.user.id);
  await applyQuestProgress(req.user.id, xpEarned);
  const freshUser = await prisma.user.findUnique({ where: { id: req.user.id }, include: { profile: true, weeklyXp: true } });

  res.json({
    progress,
    user: sanitizeUser(freshUser),
    lesson,
    xpEarned,
    gemEarned,
    multiplier
  });
});

app.get('/api/shop/items', authenticate, (_req, res) => {
  res.json({ items: SHOP_ITEMS });
});

app.post('/api/shop/buy', authenticate, async (req, res) => {
  const { itemId } = req.body;
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (user.gems < item.costGems) return res.status(400).json({ error: 'Not enough gems' });
  await prisma.user.update({ where: { id: user.id }, data: { gems: { decrement: item.costGems } } });
  const inventory = await prisma.inventory.upsert({
    where: { userId_itemId: { userId: user.id, itemId } },
    update: { quantity: { increment: 1 } },
    create: { userId: user.id, itemId, quantity: 1 }
  });
  res.json({ inventory, gems: user.gems - item.costGems });
});

app.get('/api/boosts/active', authenticate, async (req, res) => {
  await cleanExpiredBoosts(req.user.id);
  const boosts = await prisma.boost.findMany({ where: { userId: req.user.id, expiresAt: { gt: new Date() } } });
  res.json({ boosts });
});

app.post('/api/boosts/activate', authenticate, async (req, res) => {
  const { itemId } = req.body;
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const inventory = await prisma.inventory.findUnique({ where: { userId_itemId: { userId: req.user.id, itemId } } });
  if (!inventory || inventory.quantity <= 0) return res.status(400).json({ error: 'No boost in inventory' });

  const expiresAt = new Date(Date.now() + item.durationMinutes * 60 * 1000);
  await prisma.boost.create({ data: { userId: req.user.id, itemId, multiplier: item.multiplier, expiresAt } });
  const updatedInventory = await prisma.inventory.update({
    where: { id: inventory.id },
    data: { quantity: { decrement: 1 } }
  });
  const boosts = await prisma.boost.findMany({ where: { userId: req.user.id, expiresAt: { gt: new Date() } } });
  res.json({ boosts, inventory: updatedInventory });
});

app.get('/api/quests', authenticate, async (req, res) => {
  await ensureQuestProgress(req.user.id);
  const quests = await prisma.questProgress.findMany({
    where: { userId: req.user.id },
    include: { quest: true }
  });
  res.json({ quests });
});

app.get('/api/inventory', authenticate, async (req, res) => {
  const inventory = await prisma.inventory.findMany({ where: { userId: req.user.id } });
  res.json({ inventory });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await ensureDefaultQuests();
  console.log(`API listening on port ${PORT}`);
});
