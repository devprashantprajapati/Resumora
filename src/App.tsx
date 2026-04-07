/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { Eye, Edit2, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { getResume, publishResume, saveResume } from './lib/resumeService';
import { useResumeStore } from './store/useResumeStore';
import { Button } from './components/ui/Button';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const { data, updateData } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const autoSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const draftSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

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
          // Allow a small delay before enabling auto-sync to prevent syncing the initial load
          setTimeout(() => {
            isInitialLoadRef.current = false;
          }, 1000);
        }
      } else {
        isInitialLoadRef.current = false;
      }
    };

    loadUserResume();
  }, [user]);

  // Auto-sync draft resume to cloud when logged in
  useEffect(() => {
    if (isInitialLoadRef.current || !user) return;

    if (draftSyncTimeoutRef.current) {
      clearTimeout(draftSyncTimeoutRef.current);
    }

    draftSyncTimeoutRef.current = setTimeout(async () => {
      try {
        const resumeId = user.uid + '_default';
        const title = `${data.personalInfo.firstName || 'My'} Resume`;
        await saveResume(resumeId, title, data);
        console.log('Auto-saved draft to cloud');
      } catch (error) {
        console.error('Failed to auto-save draft:', error);
      }
    }, 3000); // Debounce for 3 seconds

    return () => {
      if (draftSyncTimeoutRef.current) {
        clearTimeout(draftSyncTimeoutRef.current);
      }
    };
  }, [data, user]);

  // Auto-sync published resume
  useEffect(() => {
    if (isInitialLoadRef.current || !user || !data.settings.publishedSlug) return;

    if (autoSyncTimeoutRef.current) {
      clearTimeout(autoSyncTimeoutRef.current);
    }

    autoSyncTimeoutRef.current = setTimeout(async () => {
      try {
        await publishResume(data.settings.publishedSlug!, data);
        console.log('Auto-synced published resume');
      } catch (error) {
        console.error('Failed to auto-sync published resume:', error);
      }
    }, 2000); // Debounce for 2 seconds

    return () => {
      if (autoSyncTimeoutRef.current) {
        clearTimeout(autoSyncTimeoutRef.current);
      }
    };
  }, [data, user]);

  return (
    <div className="flex flex-col h-[100dvh] bg-mesh-pattern overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">
      <Toaster position="top-center" />
      {/* Top Navigation Bar */}
      <header className="h-16 lg:h-20 glass-nav lg:bg-transparent lg:border-none lg:shadow-none flex items-center px-4 sm:px-8 shrink-0 z-40 relative">
        <Logo />
        
        <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500 font-medium">
          {/* Mobile Toggle */}
          <div className="flex bg-zinc-100/50 p-1 rounded-2xl lg:hidden border border-zinc-200/50 shadow-inner h-[50px] w-[125px]">
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 ease-out", 
                !showPreview ? "bg-white text-zinc-900 shadow-sm font-bold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-4 h-4" /> <span className="hidden xs:inline">Edit</span>
            </button>
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-300 ease-out", 
                showPreview ? "bg-white text-zinc-900 shadow-sm font-bold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4" /> <span className="hidden xs:inline">Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative bg-grid-pattern lg:p-4 lg:gap-4 lg:bg-zinc-50/50">
        {/* Left Panel: Editor */}
        <div className={cn(
          "w-full lg:w-[45%] xl:w-[40%] flex-shrink-0 bg-white/70 backdrop-blur-3xl z-20 shadow-[8px_0_30px_rgba(0,0,0,0.03)] border-r border-zinc-200/60 absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:rounded-3xl lg:border lg:shadow-2xl lg:shadow-zinc-200/50 lg:overflow-hidden",
          showPreview ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>
          <EditorSidebar />
        </div>

        {/* Right Panel: Live Preview */}
        <div className={cn(
          "absolute inset-0 lg:relative lg:flex-1 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-transparent lg:bg-white/40 lg:backdrop-blur-xl lg:rounded-3xl lg:border lg:border-zinc-200/60 lg:shadow-2xl lg:shadow-zinc-200/50 lg:overflow-hidden",
          showPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
