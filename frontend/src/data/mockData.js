export const userProfile = {
  id: 1,
  name: 'Ailsa Blair',
  email: 'ailsa@example.com',
  totalXP: 1250,
  gems: 230,
  streak: 5,
  dailyGoal: 'Complete 1 lesson',
  currentLeague: 'Bronze'
};

export const lessons = [
  {
    id: 1,
    title: 'Cell Biology: Cell Structure',
    unit: 'Unit 1: Cell Biology',
    description: 'Identify organelles and their functions.',
    difficulty: 'Foundational',
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
    id: 2,
    title: 'Transport Across Cell Membranes',
    unit: 'Unit 1: Cell Biology',
    description: 'Osmosis, diffusion, and active transport.',
    difficulty: 'Core',
    xp: 30,
    questions: [
      {
        id: 'q3',
        type: 'mcq',
        prompt: 'Osmosis involves the movement of...',
        options: ['Water', 'Protein', 'Starch', 'DNA'],
        answer: 'Water'
      }
    ]
  },
  {
    id: 3,
    title: 'Genetics and Inheritance',
    unit: 'Unit 2: Multicellular Organisms',
    description: 'Monohybrid crosses and Punnett squares.',
    difficulty: 'Challenge',
    xp: 35,
    questions: []
  }
];

export const feedItems = [
  { id: 'f1', text: 'Euan earned 50 XP completing Genetics.', time: '2h ago' },
  { id: 'f2', text: 'Maya unlocked the Cell Biology badge.', time: '4h ago' },
  { id: 'f3', text: 'Ailsa kept her streak with a quick review.', time: 'Yesterday' }
];
