import { DueStatus } from "./types";

export function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Midnight-normalized day difference, so "3 days left" doesn't wobble with time-of-day. */
function daysBetween(a: Date, b: Date) {
  const norm = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  };
  return Math.round((norm(b) - norm(a)) / 86_400_000);
}

export function computeDue(item: {
  lastRecharge: Date;
  cycleDays: number;
  leadDays: number;
}) {
  const due = addDays(item.lastRecharge, item.cycleDays);
  const daysLeft = daysBetween(new Date(), due);

  let status: DueStatus = "ok";
  if (daysLeft < 0) status = "overdue";
  else if (daysLeft <= item.leadDays) status = "soon";

  return { due, daysLeft, status };
}

export function rupeesToPaise(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number with at most two decimal places");
  }

  const match = String(amount).match(/^(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new Error("Amount must have at most two decimal places");
  }

  const wholeRupees = Number(match[1]);
  const paise = Number((match[2] ?? "").padEnd(2, "0"));
  const amountInPaise = wholeRupees * 100 + paise;
  if (!Number.isSafeInteger(amountInPaise)) {
    throw new Error("Amount is too large");
  }

  return amountInPaise;
}

export function paiseToRupees(amount: number): number {
  return amount / 100;
}

export function formatRupees(amountInPaise: number): string {
  return paiseToRupees(amountInPaise).toFixed(2).replace(/\.00$/, "");
}

export function formatRupeeAmount(amount: number): string {
  return amount.toFixed(2).replace(/\.00$/, "");
}