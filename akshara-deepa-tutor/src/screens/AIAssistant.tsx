import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Book, Lightbulb, MessageSquare, Loader2 } from 'lucide-react';
import { generateChapterSummary, explainConcept } from '../services/aiService';

export default function AIAssistant() {
  const [searchParams] = useSearchParams();
  const conceptParam = searchParams.get('concept');

  const [input, setInput] = useState(conceptParam || '');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Thinking...');

  const loadingMessages = [
    "Consulting your academic records...",
    "Brainstorming the best way to explain this...",
    "Gathering study tips for your success...",
    "Analyzing complex concepts for you...",
    "Just a moment, your tutor is almost ready..."
  ];

  useEffect(() => {
    if (conceptParam) {
      handleExplain();
    }
  }, [conceptParam]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleExplain = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const text = await explainConcept(input);
      setResponse(text);
    } catch (error) {
      setResponse("I'm sorry, I couldn't connect to my brain right now. Please check if your API key is correctly set in the Secrets panel!");
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const text = await generateChapterSummary(input);
      setResponse(text);
    } catch (error) {
       setResponse("Connection error. Ensure your Gemini API Key is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <section>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-none">AI Study Assistant</h2>
        </div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Your personal 24/7 SSLC Tutor</p>
      </section>

      {/* Input Section */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are we learning today?"
          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-purple-200 resize-none h-32"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleExplain}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
          >
            <Lightbulb size={16} /> Explain Simply
          </button>
          <button 
            onClick={handleSummary}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
          >
            <Book size={16} /> Summarize
          </button>
        </div>
      </section>

      {/* Response Section */}
      <section className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 text-center"
            >
              <Loader2 className="animate-spin text-purple-600" size={40} />
              <p className="text-slate-500 font-bold animate-pulse text-sm">{loadingMessage}</p>
            </motion.div>
          ) : response ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2.5rem] border border-purple-100 shadow-lg shadow-purple-50 space-y-4 relative"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                AI Response
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {response}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300 opacity-50 grayscale select-none">
              <MessageSquare size={60} className="mb-4" />
              <p className="font-black uppercase tracking-widest text-sm">Ask me anything about your syllabus</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Suggestion Chips */}
      {!loading && !response && (
        <section className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Try these topics</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Pythagoras Theorem",
              "Photosynthesis",
              "World War II causes",
              "Periodic Table trends"
            ].map((text) => (
              <button
                key={text}
                onClick={() => setInput(text)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold text-slate-600 transition-all border border-transparent hover:border-slate-300"
              >
                {text}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
