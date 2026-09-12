"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Check, X,
  Smartphone, Wifi, Settings as SettingsIcon, LogOut,
} from "lucide-react";
import { enablePushNotifications } from "@/lib/pushClient";

type RechargeType = "MOBILE" | "BROADBAND" | "OTHER";
type DueStatus = "ok" | "soon" | "overdue";

type RechargeItem = {
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

type FormState = {
  label: string;
  provider: string;
  type: RechargeType;
  phone: string;
  amount: string;
  cycleDays: number;
  lastRecharge: string; // yyyy-mm-dd
  leadDays: number;
};

const emptyForm: FormState = {
  label: "",
  provider: "",
  type: "MOBILE",
  phone: "",
  amount: "",
  cycleDays: 28,
  lastRecharge: new Date().toISOString().slice(0, 10),
  leadDays: 3,
};

const statusStyles: Record<DueStatus, { text: string; bg: string; label: string }> = {
  ok: { text: "text-teal", bg: "bg-teal-soft", label: "Upcoming" },
  soon: { text: "text-amber", bg: "bg-amber-soft", label: "Due soon" },
  overdue: { text: "text-rose", bg: "bg-rose-soft", label: "Overdue" },
};

export function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<RechargeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushDeviceCount, setPushDeviceCount] = useState(0);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pushMessage, setPushMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [rechargesRes, meRes] = await Promise.all([
      fetch("/api/recharges"),
      fetch("/api/me"),
    ]);
    if (rechargesRes.ok) setItems(await rechargesRes.json());
    if (meRes.ok) {
      const me = await meRes.json();
      setPushDeviceCount(me.pushDeviceCount);
      setTelegramConnected(Boolean(me.telegramChatId));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount, not an external subscription
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: RechargeItem) {
    setEditingId(item.id);
    setForm({
      label: item.label,
      provider: item.provider,
      type: item.type,
      phone: item.phone ?? "",
      amount: String(item.amount),
      cycleDays: item.cycleDays,
      lastRecharge: item.lastRecharge.slice(0, 10),
      leadDays: item.leadDays,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        label: form.label,
        provider: form.provider,
        type: form.type,
        phone: form.phone || undefined,
        amount: Number(form.amount),
        cycleDays: form.cycleDays,
        lastRecharge: form.lastRecharge,
        leadDays: form.leadDays,
      };

      const res = await fetch(
        editingId ? `/api/recharges/${editingId}` : "/api/recharges",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setModalOpen(false);
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkDone(id: string) {
    await fetch(`/api/recharges/${id}/recharge`, { method: "POST" });
    await load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/recharges/${id}`, { method: "DELETE" });
    await load();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  async function handleEnablePush() {
    const result = await enablePushNotifications();
    setPushMessage(result.ok ? "Push notifications enabled." : result.error ?? "Something went wrong");
    if (result.ok) await load();
  }

  const overdueCount = items.filter((i) => i.status === "overdue").length;
  const soonCount = items.filter((i) => i.status === "soon").length;
  const noChannel = pushDeviceCount === 0 && !telegramConnected;

  return (
    <div className="min-h-screen bg-paper">
      {/* <TopNav active="dashboard" onNav={onNav} /> */}
      <header className="border-b border-line sticky top-0 bg-paper z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span className="font-display text-lg font-semibold text-ink">Charge Guard</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/settings"
              className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft px-3 py-1.5 rounded-md hover:bg-paper-dim"
            >
              <SettingsIcon size={14} /> Settings
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft px-3 py-1.5 rounded-md hover:bg-paper-dim"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {noChannel && !loading && (
          <div className="mb-5 flex items-center justify-between gap-3 bg-amber-soft text-amber text-sm rounded-lg px-4 py-3">
            <span>You won&apos;t get reminded until you enable a notification channel.</span>
            <button
              onClick={handleEnablePush}
              className="font-semibold underline shrink-0"
            >
              Enable push
            </button>
          </div>
        )}
        {pushMessage && (
          <p className="mb-5 text-sm text-ink-soft">{pushMessage}</p>
        )}

        <div className="flex items-end justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Your recharges</h1>
            <p className="text-sm text-ink-soft mt-1">
              {overdueCount > 0
                ? `${overdueCount} overdue, ${soonCount} due soon`
                : soonCount > 0
                ? `${soonCount} due soon — everything else is on track`
                : "Everything's on track"}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-brand hover:bg-brand-light transition-colors text-white text-sm font-semibold rounded-lg px-4 py-2.5"
          >
            <Plus size={15} /> Add recharge
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-line rounded-xl p-10 text-center text-ink-soft text-sm">
            No recharges yet. Add your first one to get reminders before it&apos;s due.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <RechargeCard
                key={item.id}
                item={item}
                onDone={() => handleMarkDone(item.id)}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <EditModal
          form={form}
          setForm={setForm}
          isEditing={Boolean(editingId)}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function RechargeCard({
  item,
  onDone,
  onEdit,
  onDelete,
}: {
  item: RechargeItem;
  onDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const s = statusStyles[item.status];
  const due = new Date(item.due);
  const dueLabel = due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const TypeIcon = item.type === "BROADBAND" ? Wifi : Smartphone;

  return (
    <div className="relative bg-white border border-line rounded-xl flex overflow-visible shadow-sm">
      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-paper-dim flex items-center justify-center shrink-0">
              <TypeIcon size={15} className="text-ink-soft" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-semibold text-[15px] text-ink">{item.label}</div>
              <div className="text-xs text-ink-soft mt-0.5">
                {item.provider}
                {item.phone ? ` · ${item.phone}` : ""}
              </div>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} aria-label="Edit" className="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-paper-dim">
              <Pencil size={13} className="text-ink-soft" />
            </button>
            <button onClick={onDelete} aria-label="Delete" className="w-[26px] h-[26px] flex items-center justify-center rounded hover:bg-paper-dim">
              <Trash2 size={13} className="text-ink-soft" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-line flex items-end justify-between">
          <div>
            <div className="text-[10px] text-ink-soft mb-0.5">Amount</div>
            <div className="font-mono font-semibold text-ink">₹{item.amount}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-ink-soft mb-0.5">Due</div>
            <div className="font-mono font-semibold text-sm text-ink">{dueLabel}</div>
          </div>
        </div>
      </div>

      <div
        className={`w-24 shrink-0 border-l border-dashed border-line flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-r-xl ${s.bg}`}
      >
        <div className={`font-mono text-xl font-semibold leading-none ${s.text}`}>
          {item.status === "overdue" ? `+${Math.abs(item.daysLeft)}` : item.daysLeft}
        </div>
        <div className={`text-[10px] font-semibold text-center leading-tight ${s.text}`}>
          {item.status === "overdue" ? "days late" : "days left"}
        </div>
        <button
          onClick={onDone}
          className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-white bg-brand hover:bg-brand-light transition-colors rounded px-2 py-1"
        >
          <Check size={11} /> Done
        </button>
      </div>
    </div>
  );
}

function EditModal({
  form,
  setForm,
  isEditing,
  saving,
  onSave,
  onClose,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  isEditing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-5 z-50">
      <div className="w-full max-w-md max-h-[88vh] overflow-y-auto bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            {isEditing ? "Edit recharge" : "Add a recharge"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center rounded hover:bg-paper-dim">
            <X size={17} className="text-ink-soft" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Who's this for">
            <input
              className="input"
              placeholder="e.g. Papa, Wife, Home"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Type" className="flex-1">
              <select
                className="input"
                value={form.type}
                onChange={(e) => set("type", e.target.value as RechargeType)}
              >
                <option value="MOBILE">Mobile</option>
                <option value="BROADBAND">Broadband / Fiber</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Provider" className="flex-1">
              <input
                className="input"
                placeholder="Jio, Airtel, Vi…"
                value={form.provider}
                onChange={(e) => set("provider", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Number (optional)">
            <input
              className="input"
              placeholder="98290 xxxxx"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Amount (₹)" className="flex-1">
              <input
                type="number"
                className="input"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </Field>
            <Field label="Cycle" className="flex-1">
              <select
                className="input"
                value={form.cycleDays}
                onChange={(e) => set("cycleDays", Number(e.target.value))}
              >
                <option value={28}>28 days</option>
                <option value={30}>30 days</option>
                <option value={84}>84 days</option>
                <option value={365}>Yearly</option>
              </select>
            </Field>
          </div>

          <div className="flex gap-3">
            <Field label="Last recharged on" className="flex-1">
              <input
                type="date"
                className="input"
                value={form.lastRecharge}
                onChange={(e) => set("lastRecharge", e.target.value)}
              />
            </Field>
            <Field label="Remind (days before)" className="flex-1">
              <input
                type="number"
                className="input"
                value={form.leadDays}
                onChange={(e) => set("leadDays", Number(e.target.value))}
              />
            </Field>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="w-full mt-5 bg-brand hover:bg-brand-light transition-colors text-white font-semibold text-sm rounded-lg py-2.5 disabled:opacity-60"
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Add recharge"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-ink mb-1.5">{label}</label>
      {children}
    </div>
  );
}