import React from "react";
import { Activity, Radio, ChevronRight, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import ECGMonitor from "../monitor/ECGMonitor";
import VitalsStrip from "../monitor/VitalsStrip";

export function OverviewMonitoring({ vitals, className = "" }) {
  return (
    <div className={`overview-monitoring-card ${className}`}>
      <div className="card-top-bar">
        <div className="title-left">
          <Activity size={16} className="text-emerald" />
          <span className="card-title">SURGICAL TELEMETRY & ECG MONITOR</span>
          <span className="live-pill">
            <span className="live-dot" />
            LIVE · LEAD II
          </span>
        </div>

        <Link to="/monitor" className="link-monitor-station">
          <span>FULL MONITOR STATION</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Real-time ECG Waveform Canvas */}
      <div className="overview-ecg-wrapper">
        <ECGMonitor heartRate={vitals.heartRate} lead="Lead II" height={150} />
      </div>

      {/* Real-time Physiological Vitals Strip */}
      <div className="overview-vitals-wrapper">
        <VitalsStrip vitals={vitals} />
      </div>
    </div>
  );
}

export default OverviewMonitoring;
