import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, CheckCircle2, AlertCircle, Target, ChevronRight, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume } from '@/lib/atsChecker';
import { analyzeJobMatch, JobMatchResult } from '@/services/ai';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function ATSChecker() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'jobMatch'>('general');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);

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

  const handleAnalyzeJobMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Compile resume content into a single string for analysis
      const resumeContent = `
        ${data.personalInfo.title}
        ${data.personalInfo.summary}
        ${data.experience.map(e => `${e.position} at ${e.company}. ${e.description}`).join('\n')}
        ${data.skills.map(s => s.name).join(', ')}
        ${data.education.map(e => `${e.degree} at ${e.school}`).join('\n')}
      `;

      const matchResult = await analyzeJobMatch(resumeContent, jobDescription);
      setJobMatchResult(matchResult);
    } catch (error) {
      toast.error('Failed to analyze job match. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        onPointerDown={(e) => e.stopPropagation()}
        className="group relative overflow-hidden bg-white/90 backdrop-blur-xl hover:bg-white text-zinc-900 border border-zinc-200/80 shadow-sm hover:shadow-md rounded-full h-8 md:h-11 px-2 md:px-5 transition-all duration-300 flex items-center gap-1.5 md:gap-3 active:scale-95"
      >
        <div className="relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 drop-shadow-sm">
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
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto mx-4 border border-white/20"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-100/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Pro Analysis</h2>
                    <p className="text-sm font-medium text-zinc-500">Optimize your resume for ATS</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-10 h-10 hover:bg-zinc-100 transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>

              <div className="flex border-b border-zinc-100/80 px-6 md:px-8 pt-2 gap-6">
                <button
                  onClick={() => setActiveTab('general')}
                  className={cn(
                    "pb-4 text-sm font-bold transition-colors relative",
                    activeTab === 'general' ? "text-indigo-600" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  General ATS Check
                  {activeTab === 'general' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('jobMatch')}
                  className={cn(
                    "pb-4 text-sm font-bold transition-colors relative flex items-center gap-2",
                    activeTab === 'jobMatch' ? "text-indigo-600" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Job Matcher
                  {activeTab === 'jobMatch' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                {activeTab === 'general' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className={cn("relative flex flex-col items-center justify-center p-10 md:p-14 rounded-[3rem] border-2 border-dashed mb-10 overflow-hidden group/score", getScoreBg(result.score))}>
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-current rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-current rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 animate-pulse" />
                      </div>
                      
                      <div className="relative flex flex-col items-center">
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15, stiffness: 200 }}
                          className={cn("text-8xl md:text-9xl font-black tracking-tighter drop-shadow-2xl select-none", getScoreColor(result.score))}
                        >
                          {result.score}
                        </motion.div>
                        <div className="absolute -top-4 -right-8 text-3xl font-black opacity-30">%</div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] mt-4 opacity-70 text-center"
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
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {!jobMatchResult ? (
                      <div className="space-y-4">
                        <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-2xl">
                          <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                            Tailor Your Resume
                          </h3>
                          <p className="text-sm text-indigo-700/80 leading-relaxed">
                            Paste the job description you are applying for. Our AI will analyze your resume against the requirements and tell you exactly what keywords you're missing.
                          </p>
                        </div>
                        <Textarea
                          placeholder="Paste the job description here..."
                          className="min-h-[200px] resize-none pro-input text-sm"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <Button 
                          onClick={handleAnalyzeJobMatch} 
                          disabled={isAnalyzing}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 rounded-xl h-12 font-bold"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing Match...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              Analyze Job Match
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-zinc-900 text-lg">Analysis Results</h3>
                          <Button variant="outline" size="sm" onClick={() => setJobMatchResult(null)} className="text-xs">
                            Analyze Another Job
                          </Button>
                        </div>

                        <div className={cn("relative flex items-center justify-between p-6 rounded-3xl border-2", getScoreBg(jobMatchResult.score))}>
                          <div>
                            <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Match Score</div>
                            <div className={cn("text-4xl font-black", getScoreColor(jobMatchResult.score))}>
                              {jobMatchResult.score}%
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn(
                              "px-4 py-1.5 rounded-full text-xs font-bold border",
                              jobMatchResult.score >= 80 ? "bg-emerald-500 text-white border-emerald-400" : 
                              jobMatchResult.score >= 60 ? "bg-yellow-500 text-white border-yellow-400" : 
                              "bg-red-500 text-white border-red-400"
                            )}>
                              {jobMatchResult.score >= 80 ? "HIGH MATCH" : jobMatchResult.score >= 60 ? "MEDIUM MATCH" : "LOW MATCH"}
                            </div>
                          </div>
                        </div>

                        {jobMatchResult.missingKeywords.length > 0 && (
                          <section>
                            <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-500" />
                              Missing Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {jobMatchResult.missingKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-xs font-medium">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </section>
                        )}

                        {jobMatchResult.matchingKeywords.length > 0 && (
                          <section>
                            <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              Matching Keywords
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {jobMatchResult.matchingKeywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </section>
                        )}

                        {jobMatchResult.recommendations.length > 0 && (
                          <section>
                            <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                              <Target className="w-4 h-4 text-indigo-500" />
                              AI Recommendations
                            </h4>
                            <ul className="space-y-3">
                              {jobMatchResult.recommendations.map((rec, i) => (
                                <li key={i} className="flex gap-3 text-sm text-zinc-700 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              
              <div className="p-6 border-t border-zinc-100/50 bg-zinc-50/50 flex justify-end">
                <Button 
                  onClick={() => setIsOpen(false)} 
                  className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl px-8 h-11 font-bold shadow-md transition-all active:scale-95"
                >
                  Close
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
