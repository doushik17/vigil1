import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export function AppShell({
  children,
  selectedPatient,
  backendOnline,
  timeString,
  onAskAI,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="vigil-app-root">
      {/* Background medical grid */}
      <div className="app-grid-bg" />

      {/* Persistent Sidebar */}
      <div className={`sidebar-wrapper ${isMobileSidebarOpen ? "mobile-drawer-open" : ""}`}>
        <Sidebar
          backendOnline={backendOnline}
          onCloseDrawer={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Backdrop for mobile drawer */}
      {isMobileSidebarOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="vigil-main-container">
        <TopBar
          patient={selectedPatient}
          timeString={timeString}
          backendOnline={backendOnline}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          onAskAI={onAskAI}
        />

        <main className="vigil-page-viewport">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
