import React, { useState } from "react";
import { whoChecklistData } from "../data";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function ChecklistPage({ onAskAI }) {
  // Organize into 4 phases per requirement: PRE-OPERATIVE, SAFETY CHECK, PROCEDURE, POST-OPERATIVE
  const [itemsState, setItemsState] = useState(() => {
    const raw = whoChecklistData?.items || [
      { id: "pre-1", phase: "PRE-OPERATIVE", label: "Patient identity, surgical site, and procedure confirmed with patient", completed: true, required: true },
      { id: "pre-2", phase: "PRE-OPERATIVE", label: "Surgical site marked by operating surgeon", completed: true, required: true },
      { id: "pre-3", phase: "PRE-OPERATIVE", label: "Anesthesia safety check & machine verification complete", completed: true, required: true },
      { id: "pre-4", phase: "PRE-OPERATIVE", label: "Pulse oximeter on patient and functioning (SpO2 98%)", completed: true, required: true },
      { id: "pre-5", phase: "PRE-OPERATIVE", label: "Known allergy status reviewed (Penicillin flagged)", completed: true, required: true },
      { id: "pre-6", phase: "PRE-OPERATIVE", label: "Difficult airway / aspiration risk evaluated (Equipment ready)", completed: true, required: true },
      
      { id: "safe-1", phase: "SAFETY CHECK", label: "All team members introduced by name and clinical role", completed: true, required: true },
      { id: "safe-2", phase: "SAFETY CHECK", label: "Surgeon, Anesthetist & Nurse confirm patient, site, and procedure", completed: true, required: true },
      { id: "safe-3", phase: "SAFETY CHECK", label: "Anticipated critical events & blood loss risk reviewed (< 50 mL)", completed: true, required: true },
      { id: "safe-4", phase: "SAFETY CHECK", label: "Antibiotic prophylaxis administered within past 60 minutes (Cefazolin)", completed: true, required: true },
      { id: "safe-5", phase: "SAFETY CHECK", label: "Essential diagnostic imaging displayed on OR screen (MRI/CT ready)", completed: true, required: true },

      { id: "proc-1", phase: "PROCEDURE", label: "Sterile field integrity verified by scrub nurse", completed: true, required: true },
      { id: "proc-2", phase: "PROCEDURE", label: "Pneumoperitoneum established (CO2 insufflation at 12 mmHg)", completed: true, required: true },
      { id: "proc-3", phase: "PROCEDURE", label: "Appendix identified and mesoappendix coagulated", completed: true, required: false },
      { id: "proc-4", phase: "PROCEDURE", label: "Specimen placed in endobag for retrieval", completed: false, required: false },

      { id: "post-1", phase: "POST-OPERATIVE", label: "Nurse verbally confirms name of recorded procedure", completed: false, required: true },
      { id: "post-2", phase: "POST-OPERATIVE", label: "Instrument, sponge, and needle counts verified correct", completed: false, required: true },
      { id: "post-3", phase: "POST-OPERATIVE", label: "Specimen correctly labeled with patient ID (P001)", completed: false, required: true },
      { id: "post-4", phase: "POST-OPERATIVE", label: "Equipment issues or malfunctions flagged", completed: false, required: false },
      { id: "post-5", phase: "POST-OPERATIVE", label: "Key post-op concerns & PACU recovery plan reviewed", completed: false, required: true },
    ];
    return raw;
  });

  const [activePhaseFilter, setActivePhaseFilter] = useState("ALL");

  const phases = ["ALL", "PRE-OPERATIVE", "SAFETY CHECK", "PROCEDURE", "POST-OPERATIVE"];

  const toggleItem = (id) => {
    setItemsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const totalCompleted = itemsState.filter((i) => i.completed).length;
  const totalItems = itemsState.length;
  const progressPercent = Math.round((totalCompleted / totalItems) * 100);

  const displayedItems =
    activePhaseFilter === "ALL"
      ? itemsState
      : itemsState.filter((i) => i.phase === activePhaseFilter);

  return (
    <div className="checklist-clean-workspace">
      {/* 1. Header & Progress Banner */}
      <div className="checklist-header-banner">
        <div className="banner-left">
          <div className="title-wrap">
            <ClipboardCheck size={20} className="text-cyan" />
            <h1 className="checklist-title">WHO SURGICAL SAFETY PROTOCOL</h1>
          </div>
          <p className="checklist-subtitle font-mono">
            OR-01 PERIOPERATIVE COMPLIANCE & SAFETY AUDIT
          </p>
        </div>

        <div className="banner-right">
          {/* Progress Indicator */}
          <div className="progress-stat-wrap font-mono">
            <div className="progress-label-row">
              <span className="label">COMPLETION STATUS</span>
              <span className="count text-cyan font-bold">{totalCompleted} / {totalItems} COMPLETED ({progressPercent}%)</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {onAskAI && (
            <button
              className="btn-ask-ai-audit font-mono"
              onClick={() => onAskAI("Check the surgical checklist status for P001 and report pending items")}
            >
              <Sparkles size={14} className="text-cyan" />
              <span>AI CHECKLIST AUDIT</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Phase Navigation Tabs */}
      <div className="checklist-phase-tabs-bar font-mono">
        {phases.map((p) => (
          <button
            key={p}
            className={`phase-tab-btn ${activePhaseFilter === p ? "active" : ""}`}
            onClick={() => setActivePhaseFilter(p)}
          >
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* 3. Organized Checklist Rows */}
      <div className="checklist-items-card">
        <div className="items-list">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className={`checklist-item-row ${item.completed ? "item-completed" : "item-pending"}`}
              onClick={() => toggleItem(item.id)}
            >
              <button className="item-checkbox-btn" type="button">
                {item.completed ? (
                  <CheckCircle2 size={18} className="text-emerald" />
                ) : (
                  <Circle size={18} className="text-dim" />
                )}
              </button>

              <div className="item-text-wrap">
                <span className={`item-phase-badge font-mono badge-${item.phase.toLowerCase().replace(/\s+/g, "-")}`}>
                  {item.phase}
                </span>
                <span className={`item-label ${item.completed ? "text-strikethrough text-dim" : "text-bright"}`}>
                  {item.label}
                </span>
              </div>

              <div className="item-status-tag font-mono">
                {item.completed ? (
                  <span className="tag-completed text-emerald">✓ COMPLETED</span>
                ) : item.required ? (
                  <span className="tag-required text-amber">⚠ MANDATORY</span>
                ) : (
                  <span className="tag-pending text-dim">○ PENDING</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChecklistPage;
