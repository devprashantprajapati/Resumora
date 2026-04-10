import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, Sparkles, Loader2, Copy, CheckCircle2, Briefcase, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useResumeStore } from '@/store/useResumeStore';
import { generateCoverLetterStream } from '@/services/ai';
import { toast } from 'sonner';

export function CoverLetterGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data } = useResumeStore();

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !companyName.trim()) {
      toast.error('Please enter both company name and job description');
      return;
    }

    setIsGenerating(true);
    setCoverLetter('');
    try {
      const resumeContent = `
        ${data.personalInfo.title}
        ${data.personalInfo.summary}
        ${data.experience.map(e => `${e.position} at ${e.company}. ${e.description}`).join('\n')}
        ${data.skills.map(s => s.name).join(', ')}
      `;

      const stream = generateCoverLetterStream(resumeContent, jobDescription, companyName);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setCoverLetter(fullText);
      }
    } catch (error) {
      toast.error('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setIsCopied(true);
    toast.success('Cover letter copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

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
            className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto mx-4 border border-white/20"
          >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-100/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 tracking-tight">AI Cover Letter</h2>
                  <p className="text-sm font-medium text-zinc-500">Tailored to your target job</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full w-10 h-10 hover:bg-zinc-100 transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </Button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 rounded-xl h-12 font-bold"
                >
                  {isGenerating && !coverLetter ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-col h-full border border-zinc-200/60 rounded-2xl overflow-hidden bg-zinc-50/50">
                <div className="flex items-center justify-between p-4 border-b border-zinc-200/60 bg-white">
                  <span className="font-bold text-sm text-zinc-700">Generated Result</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!coverLetter}
                    className="h-8 text-xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                  >
                    {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                    {isCopied ? 'Copied!' : 'Copy Text'}
                  </Button>
                </div>
                <div className="p-5 flex-1 overflow-y-auto custom-scrollbar relative">
                  {isGenerating && !coverLetter ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 bg-white/50 backdrop-blur-sm z-10">
                      <Loader2 className="w-8 h-8 mb-4 animate-spin text-indigo-600" />
                      <p className="text-sm font-medium text-zinc-600">Crafting your perfect cover letter...</p>
                    </div>
                  ) : coverLetter ? (
                    <div className="space-y-4">
                      {isGenerating && (
                        <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-xs font-bold uppercase tracking-wider">Generating in real-time...</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed font-serif">
                        {coverLetter}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center p-6">
                      <FileText className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm">Your generated cover letter will appear here.</p>
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
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span className="hidden md:inline text-xs md:text-sm font-bold">Cover Letter</span>
      </Button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
