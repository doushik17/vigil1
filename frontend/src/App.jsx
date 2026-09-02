import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import DashboardPage from "./pages/DashboardPage";
import PatientPage from "./pages/PatientPage";
import ReportsPage from "./pages/ReportsPage";
import MonitorPage from "./pages/MonitorPage";
import ChecklistPage from "./pages/ChecklistPage";
import AIAssistantPage from "./pages/AIAssistantPage";

import { patients } from "./data";
import { useVitals } from "./hooks/useVitals";
import { useORClock } from "./hooks/useORClock";
import { useAgent } from "./hooks/useAgent";

export function App() {
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const { vitals } = useVitals(selectedPatient?.vitals);
  const { timeString } = useORClock();
  const agentState = useAgent();

  const handleAskAI = (promptText) => {
    agentState.sendMessage(promptText);
  };

  return (
    <BrowserRouter>
      <AppShell
        selectedPatient={selectedPatient}
        backendOnline={agentState.backendOnline}
        timeString={timeString}
        onAskAI={handleAskAI}
      >
        <Routes>
          {/* Dashboard */}
          <Route
            path="/"
            element={
              <DashboardPage
                selectedPatient={selectedPatient}
                vitals={vitals}
              />
            }
          />

          {/* Patient Workspace */}
          <Route
            path="/patient"
            element={
              <PatientPage
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                onAskAI={handleAskAI}
              />
            }
          />
          <Route
            path="/patients"
            element={
              <PatientPage
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                onAskAI={handleAskAI}
              />
            }
          />
          <Route
            path="/patients/:id"
            element={
              <PatientPage
                selectedPatient={selectedPatient}
                onSelectPatient={setSelectedPatient}
                onAskAI={handleAskAI}
              />
            }
          />

          {/* Medical Reports & Imaging */}
          <Route
            path="/reports"
            element={
              <ReportsPage
                selectedPatient={selectedPatient}
                handleAskAI={handleAskAI}
              />
            }
          />

          {/* Live Monitor Station */}
          <Route
            path="/monitor"
            element={
              <MonitorPage
                vitals={vitals}
              />
            }
          />
          <Route
            path="/vitals"
            element={
              <MonitorPage
                vitals={vitals}
              />
            }
          />

          {/* Surgical Checklist */}
          <Route
            path="/checklist"
            element={
              <ChecklistPage
                onAskAI={handleAskAI}
              />
            }
          />

          {/* AI Assistant */}
          <Route
            path="/ai"
            element={
              <AIAssistantPage
                messages={agentState.messages}
                isThinking={agentState.isThinking}
                backendOnline={agentState.backendOnline}
                lastError={agentState.lastError}
                onSendMessage={agentState.sendMessage}
                onRetry={agentState.retryMessage}
                onClear={agentState.clearMessages}
                selectedPatient={selectedPatient}
              />
            }
          />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
