import Link from "next/link";

/**
 * Charge Guard's brand mark: a brand-colored dot + wordmark.
 *
 * This was previously duplicated (with slightly inconsistent dot sizes) in
 * Landing.tsx, login/page.tsx, Dashboard.tsx, and Settings.tsx. A separate
 * two-tone glyph version was sketched out in a comment block in Landing.tsx
 * (a small square badge with an amber dot + teal shadow) but never finished
 * or wired to real design tokens — that's a bigger visual redesign than a
 * mechanical "convert this to Tailwind" pass covers, so this component keeps
 * the simple dot mark that's already live everywhere, just de-duplicated.
 * Swap the inner markup here later if/when the two-tone glyph gets finished.
 */
export function Logo({
  href,
  dotClassName = "w-2.5 h-2.5",
  textClassName = "text-lg",
  className = "",
  size=22
}: {
  /** If provided, wraps the mark in a Next.js Link. Omit for a static (non-clickable) mark. */
  href?: string;
  dotClassName?: string;
  textClassName?: string;
  className?: string;
  size?: number;
}) {
  const mark = (
     <div className="flex items-center gap-2">
      <div
        className="rounded-[7px] bg-ink flex items-center justify-center shrink-0"
        style={{ width: size + 10, height: size + 10 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-amber shadow-[8px_0_0_var(--color-teal)]" />
      </div>
      <span
        className="font-display font-semibold text-ink tracking-[-0.01em]"
        style={{ fontSize: size }}
      >
        Charge Guard
      </span>
    </div>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="inline-flex items-center cursor-pointer">
      {mark}
    </Link>
  );
}