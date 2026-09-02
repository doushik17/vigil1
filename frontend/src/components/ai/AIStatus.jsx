import React from "react";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";

export function AIStatus({ backendOnline, isThinking, onRetry, compact = false }) {
  if (compact) {
    return (
      <div className="ai-status-compact">
        <span
          className={`status-dot ${
            backendOnline === true ? "dot-online" : backendOnline === false ? "dot-offline" : "dot-checking"
          }`}
        />
        <span className="status-label">
          AI {backendOnline === true ? "ONLINE" : backendOnline === false ? "OFFLINE" : "CHECKING..."}
        </span>
      </div>
    );
  }

  return (
    <div className={`ai-status-bar ${backendOnline === false ? "ai-status-bar-offline" : ""}`}>
      <div className="ai-status-left">
        <div className="ai-brand-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>VIGIL AI</span>
        </div>
        <div className="ai-connection-indicator">
          <span
            className={`status-dot ${
              backendOnline === true ? "dot-online" : backendOnline === false ? "dot-offline" : "dot-checking"
            }`}
          />
          <span className="ai-status-text">
            {backendOnline === true
              ? "ENGINE CONNECTED (FastAPI · LangGraph)"
              : backendOnline === false
              ? "BACKEND OFFLINE (127.0.0.1:8001)"
              : "CONNECTING TO AI ENGINE..."}
          </span>
        </div>
      </div>

      <div className="ai-status-right">
        {isThinking && (
          <div className="ai-thinking-pill">
            <span className="pulse-circle" />
            <span>ANALYZING REQUEST</span>
          </div>
        )}
        {backendOnline === false && onRetry && (
          <button className="btn-retry-compact" onClick={onRetry} title="Retry backend connection">
            <RefreshCw size={12} />
            <span>RECONNECT</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default AIStatus;
