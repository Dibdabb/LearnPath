import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getWeekStart } from '../src/utils/date.js';

const prisma = new PrismaClient();

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

async function main() {
  await Promise.all(
    QUEST_TEMPLATES.map((quest) =>
      prisma.quest.upsert({
        where: { code: quest.code },
        update: quest,
        create: quest
      })
    )
  );

  const demoEmail = 'demo@learnpath.dev';
  const existing = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        passwordHash,
        xp: 0,
        gems: 50,
        streak: 0,
        profile: { create: { displayName: 'Demo Learner' } },
        weeklyXp: { create: { weekStart: getWeekStart(), xp: 0 } }
      }
    });

    const quests = await prisma.quest.findMany({ where: { active: true } });
    await Promise.all(
      quests.map((quest) =>
        prisma.questProgress.create({
          data: {
            userId: user.id,
            questId: quest.id
          }
        })
      )
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
