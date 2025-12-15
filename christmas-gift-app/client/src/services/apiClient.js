/**
 * API base:
 * - Local: VITE_API_BASE=http://localhost:5000
 * - Deploy: VITE_API_BASE=https://<render-backend>.onrender.com
 */
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");

/**
 * Lấy settings
 */
export async function getSettings() {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch settings: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Gửi reply
 */
export async function sendReply(message) {
  const res = await fetch(`${API_BASE}/api/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to send reply: ${res.status} ${text}`);
  }

  return res.json();
}