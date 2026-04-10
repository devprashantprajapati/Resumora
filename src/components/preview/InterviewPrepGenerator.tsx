import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Sparkles, Loader2, Briefcase, Building2, ChevronDown, Lightbulb, MessageSquare, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useResumeStore } from '@/store/useResumeStore';
import { generateInterviewPrepStream, InterviewPrepResult } from '@/services/ai';
import { parse } from 'partial-json';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function InterviewPrepGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<InterviewPrepResult | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  const { data } = useResumeStore();

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !companyName.trim()) {
      toast.error('Please enter both company name and job description');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setExpandedQuestion(0);
    try {
      const resumeContent = `
        ${data.personalInfo.title}
        ${data.personalInfo.summary}
        ${data.experience.map(e => `${e.position} at ${e.company}. ${e.description}`).join('\n')}
        ${data.skills.map(s => s.name).join(', ')}
      `;

      const stream = generateInterviewPrepStream(resumeContent, jobDescription, companyName);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        try {
          const partialResult = parse(fullText) as InterviewPrepResult;
          setResult(partialResult);
        } catch (e) {
          // Ignore partial parse errors
        }
      }
    } catch (error) {
      toast.error('Failed to generate interview prep. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto mx-4 border border-white/20"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-100/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">AI Interview Prep</h2>
                  <p className="text-sm font-medium text-zinc-500">Tailored questions & strategies</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-10 h-10 hover:bg-zinc-100 transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Inputs */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-zinc-400" />
                      Company Name
                    </Label>
                    <Input 
                      placeholder="e.g. Google, Stripe, etc." 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pro-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-zinc-400" />
                      Job Description
                    </Label>
                    <Textarea 
                      placeholder="Paste the full job description here..." 
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[250px] resize-none pro-input"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200/50 rounded-xl h-12 font-bold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing & Preparing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Prep Guide
                    </>
                  )}
                </Button>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-8 flex flex-col h-full border border-zinc-200/60 rounded-2xl overflow-hidden bg-zinc-50/50">
                <div className="flex items-center justify-between p-4 border-b border-zinc-200/60 bg-white shrink-0">
                  <span className="font-bold text-sm text-zinc-700">Your Personalized Guide</span>
                </div>
                
                <div className="p-5 flex-1 overflow-y-auto custom-scrollbar relative">
                  {isGenerating && !result ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-white/50 backdrop-blur-sm z-10">
                      <Loader2 className="w-8 h-8 mb-4 animate-spin text-purple-600" />
                      <p className="text-sm font-medium text-zinc-600">Cross-referencing your resume with the job description...</p>
                    </div>
                  ) : result ? (
                    <div className="space-y-8">
                      {isGenerating && (
                        <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-50 p-2 rounded-lg border border-purple-100">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-bold uppercase tracking-wider">Generating in real-time...</span>
                        </div>
                      )}
                      {/* General Tips */}
                      {Array.isArray(result.generalTips) && result.generalTips.length > 0 && (
                        <section>
                          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            General Tips for {companyName}
                          </h3>
                          <div className="grid gap-3">
                            {result.generalTips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <span className="text-amber-600 text-xs font-bold">{i + 1}</span>
                                </div>
                                <p className="text-sm text-zinc-700 leading-relaxed">{typeof tip === 'string' ? tip : ''}</p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Questions */}
                      {Array.isArray(result.questions) && result.questions.length > 0 && (
                        <section>
                          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-purple-500" />
                            Predicted Questions & Strategies
                          </h3>
                          <div className="space-y-3">
                            {result.questions.map((q, i) => q && typeof q === 'object' ? (
                              <div 
                                key={i} 
                                className={cn(
                                  "bg-white border rounded-xl overflow-hidden transition-all duration-300",
                                  expandedQuestion === i ? "border-purple-200 shadow-md" : "border-zinc-200 hover:border-purple-200/50"
                                )}
                              >
                                <button
                                  onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                                  className="w-full flex items-center justify-between p-4 text-left"
                                >
                                  <div className="flex items-center gap-3 pr-4">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold shrink-0">
                                      Q{i + 1}
                                    </span>
                                    <div>
                                      <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">{q.type || 'Thinking...'}</div>
                                      <h4 className="text-sm font-bold text-zinc-900 leading-snug">{q.question || 'Generating question...'}</h4>
                                    </div>
                                  </div>
                                  <ChevronDown className={cn(
                                    "w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300",
                                    expandedQuestion === i ? "rotate-180" : ""
                                  )} />
                                </button>

                                <AnimatePresence>
                                  {expandedQuestion === i && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-4 pt-0 border-t border-zinc-100 bg-zinc-50/50 space-y-4 mt-2">
                                        <div>
                                          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Target className="w-3.5 h-3.5" /> Why they are asking
                                          </h5>
                                          <p className="text-sm text-zinc-700 leading-relaxed">{q.whyTheyAreAsking || '...'}</p>
                                        </div>
                                        <div>
                                          <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" /> How to answer (using your resume)
                                          </h5>
                                          <p className="text-sm text-zinc-700 leading-relaxed bg-purple-50/50 p-3 rounded-lg border border-purple-100/50">
                                            {q.suggestedAnswerStrategy || '...'}
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ) : null)}
                          </div>
                        </section>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center p-6">
                      <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm max-w-[250px]">Enter the job details and click generate to get your personalized interview prep guide.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        onPointerDown={(e) => e.stopPropagation()}
        className="group relative overflow-hidden bg-white/90 backdrop-blur-xl hover:bg-white text-zinc-900 border border-zinc-200/80 shadow-sm hover:shadow-md rounded-full h-8 md:h-11 px-2 md:px-5 transition-all duration-300 flex items-center gap-1.5 md:gap-2 active:scale-95"
      >
        <BrainCircuit className="w-4 h-4 text-purple-600" />
        <span className="hidden md:inline text-xs md:text-sm font-bold">Interview Prep</span>
      </Button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
