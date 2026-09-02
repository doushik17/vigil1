import React from "react";
import { User, HeartPulse, Activity, ShieldAlert, ChevronRight, Stethoscope } from "lucide-react";

export function PatientCard({
  patient,
  isSelected = false,
  onSelect,
  compact = false,
  className = "",
}) {
  if (!patient) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "IN PROGRESS":
        return "badge-in-progress";
      case "PRE-OPERATIVE":
        return "badge-preop";
      case "SCHEDULED":
        return "badge-scheduled";
      default:
        return "badge-stable";
    }
  };

  if (compact) {
    return (
      <div
        className={`patient-card-compact ${isSelected ? "patient-selected" : ""} ${className}`}
        onClick={() => onSelect && onSelect(patient)}
      >
        <div className="avatar-compact">{patient.name.charAt(0)}</div>
        <div className="compact-info">
          <span className="compact-name">{patient.name}</span>
          <span className="compact-id font-mono">{patient.id} · {patient.age}Y</span>
        </div>
        <span className={`status-pill-mini ${getStatusColor(patient.surgicalStatus)}`}>
          {patient.surgicalStatus}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`patient-command-card ${isSelected ? "patient-card-selected" : ""} ${className}`}
      onClick={() => onSelect && onSelect(patient)}
    >
      <div className="patient-card-header">
        <div className="patient-avatar-wrap">
          <div className="patient-avatar-circle">{patient.name.charAt(0)}</div>
          <div>
            <div className="patient-id-tag font-mono">{patient.id}</div>
            <h3 className="patient-full-name">{patient.name}</h3>
            {patient.alternateName && (
              <span className="patient-alt-name">({patient.alternateName})</span>
            )}
          </div>
        </div>

        <div className="patient-status-wrap">
          <span className={`surgical-status-badge ${getStatusColor(patient.surgicalStatus)}`}>
            <span className="pulse-dot" />
            {patient.surgicalStatus}
          </span>
          <span className="room-badge font-mono">{patient.room || "OR-01"}</span>
        </div>
      </div>

      <div className="patient-demographics-strip">
        <div className="demographic-item">
          <span className="label">AGE / SEX:</span>
          <span className="val font-mono">{patient.age}Y · {patient.gender}</span>
        </div>
        <div className="demographic-item">
          <span className="label">BLOOD:</span>
          <span className="val font-mono text-cyan">{patient.bloodGroup || "O+"}</span>
        </div>
        <div className="demographic-item">
          <span className="label">BMI:</span>
          <span className="val font-mono">{patient.bmi || "24.0"}</span>
        </div>
      </div>

      <div className="patient-procedure-section">
        <div className="proc-label">
          <Stethoscope size={13} className="text-cyan" />
          <span>SCHEDULED PROCEDURE</span>
        </div>
        <p className="proc-name">{patient.procedure}</p>
      </div>

      {patient.allergies && patient.allergies.length > 0 && (
        <div className="patient-allergy-alert">
          <ShieldAlert size={13} className="text-amber" />
          <span>ALLERGY: {patient.allergies.join(", ")}</span>
        </div>
      )}

      <div className="patient-card-footer">
        <div className="vitals-quick-peek font-mono">
          <span>HR: <b className="text-emerald">{patient.vitals?.heartRate || 72}</b></span>
          <span>SpO2: <b className="text-cyan">{patient.vitals?.spo2 || 98}%</b></span>
          <span>BP: <b className="text-amber">{patient.vitals?.bp || "120/80"}</b></span>
        </div>
        <ChevronRight size={16} className="arrow-select" />
      </div>
    </div>
  );
}

export default PatientCard;
