import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { PublicResume } from './pages/PublicResume';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { SplashScreen } from './components/SplashScreen';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SplashScreen>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/p/:slug" element={<PublicResume />} />
            <Route path="/analytics/:slug" element={<AnalyticsDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </SplashScreen>
    </AuthProvider>
  </StrictMode>,
);
