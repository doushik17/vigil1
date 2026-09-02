import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Hand,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  Move,
  Check,
} from "lucide-react";

export function MedicalImageViewer({
  report,
  patient,
  onAskAI,
  activeTab = "MRI",
  onTabChange,
  className = "",
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [sliceIndex, setSliceIndex] = useState(16);
  const [invert, setInvert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchlessActive, setTouchlessActive] = useState(true);
  const [lastActionFeedback, setLastActionFeedback] = useState("");

  const containerRef = useRef(null);
  const totalSlices = 32;

  // Zoom and pan functions (exposed for UI, Voice, and Touchless Gestures)
  const handleZoomIn = useCallback(() => {
    setZoom((z) => {
      const next = Math.min(3.5, Number((z + 0.25).toFixed(2)));
      showFeedback(`ZOOM ${Math.round(next * 100)}%`);
      return next;
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(0.6, Number((z - 0.25).toFixed(2)));
      showFeedback(`ZOOM ${Math.round(next * 100)}%`);
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setInvert(false);
    showFeedback("VIEW RESET");
  }, []);

  const handleNextSlice = useCallback(() => {
    setSliceIndex((s) => {
      const next = Math.min(totalSlices, s + 1);
      showFeedback(`SLICE ${next}/${totalSlices}`);
      return next;
    });
  }, [totalSlices]);

  const handlePrevSlice = useCallback(() => {
    setSliceIndex((s) => {
      const next = Math.max(1, s - 1);
      showFeedback(`SLICE ${next}/${totalSlices}`);
      return next;
    });
  }, []);

  const showFeedback = (text) => {
    setLastActionFeedback(text);
    setTimeout(() => setLastActionFeedback(""), 1600);
  };

  // Mouse pan handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const isImaging = activeTab === "MRI" || activeTab === "CT";

  return (
    <div
      ref={containerRef}
      className={`large-dicom-workspace ${isFullscreen ? "viewer-fullscreen" : ""} ${className}`}
    >
      {/* 1. Unobtrusive Header Strip */}
      <div className="dicom-header-strip">
        <div className="header-left-meta">
          <span className="modality-badge font-mono">{activeTab} SCAN</span>
          <span className="study-desc font-mono">
            {report?.title || `${activeTab} Scan Study`}
          </span>
          {isImaging && (
            <span className="slice-tag font-mono">
              SLICE {sliceIndex} OF {totalSlices}
            </span>
          )}
        </div>

        {/* Small Unobtrusive Touchless Control Indicator */}
        <div className="header-right-meta">
          <div className="touchless-indicator-pill font-mono">
            <span className="pulse-dot-cyan" />
            <Hand size={13} className="text-cyan" />
            <span>TOUCHLESS CONTROL: {touchlessActive ? "ACTIVE" : "STANDBY"}</span>
          </div>

          {onAskAI && (
            <button
              className="btn-ai-analyze font-mono"
              onClick={() => onAskAI(`Show me the ${activeTab} report for patient ${patient?.id || "P001"}`)}
            >
              <Sparkles size={13} className="text-cyan" />
              <span>AI SCAN AUDIT</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Large Image Viewport */}
      {isImaging ? (
        <div
          className="large-scan-viewport"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* DICOM Overlay Top Left */}
          <div className="dicom-overlay top-left font-mono">
            <p className="highlight">PATIENT: {patient?.name || "Test Patient"} ({patient?.id || "P001"})</p>
            <p>AGE / SEX: {patient?.age || 45}Y / {patient?.gender || "M"}</p>
            <p>STUDY: {activeTab === "MRI" ? "MRI 3.0T AXIAL T2" : "128-MDCT ABDOMINOPELVIC"}</p>
          </div>

          {/* DICOM Overlay Top Right */}
          <div className="dicom-overlay top-right font-mono">
            <p className="highlight">OR-01 SURGICAL PACS</p>
            <p>THICKNESS: 2.0 mm</p>
            <p>MATRIX: 512 x 512</p>
          </div>

          {/* Temporary Action Feedback Toast */}
          {lastActionFeedback && (
            <div className="action-feedback-toast font-mono">
              <span>{lastActionFeedback}</span>
            </div>
          )}

          {/* Transformed Medical Scan Anatomy SVG */}
          <div
            className="anatomical-scan-container"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              filter: invert ? "invert(1)" : "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <svg viewBox="0 0 500 500" className="anatomical-scan-svg">
              <defs>
                <radialGradient id="fieldGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.7" />
                  <stop offset="80%" stopColor="#0a121a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#020406" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* FOV Circle */}
              <circle cx="250" cy="250" r="235" fill="url(#fieldGlow)" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />

              {/* Body Contour Outline */}
              <path
                d="M 120,200 C 110,320 180,410 250,420 C 320,410 390,320 380,200 C 375,130 325,100 250,100 C 175,100 125,130 120,200 Z"
                fill="#0b131a"
                stroke="#0284c7"
                strokeWidth="1.8"
                opacity="0.9"
              />

              {/* Subcutaneous fat/muscular margin */}
              <path
                d="M 135,205 C 128,305 190,395 250,405 C 310,395 372,305 365,205 C 360,145 315,118 250,118 C 185,118 140,145 135,205 Z"
                fill="none"
                stroke="#475569"
                strokeWidth="4"
                opacity="0.5"
              />

              {/* Posterior Vertebral Body / Spine */}
              <ellipse cx="250" cy="350" rx="36" ry="26" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="250" cy="350" r="11" fill="#020617" />
              <polygon points="250,376 238,402 262,402" fill="#94a3b8" />
              <polygon points="214,350 190,362 216,368" fill="#64748b" />
              <polygon points="286,350 310,362 284,368" fill="#64748b" />

              {/* Major Vessels: Aorta & IVC */}
              <circle cx="236" cy="315" r="9" fill="#ef4444" opacity="0.85" />
              <circle cx="264" cy="315" r="11" fill="#0284c7" opacity="0.85" />

              {/* Cecum / Small bowel */}
              <ellipse cx="185" cy="240" rx="42" ry="50" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" opacity="0.8" />

              {/* Primary Pathology: Dilated Appendix with Caliper */}
              <g className="pathology-highlight">
                <path
                  d="M 180,265 Q 160,290 145,310"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="310" r="12" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="95" y="340" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  APPENDIX: 9.8mm [INFLAMED]
                </text>
              </g>

              {/* Crosshair scale */}
              <line x1="250" y1="30" x2="250" y2="470" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1="250" x2="470" y2="250" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>
      ) : (
        /* Laboratory / Pathology Structured Text Document View */
        <div className="large-document-viewport">
          <div className="document-paper-sheet">
            <div className="doc-header">
              <h3 className="doc-title">{report?.title || "Clinical Laboratory Report"}</h3>
              <p className="doc-sub font-mono">PATIENT: {patient?.name} ({patient?.id}) · AUTHENTICATED REPORT</p>
            </div>
            <div className="doc-content font-mono">
              <pre>{report?.findings}</pre>
            </div>
            <div className="doc-conclusion">
              <strong>IMPRESSION / INTERPRETATION:</strong>
              <p>{report?.conclusion}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Bottom Control Toolbar (Only for Imaging) */}
      {isImaging && (
        <div className="dicom-floating-toolbar">
          {/* Slice Navigation */}
          <div className="toolbar-group slice-nav-group">
            <button className="btn-tool" onClick={handlePrevSlice} disabled={sliceIndex <= 1} title="Previous Slice">
              <ChevronLeft size={16} />
            </button>
            <input
              type="range"
              min="1"
              max={totalSlices}
              value={sliceIndex}
              onChange={(e) => setSliceIndex(Number(e.target.value))}
              className="slice-slider"
            />
            <button className="btn-tool" onClick={handleNextSlice} disabled={sliceIndex >= totalSlices} title="Next Slice">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="toolbar-sep" />

          {/* Zoom Controls */}
          <div className="toolbar-group zoom-group font-mono">
            <button className="btn-tool" onClick={handleZoomOut} title="Zoom Out (-)">
              <ZoomOut size={16} />
            </button>
            <span className="zoom-val">{Math.round(zoom * 100)}%</span>
            <button className="btn-tool" onClick={handleZoomIn} title="Zoom In (+)">
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="toolbar-sep" />

          {/* Action Tools */}
          <div className="toolbar-group action-tools-group">
            <button className="btn-tool" onClick={handleResetZoom} title="Reset Zoom & Pan">
              <RotateCcw size={16} />
            </button>
            <button
              className={`btn-tool ${invert ? "active" : ""}`}
              onClick={() => setInvert((i) => !i)}
              title="Invert Window Levels"
            >
              {invert ? <EyeOff size={16} className="text-cyan" /> : <Eye size={16} />}
            </button>
            <button className="btn-tool" onClick={toggleFullscreen} title="Toggle Fullscreen">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <div className="toolbar-sep" />

          {/* Touchless Gesture Test Chips */}
          <div className="toolbar-group gesture-trigger-chips font-mono">
            <span className="gesture-label">GESTURE:</span>
            <button className="btn-gesture-chip" onClick={handleZoomIn}>🤏 ZOOM +</button>
            <button className="btn-gesture-chip" onClick={handleZoomOut}>✋ ZOOM -</button>
            <button className="btn-gesture-chip" onClick={handleNextSlice}>👉 NEXT</button>
            <button className="btn-gesture-chip" onClick={handleResetZoom}>🖐 RESET</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalImageViewer;
