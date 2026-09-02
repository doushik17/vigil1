import json

from app.agent.llm import ask_gemini


def detect_intent(query: str):

    prompt = f"""
You are the routing brain of the VIGIL-OR hospital AI assistant.

Your ONLY job is to determine which backend tool should be used.

Available tools:

1. patient
- Retrieve patient information.

2. rag
- Search medical reports.
- Blood report
- MRI report
- CT report
- ECG report
- X-ray report

3. monitor
- Live ECG
- Heart Rate
- Blood Pressure
- SpO₂
- Respiratory Rate
- Temperature

IMPORTANT:

The ONLY valid patient IDs are:

PAT001
PAT002
PAT003

Never generate IDs like PAT-101 or PAT-001.

If the doctor asks for patient 1, use PAT-001.
If the doctor asks for patient 2, use PAT-002.
If the doctor asks for patient 3, use PAT-003.

Return ONLY valid JSON.

Examples:

{{
    "tool": "patient",
    "patient_id": "PAT-001"
}}

{{
    "tool": "rag",
    "patient_id": "PAT-001",
    "query": "blood report"
}}

{{
    "tool": "monitor"
}}

Doctor request:

{query}
"""

    response = ask_gemini(prompt)

    print("\nGemini returned:\n")
    print(response)

    # Remove markdown formatting if Gemini returns it
    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    return json.loads(response)