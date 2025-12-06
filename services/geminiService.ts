import { GoogleGenAI } from "@google/genai";
import { Client, ServiceOption } from "../types";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists, otherwise we'll handle errors gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateColdCallScript = async (client: Client, services: ServiceOption[]): Promise<string> => {
  if (!ai) return "Error: API Key is missing. Please check your environment configuration.";

  const clientServices = services.filter(s => client.interestedServices.includes(s.id));
  const serviceNames = clientServices.map(s => s.name).join(", ");

  const prompt = `
    Act as a world-class sales expert. Write a persuasive, concise cold call script for a potential client found on Google Maps.
    
    Client Details:
    - Name: ${client.name}
    - Company: ${client.company}
    - Industry: ${client.industry}
    - Website: ${client.website || 'No website found'}
    
    My Audit / Observations (What needs to be done):
    "${client.projectNotes}"
    
    Services Pitching: ${serviceNames || "SEO & Digital Marketing"}
    
    The script should:
    1. Reference the specific issues found on their website/online presence (from the audit notes).
    2. Be professional but friendly.
    3. Offer a clear value proposition.
    4. Keep it under 200 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate script. Please try again.";
  }
};

export const analyzeInteractionNotes = async (notes: string): Promise<string> => {
  if (!ai) return "Error: API Key is missing.";

  const prompt = `
    Analyze the following sales call notes and provide 3 bullet points on the next best actions to take to close the deal:
    "${notes}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to analyze notes.";
  }
};

export const generateEmailDraft = async (client: Client, tone: 'professional' | 'casual' | 'urgent'): Promise<string> => {
    if (!ai) return "Error: API Key is missing.";

    const prompt = `
      Draft a ${tone} cold outreach or follow-up email to ${client.name} from ${client.company}.
      
      Context:
      - We found them on Google Maps.
      - Website: ${client.website}
      - Specific Problem Identified: ${client.projectNotes}
      
      Goal: Book a meeting to discuss how we can fix these issues.
      Include a catchy subject line.
    `;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text || "No email generated.";
      } catch (error) {
        console.error("Gemini API Error:", error);
        return "Failed to generate email.";
      }
}

export const parseLeadData = async (text: string): Promise<Partial<Client>> => {
  if (!ai) return {};

  const prompt = `
    Analyze the unstructured text provided below and extract potential client details into a valid JSON object.
    
    Text to analyze:
    "${text}"
    
    Output JSON keys:
    - name: (The contact person's name. If missing, use "Unknown")
    - company: (The business name. If missing, use "Unknown Company")
    - industry: (Infer the industry from the context or use "General")
    - email: (Extract email if present, else empty string)
    - phone: (Extract phone number if present, else empty string)
    - website: (Extract URL if present, else empty string)
    - projectNotes: (Summarize what they need, any website issues mentioned, or context of the lead)
    
    Return ONLY the raw JSON object. Do not use Markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const responseText = response.text || "{}";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return {};
  }
};