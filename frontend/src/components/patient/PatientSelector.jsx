import React from "react";
import { Users, ChevronDown, Check } from "lucide-react";
import { patients } from "../../data";

export function PatientSelector({ selectedPatient, onSelectPatient, className = "" }) {
  return (
    <div className={`patient-selector-dropdown ${className}`}>
      <div className="selector-label">
        <Users size={14} className="text-cyan" />
        <span>SELECT ACTIVE OR PATIENT:</span>
      </div>

      <div className="patient-pills-list">
        {patients.map((p) => {
          const isSelected = selectedPatient?.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={`patient-select-pill ${isSelected ? "pill-selected" : ""}`}
              onClick={() => onSelectPatient(p)}
            >
              <span className="pill-id font-mono">{p.id}</span>
              <span className="pill-name">{p.name}</span>
              <span className="pill-proc">{p.procedure}</span>
              {isSelected && <Check size={14} className="check-icon text-cyan" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PatientSelector;
