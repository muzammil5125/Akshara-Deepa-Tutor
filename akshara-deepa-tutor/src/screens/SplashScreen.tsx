import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center text-white z-[9999]">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100, duration: 0.8 }}
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-2xl"
      >
        <BookOpen size={48} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-3xl font-black tracking-tight mb-2">Akshara-Deepa</h1>
        <p className="text-blue-100 font-medium tracking-widest uppercase text-sm">Empowering Your Learning</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 px-10 text-center italic text-blue-200 text-sm"
      >
        "Education is the most powerful weapon which you can use to change the world."
      </motion.div>
    </div>
  );
}
