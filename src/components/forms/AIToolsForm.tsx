import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { analyzeJobMatch, generateCoverLetterStream, generateInterviewPrep, tailorResumeData, translateResumeData, JobMatchResult, InterviewPrepResult } from '@/services/ai';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FileText, Target, CheckCircle2, XCircle, Search, Lightbulb, Copy, Check, ChevronDown, CheckSquare, MessageSquare, Wand2, Globe } from 'lucide-react';

export function AIToolsForm() {
  const { data, updateData } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'match' | 'coverletter' | 'interview' | 'translate'>('match');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Translation State
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');

  // Job Match State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);

  // Cover Letter State
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copiedCL, setCopiedCL] = useState(false);

  // Interview Prep State
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false);
  const [prepResult, setPrepResult] = useState<InterviewPrepResult | null>(null);

  const getResumeContent = () => {
    return `
      Name: ${data.personalInfo.firstName} ${data.personalInfo.lastName}
      Title: ${data.personalInfo.title}
      Summary: ${data.personalInfo.summary}
      Experience: ${data.experience.map(e => `${e.position} at ${e.company} (${e.startDate}-${e.endDate}): ${e.description}`).join('; ')}
      Education: ${data.education.map(e => `${e.degree} at ${e.school}`).join('; ')}
      Skills: ${data.skills.map(s => s.name).join(', ')}
    `;
  };

  const handleAnalyzeMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    
    setIsAnalyzing(true);
    setMatchResult(null);
    try {
      const result = await analyzeJobMatch(getResumeContent(), jobDescription);
      setMatchResult(result);
      toast.success('Analysis complete!');
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error('Failed to analyze job match');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description first');
      return;
    }

    setIsTailoring(true);
    try {
      const tailoredContent = await tailorResumeData(getResumeContent(), jobDescription);
      
      const newExperience = data.experience.map(exp => {
        const matchingTailoredExp = tailoredContent.experiences.find(te => te.id === exp.id);
        if (matchingTailoredExp) {
          return { ...exp, description: matchingTailoredExp.description };
        }
        return exp;
      });

      updateData({
        ...data,
        personalInfo: {
          ...data.personalInfo,
          summary: tailoredContent.summary
        },
        experience: newExperience
      });

      toast.success('Resume successfully tailored to job!');
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error('Failed to tailor resume');
      }
    } finally {
      setIsTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim() || !companyName.trim()) {
      toast.error('Please enter both company name and job description');
      return;
    }

    setIsGeneratingCL(true);
    setCoverLetter('');
    try {
      const stream = generateCoverLetterStream(getResumeContent(), jobDescription, companyName);
      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk;
        setCoverLetter(fullText);
      }
      toast.success('Cover letter generated!');
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error('Failed to generate cover letter');
      }
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleGenerateInterviewPrep = async () => {
    if (!jobDescription.trim() || !companyName.trim()) {
      toast.error('Please enter both company name and job description');
      return;
    }

    setIsGeneratingPrep(true);
    setPrepResult(null);
    try {
      const result = await generateInterviewPrep(getResumeContent(), jobDescription, companyName);
      setPrepResult(result);
      toast.success('Interview prep guide generated!');
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error('Failed to generate interview prep guide');
      }
    } finally {
      setIsGeneratingPrep(false);
    }
  };

  const handleTranslate = async () => {
    if (!targetLanguage.trim()) {
      toast.error('Please enter a target language');
      return;
    }

    setIsTranslating(true);
    try {
      const translatedData = await translateResumeData(data, targetLanguage);
      updateData(translatedData);
      toast.success(`Resume successfully translated to ${targetLanguage}!`);
    } catch (error: any) {
      console.error("Translation error:", error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error('Failed to translate resume');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopiedCL(true);
    setTimeout(() => setCopiedCL(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('match')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'match' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          ATS Match
        </button>
        <button
          onClick={() => setActiveTab('coverletter')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'coverletter' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'interview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Interview Prep
        </button>
        <button
          onClick={() => setActiveTab('translate')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'translate' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-700'}`}
        >
          Translate
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Job Description</Label>
          <Textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="min-h-[120px] pro-input bg-white"
          />
        </div>
        {(activeTab === 'coverletter' || activeTab === 'interview') && (
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Stripe"
              className="pro-input bg-white"
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        {activeTab === 'match' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <Button onClick={handleAnalyzeMatch} isLoading={isAnalyzing} className="flex-1 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl h-12 shadow-sm font-medium">
                <Search className="w-4 h-4 mr-2 text-zinc-500" /> Analyze Match
              </Button>
              <Button onClick={handleTailorResume} isLoading={isTailoring} className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border-none text-white rounded-xl h-12 shadow-sm font-medium transition-all hover:scale-[1.02]">
                <Wand2 className="w-4 h-4 mr-2" /> Auto-Tailor Resume
              </Button>
            </div>
            
            {matchResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <div>
                    <h4 className="font-semibold text-zinc-900">Match Score</h4>
                    <p className="text-sm text-zinc-500">Based on keyword overlap</p>
                  </div>
                  <div className={`text-3xl font-bold ${matchResult.score >= 80 ? 'text-green-600' : matchResult.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                    {matchResult.score}%
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-zinc-900 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Matching Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matchingKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">{kw}</span>
                      ))}
                      {matchResult.matchingKeywords.length === 0 && <span className="text-sm text-zinc-500 italic">None found</span>}
                    </div>
                  </div>
                  <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                    <h4 className="font-semibold text-zinc-900 flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-500" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">{kw}</span>
                      ))}
                      {matchResult.missingKeywords.length === 0 && <span className="text-sm text-zinc-500 italic">None missing!</span>}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <h4 className="font-semibold text-zinc-900 flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {matchResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5 text-zinc-400">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'coverletter' && (
          <div className="space-y-6">
            <Button onClick={handleGenerateCoverLetter} isLoading={isGeneratingCL} disabled={!companyName.trim() || !jobDescription.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 shadow-sm font-medium">
              <FileText className="w-4 h-4 mr-2" /> Generate Cover Letter
            </Button>

            {coverLetter && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm relative group">
                <Button variant="outline" size="sm" onClick={copyCoverLetter} className="absolute top-4 right-4 h-8 px-2.5 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedCL ? <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedCL ? 'Copied' : 'Copy'}
                </Button>
                <div className="whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed font-serif pr-16">
                  {coverLetter}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-6">
            <Button onClick={handleGenerateInterviewPrep} isLoading={isGeneratingPrep} disabled={!companyName.trim() || !jobDescription.trim()} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 shadow-sm font-medium">
              <MessageSquare className="w-4 h-4 mr-2" /> Generate Interview Prep Guide
            </Button>

            {prepResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <h4 className="font-semibold text-zinc-900 flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-indigo-500" /> Expected Questions & Strategies
                  </h4>
                  <div className="space-y-6">
                    {prepResult.questions.map((q, i) => (
                      <div key={i} className="border-b border-zinc-100 last:border-0 pb-6 last:pb-0">
                        <p className="font-medium text-zinc-900 mb-2">Q{i + 1}: {q.question}</p>
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-100 mt-3">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Why they ask</span>
                            <p className="text-sm text-zinc-600 mt-0.5">{q.whyTheyAreAsking}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">How to answer</span>
                            <p className="text-sm text-zinc-700 mt-0.5">{q.suggestedAnswerStrategy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <h4 className="font-semibold text-zinc-900 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> General Tips
                  </h4>
                  <ul className="space-y-3">
                    {prepResult.generalTips.map((tip, i) => (
                      <li key={i} className="text-sm text-zinc-700 flex items-start gap-2">
                        <span className="shrink-0 mt-0.5 text-zinc-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'translate' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">One-Click Translation</h3>
                  <p className="text-sm text-zinc-500">Translate your entire resume into any language instantly.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Target Language <span className="text-red-500">*</span></Label>
                <Input 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  placeholder="e.g. Spanish, German, French..."
                  className="pro-input bg-white h-12"
                />
              </div>
              
              <Button 
                onClick={handleTranslate} 
                isLoading={isTranslating} 
                disabled={!targetLanguage.trim()} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 shadow-sm font-medium"
              >
                {!isTranslating && <Wand2 className="w-4 h-4 mr-2" />}
                Translate Resume
              </Button>
              
              <p className="text-xs text-zinc-500 mt-2 text-center">
                This will automatically translate all text fields across your entire resume into the specified language.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
