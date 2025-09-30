import { GoogleGenAI } from "@google/genai";
import { checkEnvExistence } from "./helpers";

const ai = new GoogleGenAI({
  apiKey: checkEnvExistence("GEMINI_AI"),
});

export const generateDescription = async (
  category: string,
  post: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a short description of the following ${category} in 20 words:${post}`,
  });
  if (!response.text) throw new Error("AI did not return any text");

  return response.text;
};

export const generatePost = async (
  category: string,
  post: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate and rewrite a full detailed description of the following ${category} information. 
    Requirements:
    - Beautify with emojis and bullet
    - Minimum word count should be 400
    - Use proper HTML tags
    - Ensure adequate spacing between sections (add <br> tags or margin styles where needed)
    - Maintain good readability with proper paragraph spacing
    - EXCLUDE: <!DOCTYPE html>, <head>, <body>, <title> tags
    - DO NOT wrap the content in html code blocks
    - DO NOT start with a main heading e.g A medical Officer Needed for immediate employment
    - DO NOT add any key improvements or explanations
    - Add spacing between list items and sections for better visual separation
    Content to rewrite: ${post}`,
  });
  let result = response.text;
  if (!result) throw new Error("AI did not return any text");
  result = result.replace(/^```html|```$/g, "").trim();
  return result;
};

export const generateJobPosition = async (post: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate the job position for the job advertisement (e.g., "General Manager"). Follow these rules STRICTLY:
    1. Remove ALL newline characters from the output.
    2. If no position is explicitly stated, analyze the content and suggest ONLY ONE appropriate position.
    3. If multiple positions are mentioned, suggest ONLY ONE general/umbrella position that covers them.
    4. Return ONLY the position name - no additional text, explanations or formatting.
    Job advertisement content: ${post}`,
  });

  if (!response.text) throw new Error("AI did not return any text");
  const cleanedPosition = response.text.replace(/\n/g, "").trim();
  return cleanedPosition;
};

export const generateScholarshipLink = async (
  post: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Copy only the scholarship link/email in this post. 
    Requirement:
    - If there is no link but there are several email address. COPY only one
    - If there are several website link. COPY the major one
     content:${post}`,
  });
  if (!response.text) throw new Error("AI did not return any text");
  return response.text;
};

export const generateScholarshipHeading = async (
  post: string
): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a single scholarship name. Do not bold any text. If theres a line break, do not use /n:${post}`,
  });
  if (!response.text) throw new Error("AI did not return any text");
  return response.text;
};
