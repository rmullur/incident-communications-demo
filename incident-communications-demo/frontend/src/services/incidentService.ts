import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DraftResponse {
  draft: string;
  leaks: string[];
  latency_ms: number;
  tone?: string;
}

export interface PublishResponse {
  ok: boolean;
  ts: string;
}

export interface StatusUpdate {
  ts: string;
  draft: string;
}

export interface RedactResponse {
  redacted_text: string;
  leaks: string[];
}

export const incidentService = {
  async generateDraft(incidentId: string, tone?: string): Promise<DraftResponse> {
    const payload: { incident_id: string; tone?: string } = { incident_id: incidentId };
    if (tone) {
      payload.tone = tone;
    }
    const response = await api.post('/draft', payload);
    return response.data;
  },

  async publishUpdate(draft: string): Promise<PublishResponse> {
    const response = await api.post('/publish', { draft });
    return response.data;
  },

  async getStatusUpdates(): Promise<StatusUpdate[]> {
    const response = await api.get('/status');
    return response.data;
  },

  async redactLocal(text: string): Promise<RedactResponse> {
    const response = await api.post('/draft/redact_local', { text });
    return response.data;
  },

  async healthCheck(): Promise<{ ok: boolean }> {
    const response = await api.get('/health');
    return response.data;
  },
}; 