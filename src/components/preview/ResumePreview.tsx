import { useResumeStore } from '@/store/useResumeStore';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { PremiumTemplate } from './templates/PremiumTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { StudioTemplate } from './templates/StudioTemplate';
import { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Download, ChevronDown, FileText, FileJson, FileType2, FileCode, ZoomIn, ZoomOut, Maximize, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { exportTXT, exportJSON, exportDOCX, exportMarkdown, exportHTML, exportPDF } from '@/lib/exportUtils';
import { useReactToPrint } from 'react-to-print';
import { ATSChecker } from './ATSChecker';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { InterviewPrepGenerator } from './InterviewPrepGenerator';
import { LinkedInImporter } from './LinkedInImporter';
import { PublishModal } from './PublishModal';
import { Logo } from '../Logo';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { toast } from 'sonner';

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
    documentTitle: `${data.personalInfo.firstName || 'My'}_${data.personalInfo.lastName || 'Resume'}`,
  });

  // Calculate initial fit scale
  useEffect(() => {
    let timeoutId: number;
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
    
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        calculateScale();
      }, 50);
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
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
      case 'elegant':
        return <ElegantTemplate />;
      case 'tech':
        return <TechTemplate />;
      case 'executive':
        return <ExecutiveTemplate />;
      case 'premium':
        return <PremiumTemplate />;
      case 'academic':
        return <AcademicTemplate />;
      case 'studio':
        return <StudioTemplate />;
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
    return <div ref={containerRef} className="flex-1 h-full bg-zinc-100/50 bg-dot-pattern" />;
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
      panning={{ excluded: ['pan-pinch-ignore'] }}
      onTransformed={(ref, state) => setCurrentScale(state.scale)}
      onInit={(ref) => setCurrentScale(ref.state.scale)}
    >
      {({ zoomIn, zoomOut, centerView }) => (
        <div className="flex flex-col h-full bg-transparent relative" ref={containerRef}>
          {/* Floating Toolbar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="pan-pinch-ignore absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap md:flex-wrap items-center justify-center gap-2 md:gap-2 px-3 md:px-3 py-2 md:py-2.5 bg-white/80 backdrop-blur-3xl rounded-2xl md:rounded-[2rem] z-40 group/toolbar w-[95vw] md:w-auto max-w-[400px] xl:max-w-[800px] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)] border border-white/80 ring-1 ring-zinc-900/5 transition-shadow duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.15)]"
          >
            <div className="absolute inset-0 rounded-2xl md:rounded-[2rem] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/toolbar:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            
            <div className="flex-shrink-0 flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
              <ATSChecker />
              <CoverLetterGenerator />
              <InterviewPrepGenerator />
              <LinkedInImporter />
              <PublishModal />
            </div>
            
            <div className="hidden md:block w-px h-6 md:h-8 bg-zinc-200 mx-0.5 md:mx-2 flex-shrink-0" />

            {/* Zoom Controls & Export */}
            <div className="flex items-center justify-center gap-1 md:gap-2 bg-zinc-100/50 p-1 md:p-1.5 rounded-full border border-black/5 shadow-inner w-full md:w-auto">
              <div className="relative flex-shrink-0" ref={exportMenuRef}>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full transition-all active:scale-95 bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg flex-shrink-0"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
                </Button>

                <AnimatePresence>
                  {isExportMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25, stiffness: 400 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute bottom-[calc(100%+1rem)] left-1/2 -translate-x-1/2 md:translate-x-0 md:-left-4 w-64 bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden p-2.5 z-50 ring-1 ring-black/5"
                    >
                      <div className="px-4 py-3 mb-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Export As</span>
                      </div>
                      <div className="grid gap-1">
                        <button
                          onClick={() => { 
                            const id = toast.loading('Preparing native PDF...');
                            try {
                              handlePrint();
                              toast.success('Print dialog opened', { id });
                            } catch (e) {
                              toast.error('Failed to open print dialog', { id });
                            }
                            setIsExportMenuOpen(false); 
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-green-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-green-200/80 transition-all duration-300 shadow-sm">
                            <Printer className="w-4.5 h-4.5 text-green-600" />
                          </div>
                          Print / Native PDF
                        </button>
                        <button
                          onClick={async () => {
                            const id = toast.loading('Generating image-based PDF...');
                            try {
                              if (componentRef.current) {
                                await exportPDF(componentRef.current, data);
                                toast.success('PDF generated successfully', { id });
                              } else {
                                toast.error('Preview not loaded yet', { id });
                              }
                            } catch (e) {
                              toast.error('Failed to generate PDF', { id });
                            }
                            setIsExportMenuOpen(false); 
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-red-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-red-200/80 transition-all duration-300 shadow-sm">
                            <FileText className="w-4.5 h-4.5 text-red-600" />
                          </div>
                          PDF (Image Base)
                        </button>
                        <button
                          onClick={() => {
                            try {
                              exportDOCX(data);
                              toast.success('Word document generated');
                            } catch (e) {
                              toast.error('Failed to generate Word document');
                            }
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-blue-200/80 transition-all duration-300 shadow-sm">
                            <FileType2 className="w-4.5 h-4.5 text-blue-600" />
                          </div>
                          Word Document
                        </button>
                        <div className="h-px bg-zinc-100 my-1.5 mx-3" />
                        <button
                          onClick={() => {
                            try {
                              exportTXT(data);
                              toast.success('Plain text generated');
                            } catch(e) { toast.error('Failed to export'); }
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-zinc-200 transition-all duration-300 shadow-sm">
                            <FileText className="w-4.5 h-4.5 text-zinc-600" />
                          </div>
                          Plain Text
                        </button>
                        <button
                          onClick={() => {
                            try {
                              exportMarkdown(data);
                              toast.success('Markdown generated');
                            } catch(e) { toast.error('Failed to export'); }
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-purple-200/80 transition-all duration-300 shadow-sm">
                            <FileCode className="w-4.5 h-4.5 text-purple-600" />
                          </div>
                          Markdown
                        </button>
                        <button
                          onClick={() => {
                            try {
                              exportJSON(data);
                              toast.success('JSON generated');
                            } catch(e) { toast.error('Failed to export'); }
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-yellow-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-yellow-200/80 transition-all duration-300 shadow-sm">
                            <FileJson className="w-4.5 h-4.5 text-yellow-600" />
                          </div>
                          JSON Resume
                        </button>
                        <button
                          onClick={() => {
                            try {
                              exportHTML(data);
                              toast.success('HTML generated');
                            } catch(e) { toast.error('Failed to export'); }
                            setIsExportMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-2xl transition-all duration-300 group text-left font-semibold hover:shadow-sm"
                        >
                          <div className="w-9 h-9 rounded-xl bg-orange-100/80 flex items-center justify-center mr-3 group-hover:scale-110 group-hover:bg-orange-200/80 transition-all duration-300 shadow-sm">
                            <FileCode className="w-4.5 h-4.5 text-orange-600" />
                          </div>
                          HTML Resume
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-4 md:h-5 bg-zinc-200 mx-0.5 md:mx-1 flex-shrink-0" />

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.preventDefault(); zoomOut(0.25); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-95 flex-shrink-0"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
              </Button>
              
              <div className="flex flex-col items-center min-w-[2.5rem] md:min-w-[3.5rem] select-none px-0.5 md:px-1 flex-shrink-0">
                <span className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Zoom</span>
                <span className="text-[10px] md:text-sm font-bold text-zinc-800 tabular-nums">
                  {Math.round(currentScale * 100)}%
                </span>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.preventDefault(); zoomIn(0.25); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-95 flex-shrink-0"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
              </Button>
              
              <div className="w-px h-4 md:h-5 bg-zinc-200 mx-0.5 md:mx-1 flex-shrink-0" />
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => { e.preventDefault(); centerView(initialScale, 500); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-8 w-8 md:h-10 md:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm transition-all active:scale-95 flex-shrink-0"
                title="Fit to Screen"
              >
                <Maximize className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
              </Button>
            </div>
          </motion.div>

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden bg-zinc-100/50 lg:bg-transparent bg-dot-pattern cursor-grab active:cursor-grabbing relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            <TransformComponent 
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: 'max-content', height: 'max-content' }}
            >
              <div 
                ref={componentRef}
                className={cn(
                  "bg-white paper-premium-shadow rounded-sm transition-all duration-500 group/paper relative overflow-hidden shrink-0 my-12 md:my-16",
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
                <div id="resume-watermark" className="absolute bottom-6 right-8 pointer-events-none select-none opacity-[0.06] group-hover/paper:opacity-[0.12] transition-opacity duration-700 flex items-center gap-2">
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
