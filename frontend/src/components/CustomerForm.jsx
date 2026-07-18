import { useState } from "react";

const CONTRACT_OPTIONS = ["Month-to-month", "One year", "Two year"];
const PAYMENT_OPTIONS = [
  "Electronic check",
  "Mailed check",
  "Bank transfer (automatic)",
  "Credit card (automatic)",
];
const INTERNET_OPTIONS = ["DSL", "Fiber optic", "No"];
const YES_NO_OPTIONS = ["Yes", "No"];

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function CustomerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    gender: "Male",
    SeniorCitizen: 0,
    Partner: "No",
    Dependents: "No",
    tenure: 12,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    MonthlyCharges: 70.0,
    TotalCharges: 840.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "tenure" || name === "SeniorCitizen" || name === "MonthlyCharges" || name === "TotalCharges"
          ? Number(value)
          : value,
    }));
  };

  const selectClass = "w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer";
  const inputClass = "w-full bg-slate-800/60 border border-slate-600/40 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Gender">
            <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>
          <Field label="Senior Citizen">
            <select name="SeniorCitizen" value={form.SeniorCitizen} onChange={handleChange} className={selectClass}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </Field>
          <Field label="Tenure (months)">
            <input type="number" name="tenure" value={form.tenure} onChange={handleChange} min="0" className={inputClass} />
          </Field>
          <Field label="Partner">
            <select name="Partner" value={form.Partner} onChange={handleChange} className={selectClass}>
              {YES_NO_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Dependents">
            <select name="Dependents" value={form.Dependents} onChange={handleChange} className={selectClass}>
              {YES_NO_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <hr className="border-slate-700/50" />

      <div>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Phone Service">
            <select name="PhoneService" value={form.PhoneService} onChange={handleChange} className={selectClass}>
              {YES_NO_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Multiple Lines">
            <select name="MultipleLines" value={form.MultipleLines} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No phone service">No phone service</option>
            </select>
          </Field>
          <Field label="Internet Service">
            <select name="InternetService" value={form.InternetService} onChange={handleChange} className={selectClass}>
              {INTERNET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Online Security">
            <select name="OnlineSecurity" value={form.OnlineSecurity} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
          <Field label="Online Backup">
            <select name="OnlineBackup" value={form.OnlineBackup} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
          <Field label="Device Protection">
            <select name="DeviceProtection" value={form.DeviceProtection} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
          <Field label="Tech Support">
            <select name="TechSupport" value={form.TechSupport} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
          <Field label="Streaming TV">
            <select name="StreamingTV" value={form.StreamingTV} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
          <Field label="Streaming Movies">
            <select name="StreamingMovies" value={form.StreamingMovies} onChange={handleChange} className={selectClass}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="No internet service">No internet service</option>
            </select>
          </Field>
        </div>
      </div>

      <hr className="border-slate-700/50" />

      <div>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">Account &amp; Billing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Contract">
            <select name="Contract" value={form.Contract} onChange={handleChange} className={selectClass}>
              {CONTRACT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Payment Method">
            <select name="PaymentMethod" value={form.PaymentMethod} onChange={handleChange} className={selectClass}>
              {PAYMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Paperless Billing">
            <select name="PaperlessBilling" value={form.PaperlessBilling} onChange={handleChange} className={selectClass}>
              {YES_NO_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Monthly Charges ($)">
            <input type="number" name="MonthlyCharges" value={form.MonthlyCharges} onChange={handleChange} step="0.01" min="0" className={inputClass} />
          </Field>
          <Field label="Total Charges ($)">
            <input type="number" name="TotalCharges" value={form.TotalCharges} onChange={handleChange} step="0.01" min="0" className={inputClass} />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Predict Churn Risk
          </span>
        )}
      </button>
    </form>
  );
}
