function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-ink mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

//    <div style={{ marginBottom: 14 }}>
//       <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>
//         {label}
//       </label>
//       <input type={type} placeholder={placeholder} style={{
//   width: "100%", boxSizing: "border-box", fontFamily: "'Inter', sans-serif", fontSize: 14,
//   color: COLORS.ink, border: `1px solid ${COLORS.line}`, borderRadius: 8, padding: "10px 12px",
//   outline: "none", background: "#fff"
// }} />
//     </div>

export default Field;