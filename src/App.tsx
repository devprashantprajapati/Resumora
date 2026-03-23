/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditorSidebar } from './components/forms/EditorSidebar';
import { ResumePreview } from './components/preview/ResumePreview';
import { FileText, Eye, Edit2, Sparkles, LayoutTemplate } from 'lucide-react';
import { useState } from 'react';
import { cn } from './lib/utils';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center px-4 sm:px-6 shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-200/50">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Resumora</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4 text-sm text-slate-500 font-medium">
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Auto-saving
          </span>
          
          {/* Mobile Toggle */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl lg:hidden border border-slate-200/50 backdrop-blur-sm shadow-inner">
            <button 
              className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300", !showPreview ? "bg-white text-indigo-600 shadow-sm font-semibold scale-100" : "text-slate-500 hover:text-slate-900 scale-95")}
              onClick={() => setShowPreview(false)}
            >
              <Edit2 className="w-4 h-4" /> <span className="hidden xs:inline">Edit</span>
            </button>
            <button 
              className={cn("flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300", showPreview ? "bg-white text-indigo-600 shadow-sm font-semibold scale-100" : "text-slate-500 hover:text-slate-900 scale-95")}
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
          "w-full lg:w-[45%] xl:w-[40%] flex-shrink-0 bg-white/80 backdrop-blur-md z-20 shadow-[8px_0_30px_rgba(0,0,0,0.03)] border-r border-slate-200 absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          showPreview ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}>
          <EditorSidebar />
        </div>

        {/* Right Panel: Live Preview */}
        <div className={cn(
          "flex-1 relative absolute inset-0 lg:relative transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 bg-slate-100/50",
          showPreview ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <ResumePreview />
        </div>
      </main>
    </div>
  );
}
