# NutriScan + NutriTrack — Unified Platform

Merges NutriScan India v3 and NutriTrack Simple into one app with a blended UI.

## What's Combined

| Feature | Source |
|---|---|
| AI Risk Predictor, Food Analyzer, Chatbot, Alerts | NutriScan v3 |
| Activity Tracker, Diet Plan, Impact Model | NutriScan v3 |
| Health Worker + Admin Dashboards | NutriScan v3 |
| Research Report: The Problem | NutriTrack |
| Research Report: Data Analysis | NutriTrack |
| Research Report: Disease Impact | NutriTrack |
| Research Report: Solutions | NutriTrack |
| Python Chart Visualizations | NutriTrack |

## Quick Start

```bash
# Install
npm run install:all

# Start everything
bash start-all.sh
```

Or manually in 3 terminals:
```bash
# 1. Python charts (port 8000)
cd python-service && pip install -r requirements.txt && python3 app.py

# 2. Node backend (port 5000)
cd server && npm install && node index.js

# 3. React app (port 3000)
cd client && npm install && npm start
```

## URLs
- App → http://localhost:3000
- Node API → http://localhost:5000
- Python Charts → http://localhost:8000
- Research Reports → http://localhost:3000/report/problem
