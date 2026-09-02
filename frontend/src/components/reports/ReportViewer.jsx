import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  Search,
} from "lucide-react";
import MedicalImageViewer from "./MedicalImageViewer";
import ReportCard from "./ReportCard";
import { medicalReports } from "../../data";

export function ReportViewer({ patient, onAskAI, className = "" }) {
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedReportId, setSelectedReportId] = useState(medicalReports[0]?.id);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredReports = medicalReports.filter((r) => {
    const matchesType = selectedType === "ALL" || r.type === selectedType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.findings.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activeReport =
    medicalReports.find((r) => r.id === selectedReportId) || medicalReports[0];

  return (
    <div className={`reports-workspace-layout ${className}`}>
      {/* Left Column: Report Navigation & List */}
      <div className="reports-sidebar-column">
        {/* Modality Filter Tabs */}
        <div className="report-tabs-bar">
          {["ALL", "MRI", "CT", "LABS", "OTHER"].map((tab) => (
            <button
              key={tab}
              className={`report-tab-btn ${selectedType === tab ? "active" : ""}`}
              onClick={() => setSelectedType(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="report-search-box">
          <Search size={14} className="text-dim" />
          <input
            type="text"
            placeholder="Filter scans & reports..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Report Cards List */}
        <div className="report-items-list">
          {filteredReports.map((rep) => (
            <ReportCard
              key={rep.id}
              report={rep}
              isSelected={rep.id === activeReport?.id}
              onSelect={(r) => setSelectedReportId(r.id)}
              onAskAI={onAskAI}
            />
          ))}

          {filteredReports.length === 0 && (
            <div className="no-reports-placeholder">
              <FileText size={28} className="text-dim" />
              <p>No matching reports found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Scan Viewer & Clinical Findings */}
      <div className="reports-main-viewer-column">
        {activeReport ? (
          <>
            {/* DICOM Viewer with Member 4 Gesture Zoom */}
            <MedicalImageViewer
              report={activeReport}
              patient={patient}
              onAskAI={onAskAI}
            />

            {/* Detailed Clinical Findings Card */}
            <div className="report-findings-card">
              <div className="findings-header">
                <div className="findings-title-wrap">
                  <FileText size={18} className="text-cyan" />
                  <div>
                    <h3>CLINICAL INTERPRETATION & FINDINGS</h3>
                    <p className="findings-sub font-mono">
                      REPORT ID: {activeReport.id} · {activeReport.modality}
                    </p>
                  </div>
                </div>

                {onAskAI && (
                  <button
                    className="btn-ask-vigil-findings"
                    onClick={() =>
                      onAskAI(
                        `Explain the clinical findings for ${activeReport.title} of patient ${
                          patient?.id || "P001"
                        }`
                      )
                    }
                  >
                    <Sparkles size={14} />
                    <span>ASK VIGIL AI TO SUMMARIZE</span>
                  </button>
                )}
              </div>

              <div className="findings-body">
                <div className="findings-section">
                  <h4 className="section-label">OBSERVATIONS & MEASUREMENTS</h4>
                  <div className="findings-text-box">
                    <pre className="findings-pre">{activeReport.findings}</pre>
                  </div>
                </div>

                <div className="findings-section conclusion-box">
                  <h4 className="section-label text-cyan">RADIOLOGICAL IMPRESSION</h4>
                  <p className="conclusion-text">{activeReport.conclusion}</p>
                </div>
              </div>

              <div className="findings-footer">
                <span className="radiologist-signature">
                  AUTHENTICATED BY: <b>{activeReport.radiologist}</b>
                </span>
                <span className="sign-off-badge">
                  <CheckCircle2 size={13} className="text-emerald" />
                  PACS VERIFIED & ARCHIVED
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="no-report-selected">
            <p>Select a report or scan from the list to view</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportViewer;
