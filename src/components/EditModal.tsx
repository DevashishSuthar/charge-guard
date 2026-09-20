import { X } from "lucide-react";

import { FormState, RechargeType } from "@/lib/types";
import Field from "./Field";

export function EditModal({
  form,
  setForm,
  isEditing,
  saving,
  onSave,
  onClose,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  isEditing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  //   const [form, setForm] = useState(item || {
  //   label: "", provider: "", type: "mobile", phone: "", amount: "", cycleDays: 28, leadDays: 3, lastRecharge: new Date()
  // });
  // const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-5 z-50"
    // style={{
    //   position: "absolute", inset: 0, background: "rgba(22,35,61,0.4)",
    //   display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50
    // }}
    >
      <div className="w-full max-w-md max-h-[88vh] overflow-y-auto bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {isEditing ? "Edit recharge" : "Add a recharge"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            // style={{
            //   width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent",
            //   cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            // }}
            className="w-7 h-7 flex items-center justify-center rounded border-none cursor-pointer hover:bg-paper-dim">
            <X size={17} className="text-ink-soft" />
          </button>
        </div>

        {/* <Row>
          <Field label="Who's this for" placeholder="e.g. Papa, Wife, Home" type="text" />
        </Row>
        <div onInput={e => set("label", e.target.value)} /> */}

        <div className="space-y-3">
          <Field label="Who's this for"
          // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
          >
            <input
              className="input"
              placeholder="e.g. Papa, Wife, Home"
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
              // style={{
              //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
              //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
              //   outline: "none", background: "#fff"
              // }}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Type" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <select
                className="input"
                value={form.type}
                onChange={(e) => set("type", e.target.value as RechargeType)}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              >
                <option value="MOBILE">Mobile</option>
                <option value="BROADBAND">Broadband / Fiber</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Provider" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                className="input"
                placeholder="Jio, Airtel, Vi…"
                value={form.provider}
                onChange={(e) => set("provider", e.target.value)}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              />
            </Field>
          </div>

          <Field label="Number (optional)"
          // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
          >
            <input
              className="input"
              placeholder="98290 xxxxx"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              // style={{
              //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
              //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
              //   outline: "none", background: "#fff"
              // }}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Amount (₹)" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                type="number"
                className="input"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              />
            </Field>
            <Field label="Cycle" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <select
                className="input"
                value={form.cycleDays}
                onChange={(e) => set("cycleDays", Number(e.target.value))}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              >
                <option value={28}>28 days</option>
                <option value={30}>30 days</option>
                <option value={84}>84 days</option>
                <option value={365}>Yearly</option>
              </select>
            </Field>
          </div>

          <div className="flex gap-3">
            <Field label="Last recharged on" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                type="date"
                className="input"
                value={form.lastRecharge}
                onChange={(e) => set("lastRecharge", e.target.value)}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              />
            </Field>
            <Field label="Remind me (days before)" className="flex-1"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                type="number"
                className="input"
                value={form.leadDays}
                onChange={(e) => set("leadDays", Number(e.target.value))}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
              />
            </Field>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="w-full mt-5 bg-brand hover:bg-brand-light transition-colors text-white font-semibold text-sm rounded-lg py-2.5 disabled:opacity-60"
          // style={{
          //   width: "100%", marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
          //   color: "#fff", background: COLORS.ink, border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer"
          // }}
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Add recharge"}
        </button>
      </div>
    </div>
  );
}