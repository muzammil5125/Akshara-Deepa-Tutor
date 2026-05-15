/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import SplashScreen from './screens/SplashScreen';
import HomeDashboard from './screens/HomeDashboard';
import SyllabusTracker from './screens/SyllabusTracker';
import QuizModule from './screens/QuizModule';
import Analytics from './screens/Analytics';
import AIAssistant from './screens/AIAssistant';
import Settings from './screens/Settings';

export default function App() {
  // Simulate WorkManager notifications
  useEffect(() => {
    const checkReminder = () => {
      const lastReminder = localStorage.getItem('last_study_reminder');
      const now = Date.now();
      
      // If no reminder sent in last 24 hours
      if (!lastReminder || now - parseInt(lastReminder) > 24 * 60 * 60 * 1000) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Akshara-Deepa Tip', {
            body: 'Focus on one topic today to keep your streak alive! 💡',
          });
          localStorage.setItem('last_study_reminder', now.toString());
        } else if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/home" element={<Layout><HomeDashboard /></Layout>} />
        <Route path="/syllabus" element={<Layout><SyllabusTracker /></Layout>} />
        <Route path="/syllabus/:subjectId" element={<Layout><SyllabusTracker /></Layout>} />
        <Route path="/quiz/:chapterId" element={<Layout><QuizModule /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/ai-assistant" element={<Layout><AIAssistant /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

