import React, { useState } from "react";
import {
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import ChecklistItem from "./ChecklistItem";
import { surgicalChecklistData } from "../../data";

export function SurgicalChecklist({ onAskAI, className = "" }) {
  const [sections, setSections] = useState(surgicalChecklistData);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const toggleItem = (itemId) => {
    setSections((prevSections) =>
      prevSections.map((sec) => ({
        ...sec,
        items: sec.items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }))
    );
  };

  // Compute stats
  const allItems = sections.flatMap((s) => s.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const mandatoryPending = allItems.filter((i) => i.required && !i.checked).length;

  const filteredSections = sections.filter((s) =>
    activeFilter === "ALL" ? true : s.category === activeFilter
  );

  return (
    <div className={`surgical-checklist-container ${className}`}>
      {/* Top Banner with Progress & Quick Stats */}
      <div className="checklist-hero-header">
        <div className="checklist-hero-left">
          <div className="checklist-icon-pill">
            <ClipboardCheck size={20} className="text-cyan" />
            <div>
              <h2>WHO SURGICAL SAFETY PROTOCOL</h2>
              <p className="font-mono">OR-01 · PERIOPERATIVE VERIFICATION</p>
            </div>
          </div>
        </div>

        <div className="checklist-hero-right">
          <div className="progress-stat-box">
            <div className="stat-num-wrap">
              <span className="stat-percentage font-mono">{progressPercent}%</span>
              <span className="stat-ratio font-mono">
                {completedItems} / {totalItems} COMPLETED
              </span>
            </div>
            <div className="checklist-progress-track">
              <div
                className="checklist-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {onAskAI && (
            <button
              className="btn-ask-checklist-ai"
              onClick={() => onAskAI("Verify surgical checklist and list any pending critical safety checks.")}
            >
              <Sparkles size={14} />
              <span>ASK VIGIL AI TO AUDIT</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Alert Status if Mandatory Items Pending */}
      {mandatoryPending > 0 ? (
        <div className="checklist-warning-strip">
          <AlertTriangle size={16} className="text-amber" />
          <span>
            <b>ATTENTION REQUIRED:</b> {mandatoryPending} mandatory safety check(s) pending before sign-out.
          </span>
        </div>
      ) : (
        <div className="checklist-success-strip">
          <ShieldCheck size={16} className="text-emerald" />
          <span>
            <b>ALL MANDATORY CHECKS SATISFIED:</b> Sign-in and Time-out phases fully validated.
          </span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="checklist-phase-tabs">
        {["ALL", "SIGN IN", "TIME OUT", "SIGN OUT"].map((filter) => {
          const sec = sections.find((s) => s.category === filter);
          const secCompleted = sec ? sec.items.filter((i) => i.checked).length : completedItems;
          const secTotal = sec ? sec.items.length : totalItems;

          return (
            <button
              key={filter}
              className={`phase-tab-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              <span>{filter}</span>
              <span className="tab-pill font-mono">
                {secCompleted}/{secTotal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist Sections */}
      <div className="checklist-sections-grid">
        {filteredSections.map((section) => {
          const secCompleted = section.items.filter((i) => i.checked).length;
          const secTotal = section.items.length;
          const isFullyDone = secCompleted === secTotal;

          return (
            <div key={section.category} className="checklist-section-card">
              <div className="section-card-header">
                <div className="section-title-wrap">
                  <span className={`phase-badge ${isFullyDone ? "phase-done" : "phase-active"}`}>
                    {section.category}
                  </span>
                  <h3>{section.phase}</h3>
                  <p className="phase-desc">{section.phaseDescription}</p>
                </div>

                <div className="section-status-right">
                  <span className="section-ratio font-mono">
                    {secCompleted}/{secTotal} DONE
                  </span>
                  {isFullyDone && <CheckCircle2 size={16} className="text-emerald" />}
                </div>
              </div>

              <div className="section-items-list">
                {section.items.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SurgicalChecklist;
