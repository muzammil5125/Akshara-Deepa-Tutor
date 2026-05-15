import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart2, MessageSquare, Settings, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <BookOpen size={24} />, label: 'Syllabus', path: '/syllabus' },
    { icon: <BarChart2 size={24} />, label: 'Analysis', path: '/analytics' },
    { icon: <MessageSquare size={24} />, label: 'AI Help', path: '/ai-assistant' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Akshara-Deepa</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">SSLC Tutor</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
          <Award size={16} className="text-yellow-600" />
          <span className="text-sm font-bold text-yellow-700">Level 4</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg mx-auto p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white border-t border-slate-200 flex items-center justify-around px-2 fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${
                isActive ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
