/**
 * API base:
 * - Local:  VITE_API_BASE=http://localhost:5000
 * - Deploy: VITE_API_BASE=https://<render-backend>.onrender.com
 */
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");

// Timeout để tránh treo mãi (Render sleep lần đầu)
const DEFAULT_TIMEOUT_MS = 20000;

async function request(path, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      // nếu sau này bạn cần cookie/session thì để sẵn:
      credentials: "omit",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }

    // API bạn trả JSON nên parse luôn
    return await res.json();
  } catch (err) {
    // timeout
    if (err?.name === "AbortError") {
      throw new Error("Request timeout. Backend có thể đang sleep, thử F5 lại nhé.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function getSettings() {
  return request("/api/settings", { method: "GET" });
}

export function sendReply(message) {
  return request("/api/replies", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
