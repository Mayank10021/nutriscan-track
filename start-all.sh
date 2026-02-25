#!/bin/bash
# ============================================================
# NutriScan + NutriTrack — Unified Startup Script
# Starts: Node backend (5000) + Python viz service (8000) + React (3000)
# ============================================================
echo "🚀 Starting NutriScan + NutriTrack Unified Platform"
echo "======================================================"

# 1. Python Visualization Service (NutriTrack charts)
echo ""
echo "🐍 Starting Python Visualization Service (port 8000)..."
cd "$(dirname "$0")/python-service"
pip3 install -r requirements.txt --quiet 2>/dev/null || pip install -r requirements.txt --quiet
python3 app.py &
PYTHON_PID=$!
cd ..

# 2. ML Training (NutriScan)
echo ""
echo "🤖 Training ML model (NutriScan)..."
python3 ml_service/ml_engine.py train 2>/dev/null || echo "   (ML model already trained or Python 3 not available)"

# 3. Node.js Backend (NutriScan)
echo ""
echo "⚙️  Starting Node.js Backend (port 5000)..."
cd server
npm install --silent
node index.js &
NODE_PID=$!
cd ..

# 4. React Frontend (Combined)
echo ""
echo "⚛️  Starting React Frontend (port 3000)..."
cd client
npm install --silent
npm start &
REACT_PID=$!
cd ..

echo ""
echo "✅ All services running!"
echo "   Frontend        → http://localhost:3000"
echo "   Node Backend    → http://localhost:5000"
echo "   Python Service  → http://localhost:8000"
echo ""
echo "   NutriScan pages  → http://localhost:3000/"
echo "   Research Reports → http://localhost:3000/report/problem"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $PYTHON_PID $NODE_PID $REACT_PID 2>/dev/null; echo 'All services stopped.'" EXIT
wait
