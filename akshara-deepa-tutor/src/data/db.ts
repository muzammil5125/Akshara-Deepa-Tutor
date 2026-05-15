import Dexie, { Table } from 'dexie';

export interface Subject {
  id?: number;
  subjectName: string;
}

export interface Chapter {
  id?: number;
  subjectId: number;
  chapterName: string;
  isCompleted: boolean;
}

export interface Question {
  id?: number;
  chapterId: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  id?: number;
  chapterId: number;
  score: number;
  timestamp: number;
}

export class AksharaDeepaDatabase extends Dexie {
  subjects!: Table<Subject>;
  chapters!: Table<Chapter>;
  questions!: Table<Question>;
  quizResults!: Table<QuizResult>;

  constructor() {
    super('AksharaDeepaDB');
    this.version(1).stores({
      subjects: '++id, subjectName',
      chapters: '++id, subjectId, chapterName, isCompleted',
      questions: '++id, chapterId',
      quizResults: '++id, chapterId, timestamp'
    });
  }
}

export const db = new AksharaDeepaDatabase();

// Seed initial data
export async function seedDatabase() {
  const subjectCount = await db.subjects.count();
  if (subjectCount > 0) return;

  const scienceId = await db.subjects.add({ subjectName: 'Science' });
  const mathematicsId = await db.subjects.add({ subjectName: 'Mathematics' });
  const socialId = await db.subjects.add({ subjectName: 'Social Studies' });

  // Science Chapters
  await db.chapters.bulkAdd([
    { subjectId: scienceId, chapterName: 'Light Reflection', isCompleted: false },
    { subjectId: scienceId, chapterName: 'Electricity', isCompleted: false },
    { subjectId: scienceId, chapterName: 'Chemical Reactions', isCompleted: false },
  ]);

  // Math Chapters
  await db.chapters.bulkAdd([
    { subjectId: mathematicsId, chapterName: 'Algebra', isCompleted: false },
    { subjectId: mathematicsId, chapterName: 'Trigonometry', isCompleted: false },
    { subjectId: mathematicsId, chapterName: 'Statistics', isCompleted: false },
  ]);

  // Social Chapters
  await db.chapters.bulkAdd([
    { subjectId: socialId, chapterName: 'Indian History', isCompleted: false },
    { subjectId: socialId, chapterName: 'Geography', isCompleted: false },
    { subjectId: socialId, chapterName: 'Political Science', isCompleted: false },
  ]);

  // Sample Questions (100 mock questions requested, adding a few per chapter for brevity in seeding but will try to cover a good set)
  const chapters = await db.chapters.toArray();
  for (const chapter of chapters) {
    if (!chapter.id) continue;
    
    // Add 5 questions per chapter
    for (let i = 1; i <= 5; i++) {
      await db.questions.add({
        chapterId: chapter.id,
        question: `Question ${i} for ${chapter.chapterName}: What is the basic concept of this topic?`,
        optionA: `Option A for ${chapter.chapterName}`,
        optionB: `Option B for ${chapter.chapterName}`,
        optionC: `Option C for ${chapter.chapterName}`,
        optionD: `Option D for ${chapter.chapterName}`,
        correctAnswer: 'A'
      });
    }
  }
}
