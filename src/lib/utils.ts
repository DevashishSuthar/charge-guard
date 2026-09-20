import { DueStatus } from "./types";

export function daysFromNow(n:number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

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
