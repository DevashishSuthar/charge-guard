import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      telegramChatId: true,
      defaultLeadDays: true,
      _count: { select: { pushSubscriptions: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    telegramChatId: user.telegramChatId,
    defaultLeadDays: user.defaultLeadDays,
    pushDeviceCount: user._count.pushSubscriptions,
  });
}

const patchSchema = z.object({
  telegramChatId: z.string().nullable().optional(),
  defaultLeadDays: z.number().int().min(0).max(30).optional(),
});

export async function PATCH(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: parsed.data,
  });

  return NextResponse.json({
    telegramChatId: user.telegramChatId,
    defaultLeadDays: user.defaultLeadDays,
  });
}
