const BASE = window.location.origin === "http://localhost:5173"
  ? "http://localhost:8000"
  : "";

export async function predictChurn(data) {
  const response = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Server error (${response.status})`);
  }
  return response.json();
}
