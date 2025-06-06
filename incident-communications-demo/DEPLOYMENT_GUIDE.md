# Incident Communications Demo - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Render + Vercel (Recommended)
**Best for: Professional demos, reliable uptime**

#### Backend (Render)
1. Connect GitHub repo to Render
2. Create Web Service:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Environment**: 
     - `OPENAI_API_KEY=your_key_here`
     - `FLASK_ENV=production`
3. Custom domain: `api-incident-demo.yourcompany.com`

#### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Configure:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Environment**: `VITE_API_URL=https://api-incident-demo.yourcompany.com`
3. Custom domain: `incident-demo.yourcompany.com`

### Option 2: Railway (All-in-One)
**Best for: Quick demos, single platform**

```yaml
# railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Option 3: Fly.io (Docker-based)
**Best for: Global deployment, edge performance**

```bash
# Deploy backend
flyctl launch --dockerfile backend/Dockerfile
flyctl secrets set OPENAI_API_KEY=your_key

# Deploy frontend  
flyctl launch --dockerfile frontend/Dockerfile
```

## 🎯 Demo Preparation Checklist

### Pre-Demo Setup (30 minutes)
- [ ] Deploy backend and verify `/api/health` endpoint
- [ ] Deploy frontend and test all slash commands
- [ ] Verify OpenAI API key is working
- [ ] Test all 3 mock incidents (INC-123, 456, 789)
- [ ] Clear any existing status updates
- [ ] Test approval workflow on high-severity incidents

### Environment Variables
```bash
# Backend
OPENAI_API_KEY=sk-...
FLASK_ENV=production
PORT=8000

# Frontend  
VITE_API_URL=https://your-backend-url.com
```

### Mock Data Verification
```bash
# Test all endpoints
python test_demo.py
```

## 🎪 Demo Script (5-7 minutes)

### Introduction (30 seconds)
> "This is Abnormal Security's AI-powered incident communications assistant. It transforms raw incident data into professional status updates while protecting sensitive information."

### Flow 1: Standard Incident (90 seconds)
1. **Show the Slack-style interface**: "We've integrated this as a Slack bot"
2. **Type**: `/incident new INC-789` 
3. **Highlight agent status**: "Watch the AI agent pull data from multiple sources"
4. **Show result**: "Professional markdown status update in under 2 seconds"
5. **Publish**: "Publishes directly to status page"

### Flow 2: Security & Redaction (90 seconds)
1. **Type**: `/incident new INC-123`
2. **Point out redacted content**: "AI detected and redacted emails, IPs, phone numbers"
3. **Show guardrail banner**: "Security system blocks publication of sensitive data"
4. **Edit to remove leaks**: "Human can review and edit"

### Flow 3: Tone & Approval (2 minutes)
1. **Use previous incident**: "Let's adjust the communication style"
2. **Change tone menu**: "Different tones for different audiences"
3. **Show urgent vs reassuring**: "Same facts, different temperature settings"
4. **Request approval**: "High-severity incidents require management sign-off"
5. **Show approval flow**: "Simulates real enterprise workflows"

### Wrap-up (30 seconds)
> "This demonstrates AI-powered automation with enterprise security guardrails. Any questions?"

## 🔧 Technical Configuration

### Performance Optimization
```python
# backend/app.py - Add caching
from flask_caching import Cache

cache = Cache()
cache.init_app(app, config={'CACHE_TYPE': 'simple'})

@cache.memoize(timeout=300)
def load_incident_data(incident_id):
    # Existing code
```

### Error Handling for Demos
```python
# Fallback for OpenAI failures
def generate_status_draft_with_fallback(incident_data, tone='professional'):
    try:
        return generate_status_draft(incident_data, tone)
    except Exception as e:
        # Return pre-written fallback for demos
        return get_fallback_draft(incident_data['incident_id'], tone)
```

## 🌐 Custom Domain Setup

### DNS Configuration
```
# DNS Records
api-incident-demo.abnormal.com    CNAME    your-render-app.onrender.com
incident-demo.abnormal.com        CNAME    your-vercel-app.vercel.app
```

### SSL & Security Headers
- Automatic SSL via hosting platforms
- CORS configured for cross-origin requests
- Rate limiting for API endpoints

## 📱 Mobile-Friendly Demo

The React app is responsive, but for mobile demos:
- Use browser dev tools to show mobile view
- Slack-style UI works well on tablets
- Consider PWA installation for native feel

## 🔄 Demo Reset Script

```python
# reset_demo.py
import requests
import os

API_URL = os.getenv('DEMO_API_URL', 'http://localhost:8000')

def reset_demo():
    """Clear all status updates for fresh demo"""
    # Clear in-memory storage
    response = requests.post(f"{API_URL}/api/admin/reset")
    print(f"Demo reset: {response.status_code}")

if __name__ == "__main__":
    reset_demo()
```

## 🎥 Screen Recording Setup

For recorded demos:
1. **Screen resolution**: 1920x1080 for clarity
2. **Browser zoom**: 110-125% for visibility
3. **Hide bookmarks bar**: Clean interface
4. **Disable notifications**: Prevent interruptions
5. **Pre-load tabs**: Backend health, frontend, status page

## 🚨 Backup Plans

### If OpenAI API fails:
- Have pre-generated responses ready
- Show cached examples
- Focus on UI/UX and security features

### If hosting fails:
- Local deployment ready: `docker-compose up`
- Screenshots of key features
- Video backup of working demo

## 📊 Analytics & Monitoring

```javascript
// Add to frontend for demo insights
gtag('event', 'demo_action', {
  'event_category': 'incident_bot',
  'event_label': 'slash_command_used'
});
```

## 💡 Demo Variations

### For Security-Focused Audience:
- Emphasize PII redaction
- Show failed publish attempts
- Highlight enterprise approval workflows

### For DevOps Audience:
- Focus on integration capabilities
- Emphasize monitoring tool connections
- Show technical tone variations

### For Executive Audience:
- Highlight business value (speed, consistency)
- Show approval workflows
- Emphasize brand protection

---

**Estimated Setup Time**: 1-2 hours initial deployment, 30 minutes per demo prep 