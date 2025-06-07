"""
Incident Communication Routes
"""
import json
import os
import time
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from openai import OpenAI

from .redactor import Redactor
from .prompts import format_incident_prompt

incident_bp = Blueprint('incident', __name__, url_prefix='/api')

# In-memory storage for status updates (limited to 20 entries)
status_updates = []
redactor = Redactor()

def get_openai_client():
    """Get OpenAI client instance"""
    return OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def load_incident_data(incident_id: str) -> dict:
    """Load mock incident data"""
    mock_file = f"backend/mock/{incident_id}.json"
    try:
        with open(mock_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Return default mock data if file doesn't exist
        return {
            "incident_id": incident_id,
            "title": "Service Degradation",
            "impact": "Some users experiencing slow response times",
            "status": "investigating",
            "affected_services": ["API Gateway", "User Authentication"],
            "start_time": "2024-01-15T10:30:00Z",
            "description": "We are currently investigating reports of slow response times affecting user authentication and API gateway services."
        }

def save_status_update(draft: str):
    """Save status update to temp storage"""
    global status_updates
    
    # Create temp directory if it doesn't exist
    temp_dir = "backend/temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    # Add to in-memory storage (limit to 20 entries)
    timestamp = datetime.utcnow().isoformat() + 'Z'
    update = {
        "ts": timestamp,
        "draft": draft
    }
    
    status_updates.insert(0, update)  # Add to beginning
    status_updates = status_updates[:20]  # Keep only last 20
    
    # Also save to JSON file
    try:
        with open(f"{temp_dir}/status_data.json", 'w') as f:
            json.dump(status_updates, f, indent=2)
    except Exception as e:
        print(f"Warning: Could not save to file: {e}")
    
    return timestamp

def generate_status_draft(incident_data, tone='professional'):
    """Generate status draft with specified tone"""
    # Tone configurations
    tone_configs = {
        'professional': {'temperature': 0.3, 'style': 'professional and formal'},
        'casual': {'temperature': 0.7, 'style': 'casual and approachable'},
        'urgent': {'temperature': 0.2, 'style': 'urgent and direct'},
        'reassuring': {'temperature': 0.5, 'style': 'calm and reassuring'},
        'technical': {'temperature': 0.4, 'style': 'technical and detailed'}
    }
    
    config = tone_configs.get(tone, tone_configs['professional'])
    
    # First pass redaction on input data
    incident_json = json.dumps(incident_data, indent=2)
    redacted_input, _ = redactor.process_text(incident_json)
    
    # Generate draft using OpenAI GPT-4o
    client = get_openai_client()
    
    # Modify prompt based on tone
    base_prompt = format_incident_prompt(redacted_input)
    tone_instruction = f"\n\nTone: Write in a {config['style']} tone."
    prompt = base_prompt + tone_instruction
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a professional incident communications specialist for Abnormal Security."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=400,
        temperature=config['temperature']
    )
    
    return response.choices[0].message.content.strip()

def redact_sensitive_info(text):
    """Apply redaction to text and return redacted text and leaks"""
    redacted_text, leaks = redactor.process_text(text)
    return redacted_text, leaks

@incident_bp.route('/draft', methods=['POST'])
def generate_draft():
    """Generate a status update draft for an incident"""
    try:
        data = request.get_json()
        incident_id = data.get('incident_id')
        tone = data.get('tone', 'professional')  # Default to professional tone
        
        if not incident_id:
            return jsonify({"error": "incident_id is required"}), 400
        
        # Load incident data
        incident_data = load_incident_data(incident_id)
        if not incident_data:
            return jsonify({"error": f"Incident {incident_id} not found"}), 404
        
        # Generate draft with specified tone
        start_time = time.time()
        draft = generate_status_draft(incident_data, tone)
        latency_ms = int((time.time() - start_time) * 1000)
        
        # Apply redaction
        redacted_draft, leaks = redact_sensitive_info(draft)
        
        return jsonify({
            "draft": redacted_draft,
            "leaks": leaks,
            "latency_ms": latency_ms,
            "tone": tone
        })
    except Exception as e:
        print(f"Error generating draft: {e}")
        return jsonify({"error": "Failed to generate draft"}), 500

@incident_bp.route('/publish', methods=['POST'])
def publish_update():
    """Publish status update"""
    try:
        data = request.get_json()
        if not data or 'draft' not in data:
            return jsonify({"error": "draft is required"}), 400
        
        draft = data['draft']
        
        # Final leak check before publishing
        _, leaks = redactor.process_text(draft)
        if leaks:
            return jsonify({
                "error": "Cannot publish: sensitive information detected",
                "leaks": leaks
            }), 400
        
        # Save the update
        timestamp = save_status_update(draft)
        
        return jsonify({
            "ok": True,
            "ts": timestamp
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incident_bp.route('/status', methods=['GET'])
def get_status():
    """Get all status updates"""
    try:
        # Load from file if available
        temp_file = "backend/temp/status_data.json"
        if os.path.exists(temp_file):
            try:
                with open(temp_file, 'r') as f:
                    file_updates = json.load(f)
                # Merge with in-memory updates (in-memory takes precedence)
                global status_updates
                if file_updates and not status_updates:
                    status_updates = file_updates
            except Exception as e:
                print(f"Warning: Could not load from file: {e}")
        
        return jsonify(status_updates)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@incident_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for deployment platforms"""
    return jsonify({"ok": True})

@incident_bp.route('/draft/redact_local', methods=['POST'])
def redact_local():
    """Local redaction endpoint for frontend validation"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "text is required"}), 400
        
        text = data['text']
        redacted_text, leaks = redactor.process_text(text)
        
        return jsonify({
            "redacted_text": redacted_text,
            "leaks": leaks
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
