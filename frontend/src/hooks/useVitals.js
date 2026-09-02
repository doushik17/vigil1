import { useState, useEffect, useRef, useCallback } from "react";

export function useVitals(initialPatientVitals = null) {
  const [vitals, setVitals] = useState(() => ({
    heartRate: initialPatientVitals?.heartRate || 72,
    spo2: initialPatientVitals?.spo2 || 98,
    bpSystolic: initialPatientVitals?.bpSystolic || 120,
    bpDiastolic: initialPatientVitals?.bpDiastolic || 80,
    bp: initialPatientVitals?.bp || "120/80",
    map: initialPatientVitals?.map || 93,
    respiratoryRate: initialPatientVitals?.respiratoryRate || 16,
    temperature: initialPatientVitals?.temperature || 36.8,
    etco2: initialPatientVitals?.etco2 || 38,
    perfusionIndex: initialPatientVitals?.perfusionIndex || 4.2,
    cardiacRhythm: initialPatientVitals?.cardiacRhythm || "Sinus Rhythm",
    ecgLead: initialPatientVitals?.ecgLead || "Lead II",
    status: "NORMAL", // NORMAL | WARNING | CRITICAL
    monitorConnected: true,
    isMuted: true,
  }));

  const [history, setHistory] = useState({
    hr: [72, 72, 73, 72, 71, 72, 73, 72, 72, 72],
    spo2: [98, 98, 98, 99, 98, 98, 98, 98, 99, 98],
  });

  const timerRef = useRef(null);

  // Update base vitals if patient changes
  useEffect(() => {
    if (initialPatientVitals) {
      setVitals((prev) => ({
        ...prev,
        heartRate: initialPatientVitals.heartRate ?? prev.heartRate,
        spo2: initialPatientVitals.spo2 ?? prev.spo2,
        bpSystolic: initialPatientVitals.bpSystolic ?? prev.bpSystolic,
        bpDiastolic: initialPatientVitals.bpDiastolic ?? prev.bpDiastolic,
        bp: initialPatientVitals.bp ?? prev.bp,
        map: initialPatientVitals.map ?? prev.map,
        respiratoryRate: initialPatientVitals.respiratoryRate ?? prev.respiratoryRate,
        temperature: initialPatientVitals.temperature ?? prev.temperature,
      }));
    }
  }, [initialPatientVitals]);

  // Subtle natural clinical physiological variation loop (every 2.5 seconds)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVitals((prev) => {
        if (!prev.monitorConnected) return prev;

        // Subtle realistic drift
        const hrDelta = (Math.random() - 0.5) * 2; // ±1 BPM
        const newHr = Math.round(Math.max(68, Math.min(76, prev.heartRate + hrDelta)));

        const spo2Delta = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newSpo2 = Math.round(Math.max(97, Math.min(100, prev.spo2 + spo2Delta)));

        const sysDelta = Math.round((Math.random() - 0.5) * 2);
        const diaDelta = Math.round((Math.random() - 0.5) * 1.5);
        const newSys = Math.max(116, Math.min(124, prev.bpSystolic + sysDelta));
        const newDia = Math.max(76, Math.min(84, prev.bpDiastolic + diaDelta));
        const newMap = Math.round((newSys + 2 * newDia) / 3);

        const newEtco2 = Math.round(Math.max(36, Math.min(40, prev.etco2 + (Math.random() - 0.5) * 1.2)));

        return {
          ...prev,
          heartRate: newHr,
          spo2: newSpo2,
          bpSystolic: newSys,
          bpDiastolic: newDia,
          bp: `${newSys}/${newDia}`,
          map: newMap,
          etco2: newEtco2,
        };
      });

      setHistory((prev) => ({
        hr: [...prev.hr.slice(1), vitals.heartRate],
        spo2: [...prev.spo2.slice(1), vitals.spo2],
      }));
    }, 2500);

    return () => clearInterval(timerRef.current);
  }, [vitals.heartRate, vitals.spo2]);

  const toggleMute = useCallback(() => {
    setVitals((v) => ({ ...v, isMuted: !v.isMuted }));
  }, []);

  const toggleConnection = useCallback(() => {
    setVitals((v) => ({ ...v, monitorConnected: !v.monitorConnected }));
  }, []);

  return {
    vitals,
    history,
    toggleMute,
    toggleConnection,
    setVitals,
  };
}

export default useVitals;
