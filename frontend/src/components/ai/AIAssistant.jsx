import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  RotateCcw,
  AlertCircle,
  Clock,
  User,
  Activity,
  Bot,
  RefreshCw,
  CornerDownLeft,
} from "lucide-react";
import VoiceInput from "../VoiceInput";
import IntentBadge from "./IntentBadge";

export function AIAssistant({
  messages = [],
  isThinking = false,
  backendOnline = true,
  lastError = null,
  onSendMessage,
  onRetry,
  onClear,
  patient,
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isThinking) return;
    if (onSendMessage) {
      onSendMessage(inputValue.trim());
    }
    setInputValue("");
  };

  const handleVoiceTranscript = (text) => {
    if (text && onSendMessage) {
      onSendMessage(text);
    }
  };

  const suggestedPrompts = [
    `Show me the patient details for ${patient?.id || "P001"}`,
    `Show me the CT report for ${patient?.id || "P001"}`,
    `Show me the MRI report for ${patient?.id || "P001"}`,
    `Show me the current vitals for ${patient?.id || "P001"}`,
    `Verify surgical safety checklist for ${patient?.id || "P001"}`,
  ];

  return (
    <div className={`dedicated-ai-assistant-card ${className}`}>
      {/* 1. Header */}
      <div className="ai-workspace-header">
        <div className="header-left">
          <div className="ai-brand-badge font-mono">
            <Sparkles size={16} className="text-cyan" />
            <span className="brand-title">VIGIL AI</span>
          </div>
          <span className="ai-subtitle">Surgical Intelligence Assistant</span>
        </div>

        <div className="header-right font-mono">
          {/* Clinical Backend Status */}
          <div className="ai-connection-indicator">
            <span
              className={`status-dot ${
                backendOnline === true ? "dot-online" : backendOnline === false ? "dot-offline" : "dot-checking"
              }`}
            />
            <span className="status-text">
              {backendOnline === true ? "AI AVAILABLE" : backendOnline === false ? "AI UNAVAILABLE" : "CONNECTING..."}
            </span>
          </div>

          <button className="btn-clear-chat" onClick={onClear} title="Clear conversation">
            <RotateCcw size={13} />
            <span>CLEAR</span>
          </button>
        </div>
      </div>

      {/* 2. Backend Unavailable Banner if Offline */}
      {backendOnline === false && (
        <div className="ai-backend-offline-banner font-mono">
          <div className="banner-text">
            <AlertCircle size={15} className="text-amber" />
            <span>BACKEND OFFLINE · Unable to connect to VIGIL-OR AI backend</span>
          </div>
          <button
            className="btn-retry-offline font-mono"
            onClick={() => onRetry && onRetry(`Show me the patient details for ${patient?.id || "P001"}`)}
          >
            <RefreshCw size={12} />
            <span>RETRY</span>
          </button>
        </div>
      )}

      {/* 3. Messages Stream */}
      <div className="ai-conversation-stream">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isAgent = msg.sender === "agent";
          const isError = msg.status === "error" || msg.intent === "error";

          return (
            <div
              key={msg.id}
              className={`chat-row ${isUser ? "row-user" : "row-agent"} ${isError ? "row-error" : ""}`}
            >
              <div className="chat-avatar-box">
                {isUser ? <User size={15} /> : isError ? <AlertCircle size={15} /> : <Bot size={15} />}
              </div>

              <div className="chat-bubble-container">
                <div className="bubble-header-meta font-mono">
                  <span className="sender-tag">
                    {isUser ? "DOCTOR (SURGEON)" : "VIGIL AI"}
                  </span>
                  {isAgent && msg.intent && !isError && (
                    <IntentBadge intent={msg.intent} />
                  )}
                  <span className="msg-time">{msg.timestamp}</span>
                </div>

                <div className="bubble-body-content">
                  {msg.status === "loading" ? (
                    <div className="thinking-loader font-mono">
                      <span className="pulse-dot-cyan" />
                      <span>VIGIL AI · Processing surgical request...</span>
                    </div>
                  ) : (
                    <div className="message-text">{msg.text}</div>
                  )}
                </div>

                {isError && (
                  <div className="error-retry-action font-mono">
                    <button
                      className="btn-msg-retry"
                      onClick={() => onRetry && onRetry(msg.querySent || "Show me the patient details for P001")}
                    >
                      <RefreshCw size={12} />
                      <span>RETRY QUERY</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="chat-row row-agent">
            <div className="chat-avatar-box">
              <Bot size={15} />
            </div>
            <div className="chat-bubble-container">
              <div className="thinking-loader font-mono">
                <span className="pulse-dot-cyan" />
                <span>VIGIL AI · Processing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Quick Prompts */}
      <div className="ai-prompts-bar font-mono">
        <span className="prompts-kicker">SUGGESTED QUERIES:</span>
        <div className="prompts-chips-list">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              className="prompt-chip-btn"
              onClick={() => onSendMessage && onSendMessage(p)}
              disabled={isThinking}
            >
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar with Microphone & Send */}
      <form onSubmit={handleSubmit} className="ai-composer-form">
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          disabled={isThinking}
        />

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask VIGIL AI (e.g. 'Show me the patient details for P001')..."
          className="ai-composer-input"
          disabled={isThinking}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          className="btn-composer-send"
          title="Send query"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;
