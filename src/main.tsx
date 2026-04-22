import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App.tsx';
import { PublicResume } from './pages/PublicResume.tsx';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/p/:slug" element={<PublicResume />} />
          <Route path="/analytics/:slug" element={<AnalyticsDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    <SpeedInsights />
  </StrictMode>,
);
