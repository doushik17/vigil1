import React from "react";
import AIAssistant from "../ai/AIAssistant";

export function OverviewAIPreview({ agentState, className = "" }) {
  return (
    <div className={`overview-ai-section ${className}`}>
      <AIAssistant
        agentState={agentState}
        title="VIGIL AI · SURGICAL INTELLIGENCE"
        compact={false}
        showSuggestions={true}
      />
    </div>
  );
}

export default OverviewAIPreview;
