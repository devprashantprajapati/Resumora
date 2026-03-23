import { useResumeStore } from '@/store/useResumeStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../ui/Button';
import { Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ResumePreview() {
  const { data } = useResumeStore();
  const { template, fontSize } = data.settings;
  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume`,
  });

  // Auto-scale to fit container width initially
  useEffect(() => {
    const fitToContainer = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 48; // 48px padding
        const A4_WIDTH = 794; // A4 width in pixels at 96 DPI
        if (containerWidth < A4_WIDTH) {
          setScale(containerWidth / A4_WIDTH);
        } else {
          setScale(1);
        }
      }
    };

    fitToContainer();
    window.addEventListener('resize', fitToContainer);
    return () => window.removeEventListener('resize', fitToContainer);
  }, []);

  const getTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'corporate':
        return <CorporateTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-[0.9rem]';
      case 'large': return 'text-[1.1rem]';
      default: return 'text-base';
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Floating Toolbar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="absolute top-6 left-1/2 -tranzinc-x-1/2 flex items-center gap-1.5 px-2 py-1.5 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.3)] z-20"
      >
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.4, s - 0.1))} title="Zoom Out" className="rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-9 w-9 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-[11px] font-bold tracking-wider w-12 text-center text-zinc-300">{Math.round(scale * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2, s + 0.1))} title="Zoom In" className="rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-9 w-9 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(1)} title="Reset Zoom" className="rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 h-9 w-9 transition-colors">
          <Maximize className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-zinc-800 mx-1" />
        <Button onClick={() => handlePrint()} className="bg-white hover:bg-zinc-100 text-zinc-900 shadow-md rounded-xl h-9 px-4 ml-1 transition-all hover:-tranzinc-y-0.5">
          <Download className="w-4 h-4 mr-2" />
          <span className="text-sm font-bold">Export PDF</span>
        </Button>
      </motion.div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-8 pt-28 pb-28 flex justify-center items-start scrollbar-hide"
      >
        <div 
          className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top"
          style={{ transform: `scale(${scale})` }}
        >
          {/* A4 Paper Container */}
          <div 
            ref={componentRef}
            className={cn(
              "bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.15)] ring-1 ring-zinc-900/5 rounded-sm transition-all duration-300 group",
              getFontSizeClass()
            )}
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              padding: '20mm', // Standard A4 margins
              boxSizing: 'border-box'
            }}
          >
            {getTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
