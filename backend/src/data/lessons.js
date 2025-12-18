export const lessonPath = [
  {
    id: 'cell-1',
    title: 'Cell Structure',
    unit: 'Unit 1: Cell Biology',
    xp: 20,
    prerequisites: [],
    description: 'Identify organelles and their functions.'
  },
  {
    id: 'cell-2',
    title: 'Membrane Transport',
    unit: 'Unit 1: Cell Biology',
    xp: 25,
    prerequisites: ['cell-1'],
    description: 'Diffusion, osmosis, and active transport.'
  },
  {
    id: 'cell-3',
    title: 'Genetics Basics',
    unit: 'Unit 2: Multicellular Organisms',
    xp: 30,
    prerequisites: ['cell-2'],
    description: 'DNA structure and inheritance patterns.'
  },
  {
    id: 'eco-1',
    title: 'Ecosystems',
    unit: 'Unit 3: Life on Earth',
    xp: 25,
    prerequisites: ['cell-3'],
    description: 'Food webs and biotic factors.'
  }
];

export function lessonById(id) {
  return lessonPath.find((l) => l.id === id);
}
