from contextlib import asynccontextmanager
from pathlib import Path
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database.connection import get_database
from app.api.monitor import router as monitor_router
from app.graph.workflow import run_workflow

from app.agent.intent import detect_intent
from app.agent.reasoning import clinical_reasoning

from app.tools.patient_tool import get_patient
from app.tools.rag_tool import search_reports
from app.tools.monitor_tool import get_live_monitor


@asynccontextmanager
async def lifespan(_: FastAPI):
    get_database()
    yield


app = FastAPI(
    title="VIGIL-OR",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monitor_router)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "vigil-or"
    }


# ==========================================================
# Patient APIs
# ==========================================================

DOCUMENT_ROOT = Path(__file__).resolve().parents[1] / "patient_documents"


def patient_records():
    records = []

    for source in sorted(DOCUMENT_ROOT.glob("*/patient.json")):
        with source.open(encoding="utf-8") as file:
            records.append(json.load(file))

    return records


@app.get("/api/patients")
def list_patients(query: str = ""):
    needle = query.casefold().strip()

    records = patient_records()

    if needle:
        records = [
            record
            for record in records
            if needle in record.get("patient_id", "").casefold()
            or needle in record.get("patient_name", "").casefold()
        ]

    return records


@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):

    for record in patient_records():
        if record.get("patient_id") == patient_id:
            return record

    raise HTTPException(
        status_code=404,
        detail="Patient not found"
    )


# ==========================================================
# AI Assistant
# ==========================================================

class ChatRequest(BaseModel):
    message: str
    patient_id: str | None = None


@app.post("/api/assistant/chat")
def assistant_chat(request: ChatRequest):

    intent = detect_intent(request.message)

    tool = intent.get("tool")

    if tool == "patient":

        patient_id = intent.get("patient_id")

        tool_output = get_patient(patient_id)

    elif tool == "rag":

        query = intent.get("query", request.message)

        tool_output = search_reports(query)

    elif tool == "monitor":

        tool_output = get_live_monitor()

    else:

        return {
            "success": False,
            "message": "Unable to determine the correct tool."
        }

    explanation = clinical_reasoning(
        request.message,
        tool_output
    )

    return {
        "success": True,
        "intent": intent,
        "tool_output": tool_output,
        "response": explanation
    }