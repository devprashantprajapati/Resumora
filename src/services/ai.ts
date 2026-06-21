import { ResumeData } from "../types/resume";

export interface JobMatchResult {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface InterviewQuestion {
  question: string;
  type: string;
  whyTheyAreAsking: string;
  suggestedAnswerStrategy: string;
}

export interface InterviewPrepResult {
  questions: InterviewQuestion[];
  generalTips: string[];
}

export interface JobOpportunity {
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  matchScore: number;
  salaryRange: string;
  jobType: string;
  topSkills: string[];
  matchReason: string;
}

async function rpcCall(method: string, ...args: any[]) {
  const res = await fetch('/api/ai/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, args })
  });
  if (!res.ok) {
    let errorMsg = 'Server error';
    try {
      const error = await res.json();
      errorMsg = error.error || errorMsg;
    } catch (e) {
       // fallback to default error message
    }
    throw new Error(errorMsg);
  }
  const data = await res.json();
  return data.result;
}

async function* rpcStream(method: string, ...args: any[]) {
  const res = await fetch('/api/ai/rpc-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, args })
  });
  
  if (!res.ok) {
    throw new Error('Server error');
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || ''; // Keep the incomplete part

    for (const part of parts) {
      if (part.startsWith('event: error\ndata: ')) {
        const jsonStr = part.replace('event: error\ndata: ', '');
        try {
          const parsed = JSON.parse(jsonStr);
          throw new Error(parsed.message || 'Stream error');
        } catch(e) {
          throw new Error(jsonStr);
        }
      } else if (part.startsWith('data: ')) {
        const jsonStr = part.replace('data: ', '');
        if (!jsonStr) continue;
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.chunk !== undefined) {
             yield parsed.chunk;
          }
        } catch(e) {
          // ignore invalid json during stream
        }
      }
    }
  }
}

export async function* generateSummaryStream(title: string, experience: string, skills: string, tone: string = "Professional"): AsyncGenerator<string, void, unknown> {
  yield* rpcStream('generateSummaryStream', title, experience, skills, tone);
}

export async function* enhanceDescriptionStream(description: string, role: string): AsyncGenerator<string, void, unknown> {
  yield* rpcStream('enhanceDescriptionStream', description, role);
}

export async function* fixGrammarStream(text: string): AsyncGenerator<string, void, unknown> {
  yield* rpcStream('fixGrammarStream', text);
}

export async function suggestSkills(title: string): Promise<string[]> {
  return rpcCall('suggestSkills', title);
}

export async function analyzeJobMatch(resumeContent: string, jobDescription: string): Promise<JobMatchResult> {
  return rpcCall('analyzeJobMatch', resumeContent, jobDescription);
}

export async function* generateCoverLetterStream(resumeContent: string, jobDescription: string, companyName: string): AsyncGenerator<string, void, unknown> {
  yield* rpcStream('generateCoverLetterStream', resumeContent, jobDescription, companyName);
}

export async function generateInterviewPrep(resumeContent: string, jobDescription: string, companyName: string): Promise<InterviewPrepResult> {
  return rpcCall('generateInterviewPrep', resumeContent, jobDescription, companyName);
}

export async function* generateInterviewPrepStream(resumeContent: string, jobDescription: string, companyName: string): AsyncGenerator<string, void, unknown> {
  yield* rpcStream('generateInterviewPrepStream', resumeContent, jobDescription, companyName);
}

export async function tailorResumeData(resumeContent: string, jobDescription: string): Promise<{ summary: string; experiences: { id: string; description: string }[] }> {
  return rpcCall('tailorResumeData', resumeContent, jobDescription);
}

export async function upgradeResumeATS(resumeData: ResumeData): Promise<ResumeData> {
  return rpcCall('upgradeResumeATS', resumeData);
}

export async function translateResumeData(resumeData: ResumeData, targetLanguage: string): Promise<ResumeData> {
  return rpcCall('translateResumeData', resumeData, targetLanguage);
}

export async function* searchJobsStream(resumeContent: string): AsyncGenerator<JobOpportunity, void, unknown> {
  yield* rpcStream('searchJobsStream', resumeContent);
}

export async function searchJobs(resumeContent: string): Promise<JobOpportunity[]> {
  return rpcCall('searchJobs', resumeContent);
}

export async function structureResumeData(rawText: string, pdfBase64?: string): Promise<Partial<ResumeData>> {
  return rpcCall('structureResumeData', rawText, pdfBase64);
}
