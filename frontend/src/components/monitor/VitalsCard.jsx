import React from "react";
import { HeartPulse, Activity, Wind, Thermometer, ShieldCheck } from "lucide-react";

export function VitalsCard({
  icon,
  label,
  title,
  value,
  unit = "",
  status = "NORMAL",
  range = "",
  trend = "stable",
  color = "cyan", // cyan | emerald | amber | purple
  className = "",
}) {
  const displayLabel = label || title || "Vital";
  const isNormal = status === "NORMAL";

  return (
    <div className={`vital-command-card vital-color-${color} ${className}`}>
      <div className="vital-card-top">
        <div className="vital-icon-container">
          {icon}
        </div>
        <div className="vital-status-tag">
          <span className={`status-indicator-dot ${isNormal ? "dot-stable" : "dot-warning"}`} />
          <span className="status-indicator-text">{status}</span>
        </div>
      </div>

      <div className="vital-card-main">
        <span className="vital-label">{displayLabel}</span>
        <div className="vital-value-wrap">
          <span className="vital-number">{value}</span>
          {unit && <span className="vital-unit">{unit}</span>}
        </div>
      </div>

      <div className="vital-card-bottom">
        {range && (
          <span className="vital-range-text">
            TARGET: <b className="text-dim">{range}</b>
          </span>
        )}
        <span className="vital-trend-badge">{trend === "stable" ? "● STABLE" : trend.toUpperCase()}</span>
      </div>
    </div>
  );
}

export default VitalsCard;
