export const lessonQuestions = {
  'cell-1': [
    {
      id: 'cell-1-q1',
      type: 'mcq',
      prompt: 'Which organelle contains genetic material in a cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Golgi apparatus'],
      answer: 'Nucleus'
    },
    {
      id: 'cell-1-q2',
      type: 'tf',
      prompt: 'Plant cells have a cell wall made of cellulose.',
      answer: true
    },
    {
      id: 'cell-1-q3',
      type: 'mcq',
      prompt: 'What is the function of mitochondria?',
      options: ['Protein synthesis', 'Energy production', 'Storage of DNA', 'Cell division'],
      answer: 'Energy production'
    }
  ],
  'cell-2': [
    {
      id: 'cell-2-q1',
      type: 'mcq',
      prompt: 'Which process moves water across a selectively permeable membrane?',
      options: ['Active transport', 'Endocytosis', 'Osmosis', 'Exocytosis'],
      answer: 'Osmosis'
    },
    {
      id: 'cell-2-q2',
      type: 'tf',
      prompt: 'Diffusion requires energy from ATP.',
      answer: false
    },
    {
      id: 'cell-2-q3',
      type: 'mcq',
      prompt: 'Which transport method moves substances against their concentration gradient?',
      options: ['Diffusion', 'Facilitated diffusion', 'Osmosis', 'Active transport'],
      answer: 'Active transport'
    }
  ],
  'cell-3': [
    {
      id: 'cell-3-q1',
      type: 'mcq',
      prompt: 'DNA is arranged into structures called...',
      options: ['Genes', 'Chromosomes', 'Ribosomes', 'Codons'],
      answer: 'Chromosomes'
    },
    {
      id: 'cell-3-q2',
      type: 'tf',
      prompt: 'Each gene codes for a specific protein.',
      answer: true
    },
    {
      id: 'cell-3-q3',
      type: 'mcq',
      prompt: 'What is the probability of a dominant trait appearing if one parent is homozygous dominant and the other is homozygous recessive?',
      options: ['0%', '25%', '50%', '100%'],
      answer: '100%'
    }
  ],
  'eco-1': [
    {
      id: 'eco-1-q1',
      type: 'mcq',
      prompt: 'What term describes all the organisms and non-living factors in an area?',
      options: ['Population', 'Community', 'Ecosystem', 'Habitat'],
      answer: 'Ecosystem'
    },
    {
      id: 'eco-1-q2',
      type: 'tf',
      prompt: 'An apex predator has no natural predators in its ecosystem.',
      answer: true
    },
    {
      id: 'eco-1-q3',
      type: 'mcq',
      prompt: 'Which process adds new nitrogen to the soil?',
      options: ['Respiration', 'Nitrogen fixation', 'Combustion', 'Photosynthesis'],
      answer: 'Nitrogen fixation'
    }
  ]
};

export const fallbackQuestions = [
  {
    id: 'general-q1',
    type: 'mcq',
    prompt: 'Which molecule carries genetic information?',
    options: ['Glucose', 'DNA', 'Water', 'Cholesterol'],
    answer: 'DNA'
  },
  {
    id: 'general-q2',
    type: 'tf',
    prompt: 'All living things are made of cells.',
    answer: true
  },
  {
    id: 'general-q3',
    type: 'mcq',
    prompt: 'What is the basic unit of life?',
    options: ['Atom', 'Cell', 'Tissue', 'Organ'],
    answer: 'Cell'
  }
];
