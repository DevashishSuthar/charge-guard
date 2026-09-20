export type RechargeType = "MOBILE" | "BROADBAND" | "OTHER";
export type DueStatus = "ok" | "soon" | "overdue";

export type RechargeItem = {
  id: string;
  label: string;
  provider: string;
  type: RechargeType;
  phone: string | null;
  amount: number;
  cycleDays: number;
  lastRecharge: string;
  leadDays: number;
  due: string;
  daysLeft: number;
  status: DueStatus;
};

export type FormState = {
  label: string;
  provider: string;
  type: RechargeType;
  phone: string;
  amount: string;
  cycleDays: number;
  lastRecharge: string; // yyyy-mm-dd
  leadDays: number;
};