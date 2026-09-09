import "server-only";
import { GoogleGenAI } from "@google/genai";

// ---------------------------------------------------------------
// Server-only Gemini client. GEMINI_API_KEY must never reach the
// browser — the `server-only` import above breaks the build if
// this file is ever imported from client code.
// ---------------------------------------------------------------

const SAFETY_PREAMBLE = `You are an educational career-planning assistant for SkillBridge AI.
Rules you must always follow:
- You do not make hiring decisions and your output is never a judgment of a person's worth or employability.
- You do not infer or reason about sensitive attributes (age, gender, nationality, religion, disability, marital status, etc.).
- You never invent, exaggerate, or suggest fabricating experience, certificates, skills, or projects the person has not demonstrated.
- You only extract or reason about skills that are actually supported by the text you are given.
- If you are uncertain whether a skill is present, mark it with lower confidence instead of guessing.
- Keep language concise, constructive, and specific to the evidence provided.
- Respond with valid JSON only, matching the schema you are given. No prose, no markdown fences.`;

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key from https://aistudio.google.com/apikey"
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * Calls Gemini with a strict JSON response schema and low temperature.
 * Callers are responsible for validating the returned JSON with Zod —
 * this function only guarantees syntactically valid JSON was returned.
 */
export async function generateStructuredJSON(params: {
  prompt: string;
  responseSchema: Record<string, unknown>;
  temperature?: number;
}): Promise<unknown> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { role: "user", parts: [{ text: `${SAFETY_PREAMBLE}\n\n${params.prompt}` }] },
    ],
    config: {
      temperature: params.temperature ?? 0.2,
      responseMimeType: "application/json",
      responseSchema: params.responseSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned a response that was not valid JSON.");
  }
}
