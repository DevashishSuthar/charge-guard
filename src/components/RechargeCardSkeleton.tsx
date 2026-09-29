/**
 * Loading placeholder for RechargeCard. Mirrors its layout (icon + two
 * text lines, amount/due row, and the torn-voucher status panel) so the
 * grid doesn't jump around once the real cards arrive.
 */
export function RechargeCardSkeleton() {
    return (
        <div
            className="relative bg-white border border-line rounded-xl flex overflow-hidden"
            aria-hidden="true"
        >
            <div className="flex-1 p-4 min-w-0">
                <div className="flex items-center gap-2.5">
                    <div className="skeleton-pulse w-8 h-8 rounded-lg bg-paper-dim shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="skeleton-pulse h-3.5 w-24 rounded bg-paper-dim" />
                        <div className="skeleton-pulse h-2.5 w-32 rounded bg-paper-dim" />
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-line flex items-end justify-between">
                    <div className="space-y-1.5">
                        <div className="skeleton-pulse h-2 w-10 rounded bg-paper-dim" />
                        <div className="skeleton-pulse h-4.5 w-16 rounded bg-paper-dim" />
                    </div>
                    <div className="space-y-1.5">
                        <div className="skeleton-pulse h-2 w-8 rounded bg-paper-dim ml-auto" />
                        <div className="skeleton-pulse h-3.5 w-12 rounded bg-paper-dim" />
                    </div>
                </div>
            </div>

            <div className="w-20 sm:w-24 shrink-0 border-l border-dashed border-line flex flex-col items-center justify-center gap-2 px-2 py-3 bg-paper-dim/50">
                <div className="skeleton-pulse h-5 w-6 rounded bg-paper-dim" />
                <div className="skeleton-pulse h-2 w-10 rounded bg-paper-dim" />
                <div className="skeleton-pulse h-5 w-12 rounded-full bg-paper-dim mt-1" />
            </div>
        </div>
    );
}
