import json
from pathlib import Path

PATIENT_FOLDER = (
    Path(__file__).resolve().parents[2] / "patient_documents"
)


def get_patient(patient_id: str):
    """
    Load a patient's data from patient.json.
    """

    patient_json = PATIENT_FOLDER / patient_id / "patient.json"

    if not patient_json.exists():
        return {
            "success": False,
            "message": f"Patient {patient_id} not found."
        }

    with open(patient_json, "r", encoding="utf-8") as file:
        patient = json.load(file)

    return {
        "success": True,
        "patient": patient
    }