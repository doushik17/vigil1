import json

from app.agent.llm import ask_gemini


def clinical_reasoning(user_query: str, tool_output: dict):

    prompt = f"""
You are VIGIL-OR, an AI Clinical Decision Support Assistant.

The following information was retrieved from hospital systems.

Doctor's Question:
{user_query}

Retrieved Data:
{json.dumps(tool_output, indent=2)}

Your task:

1. Summarize the findings.
2. Highlight any abnormal values.
3. Mention possible clinical significance.
4. Recommend next clinical actions.
5. Do NOT make a definitive diagnosis.
6. Keep the answer concise and professional.

Return plain text only.
"""

    return ask_gemini(prompt)