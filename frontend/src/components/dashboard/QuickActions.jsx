import React from "react";
import {
  User,
  Activity,
  ClipboardCheck,
  FileText,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions({ className = "" }) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "VIEW PATIENT",
      sub: "Clinical Record & History",
      icon: User,
      path: "/patient",
      color: "cyan",
    },
    {
      label: "VIEW REPORTS",
      sub: "MRI, CT & Lab Findings",
      icon: FileText,
      path: "/reports",
      color: "purple",
    },
    {
      label: "LIVE MONITOR",
      sub: "Full ECG & Telemetry",
      icon: Activity,
      path: "/monitor",
      color: "emerald",
    },
    {
      label: "CHECKLIST",
      sub: "WHO Perioperative Safety",
      icon: ClipboardCheck,
      path: "/checklist",
      color: "amber",
    },
    {
      label: "ASK VIGIL AI",
      sub: "Surgical Assistant & Voice",
      icon: Sparkles,
      path: "/ai",
      color: "sky",
    },
  ];

  return (
    <div className={`quick-actions-section ${className}`}>
      <div className="section-label-bar">
        <span>QUICK CLINICAL ACTIONS</span>
      </div>

      <div className="clean-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              className={`clean-action-tile action-${act.color}`}
              onClick={() => navigate(act.path)}
            >
              <div className="action-icon-circle">
                <Icon size={18} />
              </div>
              <div className="action-text-block">
                <span className="action-primary-label">{act.label}</span>
                <span className="action-sub-label">{act.sub}</span>
              </div>
              <ChevronRight size={16} className="action-arrow-icon" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
