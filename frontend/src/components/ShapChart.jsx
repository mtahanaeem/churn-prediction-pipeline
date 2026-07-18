import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

function fmt(name) {
  return name
    .replace(/_/g, " ")
    .replace(/Contract Payment Interaction /, "")
    .replace(/Has /, "")
    .replace(/Is /, "")
    .replace(/ No$/, " (No)")
    .replace(/ Yes$/, " (Yes)")
    .replace(/Fiber Optic$/, "Fiber")
    .replace(/Credit Card \(Automatic\)$/, "Credit")
    .replace(/Bank Transfer \(Automatic\)$/, "Bank")
    .replace(/Electronic Check$/, "E-Check")
    .replace(/Month To Month$/, "M2M")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ShapChart({ features }) {
  const data = [...features]
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
    .map((f) => ({
      feature: fmt(f.feature),
      value: f.shap_value,
    }));

  if (data.length === 0) {
    return <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No data</div>;
  }

  const maxVal = Math.max(...data.map((d) => Math.abs(d.value)), 0.01);
  const pad = maxVal * 0.6;

  const renderLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width + 8}
        y={y + 14}
        fill="#94a3b8"
        fontSize={12}
        fontWeight={600}
        textAnchor="start"
      >
        {Number(value).toFixed(2)}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={Math.max(140, data.length * 50)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 70, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, maxVal + pad]}
          tick={{ fill: "#64748b", fontSize: 11 }}
          axisLine={{ stroke: "rgba(148,163,184,0.12)" }}
          tickLine={false}
        />
        <YAxis
          dataKey="feature"
          type="category"
          width={140}
          tick={{ fill: "#e2e8f0", fontSize: 12, fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 8,
            color: "#e2e8f0",
            fontSize: 12,
          }}
          formatter={(v) => ["SHAP: " + Number(v).toFixed(4), "Impact"]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22} label={renderLabel}>
          {data.map((e, i) => (
            <Cell key={i} fill={e.value > 0 ? "#ef4444" : "#22c55e"} fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
