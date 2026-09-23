"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { z } from "zod";

import Field from "./Field";

const rechargeTypes = ["MOBILE", "BROADBAND", "OTHER"] as const;

const rechargeFormSchema = z
  .object({
    label: z.string().trim().min(1, "Give it a name so you can tell it apart"),
    provider: z.string().trim().min(1, "Provider is required"),
    type: z.enum(rechargeTypes),
    phone: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[\d\s+()-]{7,15}$/.test(v), {
        message: "That doesn't look like a valid phone number",
      }),
    amount: z.coerce
      .number({ message: "Enter an amount" })
      .positive("Amount must be greater than 0")
      .refine(
        // Floating-point multiplication isn't exact (e.g. 1296.88 * 100 ===
        // 129688.00000000001 in JS), so comparing against the *nearest*
        // integer within a tiny epsilon — rather than requiring an exact
        // integer — is what actually checks "at most two decimal places".
        (value) => Math.abs(Math.round(value * 100) - value * 100) < 1e-6,
        "Use at most two decimal places"
      ),
    cycleDays: z.coerce.number().int().positive("Pick a billing cycle"),
    lastRecharge: z
      .string()
      .min(1, "Last recharge date is required")
      .refine((v) => !Number.isNaN(new Date(v).getTime()), {
        message: "Invalid date",
      })
      .refine((v) => new Date(v) <= new Date(), {
        message: "Can't be in the future",
      }),
    leadDays: z.coerce
      .number()
      .int()
      .min(0, "Can't be negative")
      .max(30, "Keep the reminder window under 30 days"),
  })
  .refine((data) => data.leadDays < data.cycleDays, {
    message: "Reminder days must be fewer than the billing cycle",
    path: ["leadDays"],
  });

export type RechargeFormValues = z.infer<typeof rechargeFormSchema>;
type RechargeFormInput = z.input<typeof rechargeFormSchema>;

export function EditModal({
  initialValues,
  isEditing,
  saving,
  onSave,
  onClose,
}: {
    initialValues: RechargeFormValues;
  isEditing: boolean;
  saving: boolean;
    onSave: (data: RechargeFormValues) => void | Promise<void>;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RechargeFormInput, unknown, RechargeFormValues>({
    resolver: zodResolver(rechargeFormSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const submit = handleSubmit((data) => onSave(data));

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

        <form onSubmit={submit} noValidate>
          <div className="space-y-3">
            <Field label="Who's this for"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                className="input"
                placeholder="e.g. Papa, Wife, Home"
                {...register("label")}
              // style={{
              //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
              //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
              //   outline: "none", background: "#fff"
              // }}
              />
              {errors.label && <ErrorText message={errors.label.message} />}
            </Field>

            <div className="flex gap-3">
              <Field label="Type" className="flex-1"
              // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
              >
                <select
                  className="input"
                  {...register("type")}
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
                  placeholder="Jio, Airtel, Vi..."
                  {...register("provider")}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
                />
                {errors.provider && <ErrorText message={errors.provider.message} />}
              </Field>
            </div>

            <Field label="Number (optional)"
            // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
            >
              <input
                className="input"
                placeholder="98290 xxxxx"
                {...register("phone")}
              // style={{
              //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
              //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
              //   outline: "none", background: "#fff"
              // }}
              />
              {errors.phone && <ErrorText message={errors.phone.message} />}
            </Field>

            <div className="flex gap-3">
              <Field label="Amount (₹)" className="flex-1"
              // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
              >
                <input
                  type="number"
                  className="input"
                  step="0.01"
                  {...register("amount")} 
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
                />
                {errors.amount && <ErrorText message={errors.amount.message} />}
              </Field>
              <Field label="Cycle" className="flex-1"
              // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
              >
                <select
                  className="input"
                  {...register("cycleDays")}
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
                  {...register("lastRecharge")}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
                />
                {errors.lastRecharge && <ErrorText message={errors.lastRecharge.message} />}
              </Field>
              <Field label="Remind me (days before)" className="flex-1"
              // style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}
              >
                <input
                  type="number"
                  className="input"
                  {...register("leadDays")}
                // style={{
                //   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
                //   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
                //   outline: "none", background: "#fff"
                // }}
                />
                {errors.leadDays && <ErrorText message={errors.leadDays.message} />}
              </Field>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-5 bg-brand hover:bg-brand-light transition-colors text-white font-semibold text-sm rounded-lg py-2.5 disabled:opacity-60"
          // style={{
          //   width: "100%", marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
          //   color: "#fff", background: COLORS.ink, border: "none", borderRadius: 8, padding: "12px 0", cursor: "pointer"
          // }}
          >
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add recharge"}
          </button>
        </form>

      </div>
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-rose mt-1">{message}</p>;
}