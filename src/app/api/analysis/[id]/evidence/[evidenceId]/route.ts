import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedEvidenceItem } from "@/lib/db/evidence";
import { updateEvidenceSchema } from "@/lib/validation/evidence";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; evidenceId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, evidenceId } = await ctx.params;
  const { analysis, evidence } = await getOwnedEvidenceItem(id, evidenceId);
  if (!analysis || !evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = updateEvidenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.evidenceItem.update({
    where: { id: evidenceId },
    data: parsed.data,
  });

  return NextResponse.json({ evidence: updated });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string; evidenceId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, evidenceId } = await ctx.params;
  const { analysis, evidence } = await getOwnedEvidenceItem(id, evidenceId);
  if (!analysis || !evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.evidenceItem.delete({ where: { id: evidenceId } });
  return NextResponse.json({ ok: true });
}
