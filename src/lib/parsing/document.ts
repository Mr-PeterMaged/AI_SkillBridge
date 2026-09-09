import "server-only";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_TEXT_LENGTH = 20000; // characters passed to the AI, keeps token cost bounded

export class DocumentParseError extends Error {}

/**
 * Parses an uploaded CV file (PDF or DOCX) into plain text, server-side only.
 * Callers should catch DocumentParseError and fall back to the "paste text"
 * flow rather than blocking the user.
 */
export async function parseDocumentToText(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new DocumentParseError(
      `File is too large (${Math.round(file.size / 1024 / 1024)}MB). Max size is 5MB.`
    );
  }

  const buffer = new Uint8Array(await file.arrayBuffer());

  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const pdf = await getDocumentProxy(buffer);
      const { text } = await extractText(pdf, { mergePages: true });
      return clampText(text);
    }

    if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      return clampText(result.value);
    }
  } catch (err) {
    throw new DocumentParseError(
      `We couldn't read this file. Please try pasting your CV text instead. (${
        err instanceof Error ? err.message : "unknown error"
      })`
    );
  }

  throw new DocumentParseError("Unsupported file type. Please upload a PDF or DOCX, or paste your CV text.");
}

function clampText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new DocumentParseError(
      "We couldn't extract any text from this file. It may be a scanned image — please paste your CV text instead."
    );
  }
  return trimmed.length > MAX_TEXT_LENGTH ? trimmed.slice(0, MAX_TEXT_LENGTH) : trimmed;
}

export function clampPastedText(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > MAX_TEXT_LENGTH ? trimmed.slice(0, MAX_TEXT_LENGTH) : trimmed;
}
