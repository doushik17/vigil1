import React from "react";
import { Radio, CheckCircle2, AlertCircle } from "lucide-react";

export function MonitorStatus({ connected = true, telemetry = "TELEMETRY-OR01" }) {
  return (
    <div className="monitor-status-badge">
      <span className={`status-indicator-dot ${connected ? "dot-stable" : "dot-warning"}`} />
      <span className="status-badge-text">
        MONITOR {connected ? "CONNECTED" : "DISCONNECTED"}
      </span>
      {telemetry && <span className="telemetry-label">({telemetry})</span>}
    </div>
  );
}

export default MonitorStatus;
