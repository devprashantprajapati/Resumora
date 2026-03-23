/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { Eye, Edit2, Sparkles, LayoutTemplate } from 'lucide-react';
import { useState } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-50 overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900">
      {/* Top Navigation Bar */}
      <header className="h-16 glass-panel flex items-center px-4 sm:px-6 shrink-0 z-30 relative">
        <div className="flex items-center gap-3 text-zinc-900">
          <div className="bg-zinc-900 p-2 rounded-xl shadow-lg shadow-zinc-900/20">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">Resumora</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500 font-medium">
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] uppercase tracking-wider font-bold border border-emerald-100/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Auto-saving
          </span>
          
          {/* Mobile Toggle */}
          <div className="flex bg-zinc-100/80 p-1 rounded-xl lg:hidden border border-zinc-200/50 backdrop-blur-sm shadow-inner">
            <button 
              className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300", !showPreview ? "bg-white text-zinc-900 shadow-sm font-semibold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95")}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-4 h-4" /> <span className="hidden xs:inline">Edit</span>
            </button>
            <button 
              className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300", showPreview ? "bg-white text-zinc-900 shadow-sm font-semibold scale-100" : "text-zinc-500 hover:text-zinc-900 scale-95")}
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
          "flex-1 relative absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-zinc-50/50",
          showPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
