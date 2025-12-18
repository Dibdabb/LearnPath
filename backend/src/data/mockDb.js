import { nanoid } from 'nanoid';

export const users = [
  {
    id: 'u1',
    name: 'Ailsa Blair',
    email: 'ailsa@example.com',
    password: 'hashed-password',
    totalXP: 1250,
    gems: 230,
    streak: 5,
    lastLoginDate: '2025-12-18',
    league: 'Bronze'
  }
];

export const lessons = [
  {
    id: 'l1',
    title: 'Cell Structure',
    unit: 'Cell Biology',
    xp: 20,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        prompt: 'Which organelle controls the cell?',
        options: ['Mitochondrion', 'Nucleus', 'Ribosome', 'Chloroplast'],
        answer: 'Nucleus'
      },
      {
        id: 'q2',
        type: 'tf',
        prompt: 'Plant cells contain chloroplasts.',
        answer: true
      }
    ]
  },
  {
    id: 'l2',
    title: 'Transport Across Membranes',
    unit: 'Cell Biology',
    xp: 30,
    questions: []
  }
];

export const progress = [
  {
    id: 'p1',
    userId: 'u1',
    lessonId: 'l1',
    xpEarned: 20,
    completedAt: '2025-12-17'
  }
];

export function recordCompletion(userId, lessonId, xpEarned) {
  const entry = {
    id: nanoid(),
    userId,
    lessonId,
    xpEarned,
    completedAt: new Date().toISOString()
  };
  progress.push(entry);
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.totalXP += xpEarned;
    user.gems += 5;
    user.streak += 1;
  }
  return entry;
}
