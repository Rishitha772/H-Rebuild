export type SkillCategory =
  | 'Frontend'
  | 'Backend & Systems'
  | 'Database & Storage'
  | 'Cloud & DevOps'
  | 'Data & AI'
  | 'Design & UX'
  | 'Core Engineering';

export interface TaxonomySkill {
  name: string;
  category: SkillCategory;
  aliases?: string[];
}

export const CATEGORIES_LIST: SkillCategory[] = [
  'Frontend',
  'Backend & Systems',
  'Database & Storage',
  'Cloud & DevOps',
  'Data & AI',
  'Design & UX',
  'Core Engineering',
];

export const SKILL_TAXONOMY: TaxonomySkill[] = [
  // Frontend
  { name: 'React', category: 'Frontend', aliases: ['reactjs', 'react.js'] },
  { name: 'TypeScript', category: 'Frontend', aliases: ['ts'] },
  { name: 'JavaScript', category: 'Frontend', aliases: ['js', 'es6'] },
  { name: 'HTML', category: 'Frontend', aliases: ['html5'] },
  { name: 'CSS', category: 'Frontend', aliases: ['css3'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs'] },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Sass / SCSS', category: 'Frontend' },
  { name: 'Redux', category: 'Frontend', aliases: ['redux toolkit'] },
  { name: 'Web Accessibility', category: 'Frontend', aliases: ['a11y', 'wcag'] },

  // Backend & Systems
  { name: 'Python', category: 'Backend & Systems' },
  { name: 'FastAPI', category: 'Backend & Systems' },
  { name: 'Django', category: 'Backend & Systems' },
  { name: 'Java', category: 'Backend & Systems' },
  { name: 'Spring Boot', category: 'Backend & Systems', aliases: ['spring', 'spring boot'] },
  { name: 'Node.js', category: 'Backend & Systems', aliases: ['nodejs'] },
  { name: 'Express', category: 'Backend & Systems', aliases: ['expressjs'] },
  { name: 'Go', category: 'Backend & Systems', aliases: ['golang'] },
  { name: 'Rust', category: 'Backend & Systems' },
  { name: 'C++', category: 'Backend & Systems' },
  { name: 'C#', category: 'Backend & Systems', aliases: ['.net'] },
  { name: 'REST APIs', category: 'Backend & Systems', aliases: ['rest', 'restful'] },
  { name: 'GraphQL', category: 'Backend & Systems' },
  { name: 'Microservices', category: 'Backend & Systems' },

  // Database & Storage
  { name: 'SQL', category: 'Database & Storage', aliases: ['relational database'] },
  { name: 'MySQL', category: 'Database & Storage' },
  { name: 'PostgreSQL', category: 'Database & Storage', aliases: ['postgres'] },
  { name: 'MongoDB', category: 'Database & Storage', aliases: ['mongo'] },
  { name: 'Redis', category: 'Database & Storage' },
  { name: 'Database Indexing', category: 'Database & Storage' },

  // Cloud & DevOps
  { name: 'Docker', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s'] },
  { name: 'GitHub Actions', category: 'Cloud & DevOps', aliases: ['ci/cd'] },
  { name: 'Terraform', category: 'Cloud & DevOps', aliases: ['iac'] },
  { name: 'Linux', category: 'Cloud & DevOps', aliases: ['bash', 'shell'] },
  { name: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services'] },
  { name: 'GCP', category: 'Cloud & DevOps', aliases: ['google cloud'] },

  // Data & AI
  { name: 'Data Analysis', category: 'Data & AI' },
  { name: 'Pandas', category: 'Data & AI' },
  { name: 'Machine Learning', category: 'Data & AI', aliases: ['ml'] },
  { name: 'Scikit-learn', category: 'Data & AI' },
  { name: 'PyTorch', category: 'Data & AI' },
  { name: 'TensorFlow', category: 'Data & AI' },

  // Design & UX
  { name: 'Figma', category: 'Design & UX' },
  { name: 'UI/UX Design', category: 'Design & UX' },
  { name: 'Design Systems', category: 'Design & UX' },
  { name: 'Prototyping', category: 'Design & UX' },
  { name: 'Wireframing', category: 'Design & UX' },
  { name: 'User Research', category: 'Design & UX' },

  // Core Engineering
  { name: 'Git & GitHub', category: 'Core Engineering', aliases: ['git'] },
  { name: 'System Design', category: 'Core Engineering' },
  { name: 'Data Structures & Algorithms', category: 'Core Engineering', aliases: ['dsa'] },
  { name: 'Unit Testing', category: 'Core Engineering', aliases: ['testing', 'pytest', 'jest'] },
  { name: 'Clean Architecture', category: 'Core Engineering' },
];

