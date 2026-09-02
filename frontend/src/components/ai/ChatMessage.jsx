import React, { useState } from "react";
import { Bot, User, Copy, Check, AlertTriangle, RefreshCw, Sparkles, Clock } from "lucide-react";
import IntentBadge from "./IntentBadge";

export function ChatMessage({ message, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isAgent = message.sender === "agent";
  const isError = message.status === "error";
  const isLoading = message.status === "loading";

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="chat-msg chat-msg-agent chat-msg-loading">
        <div className="chat-avatar avatar-agent">
          <Sparkles size={16} />
        </div>
        <div className="chat-bubble chat-bubble-agent">
          <div className="chat-bubble-header">
            <span className="sender-name">VIGIL AI</span>
            <span className="status-analyzing-pill">
              <span className="pulse-dot-cyan" />
              ANALYZING REQUEST
            </span>
          </div>
          <div className="agent-thinking-waveform">
            <div className="wave-bar bar-1" />
            <div className="wave-bar bar-2" />
            <div className="wave-bar bar-3" />
            <div className="wave-bar bar-4" />
            <div className="wave-bar bar-5" />
            <span className="thinking-text">Processing clinical query through LangGraph...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="chat-msg chat-msg-agent chat-msg-error">
        <div className="chat-avatar avatar-error">
          <AlertTriangle size={16} />
        </div>
        <div className="chat-bubble chat-bubble-error">
          <div className="chat-bubble-header">
            <span className="sender-name text-red">VIGIL AI · BACKEND OFFLINE</span>
            <IntentBadge intent="error" size="small" />
          </div>
          <p className="error-message-text">{message.text}</p>
          <div className="error-action-bar">
            <span className="error-hint">Verify FastAPI server at http://127.0.0.1:8001</span>
            {onRetry && (
              <button
                className="btn-retry"
                onClick={() => onRetry(message.querySent || "Show me patient details")}
              >
                <RefreshCw size={13} />
                <span>RETRY QUERY</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-msg ${isAgent ? "chat-msg-agent" : "chat-msg-user"}`}>
      <div className={`chat-avatar ${isAgent ? "avatar-agent" : "avatar-user"}`}>
        {isAgent ? <Sparkles size={16} /> : <User size={16} />}
      </div>

      <div className={`chat-bubble ${isAgent ? "chat-bubble-agent" : "chat-bubble-user"}`}>
        <div className="chat-bubble-header">
          <div className="sender-info">
            <span className="sender-name">{isAgent ? "VIGIL AI" : "DOCTOR / SURGEON"}</span>
            {message.timestamp && (
              <span className="msg-time">
                <Clock size={10} />
                {message.timestamp}
              </span>
            )}
          </div>

          <div className="header-meta">
            {isAgent && message.intent && <IntentBadge intent={message.intent} size="small" />}
            {isAgent && message.text && (
              <button className="btn-copy-msg" onClick={handleCopy} title="Copy response">
                {copied ? <Check size={13} className="text-stable" /> : <Copy size={13} />}
              </button>
            )}
          </div>
        </div>

        <div className="chat-bubble-content">
          <p className="chat-text">{message.text}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
