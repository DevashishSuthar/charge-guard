import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

/**
 * The "Done" button on the dashboard card. Bumps lastRecharge to today,
 * which pushes the due date forward by cycleDays, and clears
 * lastNotifiedFor so the cron job knows to notify again for the new cycle.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.rechargeItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.rechargeItem.update({
    where: { id },
    data: { lastRecharge: new Date(), lastNotifiedFor: null },
  });

  return NextResponse.json(updated);
}
