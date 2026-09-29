"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; message: string };

type ToastContextValue = {
    showToast: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 3200;

/**
 * Mounted once near the root (see layout.tsx) so any page can call
 * useToast() and get feedback that shows up right where the user is
 * looking, instead of a message banner stuck at the top of the page that's
 * easy to miss on a long screen or a PWA with the header pinned.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, kind: ToastKind = "success") => {
            const id = ++idRef.current;
            setToasts((prev) => [...prev, { id, kind, message }]);
            setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div
                className="fixed inset-x-0 bottom-0 z-100 flex flex-col items-stretch gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pointer-events-none sm:items-end sm:right-6 sm:left-auto sm:px-0 sm:pb-6 sm:w-full sm:max-w-sm"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className="pointer-events-auto flex items-start gap-2 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink shadow-lg animate-in"
                    >
                        {t.kind === "success" && (
                            <CheckCircle2 size={16} className="text-teal shrink-0 mt-0.5" />
                        )}
                        {t.kind === "error" && (
                            <XCircle size={16} className="text-rose shrink-0 mt-0.5" />
                        )}
                        {t.kind === "info" && (
                            <Info size={16} className="text-ink-soft shrink-0 mt-0.5" />
                        )}
                        <span className="flex-1 leading-snug">{t.message}</span>
                        <button
                            onClick={() => dismiss(t.id)}
                            aria-label="Dismiss"
                            className="shrink-0 text-ink-soft hover:text-ink cursor-pointer border-none bg-transparent p-0.5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
