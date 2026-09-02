import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Activity,
  ClipboardCheck,
  Sparkles,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export function Sidebar({ backendOnline = true, onCloseDrawer }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Patient",
      path: "/patient",
      icon: User,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
    },
    {
      name: "Live Monitor",
      path: "/monitor",
      icon: Activity,
    },
    {
      name: "Checklist",
      path: "/checklist",
      icon: ClipboardCheck,
    },
    {
      name: "VIGIL AI",
      path: "/ai",
      icon: Sparkles,
    },
  ];

  return (
    <aside className="vigil-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-area">
        <div className="brand-logo-hex">
          <Cpu size={20} className="text-cyan" />
        </div>
        <div className="brand-title-wrap">
          <h1 className="brand-name">VIGIL-OR</h1>
          <span className="brand-subtitle">Surgical Intelligence</span>
        </div>
      </div>

      {/* Clean Navigation */}
      <nav className="sidebar-navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              onClick={() => onCloseDrawer && onCloseDrawer()}
              className={({ isActive }) =>
                `nav-link-item ${isActive ? "nav-link-active" : ""}`
              }
            >
              <div className="nav-icon-wrap">
                <Icon size={17} />
              </div>
              <span className="nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Single Compact Bottom System Status */}
      <div className="sidebar-footer-block">
        <div className="system-status-box font-mono">
          <div className="status-box-header">
            <span className="status-dot dot-stable" />
            <span className="box-title">OR-01 · SYSTEM ACTIVE</span>
          </div>
          <div className="status-line">
            <span className="label">AI ENGINE:</span>
            <span className={`val ${backendOnline ? "text-cyan" : "text-amber"}`}>
              {backendOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div className="status-line">
            <span className="label">TELEMETRY:</span>
            <span className="val text-emerald">CONNECTED</span>
          </div>
          <div className="status-line">
            <span className="label">VOICE FLOW:</span>
            <span className="val text-cyan">READY</span>
          </div>
        </div>

        <div className="sidebar-user-pill">
          <div className="user-avatar">DR</div>
          <div className="user-text">
            <span className="user-name">Dr. Lead Surgeon</span>
            <span className="user-role">Surgical Command</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
