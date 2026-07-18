const COLORS = {
  high: { bg: "rgba(239,68,68,0.15)", text: "#fca5a5", border: "rgba(239,68,68,0.3)", bar: "#ef4444", label: "High Risk" },
  medium: { bg: "rgba(234,179,8,0.15)", text: "#fcd34d", border: "rgba(234,179,8,0.3)", bar: "#eab308", label: "Medium Risk" },
  low: { bg: "rgba(34,197,94,0.15)", text: "#86efac", border: "rgba(34,197,94,0.3)", bar: "#22c55e", label: "Low Risk" },
};

export default function PredictionResult({ result }) {
  const pct = result.churn_probability * 100;
  const level = pct > 70 ? "high" : pct > 40 ? "medium" : "low";
  const c = COLORS[level];

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "160px", height: "160px", borderRadius: "50%",
          background: `conic-gradient(${c.bar} ${pct}%, rgba(148,163,184,0.1) ${pct}%)`,
          marginBottom: "16px"
        }}>
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%",
            background: "#1e293b",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: "36px", fontWeight: 800, color: "white", lineHeight: 1 }}>
              {pct.toFixed(1)}%
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: c.text, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
              {c.label}
            </span>
          </div>
        </div>

        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: "20px",
          fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px",
          background: c.bg, color: c.text, border: "1px solid " + c.border,
          marginBottom: "12px"
        }}>
          {c.label}
        </div>

        <p style={{ color: "#cbd5e1", fontSize: "16px", textAlign: "center", margin: 0 }}>
          {result.prediction === 1
            ? "This customer is likely to churn. Proactive retention is recommended."
            : "This customer is likely to stay. No immediate action required."}
        </p>
      </div>

      <div style={{
        width: "100%", height: "12px", background: "rgba(148,163,184,0.1)",
        borderRadius: "6px", overflow: "hidden"
      }}>
        <div style={{
          width: pct + "%", height: "100%", borderRadius: "6px",
          background: c.bar, transition: "width 0.8s ease"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "12px", color: "#64748b" }}>
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
