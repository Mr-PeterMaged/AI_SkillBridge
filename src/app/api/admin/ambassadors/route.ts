import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { requirePermission, apiAuthError } from "@/lib/auth/admin";
import { prisma } from "@/lib/db/prisma";
import { ambassadorInputSchema } from "@/lib/validation/admin";
import { writeAdminAudit } from "@/lib/admin/audit";
import { discountDescription, referralLink, shareText } from "@/lib/admin/promo-utils";

export async function GET(req: Request) {
  try {
    await requirePermission("ambassador.read");
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const status = url.searchParams.get("status");
    const where: Prisma.AmbassadorWhereInput = {};
    if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { publicHandle: { contains: q, mode: "insensitive" } }];
    if (status && ["ACTIVE", "PAUSED", "ARCHIVED"].includes(status)) where.status = status as "ACTIVE" | "PAUSED" | "ARCHIVED";
    const ambassadors = await prisma.ambassador.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { campaign: true, promoCodes: true, redemptions: true, attributions: true },
    });
    const origin = req.headers.get("origin") ?? undefined;
    return Response.json({
      ambassadors: ambassadors.map((ambassador) => {
        const firstCode = ambassador.promoCodes[0];
        const link = referralLink(ambassador.referralKey, origin);
        return {
          ...ambassador,
          referralUrl: link,
          shareText: firstCode
            ? shareText({
                code: firstCode.code,
                discount: discountDescription(firstCode),
                referralLink: link,
              })
            : null,
        };
      }),
    });
  } catch (error) {
    return apiAuthError(error);
  }
}

export async function POST(req: Request) {
  try {
    const member = await requirePermission("ambassador.create");
    const body = await req.json().catch(() => null);
    const parsed = ambassadorInputSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    const ambassador = await prisma.ambassador.create({
      data: {
        ...parsed.data,
        referralKey: parsed.data.referralKey ?? randomKey(),
      },
    });
    await writeAdminAudit({
      actorMemberId: member.id,
      action: "AMBASSADOR_CREATED",
      entityType: "Ambassador",
      entityId: ambassador.id,
      after: ambassador,
    });
    return Response.json({ ambassador }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "That ambassador handle or referral key already exists." }, { status: 409 });
    }
    return apiAuthError(error);
  }
}

function randomKey() {
  return `AMB_${randomBytes(5).toString("hex").toUpperCase()}`;
}
