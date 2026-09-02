import React from "react";
import { Check, AlertCircle } from "lucide-react";

export function ChecklistItem({ item, onToggle, disabled = false }) {
  return (
    <div
      className={`checklist-item-row ${item.checked ? "item-completed" : "item-pending"}`}
      onClick={() => !disabled && onToggle(item.id)}
    >
      <div className="checkbox-custom-wrap">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`checkbox-box ${item.checked ? "checked" : ""}`}>
          {item.checked && <Check size={14} className="check-icon" strokeWidth={3} />}
        </div>
      </div>

      <div className="item-content-wrap">
        <span className="item-label-text">{item.label}</span>
        <div className="item-tags">
          {item.required && (
            <span className="item-badge-required">MANDATORY</span>
          )}
          {item.checked ? (
            <span className="item-badge-verified">VERIFIED</span>
          ) : (
            <span className="item-badge-pending">PENDING</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChecklistItem;
