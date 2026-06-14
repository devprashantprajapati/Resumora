import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { LayoutTemplate, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = ['modern', 'minimal', 'corporate', 'creative', 'elegant', 'tech', 'executive', 'premium', 'academic', 'studio'] as const;

export function TemplateSelector() {
  const { data, updateSettings } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <Button 
        variant="ghost" 
        onClick={() => setIsOpen(!isOpen)}
        onPointerDown={(e) => e.stopPropagation()}
        className="h-8 md:h-9 px-3 rounded-full text-[13px] font-semibold tracking-wide transition-all active:scale-95 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm flex items-center gap-2"
        title="Change Template"
      >
        <LayoutTemplate className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
        <span className="hidden sm:inline capitalize">{data.settings.template}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-[calc(100%+1rem)] right-0 md:-right-2 w-[280px] bg-white/95 backdrop-blur-2xl border border-zinc-200/80 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-3 z-50 ring-1 ring-black/5 origin-bottom-right"
          >
            <div className="px-3 py-2 border-b border-zinc-100/80 mb-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Select Template</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {TEMPLATES.map((template) => (
                <button
                  key={template}
                  onClick={() => {
                    updateSettings({ template });
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-300 border-2 ${
                    data.settings.template === template
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/10 scale-[1.02]'
                      : 'border-zinc-200/60 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 text-zinc-600 hover:shadow-sm'
                  }`}
                >
                  <span className="text-[13px] font-semibold capitalize whitespace-nowrap">{template}</span>
                  {data.settings.template === template && (
                    <Check className="w-3.5 h-3.5 mt-0.5 stroke-[3] text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
