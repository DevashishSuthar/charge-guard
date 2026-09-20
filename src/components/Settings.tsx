"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Send, LogOut } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { enablePushNotifications } from "@/lib/pushClient";

type Me = {
  email: string;
  telegramChatId: string | null;
  defaultLeadDays: number;
  pushDeviceCount: number;
};

export function Settings() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [telegramInput, setTelegramInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data: Me) => {
        setMe(data);
        setTelegramInput(data.telegramChatId ?? "");
      });
  }, []);

  async function saveTelegram() {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegramChatId: telegramInput || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMe((prev) => (prev ? { ...prev, ...updated } : prev));
      setMessage("Telegram chat connected.");
    }
  }

  async function saveLeadDays(days: number) {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLeadDays: days }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMe((prev) => (prev ? { ...prev, ...updated } : prev));
    }
  }

  async function handleEnablePush() {
    const result = await enablePushNotifications();
    setMessage(result.ok ? "Push notifications enabled on this device." : result.error ?? "Something went wrong");
    if (result.ok) {
      const r = await fetch("/api/me");
      setMe(await r.json());
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!me) return <div className="min-h-screen bg-paper" />;

  return (
    <div className="min-h-screen bg-paper">
      <TopNav />

      <main className="max-w-160 mx-auto px-6 pt-9 pb-20">
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          Settings
        </h1>

        {message && <p className="text-sm text-teal mb-4">{message}</p>}

        <Section title="Account">
          <Row label="Email" value={me.email} />
        </Section>

        <Section title="Notification channels">
          <Row
            icon={<Bell size={13} />}
            label="Browser push"
            value={me.pushDeviceCount > 0 ? `${me.pushDeviceCount} device(s) enabled` : "Not enabled"}
            action={me.pushDeviceCount === 0 ? { label: "Enable", onClick: handleEnablePush } : undefined}
          />
          <div className="p-4 border-t border-line">
            <div className="flex items-center gap-1.5 text-sm text-ink-soft mb-2">
              <Send size={13} /> Telegram chat ID
            </div>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="e.g. 5839201744"
                value={telegramInput}
                onChange={(e) => setTelegramInput(e.target.value)}
              />
              <button
                onClick={saveTelegram}
                className="shrink-0 bg-brand hover:bg-brand-light transition-colors text-white text-xs font-semibold rounded-md px-3"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-ink-soft mt-2">
              Message <b>@ChargeGuardBot</b> on Telegram, send <code>/start</code>, and paste the chat ID it replies with.
            </p>
          </div>
        </Section>

        <Section title="Reminders">
          <div className="p-4">
            <div className="text-sm text-ink-soft mb-2">Default lead time</div>
            <select
              className="input"
              value={me.defaultLeadDays}
              onChange={(e) => saveLeadDays(Number(e.target.value))}
            >
              {[1, 2, 3, 5, 7].map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? "s" : ""} before due date
                </option>
              ))}
            </select>
          </div>
        </Section>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-rose border border-line rounded-lg mt-2 px-4 py-2.5 hover:bg-rose-soft transition-colors cursor-pointer"
        >
          <LogOut size={14} /> Sign out
        </button>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-ink-soft mb-2">
        {title}
      </div>
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  action,
  icon,
}: {
  label: string;
  value: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-line last:border-b-0">
      <div>
        <div className="text-sm text-ink-soft">
          {label}
        </div>
        <div className="font-mono text-sm text-ink mt-0.5 flex items-center gap-1.5">
          {icon} {value}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-semibold text-ink bg-paper-dim border-none rounded-md px-3 py-1.5"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}