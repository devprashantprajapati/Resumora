import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types/resume";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function* generateSummaryStream(title: string, experience: string, skills: string): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert resume writer. Write a professional, ATS-friendly summary for a resume.
    
    Job Title: ${title}
    Experience Level: ${experience}
    Key Skills: ${skills}
    
    The summary should be 3-4 sentences long, highlighting key achievements, skills, and career goals. It should be impactful and use action verbs. Do not include any introductory text like "Here is a summary", just return the summary text.`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating summary stream:", error);
    throw error;
  }
}

export async function* enhanceDescriptionStream(description: string, role: string): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert resume writer. Enhance the following job experience description to be more professional, impactful, and ATS-friendly.
    
    Role: ${role}
    Original Description:
    ${description}
    
    Instructions:
    - Use strong action verbs.
    - Quantify achievements where possible (even if you have to suggest placeholders like [X]%).
    - Keep it as a bulleted list using the bullet character (•).
    - Make it concise and impactful.
    - Do not include any introductory text, just return the enhanced bullet points.`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error enhancing description stream:", error);
    throw error;
  }
}

export async function suggestSkills(title: string): Promise<string[]> {
  try {
    const prompt = `You are an expert technical recruiter. Suggest a list of 10 highly relevant and in-demand skills for a "${title}".
    
    Return ONLY a comma-separated list of skills. No introductory text, no bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    return text.split(',').map(s => s.trim()).filter(Boolean);
  } catch (error) {
    console.error("Error suggesting skills:", error);
    throw error;
  }
}

export interface JobMatchResult {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export async function analyzeJobMatch(resumeContent: string, jobDescription: string): Promise<JobMatchResult> {
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) and technical recruiter. 
    Analyze the provided resume against the job description.
    
    Resume Content:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Provide a detailed analysis including:
    1. A match score from 0 to 100.
    2. A list of matching keywords found in both.
    3. A list of important missing keywords present in the job description but missing from the resume.
    4. 3-4 actionable recommendations to improve the resume for this specific job.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Match score from 0 to 100" },
            matchingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords found in both" },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords missing from resume" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations" },
          },
          required: ["score", "matchingKeywords", "missingKeywords", "recommendations"],
        },
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as JobMatchResult;
  } catch (error) {
    console.error("Error analyzing job match:", error);
    throw error;
  }
}

export async function* generateCoverLetterStream(resumeContent: string, jobDescription: string, companyName: string): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert career coach and executive copywriter. Write a highly tailored, professional, and compelling cover letter.
    
    Resume Content:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Company Name: ${companyName}
    
    Instructions:
    - Write a modern, impactful cover letter (3-4 paragraphs).
    - Do not use generic templates. Tailor it specifically to the company and job description using the candidate's actual experience from the resume.
    - Highlight the most relevant achievements that match the job requirements.
    - Maintain a confident, professional, yet enthusiastic tone.
    - Do not include placeholder addresses at the top (like [Your Name] [Your Address]). Start directly with the salutation (e.g., "Dear Hiring Manager," or "Dear [Company] Team,").
    - End with a professional sign-off.
    - Return ONLY the cover letter text.`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating cover letter stream:", error);
    throw error;
  }
}

export async function structureResumeData(rawText: string): Promise<Partial<ResumeData>> {
  try {
    const prompt = `You are an expert resume parser. Extract the information from the following raw resume text and structure it into a JSON object that matches the ResumeData type.
    
    Raw Resume Text:
    ${rawText}
    
    Return ONLY the JSON object. Do not include any other text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error structuring resume data:", error);
    throw error;
  }
}
