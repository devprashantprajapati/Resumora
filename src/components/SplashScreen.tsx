import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);

  const [loadingText, setLoadingText] = useState('Initializing');

  useEffect(() => {
    // Elegant timing: 3 seconds for a smooth premium feel
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3600); // 3.6s for more breathing room

    const textSequence = [
      { text: 'Initializing', delay: 0 },
      { text: 'Optimizing Assets', delay: 1000 },
      { text: 'Preparing Workspace', delay: 2000 },
      { text: 'Ready', delay: 3000 },
    ];

    const timeouts = textSequence.map(({ text, delay }) => 
      setTimeout(() => setLoadingText(text), delay)
    );

    return () => {
      clearTimeout(timer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.15,
              filter: "blur(25px)",
              transition: { duration: 1.2, ease: [0.83, 0, 0.39, 1] } 
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-50 pointer-events-auto overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            {/* Ultra Premium Animated Mesh Background */}
            <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none opacity-[0.8] mix-blend-multiply">
              <motion.div 
                animate={{ 
                  x: ["0%", "15%", "-10%", "0%"],
                  y: ["0%", "-15%", "10%", "0%"],
                  scale: [1, 1.25, 0.85, 1],
                  rotate: [0, 120, -60, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full blur-[140px] bg-gradient-to-tr from-indigo-200/90 via-blue-100/90 to-purple-200/90"
              />
              <motion.div 
                animate={{ 
                  x: ["0%", "-20%", "15%", "0%"],
                  y: ["0%", "20%", "-15%", "0%"],
                  scale: [1, 0.8, 1.3, 1],
                  rotate: [0, -90, 80, 0],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[130px] bg-gradient-to-bl from-violet-200/90 via-fuchsia-100/90 to-cyan-100/90 mix-blend-overlay"
              />
               <motion.div 
                animate={{ 
                  x: ["-10%", "20%", "-15%", "-10%"],
                  y: ["10%", "-5%", "15%", "10%"],
                  scale: [0.9, 1.1, 0.95, 0.9],
                  rotate: [45, 0, 90, 45],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] bg-gradient-to-br from-blue-200/60 via-teal-100/50 to-indigo-100/60"
              />
            </div>

            {/* Subtle Grid Overlay for Tech Vibe */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Exquisite Spotlight */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" 
            />
            {/* Inner glow for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/30 blur-[80px] rounded-full pointer-events-none mix-blend-overlay"
            />

            {/* Main Content Reveal */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 50, filter: "blur(24px)", rotateX: 10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                filter: "blur(0px)",
                rotateX: 0
              }}
              transition={{ 
                duration: 1.8, 
                ease: [0.16, 1, 0.3, 1], // Custom spring-like cinematic easing
                delay: 0.15 
              }}
              style={{ perspective: 1000 }}
              className="relative z-10 flex flex-col items-center justify-center -mt-16"
            >
              {/* Ultra-premium glass halo behind logo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.6, rotate: -20, borderRadius: "40%" }}
                animate={{ opacity: [0, 1, 0.8], scale: [0.6, 1.4, 1], rotate: 0, borderRadius: "50%" }}
                transition={{ duration: 3.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-white/30 backdrop-blur-3xl border border-white/50 shadow-[0_40px_80px_-20px_rgba(79,70,229,0.25)] -z-10 w-[150%] h-[170%] left-[-25%] top-[-35%]"
              >
                 <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              </motion.div>
              
              <div className="relative group overflow-visible">
                <Logo className="scale-[1.6] sm:scale-[2.2] md:scale-[2.5] relative z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)]" />
                
                {/* Advanced Light Sweep over the logo area */}
                <motion.div
                  initial={{ x: "-150%", skewX: -20 }}
                  animate={{ x: "200%", skewX: -20 }}
                  transition={{ duration: 2, delay: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 z-30 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent mix-blend-overlay pointer-events-none"
                />

                {/* Micro-sparkle effects */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -90 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.8, 0], rotate: 90 }}
                  transition={{ duration: 1.8, delay: 1.4, ease: "easeInOut" }}
                  className="absolute -top-6 -right-8 w-6 h-6 z-30 pointer-events-none"
                >
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[8px] opacity-40" />
                  <div className="w-full h-full bg-white rounded-full clip-star shadow-[0_0_20px_rgba(255,255,255,1)]" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: 90 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: -45 }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-6 w-3 h-3 z-30 pointer-events-none"
                >
                  <div className="w-full h-full bg-indigo-400 rounded-full clip-star blur-[1px]" />
                </motion.div>
              </div>
            </motion.div>
            
            {/* Loading Indicator Section */}
            <motion.div 
               initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               transition={{ duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="absolute bottom-20 sm:bottom-28 flex flex-col items-center w-full px-8"
            >
               {/* Center-expanding microscopic loading line */}
               <div className="relative w-56 sm:w-80 h-[2px] bg-zinc-200/50 rounded-full overflow-hidden shadow-inner">
                  {/* Origin-center progress fill */}
                  <motion.div 
                     initial={{ scaleX: 0, opacity: 0 }}
                     animate={{ scaleX: 1, opacity: 1 }}
                     transition={{ 
                        duration: 2.8, 
                        ease: [0.25, 1, 0.5, 1], // Advanced Apple-like ease
                        delay: 0.5
                     }}
                     className="absolute inset-0 bg-gradient-to-r from-indigo-300 via-indigo-600 to-indigo-300 rounded-full origin-center shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                  />
                  {/* High-speed core highlight */}
                  <motion.div 
                     initial={{ left: "-30%", opacity: 0 }}
                     animate={{ left: "130%", opacity: [0, 1, 0] }}
                     transition={{ 
                        duration: 1.5, 
                        ease: [0.65, 0, 0.35, 1],
                        delay: 0.8,
                        repeat: Infinity,
                        repeatDelay: 0.5
                     }}
                     className="absolute inset-y-0 w-24 -ml-12 bg-gradient-to-r from-transparent via-white to-transparent mix-blend-overlay z-10"
                  />
               </div>
               
               {/* Premium Sequential Loading Text */}
               <div className="flex flex-col items-center gap-2 mt-8 overflow-hidden h-[20px] relative w-[200px]">
                 <AnimatePresence mode="popLayout">
                   <motion.div
                     key={loadingText}
                     initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                     animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                     exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                     transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                     className="absolute inset-0 flex justify-center text-[9px] sm:text-[10px] font-bold text-zinc-400 tracking-[0.4em] uppercase"
                   >
                     {loadingText}
                   </motion.div>
                 </AnimatePresence>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={isVisible ? "h-screen w-screen overflow-hidden fixed inset-0 pointer-events-none" : "w-full h-full"}
      >
        {children}
      </div>
    </>
  );
};
