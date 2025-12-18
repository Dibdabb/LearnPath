import express from 'express';
import cors from 'cors';
import { users, lessons, progress, recordCompletion } from './data/mockDb.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.get('/api/lessons', (_req, res) => {
  res.json(lessons);
});

app.post('/api/lessons/:id/complete', (req, res) => {
  const lesson = lessons.find((l) => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const entry = recordCompletion(userId, lesson.id, lesson.xp);
  res.json({ message: 'Lesson completed', progress: entry });
});

app.get('/api/leaderboard', (_req, res) => {
  const leaderboard = users
    .map((user) => ({ id: user.id, name: user.name, totalXP: user.totalXP, streak: user.streak }))
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, 10);
  res.json(leaderboard);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
