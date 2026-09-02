import React, { useState } from "react";
import ECGMonitor from "../components/monitor/ECGMonitor";
import {
  Activity,
  HeartPulse,
  Wind,
  Thermometer,
  Radio,
  Maximize2,
  Minimize2,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export function MonitorPage({ vitals }) {
  const [telemetryMode, setTelemetryMode] = useState("SIMULATED"); // SIMULATED | HARDWARE
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentVitals = vitals || {
    heartRate: 72,
    spo2: 98,
    bp: "120/80",
    map: 93,
    respiratoryRate: 16,
    temperature: 36.8,
    etco2: 38,
  };

  const hrStatus = currentVitals.heartRate > 100 || currentVitals.heartRate < 50 ? "WARNING" : "NORMAL";
  const spo2Status = currentVitals.spo2 < 95 ? "CRITICAL" : "NORMAL";
  const bpStatus = "NORMAL";
  const respStatus = "NORMAL";
  const tempStatus = "NORMAL";
  const etco2Status = "NORMAL";

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`monitor-station-page ${isFullscreen ? "station-fullscreen" : ""}`}>
      {/* 1. Header Toolbar */}
      <div className="monitor-top-toolbar">
        <div className="toolbar-left">
          <div className="telemetry-badge font-mono">
            <Radio size={14} className="text-emerald" />
            <span>OR-01 TELEMETRY STATION</span>
          </div>
          <span className="lead-indicator font-mono text-dim">
            LEAD II · DUAL MULTI-CHANNEL
          </span>
        </div>

        <div className="toolbar-right font-mono">
          <div className="mode-toggle-group">
            <button
              className={`btn-mode-toggle ${telemetryMode === "SIMULATED" ? "active" : ""}`}
              onClick={() => setTelemetryMode("SIMULATED")}
            >
              SIMULATED NSR
            </button>
            <button
              className={`btn-mode-toggle ${telemetryMode === "HARDWARE" ? "active" : ""}`}
              onClick={() => setTelemetryMode("HARDWARE")}
            >
              HARDWARE FEED
            </button>
          </div>

          <button className="btn-fullscreen-toggle" onClick={toggleFullscreen} title="Fullscreen Station">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* 2. Main Monitoring Grid (Waveforms on left, Big Numerics on right) */}
      <div className="monitor-layout-grid">
        {/* Left: Waveforms Column */}
        <div className="waveforms-main-column">
          {/* Primary Lead II ECG */}
          <div className="waveform-panel">
            <ECGMonitor heartRate={currentVitals.heartRate} lead="Lead II (Primary)" height={210} />
          </div>

          {/* Secondary Plethysmography & Capnography */}
          <div className="secondary-waveforms-grid">
            {/* SpO2 Plethysmograph Wave */}
            <div className="secondary-wave-card">
              <div className="wave-mini-header font-mono">
                <span className="text-cyan">PLETH · SpO2 PULSE WAVE</span>
                <span className="text-cyan font-bold">{currentVitals.spo2}%</span>
              </div>
              <div className="mini-wave-canvas-holder">
                <svg viewBox="0 0 400 70" className="mini-wave-svg" preserveAspectRatio="none">
                  <path
                    d="M 0,45 Q 15,45 25,12 Q 30,8 35,28 Q 42,22 55,45 Q 75,45 90,45 Q 105,45 115,12 Q 120,8 125,28 Q 132,22 145,45 Q 165,45 180,45 Q 195,45 205,12 Q 210,8 215,28 Q 222,22 235,45 Q 255,45 270,45 Q 285,45 295,12 Q 300,8 305,28 Q 312,22 325,45 Q 345,45 360,45 Q 375,45 385,12 Q 390,8 395,28 L 400,45"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Capnography EtCO2 Wave */}
            <div className="secondary-wave-card">
              <div className="wave-mini-header font-mono">
                <span className="text-amber">CAPNOGRAPHY · EtCO2</span>
                <span className="text-amber font-bold">{currentVitals.etco2 || 38} mmHg</span>
              </div>
              <div className="mini-wave-canvas-holder">
                <svg viewBox="0 0 400 70" className="mini-wave-svg" preserveAspectRatio="none">
                  <path
                    d="M 0,55 L 20,55 L 25,18 L 65,15 L 70,55 L 110,55 L 115,18 L 155,15 L 160,55 L 200,55 L 205,18 L 245,15 L 250,55 L 290,55 L 295,18 L 335,15 L 340,55 L 380,55 L 385,18 L 400,18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Large Telemetry Numerics Column */}
        <div className="numerics-sidebar-column">
          {/* HR Tile */}
          <div className="numeric-vital-tile">
            <div className="tile-top font-mono">
              <span className="tile-label text-emerald">HEART RATE</span>
              <span className={`status-tag status-${hrStatus.toLowerCase()}`}>{hrStatus}</span>
            </div>
            <div className="tile-value-wrap font-mono">
              <span className="value-huge text-emerald">{currentVitals.heartRate}</span>
              <span className="value-unit">BPM</span>
            </div>
          </div>

          {/* SpO2 Tile */}
          <div className="numeric-vital-tile">
            <div className="tile-top font-mono">
              <span className="tile-label text-cyan">OXYGEN SAT (SpO2)</span>
              <span className={`status-tag status-${spo2Status.toLowerCase()}`}>{spo2Status}</span>
            </div>
            <div className="tile-value-wrap font-mono">
              <span className="value-huge text-cyan">{currentVitals.spo2}</span>
              <span className="value-unit">%</span>
            </div>
          </div>

          {/* Blood Pressure Tile */}
          <div className="numeric-vital-tile">
            <div className="tile-top font-mono">
              <span className="tile-label text-amber">NIBP / MAP</span>
              <span className={`status-tag status-${bpStatus.toLowerCase()}`}>{bpStatus}</span>
            </div>
            <div className="tile-value-wrap font-mono">
              <span className="value-large text-amber">{currentVitals.bp}</span>
              <span className="value-unit">({currentVitals.map || 93}) mmHg</span>
            </div>
          </div>

          {/* Respiratory Rate & Temperature Dual Tile */}
          <div className="numeric-dual-tile">
            <div className="sub-tile font-mono">
              <span className="tile-label text-purple">RESP RATE</span>
              <div className="sub-val text-purple">
                <span>{currentVitals.respiratoryRate}</span>
                <span className="unit">/min</span>
              </div>
            </div>
            <div className="sub-tile font-mono">
              <span className="tile-label text-sky">CORE TEMP</span>
              <div className="sub-val text-sky">
                <span>{currentVitals.temperature}</span>
                <span className="unit">°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitorPage;
