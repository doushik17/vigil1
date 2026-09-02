from app.agent.intent import detect_intent
from app.tools.patient_tool import get_patient
from app.tools.rag_tool import search_reports
from app.tools.monitor_tool import get_live_monitor


def run_workflow(query: str):

    intent = detect_intent(query)

    tool = intent.get("tool")

    if tool == "patient":
        return get_patient(intent["patient_id"])

    elif tool == "rag":
        return search_reports(intent["query"])

    elif tool == "monitor":
        return get_live_monitor()

    return {
        "success": False,
        "message": "Unknown tool selected."
    }