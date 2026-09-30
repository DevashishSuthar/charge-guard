import Link from "next/link";

/**
 * Charge Guard's brand mark: a small ink badge holding an amber + teal dot
 * pair, followed by the "Charge Guard" wordmark. Shared by the landing page,
 * login screen and the signed-in TopNav.
 */
export function Logo({
  href,
  textClassName = "text-lg",
  className = "",
  size = 22,
}: {
  /** If provided, wraps the mark in a Next.js Link. Omit for a static (non-clickable) mark. */
  href?: string;
    /** Tailwind classes for the wordmark text (font size etc). */
  textClassName?: string;
    /** Extra classes for the outer flex row (badge + wordmark). */
  className?: string;
    /** Inner glyph size in px; the badge is `size + 10` square. Default 22 → 32px badge. */
  size?: number;
}) {
  const badge = size + 10;

  const mark = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        aria-hidden="true"
        className="rounded-[7px] bg-ink flex items-center justify-center shrink-0"
        style={{ width: badge, height: badge }}
      >
        {/* The teal dot is drawn as a box-shadow 8px to the right, which doesn't
            take up layout space, so the amber dot alone is centred. Shifting it
            left by half the offset (4px) centres the pair. */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber -translate-x-1 shadow-[8px_0_0_var(--color-teal)]" />
      </div>
      <span
        className={`font-display font-semibold text-ink tracking-[-0.01em] whitespace-nowrap ${textClassName}`}
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