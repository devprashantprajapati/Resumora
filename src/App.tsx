/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { Eye, Edit2, Sparkles, User as UserIcon, LogOut, GripVertical } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { Toaster, toast } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import { getResume, publishResume, saveResume } from './lib/resumeService';
import { useResumeStore } from './store/useResumeStore';
import { Button } from './components/ui/Button';
import { AuthModal } from './components/auth/AuthModal';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { useMediaQuery } from './hooks/useMediaQuery';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const { data, updateData } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const autoSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const draftSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const loadUserResume = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const resumeId = user.uid + '_default';
          const savedResume = await getResume(resumeId);
          if (savedResume && savedResume.data) {
            // We need to update the store with the saved data
            updateData(savedResume.data);
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
    if (isInitialLoadRef.current || !user || isLoading) return;

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
  }, [data, user, isLoading]);

  // Auto-sync published resume
  useEffect(() => {
    if (isInitialLoadRef.current || !user || !data.settings.publishedSlug || isLoading) return;

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
  }, [data, user, isLoading]);

  return (
    <div className="flex flex-col h-[100dvh] bg-mesh-pattern overflow-hidden font-sans selection:bg-zinc-900 selection:text-white">
      <Toaster position="top-center" />
      <AuthModal />
      {/* Top Navigation Bar */}
      <header className="h-16 lg:h-20 glass-nav lg:bg-white/40 lg:backdrop-blur-3xl lg:border-b lg:border-white/60 lg:shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center px-4 sm:px-8 shrink-0 z-40 relative transition-all duration-500">
        <Logo />
        
        <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500 font-medium">
          {/* Auth Button */}
          <div className="hidden sm:block">
            {user ? (
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-zinc-200/60 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <UserIcon className="w-3 h-3" />}
                </div>
                <span className="text-sm font-medium text-zinc-700 max-w-[120px] truncate">{user.displayName || user.email}</span>
                <button 
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Button 
                onClick={openAuthModal}
                variant="outline" 
                className="rounded-full px-5 border-zinc-200/60 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex bg-zinc-100/50 p-1 rounded-2xl lg:hidden border border-zinc-200/50 shadow-inner h-[55px] w-[142px]">
            <button 
              className={cn(
                "flex items-center justify-center gap-1.5 flex-1 rounded-xl transition-all duration-300 ease-out", 
                !showPreview ? "bg-white text-zinc-900 shadow-sm font-bold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-3.5 h-3.5" /> <span className="text-xs">Edit</span>
            </button>
            <button 
              className={cn(
                "flex items-center justify-center gap-1.5 flex-1 rounded-xl transition-all duration-300 ease-out", 
                showPreview ? "bg-white text-zinc-900 shadow-sm font-bold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-3.5 h-3.5" /> <span className="text-xs">View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative bg-grid-pattern lg:p-6 lg:gap-6 lg:bg-zinc-50/30">
        {/* Animated Background Gradients for Desktop */}
        {isDesktop && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
          </div>
        )}

        {isDesktop ? (
          <PanelGroup id="resume-builder" orientation="horizontal" className="flex-1 w-full h-full">
            <Panel 
              id="editor-panel"
              defaultSize={40} 
              minSize={30} 
              maxSize={60}
              className="bg-white/80 backdrop-blur-3xl z-20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-r border-zinc-200/60 lg:rounded-[2rem] lg:border lg:shadow-2xl lg:shadow-zinc-200/40 lg:overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-indigo-500/5"
            >
              <EditorSidebar />
            </Panel>
            
            <PanelResizeHandle id="resize-handle" className="w-6 flex items-center justify-center group cursor-col-resize z-30 relative outline-none">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-transparent group-hover:bg-indigo-500/10 group-active:bg-indigo-500/20 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" />
              <div className="w-1.5 h-12 bg-zinc-200/80 rounded-full group-hover:bg-indigo-500 group-active:bg-indigo-600 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center shadow-sm group-hover:shadow-indigo-500/30 group-hover:h-16 group-active:scale-x-90">
                <GripVertical className="w-3 h-3 text-zinc-400 group-hover:text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </PanelResizeHandle>

            <Panel 
              id="preview-panel"
              defaultSize={60} 
              minSize={40}
              className="z-10 bg-transparent lg:bg-white/50 lg:backdrop-blur-2xl lg:rounded-[2rem] lg:border lg:border-white/60 lg:shadow-2xl lg:shadow-zinc-200/40 lg:overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-violet-500/5"
            >
              <ResumePreview />
            </Panel>
          </PanelGroup>
        ) : (
          <>
            {/* Left Panel: Editor (Mobile) */}
            <div className={cn(
              "w-full flex-shrink-0 bg-white/70 backdrop-blur-3xl z-20 shadow-[8px_0_30px_rgba(0,0,0,0.03)] border-r border-zinc-200/60 absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              showPreview ? "-translate-x-full" : "translate-x-0"
            )}>
              <EditorSidebar />
            </div>

            {/* Right Panel: Live Preview (Mobile) */}
            <div className={cn(
              "absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-transparent",
              showPreview ? "translate-x-0" : "translate-x-full"
            )}>
              <ResumePreview />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
