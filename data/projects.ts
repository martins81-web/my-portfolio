export type Project = {
  slug: string
  title: string
  description: string
  technology: 'React' | 'Angular' | 'Vue' | 'Next.js'
  problem: string
  features: string[]
  challenges: string[]
  learnings: string[]
}

export const projects: Project[] = [
  {
    slug: 'react-admin-dashboard',
    title: 'Smart Admin Dashboard',
    description: 'Admin dashboard with charts, tables and API integration.',
    technology: 'React',
    problem:
      'Internal teams need a clear and fast way to visualize data and manage users.',
    features: [
      'Reusable UI components',
      'API integration with loading and error states',
      'Dashboard charts and data tables',
    ],
    challenges: [
      'Managing state across multiple components',
      'Keeping components reusable and maintainable',
    ],
    learnings: [
      'Improved component design',
      'Better separation of concerns',
    ],
  },
]
