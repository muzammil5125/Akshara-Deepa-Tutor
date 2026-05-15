import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Target, Flame, PieChart, ChevronRight, AlertTriangle } from 'lucide-react';
import { useSyllabusData } from '../hooks/useDatabase';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { subjects, totalProgress, getProgressBySubject, loading } = useSyllabusData();

  if (loading) return <div className="flex items-center justify-center p-20">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section>
        <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest mb-1">Welcome back,</p>
        <h2 className="text-2xl font-black text-slate-900 leading-none">Muzammil</h2>
      </section>

      {/* Main Stats Card */}
      <section className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-0.5">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Overall Progress</p>
              <h3 className="text-4xl font-black">{totalProgress}%</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <PieChart size={24} />
            </div>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white h-full rounded-full"
            />
          </div>
          <p className="text-xs text-blue-100 font-medium">Keep going! You're doing great 🎉</p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
            <Flame size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Streak</p>
            <p className="text-lg font-black text-slate-900 leading-none">12 Days</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
            <Target size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Daily Goal</p>
            <p className="text-lg font-black text-slate-900 leading-none">85%</p>
          </div>
        </div>
      </section>

      {/* Weak Subject Alert */}
      <section className="bg-red-50 border-2 border-red-100 p-4 rounded-3xl flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-red-900 leading-tight">Mathematics Attention!</h4>
          <p className="text-xs text-red-700 font-medium">Your Algebra performance is low. Re-check the concepts!</p>
        </div>
      </section>

      {/* Subjects Overview */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black text-slate-900">Your Subjects</h3>
          <button className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center" onClick={() => navigate('/syllabus')}>
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-4">
          {subjects?.map((subject) => {
            const progress = getProgressBySubject(subject.id!);
            return (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={subject.id}
                onClick={() => navigate(`/syllabus/${subject.id}`)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  subject.subjectName === 'Science' ? 'bg-purple-100 text-purple-600' :
                  subject.subjectName === 'Mathematics' ? 'bg-blue-100 text-blue-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <BookOpen size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-2">{subject.subjectName}</h4>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${
                        progress > 70 ? 'bg-green-500' : progress > 30 ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900 leading-none">{progress}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Done</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
