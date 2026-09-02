import React, { useState } from "react";
import { patientsData } from "../data";
import {
  User,
  AlertTriangle,
  Stethoscope,
  Clock,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

export function PatientPage({ selectedPatient, onSelectPatient, onAskAI }) {
  const [activeId, setActiveId] = useState(selectedPatient?.id || "P001");
  const currentPatient = patientsData[activeId] || selectedPatient || patientsData["P001"];

  const handlePatientSwitch = (id) => {
    setActiveId(id);
    if (onSelectPatient && patientsData[id]) {
      onSelectPatient(patientsData[id]);
    }
  };

  return (
    <div className="patient-clean-workspace">
      {/* 1. Patient Selector Strip */}
      <div className="patient-selector-pills-bar font-mono">
        <span className="selector-label">SELECT PATIENT:</span>
        {Object.values(patientsData).map((p) => (
          <button
            key={p.id}
            className={`patient-tab-pill ${p.id === currentPatient.id ? "active" : ""}`}
            onClick={() => handlePatientSwitch(p.id)}
          >
            <span className="pill-id">{p.id}</span>
            <span className="pill-name">{p.name}</span>
          </button>
        ))}
      </div>

      {/* 2. Primary Patient Header Banner */}
      <div className="patient-main-banner">
        <div className="banner-profile-wrap">
          <div className="patient-avatar-box">
            <User size={32} className="text-cyan" />
          </div>
          <div className="patient-profile-details">
            <div className="id-badge-row font-mono">
              <span className="id-tag">{currentPatient.id}</span>
              <span className="mrn-tag">MRN: {currentPatient.mrn || "Not available"}</span>
              <span className="status-badge-progress font-mono">
                <span className="pulse-dot-emerald" />
                {currentPatient.surgicalStatus || "IN PROGRESS"}
              </span>
            </div>
            <h1 className="patient-banner-name">{currentPatient.name}</h1>
            <p className="patient-demographics font-mono">
              {currentPatient.age} YRS · {currentPatient.gender?.toUpperCase()} · BLOOD: {currentPatient.bloodGroup || "Not available"} · BMI: {currentPatient.bmi || "23.5"}
            </p>
          </div>
        </div>

        {onAskAI && (
          <button
            className="btn-ask-ai-patient font-mono"
            onClick={() => onAskAI(`Show me the patient details for ${currentPatient.id}`)}
          >
            <Sparkles size={14} className="text-cyan" />
            <span>AI PATIENT QUERY</span>
          </button>
        )}
      </div>

      {/* 3. Clinical Data Grid */}
      <div className="patient-data-grid">
        {/* Procedure & Surgical Team */}
        <div className="patient-grid-card">
          <div className="card-header font-mono">
            <Stethoscope size={15} className="text-cyan" />
            <span>SURGICAL CASE & THEATER</span>
          </div>
          <div className="card-body font-mono">
            <div className="field-group">
              <span className="field-label">PRIMARY PROCEDURE:</span>
              <p className="field-value highlight text-cyan">{currentPatient.procedure || "Not available"}</p>
            </div>
            <div className="field-group">
              <span className="field-label">OR THEATER LOCATION:</span>
              <p className="field-value">{currentPatient.room || "OR-01 Surgical Suite"}</p>
            </div>
            <div className="field-group">
              <span className="field-label">LEAD SURGEON:</span>
              <p className="field-value">{currentPatient.leadSurgeon || "Dr. S. Vance, MD FACS"}</p>
            </div>
            <div className="field-group">
              <span className="field-label">ANESTHESIOLOGIST:</span>
              <p className="field-value">{currentPatient.anesthesiologist || "Dr. K. Patel, MD"}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis & Critical Allergies */}
        <div className="patient-grid-card">
          <div className="card-header font-mono">
            <AlertTriangle size={15} className="text-amber" />
            <span>DIAGNOSIS & SAFETY ALERTS</span>
          </div>
          <div className="card-body font-mono">
            <div className="field-group">
              <span className="field-label">PRE-OPERATIVE DIAGNOSIS:</span>
              <p className="field-value">{currentPatient.diagnosis || "Not available"}</p>
            </div>

            <div className="field-group">
              <span className="field-label text-amber">RECORDED ALLERGIES:</span>
              <div className="allergies-flag-pill font-mono">
                <AlertTriangle size={13} className="text-amber" />
                <span>{currentPatient.allergies || "No Known Drug Allergies (NKDA)"}</span>
              </div>
            </div>

            <div className="field-group">
              <span className="field-label">ADMISSION STATUS:</span>
              <p className="field-value">{currentPatient.admissionDate ? `Admitted ${currentPatient.admissionDate}` : "Emergency Admission (OR-01)"}</p>
            </div>
          </div>
        </div>

        {/* Clinical History & Summary */}
        <div className="patient-grid-card col-span-2">
          <div className="card-header font-mono">
            <FileCheck size={15} className="text-emerald" />
            <span>CLINICAL SUMMARY & OPERATIVE PLAN</span>
          </div>
          <div className="card-body">
            <p className="clinical-text">
              {currentPatient.history ||
                `Patient admitted with acute right lower quadrant pain. Ultrasound and CT confirmed acute uncomplicated appendicitis. Patient cleared for urgent laparoscopic intervention under general endotracheal anesthesia.`}
            </p>
            {currentPatient.postOpPlan && (
              <div className="postop-box font-mono">
                <span className="field-label text-cyan">POST-OPERATIVE RECOVERY PLAN:</span>
                <p>{currentPatient.postOpPlan}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientPage;
