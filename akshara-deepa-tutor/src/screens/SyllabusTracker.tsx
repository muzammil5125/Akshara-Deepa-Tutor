import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, Circle, PlayCircle, BookCheck } from 'lucide-react';

export default function SyllabusTracker() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(subjectId ? parseInt(subjectId) : -1);

  const subjects = useLiveQuery(() => db.subjects.toArray());
  const chapters = useLiveQuery(() => 
    activeTab !== -1 
      ? db.chapters.where('subjectId').equals(activeTab).toArray() 
      : db.chapters.toArray()
  );

  const toggleChapter = async (id: number, current: boolean) => {
    await db.chapters.update(id, { isCompleted: !current });
  };

  const currentSubject = subjects?.find(s => s.id === activeTab);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <section className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-2xl font-black text-slate-900 leading-none">Syllabus</h2>
      </section>

      {/* Subject Tabs */}
      <section className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
        <button
          onClick={() => setActiveTab(-1)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all border ${
            activeTab === -1 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-100 text-slate-500'
          }`}
        >
          All
        </button>
        {subjects?.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id!)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold uppercase tracking-wider transition-all border ${
              activeTab === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-100 text-slate-500'
            }`}
          >
            {s.subjectName}
          </button>
        ))}
      </section>

      {/* Stats Summary */}
      {activeTab !== -1 && (
        <section className="bg-slate-900 rounded-3xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Progress</p>
            <h3 className="text-xl font-bold">{currentSubject?.subjectName}</h3>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-blue-600 flex items-center justify-center font-black text-lg">
            {Math.round(((chapters?.filter(c => c.isCompleted).length || 0) / (chapters?.length || 1)) * 100)}%
          </div>
        </section>
      )}

      {/* Chapters Tree */}
      <section className="space-y-4">
        {chapters?.map((chapter) => (
          <div 
            key={chapter.id}
            className={`bg-white p-4 rounded-3xl border border-slate-100 shadow-sm transition-all ${
              chapter.isCompleted ? 'bg-green-50/30' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleChapter(chapter.id!, chapter.isCompleted)}
                className={`transition-all ${chapter.isCompleted ? 'text-green-500' : 'text-slate-300'}`}
              >
                {chapter.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1">
                <h4 className={`font-bold leading-tight ${chapter.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {chapter.chapterName}
                </h4>
                {activeTab === -1 && (
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                    {subjects?.find(s => s.id === chapter.subjectId)?.subjectName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => navigate(`/quiz/${chapter.id}`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Take Quiz"
                >
                  <PlayCircle size={20} />
                </button>
                <button 
                  onClick={() => navigate(`/ai-assistant?concept=${chapter.chapterName}`)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                  title="Study Guide"
                >
                  <BookCheck size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {chapters?.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic">
            No chapters found for this subject.
          </div>
        )}
      </section>
    </div>
  );
}
