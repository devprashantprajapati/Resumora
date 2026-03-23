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
    <div className="flex flex-col h-full bg-slate-100/50 relative">
      {/* Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1.5 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 z-20 transition-all duration-300 hover:shadow-xl hover:bg-white/90">
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.4, s - 0.1))} title="Zoom Out" className="rounded-xl hover:bg-slate-100 text-slate-600 h-9 w-9 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs font-semibold w-12 text-center text-slate-700">{Math.round(scale * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2, s + 0.1))} title="Zoom In" className="rounded-xl hover:bg-slate-100 text-slate-600 h-9 w-9 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setScale(1)} title="Reset Zoom" className="rounded-xl hover:bg-slate-100 text-slate-600 h-9 w-9 transition-colors">
          <Maximize className="w-4 h-4" />
        </Button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <Button onClick={() => handlePrint()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 rounded-xl h-9 px-4 ml-1 transition-all hover:shadow-lg hover:-translate-y-0.5">
          <Download className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Export PDF</span>
        </Button>
      </div>

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
              "bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 rounded-sm transition-all duration-300 group",
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
