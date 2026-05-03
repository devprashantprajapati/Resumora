import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function parseJsonResponse(text?: string): any {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return JSON.parse(cleaned.trim());
}

async function run() {
  const rawText = "John Doe\nSoftware Engineer\nExperience:\n- Google : 2020 to 2024\nSkills: React, Node";
  
  const prompt = `You are an expert resume parser. Extract the information from the following raw resume text (which might be a LinkedIn PDF export or a standard resume) and structure it into a JSON object.
    
    Raw Resume Text:
    ${rawText}
    
    Extract all possible fields including personal info, experience, education, skills, projects, certifications, languages, interests, and references. Ensure dates are in YYYY-MM format if possible.`;

  try {
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
              }
            },
            experience: {
              type: Type.ARRAY,
              items: { type: Type.OBJECT, properties: { company: { type: Type.STRING } } }
            }
          }
        }
      }
    });
    
    console.log("Raw Text:", response.text);
    console.log("Parsed:", parseJsonResponse(response.text));
  } catch (err) {
    console.error(err);
  }
}
run();
