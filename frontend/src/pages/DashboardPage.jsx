import React from "react";
import {
  User,
  HeartPulse,
  Activity,
  Wind,
  Thermometer,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import QuickActions from "../components/dashboard/QuickActions";

export function DashboardPage({ selectedPatient, vitals }) {
  const navigate = useNavigate();
  const patient = selectedPatient || {
    id: "P001",
    name: "Test Patient",
    age: 45,
    gender: "Male",
    procedure: "Laparoscopic Appendectomy",
    surgicalStatus: "IN PROGRESS",
    bloodGroup: "O+",
    room: "OR-01",
  };

  const patientVitals = vitals || {
    heartRate: 72,
    spo2: 98,
    bp: "120/80",
    respiratoryRate: 16,
    temperature: 36.8,
  };

  // Determine vital statuses
  const hrStatus = patientVitals.heartRate > 100 || patientVitals.heartRate < 50 ? "WARNING" : "NORMAL";
  const spo2Status = patientVitals.spo2 < 95 ? "WARNING" : "NORMAL";
  const bpStatus = "NORMAL";
  const respStatus = patientVitals.respiratoryRate > 24 || patientVitals.respiratoryRate < 10 ? "WARNING" : "NORMAL";
  const tempStatus = patientVitals.temperature > 38.0 || patientVitals.temperature < 35.5 ? "WARNING" : "NORMAL";

  const hasWarning = hrStatus === "WARNING" || spo2Status === "WARNING" || respStatus === "WARNING" || tempStatus === "WARNING";

  return (
    <div className="dashboard-clean-workspace">
      {/* 1. Header Banner */}
      <div className="dashboard-header-banner">
        <div className="banner-left">
          <div className="title-row">
            <h1 className="system-title">VIGIL-OR</h1>
            <span className="system-subtitle">Surgical Intelligence</span>
            <span className="live-pill font-mono">
              <span className="pulse-dot-emerald" />
              OR-01 • LIVE
            </span>
          </div>
          <div className="context-row font-mono">
            <span className="context-patient">
              PATIENT: <b>{patient.id} • {patient.name}</b>
            </span>
            <span className="context-sep">•</span>
            <span className="context-proc">
              PROCEDURE: <b>{patient.procedure}</b>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary 2-Column Clinical Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column: Active Patient & Attention Area */}
        <div className="dashboard-left-col">
          {/* Active Patient Card */}
          <div className="clinical-patient-card">
            <div className="card-header-line">
              <span className="card-kicker">ACTIVE PATIENT</span>
              <span className="status-badge-progress">
                <span className="pulse-dot-emerald" />
                {patient.surgicalStatus || "IN PROGRESS"}
              </span>
            </div>

            <div className="patient-identity-block">
              <div className="patient-avatar-circle">
                <User size={26} className="text-cyan" />
              </div>
              <div className="patient-text-details">
                <div className="patient-id font-mono">{patient.id}</div>
                <h2 className="patient-name">{patient.name}</h2>
                <p className="patient-demographics font-mono">
                  {patient.age} YEARS · {patient.gender.toUpperCase()} · BLOOD {patient.bloodGroup || "O+"}
                </p>
              </div>
            </div>

            <div className="procedure-summary-box">
              <div className="proc-label">
                <Stethoscope size={14} className="text-cyan" />
                <span>SCHEDULED PROCEDURE</span>
              </div>
              <p className="proc-title">{patient.procedure}</p>
            </div>

            <div className="card-bottom-action">
              <Link to="/patient" className="btn-details-link">
                <span>VIEW COMPLETE PATIENT CHART</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* Attention / Alert Area */}
          <div className={`clinical-attention-card ${hasWarning ? "attention-warning" : "attention-stable"}`}>
            <div className="attention-header">
              {hasWarning ? (
                <AlertCircle size={16} className="text-amber" />
              ) : (
                <ShieldCheck size={16} className="text-emerald" />
              )}
              <span className="attention-title font-mono">
                {hasWarning ? "ATTENTION REQUIRED" : "SYSTEM STABLE"}
              </span>
            </div>
            <p className="attention-body">
              {hasWarning
                ? "One or more physiological parameters require clinical observation."
                : "No active alerts. Patient hemodynamics and depth of anesthesia remain within normal surgical limits."}
            </p>
          </div>
        </div>

        {/* Right Column: Vitals Summary */}
        <div className="dashboard-right-col">
          <div className="vitals-summary-panel">
            <div className="panel-header-line">
              <div className="header-title-wrap">
                <Activity size={16} className="text-cyan" />
                <span className="panel-title">CURRENT VITALS</span>
              </div>
              <Link to="/monitor" className="link-to-monitor font-mono">
                <span>OPEN LIVE MONITOR</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="clean-vitals-list">
              {/* Heart Rate */}
              <div className="clean-vital-row">
                <div className="vital-left">
                  <HeartPulse size={20} className="text-emerald vital-icon" />
                  <span className="vital-name">Heart Rate</span>
                </div>
                <div className="vital-right">
                  <span className="vital-val font-mono">{patientVitals.heartRate}</span>
                  <span className="vital-unit font-mono">BPM</span>
                  <span className={`status-pill pill-${hrStatus.toLowerCase()} font-mono`}>
                    {hrStatus}
                  </span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="clean-vital-row">
                <div className="vital-left">
                  <Activity size={20} className="text-cyan vital-icon" />
                  <span className="vital-name">SpO2 Oxygen</span>
                </div>
                <div className="vital-right">
                  <span className="vital-val font-mono">{patientVitals.spo2}</span>
                  <span className="vital-unit font-mono">%</span>
                  <span className={`status-pill pill-${spo2Status.toLowerCase()} font-mono`}>
                    {spo2Status}
                  </span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="clean-vital-row">
                <div className="vital-left">
                  <Wind size={20} className="text-amber vital-icon" />
                  <span className="vital-name">Blood Pressure</span>
                </div>
                <div className="vital-right">
                  <span className="vital-val font-mono">{patientVitals.bp}</span>
                  <span className="vital-unit font-mono">mmHg</span>
                  <span className={`status-pill pill-${bpStatus.toLowerCase()} font-mono`}>
                    {bpStatus}
                  </span>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="clean-vital-row">
                <div className="vital-left">
                  <Wind size={20} className="text-purple vital-icon" />
                  <span className="vital-name">Respiratory Rate</span>
                </div>
                <div className="vital-right">
                  <span className="vital-val font-mono">{patientVitals.respiratoryRate}</span>
                  <span className="vital-unit font-mono">/MIN</span>
                  <span className={`status-pill pill-${respStatus.toLowerCase()} font-mono`}>
                    {respStatus}
                  </span>
                </div>
              </div>

              {/* Temperature */}
              <div className="clean-vital-row">
                <div className="vital-left">
                  <Thermometer size={20} className="text-sky vital-icon" />
                  <span className="vital-name">Core Temperature</span>
                </div>
                <div className="vital-right">
                  <span className="vital-val font-mono">{patientVitals.temperature}</span>
                  <span className="vital-unit font-mono">°C</span>
                  <span className={`status-pill pill-${tempStatus.toLowerCase()} font-mono`}>
                    {tempStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Large Clean Quick Actions */}
      <QuickActions />
    </div>
  );
}

export default DashboardPage;
