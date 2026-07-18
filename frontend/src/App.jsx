import { useState, lazy, Suspense } from "react";
import CustomerForm from "./components/CustomerForm";
import PredictionResult from "./components/PredictionResult";
import { predictChurn } from "./api";

const ShapChart = lazy(() => import("./components/ShapChart"));

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await predictChurn(formData));
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sectionTitle = (icon, text, color = "#60a5fa") => (
    <h2 style={{ fontSize: "20px", fontWeight: 600, margin: "0 0 24px", display: "flex", alignItems: "center", gap: "8px", color: "#f1f5f9" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
      {text}
    </h2>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "32px 16px", background: "#0f172a" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 16px", borderRadius: "20px",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
            color: "#60a5fa", fontSize: "13px", fontWeight: 600, marginBottom: "16px"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
            AI-Powered Predictive Model
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, margin: "0 0 8px", lineHeight: 1.2,
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Customer Churn Predictor
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
            Enter customer details below to predict churn probability and identify the key drivers.
          </p>
        </div>

        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          {sectionTitle(
            "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
            "Customer Information"
          )}
          <CustomerForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {loading && (
          <div className="card" style={{ padding: "24px", textAlign: "center", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div className="spinner" />
              <span style={{ color: "#94a3b8", fontWeight: 500 }}>Analyzing customer data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="card" style={{ padding: "16px", marginBottom: "24px", borderColor: "rgba(239,68,68,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fca5a5" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="card" style={{ padding: "24px" }}>
              {sectionTitle(
                "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                "Prediction Result"
              )}
              <PredictionResult result={result} />
            </div>

            <div className="card" style={{ padding: "24px" }}>
              {sectionTitle(
                "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                "Top Drivers - SHAP Feature Importance", "#a78bfa"
              )}
              <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading chart...</div>}>
                <ShapChart features={result.top_features} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
