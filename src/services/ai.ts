import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types/resume";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function* generateSummaryStream(title: string, experience: string, skills: string, tone: string = "Professional"): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert resume writer. Write a ${tone.toLowerCase()}, ATS-friendly summary for a resume.
    
    Job Title: ${title}
    Experience Level: ${experience}
    Key Skills: ${skills}
    Tone: ${tone}
    
    The summary should be 3-4 sentences long in a ${tone.toLowerCase()} tone, highlighting key achievements, skills, and career goals. It should be impactful and use action verbs. Do not include any introductory text like "Here is a summary", just return the summary text.`;

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

export async function* fixGrammarStream(text: string): AsyncGenerator<string, void, unknown> {
  try {
    const prompt = `You are an expert copyeditor. Fix any spelling, punctuation, and grammatical errors in the following text. Do not change the underlying meaning, tone, or formatting (keep any bullet points or line breaks exactly as they are). If the text is already perfect, just return the exact same text.

    Text:
    ${text}
    
    Return ONLY the corrected text.`;

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
    console.error("Error fixing grammar stream:", error);
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

export async function tailorResumeData(resumeContent: string, jobDescription: string): Promise<{ summary: string; experiences: { id: string; description: string }[] }> {
  try {
    const prompt = `You are an expert resume writer and career coach. 
    Review the provided Resume Content against the Job Description.
    Your goal is to rewrite the candidate's Professional Summary and Experience descriptions to better align with the job requirements, highlighting relevant skills and keywords.
    Keep the same factual achievements, but emphasize the aspects most relevant to the job.
    IMPORTANT: You must return the EXACT SAME experience IDs so they can be matched.
    
    Resume Content:
    ${resumeContent}
    
    Job Description:
    ${jobDescription}
    
    Return a JSON object with:
    1. "summary": A tailored professional summary (3-4 sentences).
    2. "experiences": An array of objects, each containing the "id" (from the original experience) and the "description" (the tailored bullet points, using •).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Tailored professional summary" },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Tailored bullet points for this experience" }
                },
                required: ["id", "description"]
              }
            }
          },
          required: ["summary", "experiences"]
        }
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error tailoring resume data:", error);
    throw error;
  }
}

export async function translateResumeData(resumeData: ResumeData, targetLanguage: string): Promise<ResumeData> {
  try {
    const prompt = `You are an expert professional translator and resume writer. 
    Translate the following Resume JSON data into ${targetLanguage}.
    
    IMPORTANT INSTRUCTIONS:
    - Return ONLY the exact SAME JSON structure, just translated.
    - DO NOT change IDs or structural attributes.
    - Translate all user-facing content (names of skills, descriptions, summaries, positions, degrees, etc.).
    - Ensure the tone remains professional and culturally appropriate for business in that language.
    - If a proper noun (like a company name "Google" or technology "React") shouldn't be translated, keep it as is.
    
    Resume JSON:
    ${JSON.stringify(resumeData)}
    
    Return the translated JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as ResumeData;
  } catch (error) {
    console.error("Error translating resume data:", error);
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
