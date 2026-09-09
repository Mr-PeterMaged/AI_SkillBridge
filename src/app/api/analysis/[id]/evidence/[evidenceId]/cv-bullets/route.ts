import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getOwnedEvidenceItem } from "@/lib/db/evidence";
import { generateResumeBulletsSchema } from "@/lib/validation/resume-bullet";
import { generateStructuredJSON } from "@/lib/ai/gemini";
import { buildResumeBulletPrompt, RESUME_BULLET_RESPONSE_SCHEMA } from "@/lib/ai/prompts";
import { resumeBulletResultSchema } from "@/lib/ai/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string; evidenceId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`cv-bullets:${userId}`, 12, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many CV bullet generations. Please try again later." }, { status: 429 });
  }

  const { id, evidenceId } = await ctx.params;
  const { evidence } = await getOwnedEvidenceItem(id, evidenceId);
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = generateResumeBulletsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  let bullets: string[];
  try {
    const raw = await generateStructuredJSON({
      prompt: buildResumeBulletPrompt(parsed.data),
      responseSchema: RESUME_BULLET_RESPONSE_SCHEMA,
      temperature: 0.35,
    });
    bullets = resumeBulletResultSchema.parse(raw).bullets;
  } catch {
    bullets = buildFallbackBullets(parsed.data);
  }

  await prisma.resumeBullet.deleteMany({ where: { evidenceItemId: evidence.id } });
  const created = await prisma.$transaction(
    bullets.map((content) =>
      prisma.resumeBullet.create({
        data: { evidenceItemId: evidence.id, content },
      })
    )
  );

  return NextResponse.json({
    bullets: created,
    disclaimer: "Review this text and include only work you genuinely completed.",
  });
}

function buildFallbackBullets(input: {
  built: string;
  technologies: string;
  contribution: string;
  outcome: string;
  metric?: string | null;
}) {
  const metric = input.metric?.trim();
  return [
    `Built ${input.built} using ${input.technologies}; contributed ${input.contribution} and documented the outcome: ${input.outcome}.`,
    `${input.contribution} on ${input.built}, applying ${input.technologies} to produce a portfolio-ready project${metric ? ` with ${metric}` : ""}.`,
  ].map((bullet) => bullet.slice(0, 320));
}
