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

export async function generateInterviewPrep(resumeContent: string, jobDescription: string, companyName: string): Promise<InterviewPrepResult> {
  try {
    const prompt = `You are an expert technical recruiter and executive career coach. 
    Based on the candidate's resume and the target job description, generate a highly tailored interview preparation guide.
    
    Resume Content:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Company Name: ${companyName}
    
    Provide:
    1. 5 highly probable interview questions (mix of behavioral, technical, and experience-based) specific to this role and company.
    2. For each question, explain WHY the interviewer is asking it.
    3. For each question, provide a specific strategy on HOW the candidate should answer it, explicitly referencing their actual past experiences and skills from the provided resume.
    4. 3 general interview tips tailored to this specific company and role.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The interview question" },
                  type: { type: Type.STRING, description: "Type of question (e.g., Behavioral, Technical, Leadership)" },
                  whyTheyAreAsking: { type: Type.STRING, description: "The underlying motivation for this question" },
                  suggestedAnswerStrategy: { type: Type.STRING, description: "How to answer, referencing specific resume details" }
                },
                required: ["question", "type", "whyTheyAreAsking", "suggestedAnswerStrategy"]
              }
            },
            generalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "General interview tips for this role/company"
            }
          },
          required: ["questions", "generalTips"]
        }
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as InterviewPrepResult;
  } catch (error) {
    console.error("Error generating interview prep:", error);
    throw error;
  }
}

export async function* generateInterviewPrepStream(resumeContent: string, jobDescription: string, companyName: string): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert technical recruiter and executive career coach. 
    Based on the candidate's resume and the target job description, generate a highly tailored interview preparation guide.
    
    Resume Content:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Company Name: ${companyName}
    
    Provide:
    1. 5 highly probable interview questions (mix of behavioral, technical, and experience-based) specific to this role and company.
    2. For each question, explain WHY the interviewer is asking it.
    3. For each question, provide a specific strategy on HOW the candidate should answer it, explicitly referencing their actual past experiences and skills from the provided resume.
    4. 3 general interview tips tailored to this specific company and role.`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The interview question" },
                  type: { type: Type.STRING, description: "Type of question (e.g., Behavioral, Technical, Leadership)" },
                  whyTheyAreAsking: { type: Type.STRING, description: "The underlying motivation for this question" },
                  suggestedAnswerStrategy: { type: Type.STRING, description: "How to answer, referencing specific resume details" }
                },
                required: ["question", "type", "whyTheyAreAsking", "suggestedAnswerStrategy"]
              }
            },
            generalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "General interview tips for this role/company"
            }
          },
          required: ["questions", "generalTips"]
        }
      }
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error generating interview prep stream:", error);
    throw error;
  }
}

export async function structureResumeData(rawText: string): Promise<Partial<ResumeData>> {
  try {
    const prompt = `You are an expert resume parser. Extract the information from the following raw resume text (which might be a LinkedIn PDF export or a standard resume) and structure it into a JSON object.
    
    Raw Resume Text:
    ${rawText}
    
    Extract all possible fields including personal info, experience, education, skills, projects, certifications, languages, interests, and references. Ensure dates are in YYYY-MM format if possible.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                firstName: { type: Type.STRING },
                lastName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                address: { type: Type.STRING },
                city: { type: Type.STRING },
                country: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      url: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  school: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  description: { type: Type.STRING }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  level: { type: Type.STRING }
                }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  url: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING }
                }
              }
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  proficiency: { type: Type.STRING }
                }
              }
            },
            interests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING }
                }
              }
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  position: { type: Type.STRING },
                  company: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING }
                }
              }
            }
          }
        }
      },
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error structuring resume data:", error);
    throw error;
  }
}
