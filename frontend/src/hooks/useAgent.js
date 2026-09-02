import { useState, useEffect, useCallback, useRef } from "react";
import { sendToAgent, checkBackendHealth } from "../services/agentService";

export function useAgent() {
  const [messages, setMessages] = useState([
    {
      id: "init-1",
      sender: "agent",
      text: "VIGIL-OR Surgical Assistant online. You may query patient records (e.g., P001), monitor vitals, review imaging reports, or verify surgical safety checklists.",
      intent: "general",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "success",
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null); // null = checking, true, false
  const [lastError, setLastError] = useState(null);
  const checkIntervalRef = useRef(null);

  // Periodic health check
  const performHealthCheck = useCallback(async () => {
    const status = await checkBackendHealth();
    setBackendOnline(status.online);
  }, []);

  useEffect(() => {
    performHealthCheck();
    checkIntervalRef.current = setInterval(performHealthCheck, 10000);
    return () => clearInterval(checkIntervalRef.current);
  }, [performHealthCheck]);

  const sendMessage = useCallback(async (userText) => {
    if (!userText || !userText.trim() || isThinking) return;

    const trimmed = userText.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user",
      text: trimmed,
      timestamp: timeNow,
      status: "success",
    };

    // 2. Add pending agent placeholder
    const agentMsgId = `agent-${Date.now() + 1}`;
    const pendingAgentMsg = {
      id: agentMsgId,
      sender: "agent",
      text: "",
      intent: "",
      timestamp: timeNow,
      status: "loading",
      querySent: trimmed,
    };

    setMessages((prev) => [...prev, userMsg, pendingAgentMsg]);
    setIsThinking(true);
    setLastError(null);

    try {
      // Call REAL backend API (FastAPI POST /agent)
      const data = await sendToAgent(trimmed);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
                ...msg,
                text: data.response,
                intent: data.intent || "general",
                status: "success",
                raw: data.raw,
              }
            : msg
        )
      );
      setBackendOnline(true);
    } catch (err) {
      console.error("Agent query error:", err);
      // Clean clinical error without exposing localhost debug URLs to clinicians
      const clinicalError = "Unable to connect to VIGIL-OR AI backend. Please verify the agent server is running.";

      setLastError(clinicalError);
      setBackendOnline(false);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
                ...msg,
                text: clinicalError,
                intent: "error",
                status: "error",
                errorDetails: err.message,
              }
            : msg
        )
      );
    } finally {
      setIsThinking(false);
    }
  }, [isThinking]);

  const retryMessage = useCallback((queryToRetry) => {
    if (queryToRetry) {
      sendMessage(queryToRetry);
    }
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "agent",
        text: "Conversation cleared. Standing by for surgical queries.",
        intent: "general",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "success",
      },
    ]);
    setLastError(null);
  }, []);

  return {
    messages,
    isThinking,
    backendOnline,
    lastError,
    sendMessage,
    retryMessage,
    clearMessages,
    checkHealth: performHealthCheck,
  };
}

export default useAgent;
