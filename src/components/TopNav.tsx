"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Settings as SettingsIcon } from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * Shared dashboard/settings header. This component already existed but was
 * never used anywhere — it was written for a client-side, single-page-app
 * style of navigation (an `active` string + an `onNav` callback that swaps
 * screens in place), which doesn't match how this app actually navigates:
 * Dashboard and Settings are separate routes reached via next/link and
 * server-checked auth. Meanwhile Dashboard.tsx and Settings.tsx each hand-
 * rolled their own near-identical header instead of using this component,
 * and drifted from each other (Dashboard's header had a Settings + Log out
 * button, Settings' header only linked back to Dashboard).
 *
 * Rebuilt here as a real route-aware nav (Link + usePathname for the active
 * state) with its own logout handler, so both pages can share one header.
 */
export function TopNav() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-10 border-b border-line bg-paper">
            <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
                <Logo href="/dashboard" dotClassName="w-2 h-2" />
                <div className="flex items-center gap-1">
                    <NavLink
                        href="/dashboard"
                        active={pathname === "/dashboard"}
                        icon={<Bell size={14} />}
                        label="Dashboard"
                    />
                    <NavLink
                        href="/settings"
                        active={pathname === "/settings"}
                        icon={<SettingsIcon size={14} />}
                        label="Settings"
                    />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft border-none rounded-lg px-3 py-2 transition hover:bg-paper-dim cursor-pointer"
                    >
                        <LogOut size={14} /> Log out
                    </button>
                </div>
            </div>
        </header>
    );
}

function NavLink({
    href,
    active,
    icon,
    label,
}: {
    href: string;
    active: boolean;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-2 transition ${active ? "text-ink bg-paper-dim" : "text-ink-soft hover:bg-paper-dim"
                }`}
        >
            {icon} {label}
        </Link>
    );
}