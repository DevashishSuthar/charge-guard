"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Settings as SettingsIcon, X } from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * Shared dashboard/settings header. Route-aware nav (Link + usePathname for
 * the active state) with its own logout handler, so both pages share one
 * header.
 *
 * On narrow / PWA-width viewports the logo + two nav links + log out button
 * used to all fight for space in a single row, so below the `sm` breakpoint
 * the links and log-out button collapse behind a hamburger button and drop
 * into a full-width panel underneath the header instead.
 */
export function TopNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-20 border-b border-line bg-paper">
            <div className="max-w-3xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
                <Logo href="/dashboard" dotClassName="w-2 h-2" textClassName="text-base sm:text-lg" />

                {/* Full nav — hidden below sm, where it collapses into the hamburger panel */}
                <div className="hidden sm:flex items-center gap-1">
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

                {/* Hamburger toggle — sm and up hides this in favor of the full nav */}
                <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border-none text-ink cursor-pointer hover:bg-paper-dim"
                >
                    {menuOpen ? <X size={19} /> : <Menu size={19} />}
                </button>
            </div>

            {/* Mobile nav panel */}
            {menuOpen && (
                <div className="sm:hidden border-t border-line bg-paper px-4 py-2">
                    <div className="max-w-3xl mx-auto flex flex-col gap-1 py-1">
                        <MobileNavLink
                            href="/dashboard"
                            active={pathname === "/dashboard"}
                            icon={<Bell size={15} />}
                            label="Dashboard"
                            onNavigate={() => setMenuOpen(false)}
                        />
                        <MobileNavLink
                            href="/settings"
                            active={pathname === "/settings"}
                            icon={<SettingsIcon size={15} />}
                            label="Settings"
                            onNavigate={() => setMenuOpen(false)}
                        />
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                handleLogout();
                            }}
                            className="flex items-center gap-2 text-sm font-semibold text-ink-soft border-none rounded-lg px-3 py-2.5 transition hover:bg-paper-dim cursor-pointer text-left"
                        >
                            <LogOut size={15} /> Log out
                        </button>
                    </div>
                </div>
            )}
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

function MobileNavLink({
    href,
    active,
    icon,
    label,
    onNavigate,
}: {
    href: string;
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onNavigate: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2 text-sm font-semibold rounded-lg px-3 py-2.5 transition ${active ? "text-ink bg-paper-dim" : "text-ink-soft hover:bg-paper-dim"
                }`}
        >
            {icon} {label}
        </Link>
    );
}
