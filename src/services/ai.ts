import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummary(title: string, experience: string, skills: string): Promise<string> {
  try {
    const prompt = `You are an expert resume writer. Write a professional, ATS-friendly summary for a resume.
    
    Job Title: ${title}
    Experience Level: ${experience}
    Key Skills: ${skills}
    
    The summary should be 3-4 sentences long, highlighting key achievements, skills, and career goals. It should be impactful and use action verbs. Do not include any introductory text like "Here is a summary", just return the summary text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || "Failed to generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again.";
  }
}

export async function enhanceDescription(description: string, role: string): Promise<string> {
  try {
    const prompt = `You are an expert resume writer. Enhance the following job experience description to be more professional, impactful, and ATS-friendly.
    
    Role: ${role}
    Original Description:
    ${description}
    
    Instructions:
    - Use strong action verbs.
    - Quantify achievements where possible (even if you have to suggest placeholders like [X]%).
    - Keep it as a bulleted list using the bullet character (â¢).
    - Make it concise and impactful.
    - Do not include any introductory text, just return the enhanced bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text?.trim() || description;
  } catch (error) {
    console.error("Error enhancing description:", error);
    return description;
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
    return [];
  }
}
