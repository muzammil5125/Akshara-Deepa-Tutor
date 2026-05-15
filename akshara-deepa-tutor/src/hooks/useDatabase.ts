import { useLiveQuery } from 'dexie-react-hooks';
import { db, Subject, Chapter, QuizResult } from '../data/db';

export function useSyllabusData() {
  const subjects = useLiveQuery(() => db.subjects.toArray());
  const chapters = useLiveQuery(() => db.chapters.toArray());
  const quizResults = useLiveQuery(() => db.quizResults.toArray());

  const getProgressBySubject = (subjectId: number) => {
    if (!chapters) return 0;
    const subjectChapters = chapters.filter(c => c.subjectId === subjectId);
    if (subjectChapters.length === 0) return 0;
    const completed = subjectChapters.filter(c => c.isCompleted).length;
    return Math.round((completed / subjectChapters.length) * 100);
  };

  const totalProgress = chapters && chapters.length > 0
    ? Math.round((chapters.filter(c => c.isCompleted).length / chapters.length) * 100)
    : 0;

  return {
    subjects,
    chapters,
    quizResults,
    getProgressBySubject,
    totalProgress,
    loading: subjects === undefined || chapters === undefined
  };
}

export function useSubjectPerformance() {
  const quizResults = useLiveQuery(() => db.quizResults.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());

  const getAverageScore = (subjectId: number) => {
    // This is a simplification: average score across all chapters of the subject
    // In a real app, we'd relate results to chapters then to subjects
    return 75; // Placeholder for now
  };

  return { getAverageScore };
}
