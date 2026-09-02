// VIGIL-OR Surgical Assistant API Service
// Connects to FastAPI + LangGraph backend at http://127.0.0.1:8001

const API_BASE_URL = "http://127.0.0.1:8001";

/**
 * Send a query to the VIGIL-OR AI agent backend.
 * @param {string} userInput - The user's voice transcript or typed text query
 * @returns {Promise<{ intent: string, response: string, raw?: any }>}
 */
export async function sendToAgent(userInput) {
  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    throw new Error("Empty user input provided");
  }

  const response = await fetch(`${API_BASE_URL}/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_input: userInput.trim(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Agent API error ${response.status}: ${errorText || response.statusText || "Request failed"}`
    );
  }

  const data = await response.json();
  return {
    intent: data.intent || "general",
    response: data.response || "No response text received from agent.",
    raw: data,
  };
}

/**
 * Check if the VIGIL-OR AI backend is online and reachable.
 * @returns {Promise<{ online: boolean, message?: string }>}
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return { online: true, message: data.message || "Backend Online" };
    }
    return { online: false, message: `HTTP ${response.status}` };
  } catch (err) {
    return { online: false, message: err.message || "Offline" };
  }
}

export { API_BASE_URL };
export default { sendToAgent, checkBackendHealth, API_BASE_URL };
