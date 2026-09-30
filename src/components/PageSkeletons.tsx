import { RechargeCardSkeleton } from "@/components/RechargeCardSkeleton";

/*
 * Full-page loading placeholders. Each renders the same <main> wrapper as the
 * real page, so nothing shifts when the page swaps in. They're used in two
 * places: the route-level loading.tsx files (while the server renders the next
 * page) and the client components themselves (while their /api data loads) —
 * one skeleton for both stages, so there's no visible "double loading".
 */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`skeleton-pulse rounded bg-paper-dim ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <main
      className="max-w-shell mx-auto px-4 sm:px-6 pt-6 sm:pt-9 pb-20"
      aria-busy="true"
      aria-label="Loading your recharges"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink m-0">Your recharges</h1>
          <Bar className="h-3.5 w-40 mt-2.5" />
        </div>
        <div className="skeleton-pulse rounded-lg bg-paper-dim h-10 w-full sm:w-36" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <RechargeCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}

export function SettingsSkeleton() {
  return (
    <main
      className="max-w-160 mx-auto px-4 sm:px-6 pt-6 sm:pt-9 pb-20"
      aria-busy="true"
      aria-label="Loading settings"
    >
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Settings</h1>

      {[1, 2, 3].map((n) => (
        <div key={n} className="mb-6">
          <Bar className="h-3 w-28 mb-2.5" />
          <div className="bg-white border border-line rounded-lg p-4 space-y-3">
            <Bar className="h-3 w-24" />
            <Bar className="h-4 w-48" />
          </div>
        </div>
      ))}
    </main>
  );
}
