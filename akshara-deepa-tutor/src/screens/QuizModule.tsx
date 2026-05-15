import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Question } from '../data/db';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Timer, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function QuizModule() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  const questions = useLiveQuery(() => 
    db.questions.where('chapterId').equals(parseInt(chapterId!)).limit(5).toArray()
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<{questionId: number, isCorrect: boolean, selected: string}[]>([]);

  useEffect(() => {
    if (isFinished || !questions) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isFinished, questions]);

  const handleNext = async (timeout = false) => {
    if (!questions) return;
    
    const currentQuestion = questions[currentIndex];
    const isCorrect = timeout ? false : selectedOption === currentQuestion.correctAnswer;
    
    const newResults = [...results, { 
      questionId: currentQuestion.id!, 
      isCorrect, 
      selected: selectedOption || 'None' 
    }];
    setResults(newResults);

    if (isCorrect) setScore(score + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
      // Save result to DB
      await db.quizResults.add({
        chapterId: parseInt(chapterId!),
        score: isCorrect ? score + 1 : score,
        timestamp: Date.now()
      });
    }
  };

  if (!questions) return <div className="p-10 text-center">Loading Questions...</div>;
  if (questions.length === 0) return <div className="p-10 text-center">No questions available for this chapter.</div>;

  const currentQuestion = questions[currentIndex];

  if (isFinished) {
    return (
      <div className="space-y-8 py-6">
        <section className="text-center space-y-4">
          <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black">
            {score}/{questions.length}
          </div>
          <h2 className="text-2xl font-black text-slate-900">Quiz Completed!</h2>
          <p className="text-slate-500 font-medium">
            {score === questions.length ? 'Outstanding! You mastered this chapter.' : 'Good effort! Keep practicing.'}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest pl-2">Review Answers</h3>
          {questions.map((q, idx) => {
            const res = results[idx];
            return (
              <div key={q.id} className={`p-4 rounded-3xl border ${res.isCorrect ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50/20'}`}>
                <div className="flex gap-3 items-start mb-2">
                  {res.isCorrect ? <CheckCircle2 className="text-green-600 shrink-0" size={18} /> : <XCircle className="text-red-600 shrink-0" size={18} />}
                  <p className="text-sm font-bold text-slate-800">{q.question}</p>
                </div>
                <div className="pl-7 space-y-1">
                  <p className="text-xs text-slate-500">Correct Answer: <span className="text-green-700 font-bold">{q.correctAnswer}</span></p>
                  <p className="text-xs text-slate-500">Your Answer: <span className={res.isCorrect ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>{res.selected}</span></p>
                </div>
              </div>
            );
          })}
        </section>

        <button 
          onClick={() => navigate('/syllabus')}
          className="w-full bg-slate-900 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl"
        >
          Back to Syllabus
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-slate-100">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm font-bold text-slate-900 text-sm">
          <Timer size={16} className="text-blue-600" />
          {timeLeft}s
        </div>
      </section>

      {/* Progress */}
      <section className="space-y-2">
        <div className="flex justify-between items-end">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Question {currentIndex + 1} of {questions.length}</p>
          <p className="text-xs font-bold text-blue-600">{Math.round(((currentIndex + 1) / questions.length) * 100)}%</p>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </section>

      {/* Question Card */}
      <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-bold text-slate-900 mb-6 leading-tight">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedOption(key)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-bold flex items-center gap-3 ${
                selectedOption === key 
                  ? 'border-blue-600 bg-blue-50 text-blue-900' 
                  : 'border-slate-50 bg-slate-50 text-slate-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                selectedOption === key ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'
              }`}>
                {key}
              </div>
              {currentQuestion[`option${key}` as keyof Question]}
            </button>
          ))}
        </div>
      </section>

      {/* Footer Actions */}
      <button 
        disabled={!selectedOption}
        onClick={() => handleNext()}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all ${
          selectedOption ? 'bg-blue-600 shadow-xl shadow-blue-200 text-white translate-y-0' : 'bg-slate-100 text-slate-400 translate-y-1 opacity-50'
        }`}
      >
        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
