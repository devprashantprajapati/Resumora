import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, CheckCircle2, AlertCircle, Target, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume } from '@/lib/atsChecker';
import { cn } from '@/lib/utils';

export function ATSChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useResumeStore();
  
  const result = analyzeResume(data);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200/80 shadow-sm rounded-full h-8 md:h-11 px-2 md:px-5 transition-all flex items-center gap-1.5 md:gap-3 active:scale-95"
      >
        <div className="relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
          <svg className="w-full h-full -rotate-90 drop-shadow-sm">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-zinc-100"
            />
            <motion.circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={2 * Math.PI * 14}
              initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - result.score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000 ease-out",
                result.score >= 80 ? "text-emerald-500" : result.score >= 60 ? "text-yellow-500" : "text-red-500"
              )}
            />
          </svg>
          <Activity className={cn(
            "w-2.5 h-2.5 md:w-3 md:h-3 absolute transition-colors",
            result.score >= 80 ? "text-emerald-600" : result.score >= 60 ? "text-yellow-600" : "text-red-600"
          )} />
          {result.score >= 80 && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-emerald-400/20 -z-10"
            />
          )}
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5 opacity-70">ATS Score</span>
          <span className={cn("text-xs md:text-sm font-black tabular-nums tracking-tight", getScoreColor(result.score))}>
            {result.score}%
          </span>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto mx-4 border border-white/20"
            >
              <div className="flex items-center justify-between p-8 border-b border-zinc-100/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">ATS Analysis</h2>
                    <p className="text-sm font-medium text-zinc-500">How well your resume performs</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-10 h-10 hover:bg-zinc-100 transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className={cn("relative flex flex-col items-center justify-center p-14 rounded-[3rem] border-2 border-dashed mb-10 overflow-hidden group/score", getScoreBg(result.score))}>
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-48 h-48 bg-current rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-current rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse" />
                  </div>
                  
                  <div className="relative flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className={cn("text-9xl font-black tracking-tighter drop-shadow-2xl select-none", getScoreColor(result.score))}
                    >
                      {result.score}
                    </motion.div>
                    <div className="absolute -top-4 -right-8 text-3xl font-black opacity-30">%</div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] mt-4 opacity-70"
                    >
                      Resume Strength
                    </motion.div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className={cn(
                      "mt-8 px-6 py-2.5 rounded-full text-sm font-black shadow-xl border backdrop-blur-md",
                      result.score >= 80 ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200/50" : 
                      result.score >= 60 ? "bg-yellow-500 text-white border-yellow-400 shadow-yellow-200/50" : 
                      "bg-red-500 text-white border-red-400 shadow-red-200/50"
                    )}
                  >
                    {result.score >= 80 ? "EXCELLENT" : result.score >= 60 ? "GOOD" : "NEEDS WORK"}
                  </motion.div>
                </div>

                <div className="space-y-10">
                  {result.improvements.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.15em] mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Critical Improvements ({result.improvements.length})
                      </h3>
                      <div className="grid gap-3">
                        {result.improvements.map((item, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            className="flex items-start gap-4 text-sm text-zinc-700 bg-red-50/30 p-4 rounded-2xl border border-red-100/50 group hover:bg-red-50/50 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            </div>
                            <span className="leading-relaxed font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {result.good.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.15em] mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Optimization Success ({result.good.length})
                      </h3>
                      <div className="grid gap-3">
                        {result.good.map((item, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            className="flex items-start gap-4 text-sm text-zinc-700 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50 group hover:bg-emerald-50/50 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="leading-relaxed font-medium">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-zinc-100/50 bg-zinc-50/50 flex justify-end">
                <Button 
                  onClick={() => setIsOpen(false)} 
                  className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-zinc-200 transition-all active:scale-95"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
