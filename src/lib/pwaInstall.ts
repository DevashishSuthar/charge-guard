"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny store around the browser's `beforeinstallprompt` event.
 *
 * Chrome/Edge/Android fire that event once, when the app becomes installable,
 * and only the first listener registered sees it. Capturing it at module level
 * (instead of inside a component) means it isn't lost when the component that
 * wants it — e.g. the mobile menu — isn't mounted yet.
 */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallState = {
  /** A native install prompt is available (Chrome, Edge, Android browsers). */
  canPrompt: boolean;
  /** iOS Safari has no prompt API; users must use Share → Add to Home Screen. */
  isIos: boolean;
  /** Already running as an installed app. */
  installed: boolean;
};

const serverState: InstallState = { canPrompt: false, isIos: false, installed: true };

let deferred: InstallPromptEvent | null = null;
let state: InstallState = serverState;
const listeners = new Set<() => void>();

function detect(): Pick<InstallState, "isIos" | "installed"> {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  const installed =
    window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  const isIos =
    /iphone|ipad|ipod/i.test(nav.userAgent) ||
    // iPadOS reports itself as a Mac, but has touch points
    (nav.userAgent.includes("Macintosh") && nav.maxTouchPoints > 1);
  return { isIos, installed };
}

function update(patch: Partial<InstallState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  state = { canPrompt: false, ...detect() };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // stop the mini-infobar; we show our own button
    deferred = e as InstallPromptEvent;
    update({ canPrompt: true });
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    update({ canPrompt: false, installed: true });
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useInstallState() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

/** Shows the native install dialog. Returns true if the user accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const evt = deferred;
  deferred = null; // the event can only be used once
  update({ canPrompt: false });
  await evt.prompt();
  const { outcome } = await evt.userChoice;
  return outcome === "accepted";
}
