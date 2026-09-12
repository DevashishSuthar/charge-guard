import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  label: z.string().min(1).max(60).optional(),
  provider: z.string().min(1).max(40).optional(),
  type: z.enum(["MOBILE", "BROADBAND", "OTHER"]).optional(),
  phone: z.string().max(20).nullable().optional(),
  amount: z.number().int().positive().optional(),
  cycleDays: z.number().int().positive().optional(),
  lastRecharge: z.coerce.date().optional(),
  leadDays: z.number().int().min(0).max(30).optional(),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.rechargeItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const updated = await prisma.rechargeItem.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.rechargeItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.rechargeItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
