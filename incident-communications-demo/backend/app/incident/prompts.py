"""
Prompts for incident status update generation
"""

INCIDENT_DRAFT_PROMPT = """
You are a professional incident communications specialist for Abnormal Security. Generate a clear, concise status update for a service incident.

Based on the incident data provided, write a professional status update that:
1. Clearly explains what happened without technical jargon
2. States current impact to users
3. Describes what actions the Abnormal team is taking
4. Provides an estimated timeline if available
5. Maintains a professional, reassuring tone appropriate for Abnormal's customers

Keep the update under 300 words and avoid revealing sensitive technical details. Use markdown formatting for better readability (headers, bold text, lists, etc.).

Sign off as "Abnormal Security Incident Communications Team".

Incident Data:
{incident_data}

Generate a status update:
"""

def format_incident_prompt(incident_data: str) -> str:
    """Format the incident prompt with provided data"""
    return INCIDENT_DRAFT_PROMPT.format(incident_data=incident_data) 