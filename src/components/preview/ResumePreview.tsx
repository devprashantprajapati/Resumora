import { useResumeStore } from '@/store/useResumeStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../ui/Button';
import { Download, ChevronDown, FileText, FileJson, FileType2, FileCode, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { exportTXT, exportJSON, exportDOCX, exportMarkdown, exportHTML } from '@/lib/exportUtils';
import { ATSChecker } from './ATSChecker';
import { Logo } from '../Logo';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function ResumePreview() {
  const { data } = useResumeStore();
  const { template, fontSize } = data.settings;
  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialScale, setInitialScale] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume`,
  });

  // Calculate initial fit scale
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = window.innerWidth < 768 ? 32 : 64; // Responsive padding
        const availableWidth = Math.max(containerWidth - padding, 0);
        const PAPER_WIDTH = data.settings.paperSize === 'a4' ? 794 : 816;
        const fitScale = Math.min(availableWidth / PAPER_WIDTH, 1.2);
        setInitialScale(fitScale);
        setCurrentScale(fitScale);
        setIsReady(true);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [data.settings.paperSize]);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const getPaperDimensions = () => {
    const isA4 = data.settings.paperSize === 'a4';
    return {
      width: isA4 ? 794 : 816, // A4: 210mm (~794px), Letter: 8.5in (~816px)
      height: isA4 ? 1123 : 1056, // A4: 297mm (~1123px), Letter: 11in (~1056px)
      cssWidth: isA4 ? '210mm' : '8.5in',
      cssMinHeight: isA4 ? '297mm' : '11in',
    };
  };

  const getPadding = () => {
    switch (data.settings.spacing) {
      case 'compact': return '12mm';
      case 'relaxed': return '28mm';
      default: return '20mm';
    }
  };

  const paperDims = getPaperDimensions();

  if (!isReady) {
    return <div ref={containerRef} className="flex-1 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]" />;
  }

  return (
    <TransformWrapper
      initialScale={initialScale}
      minScale={0.2}
      maxScale={3}
      centerOnInit={true}
      centerZoomedOut={true}
      limitToBounds={true}
      wheel={{ step: 0.1 }}
      pinch={{ step: 5 }}
      doubleClick={{ disabled: true }}
      onTransformed={(ref, state) => setCurrentScale(state.scale)}
      onInit={(ref) => setCurrentScale(ref.state.scale)}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="flex flex-col h-full bg-transparent relative" ref={containerRef}>
          {/* Floating Toolbar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed md:absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-between gap-1 md:gap-1.5 px-3 md:px-4 py-2.5 md:py-3 bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_20px_rgba(255,255,255,0.5)] z-40 ring-1 ring-black/5 group/toolbar max-w-[95vw] md:max-w-none w-[310px]"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/toolbar:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <div className="flex-shrink-0">
              <ATSChecker />
            </div>
            
            <div className="w-px h-8 bg-zinc-200/50 mx-0.5 md:mx-1" />

            {/* Zoom Controls & Export */}
            <div className="flex items-center gap-0.5 md:gap-1 bg-zinc-900/5 p-1 rounded-full border border-black/5 shadow-inner">
              <div className="relative flex-shrink-0" ref={exportMenuRef}>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="h-8 w-8 md:h-9 md:w-9 rounded-full transition-all active:scale-90 bg-[#eaeaf5] text-zinc-900 hover:bg-[#d8d8e9] shadow-sm ring-1 ring-black/5"
                  style={{ width: '30px', height: '30px' }}
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>

                <AnimatePresence>
                  {isExportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                      className="absolute bottom-full mb-4 left-0 md:-left-4 w-64 bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-2 z-50 ring-1 ring-black/5"
                    >
                      <div className="px-4 py-3 mb-1">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Format</span>
                      </div>
                      <div className="grid gap-1">
                        <button
                          onClick={() => { handlePrint(); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-4 h-4 text-red-500" />
                          </div>
                          PDF Document
                        </button>
                        <button
                          onClick={() => { exportDOCX(data); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileType2 className="w-4 h-4 text-blue-500" />
                          </div>
                          Word Document
                        </button>
                        <div className="h-px bg-zinc-100/50 my-1 mx-2" />
                        <button
                          onClick={() => { exportTXT(data); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-zinc-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileText className="w-4 h-4 text-zinc-400" />
                          </div>
                          Plain Text
                        </button>
                        <button
                          onClick={() => { exportMarkdown(data); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileCode className="w-4 h-4 text-purple-500" />
                          </div>
                          Markdown
                        </button>
                        <button
                          onClick={() => { exportJSON(data); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileJson className="w-4 h-4 text-yellow-500" />
                          </div>
                          JSON Resume
                        </button>
                        <button
                          onClick={() => { exportHTML(data); setIsExportMenuOpen(false); }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all group text-left font-bold"
                        >
                          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FileCode className="w-4 h-4 text-orange-500" />
                          </div>
                          HTML Resume
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-4 bg-zinc-200/50 mx-0.5" />

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => zoomOut(0.1)}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-90"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
              
              <div className="flex flex-col items-center min-w-[2.5rem] md:min-w-[3.5rem] select-none px-0.5 md:px-1">
                <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-0.5 opacity-70">Zoom</span>
                <span className="text-[10px] md:text-xs font-bold text-zinc-900 tabular-nums">
                  {Math.round(currentScale * 100)}%
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => zoomIn(0.1)}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-90"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
              
              <div className="hidden sm:block w-px h-4 bg-zinc-200/50 mx-0.5" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => resetTransform()}
                className="hidden sm:flex h-8 w-8 md:h-9 md:w-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-90"
                title="Fit to Screen"
              >
                <Maximize className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] cursor-grab active:cursor-grabbing">
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ margin: 'auto' }}>
              <div 
                ref={componentRef}
                className={cn(
                  "bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] ring-1 ring-black/5 rounded-sm transition-all duration-500 group/paper hover:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.25)] relative overflow-hidden shrink-0 my-8",
                  getFontSizeClass()
                )}
                style={{ 
                  width: paperDims.cssWidth, 
                  minHeight: paperDims.cssMinHeight,
                  padding: getPadding(),
                  boxSizing: 'border-box'
                }}
              >
                {/* Watermark */}
                <div className="absolute bottom-6 right-8 pointer-events-none select-none opacity-[0.08] group-hover/paper:opacity-[0.15] transition-opacity duration-700 flex items-center gap-2">
                  <Logo className="scale-75 origin-right" showText={false} />
                  <span className="text-[12px] font-black tracking-[0.4em] uppercase text-zinc-900">Resumora</span>
                </div>
                
                {getTemplate()}
              </div>
            </TransformComponent>
          </div>
        </div>
      )}
    </TransformWrapper>
  );
}
