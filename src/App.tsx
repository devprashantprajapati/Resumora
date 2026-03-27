/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { Eye, Edit2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './components/Logo';
import { Toaster } from 'sonner';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-50 overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <Toaster position="top-center" />
      {/* Top Navigation Bar */}
      <header className="h-16 glass-panel flex items-center px-4 sm:px-8 shrink-0 z-40 relative shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.02)]">
        <Logo />
        
        <div className="ml-auto flex items-center gap-6 text-sm text-zinc-500 font-medium">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-50/50 text-emerald-600 rounded-full text-[10px] uppercase tracking-[0.15em] font-black border border-emerald-100/50 shadow-sm"
          >
            <motion.div 
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            Auto-saving
          </motion.div>
          
          {/* Mobile Toggle */}
          <div className="flex bg-zinc-100/80 p-1 rounded-2xl lg:hidden border border-zinc-200/50 backdrop-blur-md shadow-inner">
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]", 
                !showPreview ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50 font-bold scale-100 ring-1 ring-black/5" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-4 h-4" /> <span className="hidden xs:inline">Edit</span>
            </button>
            <button 
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]", 
                showPreview ? "bg-white text-zinc-900 shadow-lg shadow-zinc-200/50 font-bold scale-100 ring-1 ring-black/5" : "text-zinc-500 hover:text-zinc-900 scale-95"
              )}
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4" /> <span className="hidden xs:inline">Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative bg-dot-pattern">
        {/* Left Panel: Editor */}
        <div className={cn(
          "w-full lg:w-[45%] xl:w-[40%] flex-shrink-0 bg-white/60 backdrop-blur-3xl z-20 shadow-[8px_0_30px_rgba(0,0,0,0.02)] border-r border-zinc-200/50 absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          showPreview ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>
          <EditorSidebar />
        </div>

        {/* Right Panel: Live Preview */}
        <div className={cn(
          "flex-1 relative lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-zinc-50/50",
          showPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          !showPreview && "absolute inset-0 lg:relative"
        )}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
