import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSyllabusData } from '../hooks/useDatabase';
import { motion } from 'motion/react';
import { Target, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export default function Analytics() {
  const { subjects, getProgressBySubject } = useSyllabusData();

  // Mock data for strength map calculation as per requirement:
  // Strength = (Quiz Score × 0.6) + (Chapter Completion × 0.3) + (Study Streak × 0.1)
  const chartData = subjects?.map(s => {
    const completion = getProgressBySubject(s.id!);
    const quizScore = 70; // Mock score for calculation
    const streak = 60; // Mock streak contribution
    const strength = (quizScore * 0.6) + (completion * 0.3) + (streak * 0.1);
    
    return {
      subject: s.subjectName,
      A: strength,
      fullMark: 100,
    };
  }) || [];

  const weakSubjects = chartData.sort((a, b) => a.A - b.A).slice(0, 1);

  return (
    <div className="space-y-8 pb-12">
      <section>
        <h2 className="text-2xl font-black text-slate-900 leading-none">Strength Map</h2>
        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wider">Your Performance Visualized</p>
      </section>

      {/* Radar Chart Card */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
              <Radar
                name="Strength"
                dataKey="A"
                stroke="#1a73e8"
                fill="#1a73e8"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full text-blue-700 text-xs font-bold uppercase">
            <TrendingUp size={14} /> Overall Performance: Good
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 border-l-4 border-blue-600 pl-3">Performance Insights</h3>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 flex gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900">Area for Growth</h4>
              <p className="text-sm text-amber-700 leading-snug">
                Your <span className="font-bold">{weakSubjects[0]?.subject}</span> score is lower than other subjects. Focus on completing 2 more chapters this week.
              </p>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-3xl border border-purple-100 flex gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-purple-900">AI Recommendation</h4>
              <p className="text-sm text-purple-700 leading-snug">
                You master Science concepts quickly. Use that extra time to practice Mathematics logic puzzles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action Items */}
      <section className="bg-slate-900 p-6 rounded-3xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-blue-400" />
          </div>
          <h4 className="font-bold text-lg">Next Milestone</h4>
        </div>
        <p className="text-slate-400 text-sm mb-4">Complete "Trigonometry" to reach 45% overall syllabus completion.</p>
        <button className="w-full bg-blue-600 py-3 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-blue-500/20">
          Start Lesson Now
        </button>
      </section>
    </div>
  );
}
