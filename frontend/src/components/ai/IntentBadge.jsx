import React from "react";
import { User, Activity, ClipboardCheck, FileSearch, HelpCircle, AlertTriangle } from "lucide-react";

export function IntentBadge({ intent = "general", size = "normal" }) {
  const normalized = (intent || "general").toLowerCase();

  const configs = {
    patient: {
      label: "PATIENT RECORD",
      icon: User,
      className: "intent-badge-patient",
    },
    monitoring: {
      label: "VITALS MONITOR",
      icon: Activity,
      className: "intent-badge-monitoring",
    },
    checklist: {
      label: "SURGICAL CHECKLIST",
      icon: ClipboardCheck,
      className: "intent-badge-checklist",
    },
    rag: {
      label: "MEDICAL RAG / DOCS",
      icon: FileSearch,
      className: "intent-badge-rag",
    },
    general: {
      label: "OR ASSISTANT",
      icon: HelpCircle,
      className: "intent-badge-general",
    },
    error: {
      label: "BACKEND ERROR",
      icon: AlertTriangle,
      className: "intent-badge-error",
    },
  };

  const config = configs[normalized] || configs.general;
  const Icon = config.icon;

  return (
    <span className={`intent-badge ${config.className} ${size === "small" ? "intent-badge-sm" : ""}`}>
      <Icon size={size === "small" ? 11 : 13} strokeWidth={2.2} />
      <span>{config.label}</span>
    </span>
  );
}

export default IntentBadge;
