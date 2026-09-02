import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";
import ECGMonitor from "./ECGMonitor";
import VitalsStrip from "./VitalsStrip";

export function MultiWaveformView({ vitals, onToggleMute, className = "" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(true);
  const containerRef = useRef(null);

  const plethCanvasRef = useRef(null);
  const respCanvasRef = useRef(null);

  // Plethysmography & Respiration waveforms rendering
  useEffect(() => {
    const plethCanvas = plethCanvasRef.current;
    const respCanvas = respCanvasRef.current;
    if (!plethCanvas || !respCanvas) return;

    const plethCtx = plethCanvas.getContext("2d");
    const respCtx = respCanvas.getContext("2d");

    let animId;
    let plethX = 0;
    let respX = 0;
    const width = 600;
    const pHeight = 80;
    const rHeight = 80;

    const plethBuffer = new Array(width).fill(pHeight / 2);
    const respBuffer = new Array(width).fill(rHeight / 2);

    let phase = 0;

    const render = () => {
      phase += 0.04;

      // Draw Pleth wave (dicrotic notch pulse)
      plethCtx.fillStyle = "#070c0e";
      plethCtx.fillRect(0, 0, width, pHeight);

      // Grid
      plethCtx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      plethCtx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 30) {
        plethCtx.beginPath();
        plethCtx.moveTo(x, 0);
        plethCtx.lineTo(x, pHeight);
        plethCtx.stroke();
      }

      plethX = (plethX + 2) % width;
      const plethCycle = (phase * 1.2) % (Math.PI * 2);
      const plethVal =
        pHeight / 2 -
        Math.sin(plethCycle) * 22 -
        (Math.sin(plethCycle * 2) > 0 ? Math.sin(plethCycle * 2) * 8 : 0);

      plethBuffer[plethX] = plethVal;
      plethBuffer[(plethX + 1) % width] = plethVal;

      // Clear gap
      for (let g = 0; g < 16; g++) {
        plethBuffer[(plethX + g) % width] = null;
      }

      plethCtx.strokeStyle = "#06b6d4";
      plethCtx.lineWidth = 2;
      plethCtx.shadowColor = "#06b6d4";
      plethCtx.shadowBlur = 6;
      plethCtx.beginPath();
      let pDraw = false;
      for (let x = 0; x < width; x++) {
        const y = plethBuffer[x];
        if (y === null) {
          pDraw = false;
          continue;
        }
        if (!pDraw) {
          plethCtx.moveTo(x, y);
          pDraw = true;
        } else {
          plethCtx.lineTo(x, y);
        }
      }
      plethCtx.stroke();
      plethCtx.shadowBlur = 0;

      // Draw Respiration / Capnography waveform
      respCtx.fillStyle = "#070c0e";
      respCtx.fillRect(0, 0, width, rHeight);

      respX = (respX + 1.5) % width;
      const respCycle = (phase * 0.4) % (Math.PI * 2);
      // Square-ish capnography alveolar plateau curve
      const sinResp = Math.sin(respCycle);
      const respVal = rHeight / 2 - Math.tanh(sinResp * 2.5) * 24;

      respBuffer[Math.floor(respX)] = respVal;
      for (let g = 0; g < 14; g++) {
        respBuffer[(Math.floor(respX) + g) % width] = null;
      }

      respCtx.strokeStyle = "#eab308";
      respCtx.lineWidth = 2;
      respCtx.shadowColor = "#eab308";
      respCtx.shadowBlur = 5;
      respCtx.beginPath();
      let rDraw = false;
      for (let x = 0; x < width; x++) {
        const y = respBuffer[x];
        if (y === null) {
          rDraw = false;
          continue;
        }
        if (!rDraw) {
          respCtx.moveTo(x, y);
          rDraw = true;
        } else {
          respCtx.lineTo(x, y);
        }
      }
      respCtx.stroke();
      respCtx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`multi-waveform-monitor-container ${isFullscreen ? "fullscreen-monitor" : ""} ${className}`}
    >
      {/* Top Monitor Bar */}
      <div className="monitor-top-bar">
        <div className="monitor-brand-tag">
          <Radio size={16} className="text-emerald" />
          <span className="monitor-title">VIGIL-OR CLINICAL MULTI-PARAMETER STATION</span>
          <span className="monitor-badge-live">
            <span className="live-dot" />
            ONLINE · BED 01
          </span>
        </div>

        <div className="monitor-top-controls">
          <button
            className={`btn-monitor-toggle ${isSimulated ? "btn-active" : ""}`}
            onClick={() => setIsSimulated((s) => !s)}
            title="Toggle between real telemetry hook & demo physiological engine"
          >
            {isSimulated ? "PHYSIO ENGINE (DEMO)" : "TELEMETRY HOOK (MEMBER 4)"}
          </button>

          <button
            className="btn-monitor-icon"
            onClick={onToggleMute}
            title={vitals.isMuted ? "Unmute Monitor Audio" : "Mute Monitor Audio"}
          >
            {vitals.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-emerald" />}
          </button>

          <button
            className="btn-monitor-icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Monitor Display"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Waveforms & Numerics Grid */}
      <div className="monitor-grid-layout">
        <div className="monitor-waveforms-column">
          {/* Waveform 1: ECG Lead II */}
          <div className="waveform-box">
            <ECGMonitor heartRate={vitals.heartRate} lead="Lead II" height={130} />
          </div>

          {/* Waveform 2: Plethysmography (SpO2) */}
          <div className="waveform-box">
            <div className="waveform-box-header">
              <div className="wave-label-wrap">
                <span className="wave-lead-name text-cyan">Pleth · SpO2</span>
                <span className="wave-tag">PULSE OXIMETRY</span>
              </div>
              <div className="wave-num-val text-cyan">
                <span>{vitals.spo2}</span>
                <span className="unit">%</span>
              </div>
            </div>
            <div className="canvas-wrapper">
              <canvas ref={plethCanvasRef} width={600} height={80} className="wave-canvas" />
            </div>
          </div>

          {/* Waveform 3: Capnography / EtCO2 */}
          <div className="waveform-box">
            <div className="waveform-box-header">
              <div className="wave-label-wrap">
                <span className="wave-lead-name text-amber">Capnography · EtCO2</span>
                <span className="wave-tag">END-TIDAL CO2</span>
              </div>
              <div className="wave-num-val text-amber">
                <span>{vitals.etco2 || 38}</span>
                <span className="unit">mmHg</span>
              </div>
            </div>
            <div className="canvas-wrapper">
              <canvas ref={respCanvasRef} width={600} height={80} className="wave-canvas" />
            </div>
          </div>
        </div>

        {/* Side Numerics Display */}
        <div className="monitor-numerics-column">
          <div className="numeric-tile tile-hr">
            <span className="num-label">HEART RATE</span>
            <div className="num-main">
              <HeartPulse size={26} className="text-emerald pulse-heart-icon" />
              <span className="num-value">{vitals.heartRate}</span>
            </div>
            <span className="num-sub">BPM · SINUS NSR</span>
          </div>

          <div className="numeric-tile tile-spo2">
            <span className="num-label">SpO2 SATURATION</span>
            <div className="num-main">
              <Activity size={26} className="text-cyan" />
              <span className="num-value">{vitals.spo2}</span>
            </div>
            <span className="num-sub">% · PLETH INDEX {vitals.perfusionIndex || 4.2}</span>
          </div>

          <div className="numeric-tile tile-nibp">
            <span className="num-label">NIBP BLOOD PRESSURE</span>
            <div className="num-main">
              <span className="num-value-bp">{vitals.bp || `${vitals.bpSystolic}/${vitals.bpDiastolic}`}</span>
            </div>
            <span className="num-sub">MAP {vitals.map || 93} mmHg (AUTO 5M)</span>
          </div>

          <div className="numeric-tile tile-resp">
            <span className="num-label">RESPIRATION</span>
            <div className="num-main">
              <span className="num-value">{vitals.respiratoryRate}</span>
            </div>
            <span className="num-sub">RPM · MECHANICAL VENT</span>
          </div>

          <div className="numeric-tile tile-temp">
            <span className="num-label">CORE TEMP</span>
            <div className="num-main">
              <span className="num-value">{vitals.temperature}</span>
            </div>
            <span className="num-sub">°C · ESOPHAGEAL PROBE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiWaveformView;
