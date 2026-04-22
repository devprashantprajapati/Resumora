import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className, showText = true, ...props }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <svg
        className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="docGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#312e81" />
          </linearGradient>
          <linearGradient id="arrowGrad" x1="10" y1="60" x2="70" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#312e81" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="starGrad" x1="60" y1="10" x2="90" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
        </defs>

        {/* Document Outline */}
        <path
          d="M 35 25 H 50 M 65 35 V 75 C 65 80.523 60.523 85 55 85 H 35 C 29.477 85 25 80.523 25 75 V 45"
          stroke="url(#docGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Document Lines */}
        <rect x="35" y="40" width="20" height="4" rx="2" fill="#312e81" />
        <rect x="35" y="52" width="20" height="4" rx="2" fill="#312e81" />
        <rect x="35" y="64" width="12" height="4" rx="2" fill="#312e81" />

        {/* Swoosh Arrow */}
        <path
          d="M 15 65 C 15 65 15 45 40 35 C 55 29 60 35 65 25 L 70 35 L 55 40 C 55 40 50 35 40 40 C 25 47.5 25 65 25 65 H 15 Z"
          fill="url(#arrowGrad)"
        />

        {/* Star */}
        <motion.path
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          d="M 75 25 L 78 17 L 86 14 L 78 11 L 75 3 L 72 11 L 64 14 L 72 17 L 75 25 Z"
          fill="url(#starGrad)"
        />
        {/* Star Sparkles */}
        <motion.path 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          d="M 75 0 V -5 M 75 28 V 33 M 90 14 H 95 M 55 14 H 60 M 83 6 L 86 3 M 67 22 L 64 25 M 67 6 L 64 3 M 83 22 L 86 25" 
          stroke="#6366f1" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-[24px] sm:text-[28px] font-black tracking-tighter leading-none">
            <span className="text-zinc-900">Resum</span>
            <span className="text-indigo-500">ora</span>
          </span>
          <span className="hidden sm:block text-[8px] sm:text-[9px] font-black text-zinc-400 tracking-[0.2em] mt-1 sm:mt-1.5 uppercase">
            AI Resume Architect
          </span>
        </div>
      )}
    </div>
  );
};
