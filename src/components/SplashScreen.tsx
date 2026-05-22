import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './Logo';

export const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep it visible for 2.6 seconds to allow the animation to play out completely
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    return () => clearTimeout(timer);
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
              scale: 1.05,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
            }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-50 pointer-events-auto overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            {/* Elegant Background Ambient Glows */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-multiply opacity-70">
              <motion.div 
                initial={{ opacity: 0, scale: 0.3, x: -100, y: -50 }}
                animate={{ opacity: 0.6, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-indigo-200/50 rounded-full blur-[80px]"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.3, x: 100, y: 50 }}
                animate={{ opacity: 0.4, scale: 1.2, x: 0, y: 0 }}
                transition={{ duration: 2.2, delay: 0.2, ease: "easeOut" }}
                className="absolute w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-sky-200/40 rounded-full blur-[80px]"
              />
            </div>

            {/* Premium Logo Reveal with subtle float */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ 
                scale: [0.85, 1.02, 1], 
                opacity: 1, 
                y: [30, -5, 0], 
                filter: ["blur(12px)", "blur(0px)", "blur(0px)"] 
              }}
              transition={{ 
                duration: 1.4, 
                ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
                delay: 0.2 
              }}
              className="relative z-10 flex items-center justify-center -mt-16"
            >
              {/* Outer glowing ring behind logo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.5, 2] }}
                transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
                className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl"
              />
              <Logo className="scale-[1.35] sm:scale-[1.65] relative z-20 drop-shadow-2xl" />
            </motion.div>
            
            {/* Loading Indicator Section */}
            <motion.div 
               initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
               className="absolute bottom-20 flex flex-col items-center w-full px-8"
            >
               {/* Animated minimal loading bar */}
               <div className="relative w-56 sm:w-72 h-[2px] bg-zinc-200/80 rounded-full overflow-hidden shadow-inner">
                  {/* The progress fill */}
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ 
                      duration: 1.8, 
                      ease: [0.76, 0, 0.24, 1], // premium easeInOut curve
                      delay: 0.2
                    }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400 rounded-full w-full"
                  />
                  {/* Subtle sweep highlight on top of progress */}
                  <motion.div 
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "100%", opacity: 1 }}
                    transition={{ 
                      duration: 1.5, 
                      ease: "linear",
                      delay: 0.6
                    }}
                    className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent z-10"
                  />
               </div>
               
               {/* Staggered Loading Text */}
               <div className="flex items-center gap-1 mt-6 text-[9px] sm:text-[10px] font-black text-indigo-900/50 tracking-[0.35em] uppercase select-none">
                 <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                 >
                   Initializing
                 </motion.span>
                 <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 >
                   ...
                 </motion.span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children right away so they load in DOM, but aren't interacted with if under splash. */}
      {/* We can enforce no scrolling on the body while the splash is visible */}
      <div 
        className={isVisible ? "h-screen w-screen overflow-hidden fixed inset-0 pointer-events-none" : "w-full h-full"}
      >
        {children}
      </div>
    </>
  );
};
