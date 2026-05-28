import { useState, useDeferredValue, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Briefcase, MapPin, Building, ExternalLink, Loader2, Globe, Target, Sparkles, CheckCircle2, DollarSign, Clock, Layout } from 'lucide-react';
import { Button } from '../ui/Button';
import { useResumeStore } from '@/store/useResumeStore';
import { searchJobsStream, JobOpportunity } from '@/services/ai';
import { toast } from 'sonner';

const LOADING_STEPS = [
  "Analyzing resume structure...",
  "Extracting key technical skills...",
  "Matching candidate profile...",
  "Scouring live job boards...",
  "Ranking opportunities by fit..."
];

export function JobSearchGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const { data } = useResumeStore();
  const deferredData = useDeferredValue(data);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    setJobs([]);
    
    try {
      const resumeContext = `
        Title: ${deferredData.personalInfo.title}
        Summary: ${deferredData.personalInfo.summary}
        Experience: ${deferredData.experience.map(e => `${e.position} at ${e.company}. ${e.description}`).join(' | ')}
        Skills: ${deferredData.skills.map(s => s.name).join(', ')}
        Location: ${deferredData.personalInfo.city}, ${deferredData.personalInfo.country}
      `;
      
      const stream = searchJobsStream(resumeContext);
      for await (const job of stream) {
        setJobs(prev => [...prev, job]);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast.error(error?.message || 'Failed to search jobs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-zinc-700 bg-zinc-50 border-zinc-200';
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-[40px] h-[33px] rounded-full transition-all active:scale-95 text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm flex-shrink-0"
        title="Find Jobs Online"
      >
        <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </Button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-zinc-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 bg-white shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-zinc-900 tracking-tight">AI Connect Job Search</h2>
                      <p className="text-sm font-medium text-zinc-500 mt-0.5">Real-time matching powered by Gemini 3.5 Flash</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                  {!hasSearched ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center max-w-lg mx-auto">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 border border-zinc-100">
                        <Sparkles className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">Ready to find your next role?</h3>
                      <p className="text-zinc-500 mb-10 leading-relaxed text-[15px]">
                        Our AI engine will analyze your resume against thousands of live private and government postings to find your perfect match.
                      </p>
                      <Button onClick={handleSearch} disabled={isLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 h-14 px-10 text-base rounded-xl shadow-xl shadow-blue-600/20 w-full sm:w-auto transition-all hover:scale-[1.02]">
                        <Search className="w-5 h-5" />
                        Start Deep Search
                      </Button>
                    </div>
                  ) : isLoading && jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[350px] space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-[40px] opacity-20 animate-pulse" />
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-zinc-100 relative z-10">
                          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                      </div>
                      <div className="space-y-3 text-center">
                        <h3 className="text-lg font-bold text-zinc-900">Conducting Deep Search</h3>
                        <div className="h-6 flex items-center justify-center overflow-hidden">
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={loadingStepIdx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full"
                            >
                              {LOADING_STEPS[loadingStepIdx]}
                            </motion.p>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  ) : jobs.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center">
                      <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 shadow-sm">
                        <Search className="w-10 h-10 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">No active jobs found</h3>
                      <p className="text-[15px] text-zinc-500 max-w-md mb-8 leading-relaxed">
                        We couldn't find any direct matches that meet our high-confidence threshold right now. 
                      </p>
                      <Button onClick={handleSearch} variant="outline" className="gap-2 h-12 px-8 rounded-xl border-zinc-300">
                        <Search className="w-4 h-4" />
                        Retry Search
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {isLoading && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/60 shadow-inner mb-2"
                        >
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          <span className="text-sm font-semibold text-blue-800 tracking-tight animate-pulse">Scanning live sources for more opportunities...</span>
                        </motion.div>
                      )}
                      {jobs.map((job, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-2xl border border-zinc-200/80 p-6 hover:border-blue-300 hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50 group-hover:bg-blue-100 transition-colors" />
                          
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-5">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 transition-colors tracking-tight">
                                  {job.title}
                                </h4>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(job.matchScore)}`}>
                                  <Target className="w-3.5 h-3.5" />
                                  {job.matchScore}% Match
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-zinc-600">
                                <span className="flex items-center gap-1.5">
                                  <Building className="w-4 h-4 text-zinc-400" />
                                  {job.company}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-zinc-400" />
                                  {job.location}
                                </span>
                                {job.salaryRange && (
                                  <span className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-zinc-400" />
                                    {job.salaryRange}
                                  </span>
                                )}
                                {job.jobType && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    {job.jobType}
                                  </span>
                                )}
                              </div>
                            </div>
                            <a
                              href={job.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                            >
                              Apply Now <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-zinc-100">
                            <div className="md:col-span-2 space-y-3">
                              <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Layout className="w-3.5 h-3.5" /> Role Overview
                              </h5>
                              <p className="text-[14px] text-zinc-700 leading-relaxed">
                                {job.description}
                              </p>
                              {job.matchReason && (
                                <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-100/50">
                                  <p className="text-[13px] text-blue-800 font-medium flex items-start gap-2 leading-relaxed">
                                    <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    {job.matchReason}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {job.topSkills && job.topSkills.length > 0 && (
                              <div className="space-y-3">
                                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Key Requirements
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {job.topSkills.map((skill, i) => (
                                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[13px] font-medium border border-zinc-200/60">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
