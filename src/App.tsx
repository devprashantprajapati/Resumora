/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { Eye, Edit2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { getResume } from './lib/resumeService';
import { useResumeStore } from './store/useResumeStore';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const { data, updateData } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserResume = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const resumeId = user.uid + '_default';
          const savedResume = await getResume(resumeId);
          if (savedResume && savedResume.data) {
            // We need to update the store with the saved data
            // Since updateData only takes partial updates, we can do this:
            Object.keys(savedResume.data).forEach((key) => {
              updateData({ [key]: savedResume.data[key as keyof typeof savedResume.data] });
            });
            toast.success('Resume loaded from cloud');
          }
        } catch (error) {
          console.error('Failed to load resume:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserResume();
  }, [user]);

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-50/50 overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <Toaster position="top-center" />
      {/* Top Navigation Bar */}
      <header className="h-16 glass-panel flex items-center px-4 sm:px-8 shrink-0 z-40 relative">
        <Logo />
        
        <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500 font-medium">
          {/* Mobile Toggle */}
          <div className="flex bg-zinc-100/80 p-1 rounded-2xl lg:hidden border border-zinc-200/50 backdrop-blur-md shadow-inner">
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]", 
                !showPreview ? "bg-white text-indigo-700 shadow-lg shadow-indigo-200/50 font-bold scale-100 ring-1 ring-indigo-500/10" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-4 h-4" /> <span className="hidden xs:inline">Edit</span>
            </button>
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]", 
                showPreview ? "bg-white text-indigo-700 shadow-lg shadow-indigo-200/50 font-bold scale-100 ring-1 ring-indigo-500/10" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4" /> <span className="hidden xs:inline">Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative bg-grid-pattern">
        {/* Left Panel: Editor */}
        <div className={cn(
          "w-full lg:w-[45%] xl:w-[40%] flex-shrink-0 bg-white/70 backdrop-blur-3xl z-20 shadow-[8px_0_30px_rgba(0,0,0,0.03)] border-r border-zinc-200/60 absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          showPreview ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>
          <EditorSidebar />
        </div>

        {/* Right Panel: Live Preview */}
        <div className={cn(
          "absolute inset-0 lg:relative lg:flex-1 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-transparent",
          showPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
