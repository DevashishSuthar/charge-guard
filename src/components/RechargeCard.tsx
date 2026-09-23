import {
    Check,
    Pencil,
    Trash2,
    Smartphone,
    Wifi,
} from "lucide-react";
import type {
    DueStatus,
    RechargeItem
} from "@/lib/types";
import { formatRupeeAmount } from "@/lib/utils";

const statusStyles: Record<DueStatus, { text: string; bg: string; label: string }> = {
    ok: { text: "text-teal", bg: "bg-teal-soft", label: "Upcoming" },
    soon: { text: "text-amber", bg: "bg-amber-soft", label: "Due soon" },
    overdue: { text: "text-rose", bg: "bg-rose-soft", label: "Overdue" },
};

export function RechargeCard({
    item,
    onDone,
    onEdit,
    onDelete,
}: {
    item: RechargeItem;
    onDone: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const s = statusStyles[item.status];
    const due = new Date(item.due);
    const dueLabel = due.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const TypeIcon = item.type === "BROADBAND" ? Wifi : Smartphone;

    // const { due, daysLeft, status } = dueInfo(item);

    return (
        <div className="relative bg-white border border-line rounded-xl flex overflow-visible shadow-sm"
        // style={{
        //   position: "relative", background: "#fff", border: `1px solid ${COLORS.line}`,
        //   borderRadius: 10, display: "flex", overflow: "visible",
        //   boxShadow: "0 1px 2px rgba(22,35,61,0.04)"
        // }}
        >
            <div className="flex-1 p-4 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-paper-dim flex items-center justify-center shrink-0">
                            <TypeIcon size={15} className="text-ink-soft" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-display font-semibold text-[15px] text-ink">
                                {item.label}
                            </div>
                            <div className="text-xs text-ink-soft mt-0.5">
                                {item.provider}
                                {item.phone ? ` · ${item.phone}` : ""}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                        <button
                            onClick={onEdit}
                            aria-label="Edit"
                            className="w-6.5 h-6.5 flex items-center justify-center rounded border-none cursor-pointer hover:bg-paper-dim"
                        // style={{
                        //   width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent",
                        //   cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                        // }}
                        >
                            <Pencil size={13} className="text-ink-soft" />
                        </button>
                        <button
                            onClick={onDelete}
                            aria-label="Delete"
                            className="w-6.5 h-6.5 flex items-center justify-center rounded border-none cursor-pointer hover:bg-paper-dim"
                        // style={{
                        //   width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent",
                        //   cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                        // }}
                        >
                            <Trash2 size={13} className="text-ink-soft" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-line flex items-end justify-between">
                    <div>
                        <div className="text-[10px] text-ink-soft mb-0.5">Amount</div>
                        <div className="font-mono font-semibold text-lg text-ink">₹{formatRupeeAmount(item.amount)}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-ink-soft mb-0.5">Due</div>
                        <div className="font-mono font-semibold text-sm text-ink">{dueLabel}</div>
                    </div>
                </div>
            </div>

            <div
                className={`relative w-24 shrink-0 border-l border-dashed border-line flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-r-xl ${s.bg}`}
            //   style={{
            //   position: "relative", width: 96, flexShrink: 0, borderLeft: `1px dashed ${COLORS.line}`,
            //   display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            //   gap: 8, padding: "12px 8px", background: s.bg, borderRadius: "0 10px 10px 0"
            // }}
            >
                <VoucherNotch side="left" />
                <div className={`font-mono text-xl font-semibold leading-none ${s.text}`}>
                    {item.status === "overdue" ? `+${Math.abs(item.daysLeft)}` : item.daysLeft}
                </div>
                <div className={`text-[10px] font-semibold text-center leading-tight ${s.text}`}>
                    {item.status === "overdue" ? "days late" : "days left"}
                </div>
                <button
                    onClick={onDone}
                    className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-white bg-brand hover:bg-brand-light transition-colors rounded px-2 py-1 cursor-pointer"
                // style={{
                //   marginTop: 4, fontFamily: "'Inter', sans-serif", fontSize: 10.5, fontWeight: 600,
                //   color: "#fff", background: COLORS.ink, border: "none", borderRadius: 6,
                //   padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                // }}
                >
                    <Check size={11} /> Done
                </button>
            </div>
        </div>
    );
}

/**
 * The perforated "torn voucher" notch between the recharge details and the
 * status panel. The Tailwind conversion had dropped the actual left/right
 * offset — the original inline style used a dynamic `[side]: -9` (px) to
 * cut the notch into whichever edge it sat on, but the converted className
 * never set `left`/`right` at all, so the notch just sat wherever the
 * default `absolute` position happened to land instead of appearing to
 * bite into the card's edge. Restored with the equivalent arbitrary-value
 * Tailwind classes.
 */
function VoucherNotch({ side }: { side: "left" | "right" }) {
    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-paper border border-line ${side === "left" ? "-left-2.25" : "-right-2.25"
                }`}
        // style={{
        //   position: "absolute", top: "50%", transform: "translateY(-50%)",
        //   [side]: -9, width: 18, height: 18, borderRadius: "50%",
        //   background: COLORS.paper, border: `1px solid ${COLORS.line}`
        // }} 
        />
    );
}