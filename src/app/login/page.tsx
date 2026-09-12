"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        {/* <div className="flex justify-center mb-7"><Wordmark /></div> */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-7">
          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
          <span className="font-display text-2xl font-semibold text-ink">
            Charge Guard
          </span>
        </Link>

        <div className="bg-white border border-line rounded-xl p-7 shadow-sm">
          <div className="flex gap-1 bg-paper-dim rounded-lg p-1 mb-6">
            {(["signup", "login"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${mode === m
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink-soft"
                  }`}
              >
                {m === "signup" ? "Sign up" : "Log in"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-line rounded-lg pl-3 pr-10 py-2.5 text-sm text-ink outline-none focus:border-brand"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-soft hover:text-ink"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose bg-rose-soft rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              //  style={{
              //   width: "100%", marginTop: 8, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
              //   color: "#fff", background: COLORS.ink, border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer"
              // }}
              className="w-full bg-brand hover:bg-brand-light transition-colors text-white font-semibold text-sm rounded-lg py-2.5 disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-3.15 4.03M6.6 6.6C3.4 8.4 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 4.4-.94" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}