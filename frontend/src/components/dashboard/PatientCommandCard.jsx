import React from "react";
import { User, Stethoscope, ShieldAlert, HeartPulse, ChevronRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export function PatientCommandCard({ patient, className = "" }) {
  if (!patient) return null;

  return (
    <div className={`patient-overview-card ${className}`}>
      <div className="card-top-tag">
        <span className="tag-label">PATIENT COMMAND CARD</span>
        <span className="room-indicator font-mono">{patient.room || "OR-01"}</span>
      </div>

      <div className="card-patient-profile">
        <div className="patient-avatar-large">
          <User size={28} className="text-cyan" />
        </div>

        <div className="patient-meta-text">
          <div className="id-badge font-mono">{patient.id}</div>
          <h2 className="patient-name-display">{patient.name}</h2>
          {patient.alternateName && (
            <p className="patient-alias">Alias: {patient.alternateName}</p>
          )}
          <div className="demographics-line font-mono">
            <span>{patient.age} YEARS</span>
            <span>·</span>
            <span>{patient.gender.toUpperCase()}</span>
            <span>·</span>
            <span className="text-cyan font-bold">{patient.bloodGroup || "O+"}</span>
          </div>
        </div>
      </div>

      <div className="procedure-block">
        <div className="proc-header">
          <Stethoscope size={14} className="text-cyan" />
          <span>CURRENT PROCEDURE</span>
        </div>
        <p className="procedure-name-text">{patient.procedure}</p>
        <div className="proc-status-row">
          <span className="status-badge-in-progress">
            <span className="pulse-dot" />
            {patient.surgicalStatus}
          </span>
          <span className="anesthesia-tag font-mono">
            {patient.anesthesia || "General Endotracheal"}
          </span>
        </div>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div className="allergies-flag-box">
          <ShieldAlert size={14} className="text-amber" />
          <span>ALLERGIES: <b>{patient.allergies.join(", ")}</b></span>
        </div>
      )}

      <div className="card-quick-vitals font-mono">
        <div className="quick-vital-item">
          <span className="label">HEART RATE</span>
          <span className="val text-emerald">{patient.vitals?.heartRate || 72} BPM</span>
        </div>
        <div className="quick-vital-item">
          <span className="label">SpO2</span>
          <span className="val text-cyan">{patient.vitals?.spo2 || 98}%</span>
        </div>
        <div className="quick-vital-item">
          <span className="label">NIBP</span>
          <span className="val text-amber">{patient.vitals?.bp || "120/80"}</span>
        </div>
      </div>

      <Link to="/patient" className="btn-view-full-chart">
        <span>VIEW COMPLETE PATIENT CHART</span>
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}

export default PatientCommandCard;
