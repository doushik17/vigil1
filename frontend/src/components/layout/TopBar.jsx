import React from "react";
import { Sparkles, Menu, Stethoscope, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceInput from "../VoiceInput";

export function TopBar({
  patient,
  timeString,
  backendOnline,
  onOpenSidebar,
  onAskAI,
}) {
  const navigate = useNavigate();

  return (
    <header className="vigil-topbar">
      <div className="topbar-left">
        {/* Mobile menu toggle */}
        <button
          className="btn-menu-drawer"
          onClick={onOpenSidebar}
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        {/* OR Status */}
        <div className="theater-badge font-mono">
          <span className="pulse-dot-emerald" />
          <span className="or-label">OR-01 · LIVE</span>
        </div>

        {/* Active Patient & Procedure */}
        <div className="active-case-pill">
          <span className="patient-tag font-mono">
            {patient?.id || "P001"} · {patient?.name || "Patient"}
          </span>
          <span className="separator">|</span>
          <span className="procedure-tag">
            {patient?.procedure || "Laparoscopic Appendectomy"}
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Single Compact AI status */}
        <div className="topbar-ai-status font-mono">
          <span
            className={`status-dot ${
              backendOnline === true ? "dot-online" : backendOnline === false ? "dot-offline" : "dot-checking"
            }`}
          />
          <span className="status-text">
            {backendOnline === true ? "AI ONLINE" : backendOnline === false ? "AI OFFLINE" : "CONNECTING..."}
          </span>
        </div>

        {/* Voice Command Button */}
        <VoiceInput
          onTranscript={(text) => {
            if (onAskAI) onAskAI(text);
            navigate("/ai");
          }}
          compact={true}
        />

        {/* AI Assistant Quick Navigation */}
        <button
          className="btn-quick-ai-nav"
          onClick={() => navigate("/ai")}
          title="Open VIGIL AI Assistant"
        >
          <Sparkles size={14} className="text-cyan" />
          <span>VIGIL AI</span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
