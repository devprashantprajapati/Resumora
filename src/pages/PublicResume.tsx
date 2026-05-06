import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublishedResume, incrementResumeViews, updateViewTime, PublishedResume } from '@/lib/resumeService';
import { ModernTemplate } from '@/components/preview/templates/ModernTemplate';
import { MinimalTemplate } from '@/components/preview/templates/MinimalTemplate';
import { CorporateTemplate } from '@/components/preview/templates/CorporateTemplate';
import { CreativeTemplate } from '@/components/preview/templates/CreativeTemplate';
import { ElegantTemplate } from '@/components/preview/templates/ElegantTemplate';
import { TechTemplate } from '@/components/preview/templates/TechTemplate';
import { ExecutiveTemplate } from '@/components/preview/templates/ExecutiveTemplate';
import { PremiumTemplate } from '@/components/preview/templates/PremiumTemplate';
import { AcademicTemplate } from '@/components/preview/templates/AcademicTemplate';
import { StudioTemplate } from '@/components/preview/templates/StudioTemplate';
import { Loader2, ZoomIn, ZoomOut, Maximize, Printer, Zap } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useReactToPrint } from 'react-to-print';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function PublicResume() {
  const { slug } = useParams<{ slug: string }>();
  const [resume, setResume] = useState<PublishedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialScale, setInitialScale] = useState(1);
  const [currentScale, setCurrentScale] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resume ? `${resume.data.personalInfo.firstName || 'Resume'}_${resume.data.personalInfo.lastName || ''}` : 'Resume',
  });

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      if (!slug) return;
      
      try {
        const data = await getPublishedResume(slug);
        if (data) {
          setResume(data);
          
          // Fetch location
          let location = 'Unknown Location';
          try {
            const response = await fetch('https://ipapi.co/json/');
            const ipData = await response.json();
            if (ipData.city && ipData.country_name) {
              location = `${ipData.city}, ${ipData.country_name}`;
            }
          } catch (e) {
            console.error('Failed to fetch location', e);
          }

          // Increment view count
          const viewId = await incrementResumeViews(slug, location, navigator.userAgent);
          viewIdRef.current = viewId;
          startTimeRef.current = Date.now();
        } else {
          setError('Resume not found');
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();

    // Track time spent when user leaves the page
    const handleBeforeUnload = () => {
      if (slug && viewIdRef.current) {
        const timeSpentSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        updateViewTime(slug, viewIdRef.current, timeSpentSeconds);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [slug]);

  // Handle scaling logic perfectly
  useEffect(() => {
    let timeoutId: number;
    const calculateScale = () => {
      if (containerRef.current && resume) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = window.innerWidth < 768 ? 20 : 64; 
        const availableWidth = Math.max(containerWidth - padding, 0);
        const PAPER_WIDTH = resume.data.settings.paperSize === 'a4' ? 794 : 816;
        const fitScale = Math.min(availableWidth / PAPER_WIDTH, 1.2);
        setInitialScale(fitScale);
        setCurrentScale(fitScale);
        setIsReady(true);
      }
    };

    if (resume && !isLoading) {
      calculateScale();
      const observer = new ResizeObserver(() => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(calculateScale, 50);
      });
      
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [resume, isLoading]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="w-10 h-10 text-zinc-900 animate-spin" />
          <p className="text-sm font-medium text-zinc-600 animate-pulse">Loading amazing resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        <div className="relative z-10 bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-zinc-200/50">
          <div className="mb-8 flex justify-center"><Logo /></div>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Resume Not Found</h1>
          <p className="text-zinc-600 mb-8">The resume you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors font-semibold">
            Create your own resume
          </Link>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    const props = { data: resume.data };
    switch (resume.data.settings.template) {
      case 'minimal': return <MinimalTemplate {...props} />;
      case 'corporate': return <CorporateTemplate {...props} />;
      case 'creative': return <CreativeTemplate {...props} />;
      case 'elegant': return <ElegantTemplate {...props} />;
      case 'tech': return <TechTemplate {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      case 'premium': return <PremiumTemplate {...props} />;
      case 'academic': return <AcademicTemplate {...props} />;
      case 'studio': return <StudioTemplate {...props} />;
      case 'modern':
      default:
        return <ModernTemplate {...props} />;
    }
  };

  const getFontSizeClass = () => {
    switch (resume.data.settings.fontSize) {
      case 'small': return 'text-[0.9rem]';
      case 'large': return 'text-[1.1rem]';
      default: return 'text-base';
    }
  };

  const getPadding = () => {
    switch (resume.data.settings.spacing) {
      case 'compact': return '12mm';
      case 'relaxed': return '28mm';
      default: return '20mm';
    }
  };

  const isA4 = resume.data.settings.paperSize === 'a4';
  const paperWidth = isA4 ? '210mm' : '8.5in';
  const paperMinHeight = isA4 ? '297mm' : '11in';

  const renderVideoPitch = () => {
    const url = resume.data.settings.videoPitchUrl;
    if (!url) return null;

    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    } else if (url.includes('loom.com/share/')) {
      embedUrl = url.replace('share/', 'embed/');
    }

    return (
      <div className="w-full max-w-[800px] bg-white shadow-xl rounded-3xl overflow-hidden mb-8 border border-zinc-200/50 p-2 sm:p-4 mx-auto relative z-10 z-20 hover:shadow-2xl transition-shadow duration-500">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 rounded-t-2xl">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span className="text-xl">👋</span> Video Introduction
          </h3>
        </div>
        <div className="p-2 sm:p-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-950 border-4 border-black group">
            <iframe 
              src={embedUrl} 
              className="absolute top-0 left-0 w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Sticky Header Nav */}
      <div className="sticky top-0 left-0 right-0 h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 z-50 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <Logo />
        <Link 
          to="/" 
          className="group relative inline-flex items-center gap-2 sm:gap-2.5 bg-zinc-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold hover:bg-zinc-800 transition-all hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.3)] active:scale-95"
        >
          <Zap className="w-4 h-4 text-yellow-400 group-hover:animate-pulse" />
          <span className="hidden sm:inline">Create your own resume — it's free</span>
          <span className="inline sm:hidden">Build yours free</span>
        </Link>
      </div>

      <main className="flex-1 flex flex-col relative w-full h-[calc(100vh-5rem)]">
        {/* Background Decorative */}
        <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        <div className="pt-6 sm:pt-10 px-4 sm:px-6 flex flex-col h-full z-10" ref={containerRef}>
          {renderVideoPitch()}

          {/* Interactive Resume Canvas */}
          {!isReady ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
            </div>
          ) : (
            <TransformWrapper
              initialScale={initialScale}
              minScale={0.1}
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
                <div className="relative flex-1 w-full h-full flex flex-col pb-24 sm:pb-32">
                  <div className="flex-1 overflow-hidden rounded-3xl border border-zinc-200/60 bg-zinc-100/50 shadow-inner group/canvas relative cursor-grab active:cursor-grabbing">
                    <TransformComponent 
                      wrapperStyle={{ width: '100%', height: '100%' }}
                      contentStyle={{ width: 'max-content', height: 'max-content' }}
                    >
                      <div 
                        ref={componentRef}
                        className={cn(
                          "bg-white paper-premium-shadow rounded-sm transition-all duration-500 relative overflow-hidden shrink-0 my-16 md:my-24 print:m-0 print:shadow-none pointer-events-none",
                          getFontSizeClass()
                        )}
                        style={{ 
                          width: paperWidth, 
                          minHeight: paperMinHeight,
                          padding: getPadding(),
                          boxSizing: 'border-box'
                        }}
                      >
                         {/* Watermark for public viewing */}
                        <div className="absolute bottom-6 right-8 pointer-events-none select-none opacity-[0.06] flex items-center gap-2 print:hidden z-0">
                          <Logo className="scale-75 origin-right grayscale" showText={false} />
                          <span className="text-[12px] font-black tracking-[0.4em] uppercase text-zinc-900">Resumora</span>
                        </div>
                        <div className="relative z-10 pointer-events-auto">
                          {renderTemplate()}
                        </div>
                      </div>
                    </TransformComponent>
                  </div>

                  {/* Floating Action Toolbar */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                    className="pan-pinch-ignore absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-white/90 backdrop-blur-2xl rounded-full z-40 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)] border border-white/60 ring-1 ring-zinc-900/5"
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => handlePrint()}
                      className="h-10 sm:h-12 px-4 sm:px-6 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md font-semibold gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <Printer className="w-4.5 h-4.5" />
                      <span className="hidden sm:inline">Print / Download PDF</span>
                      <span className="inline sm:hidden">Download</span>
                    </Button>

                    <div className="w-px h-6 sm:h-8 bg-zinc-200 mx-1 sm:mx-2" />

                    <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-zinc-200/50 shadow-inner">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); zoomOut(0.25); }}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex flex-col items-center justify-center min-w-[3rem] sm:min-w-[4rem] px-1 select-none">
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-800 tabular-nums bg-white px-2 py-0.5 rounded-md shadow-sm border border-zinc-200/50">
                          {Math.round(currentScale * 100)}%
                        </span>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); zoomIn(0.25); }}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      
                      <div className="w-px h-5 bg-zinc-200 mx-1" />
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => { e.preventDefault(); centerView(initialScale, 500); }}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-sm"
                        title="Fit to Screen"
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </TransformWrapper>
          )}
        </div>
      </main>
    </div>
  );
}

