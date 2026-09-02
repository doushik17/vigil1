import React from "react";
import AIAssistant from "../components/ai/AIAssistant";

export function AIAssistantPage({
  messages,
  isThinking,
  backendOnline,
  lastError,
  onSendMessage,
  onRetry,
  onClear,
  selectedPatient,
}) {
  return (
    <div className="ai-dedicated-page-workspace">
      <AIAssistant
        messages={messages}
        isThinking={isThinking}
        backendOnline={backendOnline}
        lastError={lastError}
        onSendMessage={onSendMessage}
        onRetry={onRetry}
        onClear={onClear}
        patient={selectedPatient}
      />
    </div>
  );
}

export default AIAssistantPage;
