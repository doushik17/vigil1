import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { suggestedPrompts } from "../../data";

export function SuggestedPrompts({ onSelectPrompt, disabled = false }) {
  return (
    <div className="suggested-prompts-container">
      <div className="prompts-label">
        <Sparkles size={12} className="text-cyan" />
        <span>SUGGESTED SURGICAL QUERIES</span>
      </div>

      <div className="prompts-grid">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="prompt-chip"
            disabled={disabled}
            onClick={() => onSelectPrompt(p.text)}
          >
            <span className="prompt-text">{p.text}</span>
            <ArrowRight size={12} className="prompt-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedPrompts;
