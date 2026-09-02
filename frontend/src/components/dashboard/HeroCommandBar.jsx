import React from "react";
import { Activity, Clock, ShieldCheck, Stethoscope, User, Radio } from "lucide-react";

export function HeroCommandBar({
  patient,
  elapsedString,
  timeString,
  backendOnline,
  className = "",
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "GOOD MORNING, DOCTOR";
    if (hour < 18) return "GOOD AFTERNOON, DOCTOR";
    return "GOOD EVENING, DOCTOR";
  };

  return (
    <div className={`hero-command-bar ${className}`}>
      <div className="hero-scanline-effect" />

      <div className="hero-top-row">
        <div className="hero-salutation">
          <div className="or-badge-chip">
            <Radio size={13} className="text-cyan animate-pulse" />
            <span>OR-01 · SURGICAL INTELLIGENCE CENTER</span>
          </div>
          <h1 className="doctor-salutation-text">{getGreeting()}</h1>
        </div>

        <div className="hero-telemetry-status">
          <div className="status-item font-mono">
            <span className="status-dot dot-online" />
            <span>AI ENGINE ● {backendOnline ? "ONLINE" : "READY"}</span>
          </div>
          <div className="status-item font-mono">
            <span className="status-dot dot-stable" />
            <span>MONITOR ● CONNECTED</span>
          </div>
          <div className="status-item font-mono">
            <span className="status-dot dot-online" />
            <span>VOICE ● READY</span>
          </div>
        </div>
      </div>

      <div className="hero-metrics-strip">
        <div className="hero-metric-tile">
          <span className="hero-metric-label">CURRENT PROCEDURE</span>
          <div className="hero-metric-val-wrap">
            <Stethoscope size={16} className="text-cyan" />
            <span className="hero-metric-val text-cyan">
              {patient?.procedure?.toUpperCase() || "APPENDECTOMY"}
            </span>
          </div>
          <span className="hero-metric-sub">LAPAROSCOPIC · GENERAL SURGERY</span>
        </div>

        <div className="hero-metric-tile">
          <span className="hero-metric-label">ACTIVE PATIENT</span>
          <div className="hero-metric-val-wrap">
            <User size={16} className="text-purple" />
            <span className="hero-metric-val font-mono">
              {patient?.id || "P001"} · {patient?.name || "Test Patient"}
            </span>
          </div>
          <span className="hero-metric-sub">{patient?.age || 45}Y · {patient?.gender?.toUpperCase() || "MALE"} · {patient?.bloodGroup || "O+"}</span>
        </div>

        <div className="hero-metric-tile">
          <span className="hero-metric-label">SURGICAL STATUS</span>
          <div className="hero-metric-val-wrap">
            <span className="pulse-dot-emerald" />
            <span className="hero-metric-val text-emerald">
              ● {patient?.surgicalStatus || "IN PROGRESS"}
            </span>
          </div>
          <span className="hero-metric-sub">ANESTHESIA STABLE · DEPTH 42 BIS</span>
        </div>

        <div className="hero-metric-tile">
          <span className="hero-metric-label">PROCEDURE ELAPSED</span>
          <div className="hero-metric-val-wrap">
            <Clock size={16} className="text-cyan" />
            <span className="hero-metric-val font-mono text-cyan">
              {elapsedString || "01:42:18"}
            </span>
          </div>
          <span className="hero-metric-sub">START: {patient?.startTime || "07:30 AM"}</span>
        </div>
      </div>
    </div>
  );
}

export default HeroCommandBar;
