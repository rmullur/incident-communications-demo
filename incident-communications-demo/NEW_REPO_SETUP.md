# Setting Up New Repository: Incident Communications Demo

## 📁 Repository Structure

```
incident-communications-demo/
├── README.md
├── .gitignore
├── DEPLOYMENT_GUIDE.md
├── docker-compose.yml
├── LICENSE
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   ├── .env.example
│   ├── app/
│   │   ├── __init__.py
│   │   └── incident/
│   │       ├── __init__.py
│   │       ├── routes.py
│   │       ├── redactor.py
│   │       └── prompts.py
│   ├── mock/
│   │   ├── INC-123.json
│   │   ├── INC-456.json
│   │   └── INC-789.json
│   └── temp/
│       └── .gitkeep
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── vercel.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── AgentStatusModal.tsx
│       │   ├── CommandBar.tsx
│       │   ├── DraftViewer.tsx
│       │   ├── EditModal.tsx
│       │   └── GuardrailBanner.tsx
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   └── StatusPage.tsx
│       ├── services/
│       │   └── incidentService.ts
│       └── types/
│           └── index.ts
└── test_demo.py
```

## 🚀 Quick Setup Commands

### 1. Initialize Repository
```bash
# Create new directory
mkdir incident-communications-demo
cd incident-communications-demo

# Initialize git
git init
git branch -M main

# Create GitHub repository (using GitHub CLI)
gh repo create incident-communications-demo --public --description "AI-powered incident communications assistant with security guardrails"

# Set remote
git remote add origin https://github.com/yourusername/incident-communications-demo.git
```

### 2. Copy Files from Current Project
```bash
# Copy backend files
cp -r /path/to/Helix_clean/backend ./backend
cp /path/to/Helix_clean/test_demo.py ./test_demo.py

# Copy frontend files
cp -r /path/to/Helix_clean/frontend ./frontend

# Copy documentation
cp /path/to/Helix_clean/DEPLOYMENT_GUIDE.md ./DEPLOYMENT_GUIDE.md
```

### 3. Clean Up & Initialize
```bash
# Remove old virtual environments
rm -rf backend/venv
rm -rf frontend/node_modules

# Remove DS_Store files
find . -name ".DS_Store" -delete

# Create environment examples
cp backend/.env backend/.env.example
cp frontend/.env frontend/.env.example

# Clean sensitive data from examples
sed -i '' 's/sk-[a-zA-Z0-9]*/your_openai_api_key_here/g' backend/.env.example
```

## 📝 Essential Files to Create

### README.md
```markdown
# 🚨 Incident Communications Demo

AI-powered incident communications assistant for Abnormal Security. Transforms raw incident data into professional status updates while protecting sensitive information.

## ✨ Features

- 🤖 **AI-Powered Drafting**: GPT-4o generates professional incident communications
- 🛡️ **Security Guardrails**: Automatic PII detection and redaction
- 🎭 **Tone Variations**: Multiple communication styles (professional, urgent, reassuring, etc.)
- 👔 **Approval Workflows**: Enterprise-grade approval processes for high-severity incidents
- 🔌 **Multi-Source Integration**: Connects to Slack, PagerDuty, Grafana, Splunk, ServiceNow
- 📱 **Slack-Style Interface**: Familiar chat-based interaction

## 🚀 Quick Start

### Local Development
\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/incident-communications-demo.git
cd incident-communications-demo

# Start with Docker Compose
docker-compose up

# Or run manually:
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
\`\`\`

### Demo Commands
- \`/incident new INC-123\` - Database timeout (tests redaction)
- \`/incident new INC-456\` - Authentication service outage
- \`/incident new INC-789\` - Resolved CDN performance issue

## 🌐 Live Demo

Visit: [incident-demo.abnormal.com](https://incident-demo.abnormal.com)

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [API Documentation](docs/API.md)
- [Security Features](docs/SECURITY.md)

## 🏗️ Architecture

- **Backend**: Flask + OpenAI GPT-4o + PII Detection
- **Frontend**: React + TypeScript + Chakra UI
- **Deployment**: Docker + Render + Vercel

## 🔐 Environment Variables

\`\`\`bash
# Backend
OPENAI_API_KEY=your_openai_api_key
FLASK_ENV=development

# Frontend
VITE_API_URL=http://localhost:8000
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Abnormal Security
```

### .gitignore
```bash
# Environment files
.env
.env.local
.env.production

# Dependencies
node_modules/
venv/
__pycache__/
*.pyc
*.pyo
*.pyd

# Build outputs
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Temporary files
temp/
tmp/
*.tmp

# Database
*.db
*.sqlite

# API keys and secrets
backend/app/secrets.py
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - FLASK_ENV=development
    volumes:
      - ./backend:/app
      - ./backend/temp:/app/temp

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
```

## 🔧 Repository Configuration

### GitHub Repository Settings
- **Description**: "AI-powered incident communications assistant with security guardrails"
- **Topics**: `ai`, `incident-management`, `security`, `openai`, `react`, `flask`, `abnormal-security`
- **Website**: Your deployed demo URL
- **Visibility**: Public (for demo purposes)

### Branch Protection Rules
```yaml
# .github/workflows/ci.yml - Optional CI/CD
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Test Backend
      run: |
        cd backend
        pip install -r requirements.txt
        python -m pytest
    - name: Test Frontend
      run: |
        cd frontend
        npm install
        npm run test
```

## 📦 First Commit Strategy

```bash
# Stage all files
git add .

# Initial commit
git commit -m "🎉 Initial commit: AI-powered incident communications demo

Features:
- GPT-4o powered status update generation
- PII redaction and security guardrails  
- Multiple tone variations with temperature control
- Enterprise approval workflows
- Slack-style interface with real-time agent status
- Docker deployment ready
- Comprehensive demo with 3 mock incidents"

# Push to GitHub
git push -u origin main
```

## 🎯 Next Steps After Repository Setup

1. **Deploy to Render + Vercel** using the DEPLOYMENT_GUIDE.md
2. **Set up custom domains** for professional demo URLs
3. **Add GitHub repository description and topics** for discoverability
4. **Create demo video** showcasing key features
5. **Share repository link** in presentations and documentation

---

**Estimated Setup Time**: 30-45 minutes for complete repository initialization 