import React, { useState } from "react";
import MedicalImageViewer from "../components/reports/MedicalImageViewer";
import { medicalReports } from "../data";
import { FileText, CheckCircle2 } from "lucide-react";

export function ReportsPage({ selectedPatient, handleAskAI }) {
  const [activeTab, setActiveTab] = useState("MRI");

  const tabs = [
    { key: "MRI", label: "MRI" },
    { key: "CT", label: "CT" },
    { key: "LABS", label: "LABS" },
    { key: "DOCUMENTS", label: "DOCUMENTS" },
  ];

  // Map active tab to report
  const getActiveReport = () => {
    if (activeTab === "MRI") return medicalReports.find((r) => r.type === "MRI") || medicalReports[0];
    if (activeTab === "CT") return medicalReports.find((r) => r.type === "CT") || medicalReports[1];
    if (activeTab === "LABS") return medicalReports.find((r) => r.type === "LABS") || medicalReports[2];
    return medicalReports.find((r) => r.type === "OTHER") || medicalReports[3];
  };

  const currentReport = getActiveReport();

  return (
    <div className="reports-clean-workspace">
      {/* 1. Modality Segmented Navigation Bar */}
      <div className="reports-top-bar">
        <div className="segmented-tabs-wrapper font-mono">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`segmented-tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Large Full-Workspace Image / Document Viewer */}
      <div className="reports-viewer-container">
        <MedicalImageViewer
          report={currentReport}
          patient={selectedPatient}
          onAskAI={handleAskAI}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* 3. Concise Clinical Findings Summary Card */}
      {currentReport && (
        <div className="report-clinical-summary-card">
          <div className="summary-header">
            <div className="summary-title-wrap">
              <FileText size={16} className="text-cyan" />
              <h3 className="summary-title font-mono">{currentReport.title}</h3>
            </div>
            <span className="summary-date font-mono text-dim">{currentReport.date}</span>
          </div>

          <div className="summary-body font-mono">
            <div className="summary-findings">
              <span className="summary-kicker">KEY FINDINGS:</span>
              <pre className="summary-pre">{currentReport.findings}</pre>
            </div>
            <div className="summary-impression">
              <span className="summary-kicker text-cyan">RADIOLOGICAL IMPRESSION:</span>
              <p className="impression-text">{currentReport.conclusion}</p>
            </div>
          </div>

          <div className="summary-footer font-mono">
            <span>AUTHENTICATED BY: <b>{currentReport.radiologist}</b></span>
            <span className="verified-pill">
              <CheckCircle2 size={13} className="text-emerald" />
              PACS ARCHIVED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
