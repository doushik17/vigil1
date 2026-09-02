import React from "react";
import { FileText, Sparkles, ChevronRight, Activity, Image as ImageIcon } from "lucide-react";

export function ReportCard({ report, isSelected = false, onSelect, onAskAI }) {
  const isImaging = report.type === "MRI" || report.type === "CT" || report.type === "XRAY";

  return (
    <div
      className={`report-item-card ${isSelected ? "report-item-selected" : ""}`}
      onClick={() => onSelect && onSelect(report)}
    >
      <div className="report-item-icon">
        {isImaging ? (
          <ImageIcon size={20} className="text-cyan" />
        ) : (
          <FileText size={20} className="text-emerald" />
        )}
      </div>

      <div className="report-item-body">
        <div className="report-item-title-row">
          <span className="report-type-badge">{report.type}</span>
          <span className="report-date font-mono">{report.date}</span>
        </div>
        <h4 className="report-item-name">{report.title}</h4>
        <p className="report-item-sub">
          {report.patientName} · {report.modality}
        </p>
      </div>

      <div className="report-item-actions">
        {onAskAI && (
          <button
            className="btn-report-ai-ask"
            onClick={(e) => {
              e.stopPropagation();
              onAskAI(`Show me the ${report.type} report for patient ${report.patientId}`);
            }}
            title="Ask VIGIL AI about this document"
          >
            <Sparkles size={13} />
            <span>ASK AI</span>
          </button>
        )}
        <ChevronRight size={16} className="arrow-icon" />
      </div>
    </div>
  );
}

export default ReportCard;
