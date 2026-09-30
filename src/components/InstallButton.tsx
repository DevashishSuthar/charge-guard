"use client";

import { Download } from "lucide-react";
import { promptInstall, useInstallState } from "@/lib/pwaInstall";
import { useToast } from "@/components/Toast";

/**
 * "Install app" button. Renders nothing when the app is already installed or
 * the browser can't install it (e.g. desktop Firefox), so it never shows a
 * dead button.
 */
export function InstallButton({
  className,
  onClick,
}: {
  className: string;
  /** Lets the mobile menu close itself after the tap. */
  onClick?: () => void;
}) {
  const { canPrompt, isIos, installed } = useInstallState();
  const { showToast } = useToast();

  if (installed || (!canPrompt && !isIos)) return null;

  async function handleClick() {
    onClick?.();
    if (canPrompt) {
      await promptInstall();
    } else {
      // iOS Safari: no install API, so tell the user where the option lives.
      showToast('To install: tap the Share button, then "Add to Home Screen".');
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      <Download size={14} /> Install app
    </button>
  );
}
