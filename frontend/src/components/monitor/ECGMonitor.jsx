import React, { useRef, useEffect, useState } from "react";
import { Activity, Play, Pause } from "lucide-react";

export function ECGMonitor({
  heartRate = 72,
  lead = "Lead II",
  height = 160,
  showControls = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const animationFrameRef = useRef(null);
  const xPosRef = useRef(0);
  const dataPointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");

    let width = container.clientWidth || 600;
    const canvasHeight = height || 160;
    const midY = canvasHeight / 2;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    dataPointsRef.current = new Array(Math.ceil(width)).fill(midY);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = Math.floor(entry.contentRect.width);
        if (width > 0) {
          canvas.width = width * dpr;
          canvas.height = canvasHeight * dpr;
          ctx.scale(dpr, dpr);
          dataPointsRef.current = new Array(Math.ceil(width)).fill(midY);
          xPosRef.current = 0;
        }
      }
    });

    resizeObserver.observe(container);

    // Physiological P-Q-R-S-T wave calculation
    const getECGValue = (phase) => {
      if (phase >= 0.05 && phase < 0.15) {
        const pPhase = (phase - 0.05) / 0.1;
        return -Math.sin(pPhase * Math.PI) * 9;
      } else if (phase >= 0.20 && phase < 0.23) {
        const qPhase = (phase - 0.20) / 0.03;
        return Math.sin(qPhase * Math.PI) * 6;
      } else if (phase >= 0.23 && phase < 0.30) {
        const rPhase = (phase - 0.23) / 0.07;
        return -Math.sin(rPhase * Math.PI) * 48;
      } else if (phase >= 0.30 && phase < 0.34) {
        const sPhase = (phase - 0.30) / 0.04;
        return Math.sin(sPhase * Math.PI) * 16;
      } else if (phase >= 0.45 && phase < 0.65) {
        const tPhase = (phase - 0.45) / 0.2;
        return -Math.sin(tPhase * Math.PI) * 14;
      }
      return 0;
    };

    let beatProgress = 0;
    const beatsPerSec = (heartRate || 72) / 60;

    const render = () => {
      if (!isRunning) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = "#060a0d";
      ctx.fillRect(0, 0, width, canvasHeight);

      // Minor grid
      ctx.strokeStyle = "rgba(16, 185, 129, 0.07)";
      ctx.lineWidth = 0.5;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid
      ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
      ctx.lineWidth = 0.8;
      const majorGrid = gridSize * 5;
      for (let x = 0; x < width; x += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvasHeight; y += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const step = speed;
      const prevX = xPosRef.current;
      xPosRef.current = (xPosRef.current + step) % width;

      beatProgress = (beatProgress + (step / (width * 0.75)) * (beatsPerSec / 1.2)) % 1;
      const ecgVal = midY + getECGValue(beatProgress);

      for (let i = 0; i < step; i++) {
        const currentPlotX = Math.floor((prevX + i) % width);
        dataPointsRef.current[currentPlotX] = ecgVal;
      }

      // Clear beam gap
      const clearGap = 20;
      for (let g = 0; g < clearGap; g++) {
        const gapX = Math.floor((xPosRef.current + g) % width);
        dataPointsRef.current[gapX] = null;
      }

      // Draw green phosphor ECG trace
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#10b981";
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      let isDrawing = false;
      for (let x = 0; x < width; x++) {
        const y = dataPointsRef.current[x];
        if (y === null || y === undefined) {
          isDrawing = false;
          continue;
        }
        if (!isDrawing) {
          ctx.moveTo(x, y);
          isDrawing = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Bright sweep head
      const beamX = xPosRef.current;
      const beamY = dataPointsRef.current[Math.floor(beamX)] || midY;
      ctx.beginPath();
      ctx.arc(beamX, beamY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [heartRate, isRunning, speed, height]);

  return (
    <div ref={containerRef} className={`ecg-monitor-responsive ${className}`}>
      <div className="ecg-strip-header">
        <div className="lead-tag font-mono">
          <Activity size={14} className="text-emerald" />
          <span>ECG · {lead}</span>
          <span className="live-dot-green" />
        </div>

        <div className="ecg-stats-right font-mono">
          <span className="hr-number text-emerald font-bold">{heartRate}</span>
          <span className="hr-label">BPM (NSR)</span>
          {showControls && (
            <button
              className="btn-ecg-pause"
              onClick={() => setIsRunning((r) => !r)}
              title={isRunning ? "Pause" : "Resume"}
            >
              {isRunning ? <Pause size={12} /> : <Play size={12} />}
            </button>
          )}
        </div>
      </div>

      <div className="ecg-canvas-holder" style={{ height: `${height}px` }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px`, display: "block" }} />
      </div>
    </div>
  );
}

export default ECGMonitor;
