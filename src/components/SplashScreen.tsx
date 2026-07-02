import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Ultra professional timing: total ~3.2s
    const timer = setTimeout(() => setIsVisible(false), 3200);

    const steps = [0, 800, 1600, 2400];
    const timeouts = steps.map((delay, index) => 
      setTimeout(() => setLoadingStep(index), delay)
    );

    return () => {
      clearTimeout(timer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const loadingTexts = [
    'ESTABLISHING CONNECTION...',
    'SYNCING WORKSPACE STATE...',
    'INITIALIZING AI MODELS...',
    'READY'
  ];

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -20,
              filter: "blur(10px)",
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090b] pointer-events-auto overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            {/* Minimalist Ambient Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-500 blur-[120px]"
              />
            </div>

            {/* Geometric Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm px-6">
              {/* Logo Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12 filter brightness-0 invert"
              >
                <Logo className="scale-150 sm:scale-[1.75]" />
              </motion.div>

              {/* Progress Container */}
              <div className="w-full space-y-4">
                {/* Minimalist Loading Bar */}
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.2, ease: [0.25, 1, 0.5, 1] }}
                  />
                </div>

                {/* Tech Terminal Text */}
                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-white/50">
                  <div className="flex space-x-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {loadingTexts[loadingStep]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    v2.0.0
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isVisible ? "h-screen w-screen overflow-hidden fixed inset-0 pointer-events-none" : "w-full h-full"}>
        {children}
      </div>
    </>
  );
};
