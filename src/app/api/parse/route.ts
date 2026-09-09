import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { parseDocumentToText, DocumentParseError } from "@/lib/parsing/document";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const text = await parseDocumentToText(file);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof DocumentParseError) {
      return NextResponse.json({ error: err.message, recoverable: true }, { status: 422 });
    }
    console.error("Unexpected parse error", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Something went wrong reading this file." }, { status: 500 });
  }
}
