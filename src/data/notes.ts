// Shared note data and utilities
export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  isEncrypted?: boolean;
}

// Mock data for demonstration
export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Q4 Planning',
    content: 'Discussed quarterly goals, budget allocation, and team restructuring. Key points: increase marketing spend by 20%, hire 3 new developers, focus on mobile app development.',
    isPinned: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: 'AI-powered note-taking app, Real-time collaboration features, Voice-to-text integration, Smart categorization system.',
    isPinned: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Recipe: Chocolate Chip Cookies',
    content: '2 cups flour, 1 cup butter, 3/4 cup brown sugar, 1/2 cup white sugar, 2 eggs, 2 tsp vanilla extract, 1 tsp baking soda, 1 tsp salt, 2 cups chocolate chips.',
    isPinned: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Book Recommendations',
    content: 'The Pragmatic Programmer, Clean Code, Design Patterns, System Design Interview, Atomic Habits, Deep Work.',
    isPinned: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '5',
    title: 'Travel Itinerary - Japan',
    content: 'Day 1: Tokyo - Shibuya, Harajuku. Day 2: Kyoto - Fushimi Inari, Kiyomizu-dera. Day 3: Osaka - Dotonbori, Osaka Castle.',
    isPinned: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '6',
    title: 'Workout Plan',
    content: 'Monday: Chest & Triceps, Tuesday: Back & Biceps, Wednesday: Legs, Thursday: Shoulders, Friday: Cardio, Weekend: Rest.',
    isPinned: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: '7',
    title: 'Confidential Project Notes',
    content: 'This note contains sensitive information and is password protected.',
    isPinned: true,
    isEncrypted: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  }
];

// Utility function to find a note by ID
export const findNoteById = (id: string): Note | undefined => {
  return mockNotes.find(note => note.id === id);
};

// Utility function to get all notes
export const getAllNotes = (): Note[] => {
  return mockNotes;
};
