import React from "react";
import { HeartPulse, Activity, Wind, Thermometer, Droplets, Zap } from "lucide-react";
import VitalsCard from "./VitalsCard";

export function VitalsStrip({ vitals, className = "" }) {
  if (!vitals) return null;

  return (
    <div className={`vitals-command-strip ${className}`}>
      <VitalsCard
        icon={<HeartPulse size={22} className="pulse-heart-icon text-emerald" />}
        label="HEART RATE"
        value={vitals.heartRate}
        unit="BPM"
        status="NORMAL"
        range="60-100"
        trend="stable"
        color="emerald"
      />

      <VitalsCard
        icon={<Activity size={22} className="text-cyan" />}
        label="SpO2 SATURATION"
        value={vitals.spo2}
        unit="%"
        status="NORMAL"
        range="95-100%"
        trend="stable"
        color="cyan"
      />

      <VitalsCard
        icon={<Wind size={22} className="text-amber" />}
        label="BLOOD PRESSURE"
        value={vitals.bp || `${vitals.bpSystolic}/${vitals.bpDiastolic}`}
        unit="mmHg"
        status="NORMAL"
        range="120/80 (MAP 93)"
        trend="stable"
        color="amber"
      />

      <VitalsCard
        icon={<Wind size={22} className="text-purple" />}
        label="RESPIRATION"
        value={vitals.respiratoryRate}
        unit="/MIN"
        status="NORMAL"
        range="12-20"
        trend="stable"
        color="purple"
      />

      <VitalsCard
        icon={<Thermometer size={22} className="text-sky" />}
        label="CORE TEMP"
        value={vitals.temperature}
        unit="°C"
        status="NORMAL"
        range="36.5 - 37.5"
        trend="stable"
        color="sky"
      />
    </div>
  );
}

export default VitalsStrip;
