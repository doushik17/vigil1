import React from "react";
import {
  User,
  HeartPulse,
  Activity,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import VitalsStrip from "../monitor/VitalsStrip";

export function PatientOverview({ patient, onAskAI, className = "" }) {
  if (!patient) return null;

  return (
    <div className={`patient-full-overview ${className}`}>
      {/* Patient Hero Card */}
      <div className="patient-hero-panel">
        <div className="hero-panel-left">
          <div className="hero-avatar">{patient.name.charAt(0)}</div>
          <div className="hero-meta">
            <div className="meta-id-row">
              <span className="patient-id-badge font-mono">{patient.id}</span>
              <span className="or-room-badge font-mono">{patient.room || "OR-01"}</span>
              <span className="status-live-pill">
                <span className="pulse-dot" />
                {patient.surgicalStatus}
              </span>
            </div>
            <h2 className="patient-main-name">{patient.name}</h2>
            <p className="patient-demographics-text">
              {patient.age} YEARS · {patient.gender.toUpperCase()} · BLOOD GROUP:{" "}
              <b className="text-cyan">{patient.bloodGroup || "O+"}</b> · HEIGHT: {patient.height || "178 cm"} · WEIGHT:{" "}
              {patient.weight || "76 kg"} · BMI: {patient.bmi || "24.0"}
            </p>
          </div>
        </div>

        <div className="hero-panel-right">
          {onAskAI && (
            <button
              className="btn-ask-vigil-hero"
              onClick={() => onAskAI(`Show me the patient details for ${patient.id}`)}
            >
              <Sparkles size={16} />
              <span>ASK VIGIL AI ABOUT {patient.id}</span>
            </button>
          )}
        </div>
      </div>

      {/* Vitals Summary Strip */}
      <div className="overview-vitals-section">
        <div className="section-title-bar">
          <Activity size={16} className="text-emerald" />
          <span className="title-text">REAL-TIME CLINICAL VITALS</span>
        </div>
        <VitalsStrip vitals={patient.vitals} />
      </div>

      {/* Grid: Procedure, Clinical Summary, Team, Allergies */}
      <div className="patient-details-grid">
        {/* Procedure & Anesthesia Card */}
        <div className="detail-card">
          <div className="detail-card-header">
            <Stethoscope size={16} className="text-cyan" />
            <h4>SURGICAL PROCEDURE & PROTOCOL</h4>
          </div>
          <div className="detail-card-body">
            <div className="info-field">
              <span className="field-label">PROCEDURE:</span>
              <span className="field-value font-bold text-cyan">{patient.procedure}</span>
            </div>
            <div className="info-field">
              <span className="field-label">CATEGORY:</span>
              <span className="field-value">{patient.procedureCategory || "General Surgery"}</span>
            </div>
            <div className="info-field">
              <span className="field-label">ANESTHESIA TYPE:</span>
              <span className="field-value">{patient.anesthesia || "General Endotracheal"}</span>
            </div>
            <div className="info-field">
              <span className="field-label">PRE-OP DIAGNOSIS:</span>
              <p className="diagnosis-text">{patient.preOpDiagnosis}</p>
            </div>
          </div>
        </div>

        {/* Surgical Team Card */}
        <div className="detail-card">
          <div className="detail-card-header">
            <User size={16} className="text-purple" />
            <h4>SURGICAL TEAM ASSIGNMENT</h4>
          </div>
          <div className="detail-card-body">
            <div className="info-field">
              <span className="field-label">LEAD SURGEON:</span>
              <span className="field-value font-bold">{patient.leadSurgeon || "Dr. A. Vance, MD"}</span>
            </div>
            <div className="info-field">
              <span className="field-label">ANESTHESIOLOGIST:</span>
              <span className="field-value">{patient.anesthesiologist || "Dr. K. Chen, MD"}</span>
            </div>
            <div className="info-field">
              <span className="field-label">SCRUB NURSE:</span>
              <span className="field-value">{patient.scrubNurse || "S. Miller, RN, CNOR"}</span>
            </div>
            <div className="info-field">
              <span className="field-label">CIRCULATING NURSE:</span>
              <span className="field-value">{patient.circulatingNurse || "J. Ramos, RN"}</span>
            </div>
          </div>
        </div>

        {/* Clinical Summary & AI Insights */}
        <div className="detail-card col-span-2">
          <div className="detail-card-header">
            <Sparkles size={16} className="text-cyan" />
            <h4>VIGIL-OR CLINICAL AI SUMMARY</h4>
          </div>
          <div className="detail-card-body">
            <p className="clinical-summary-paragraph">{patient.clinicalSummary}</p>

            <div className="post-op-plan-box">
              <span className="plan-label font-mono text-cyan">POST-OPERATIVE RECOVERY PLAN:</span>
              <p>{patient.postOpPlan}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientOverview;
