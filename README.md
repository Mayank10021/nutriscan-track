# 🩺 Malnutrition Pattern Identification System
### Public Health & Nutrition (Rural Focus)

A Python-based data analysis and visualization system designed to identify malnutrition patterns in rural populations using demographic and nutrition indicators.

---

## 📖 Project Overview

Malnutrition remains a serious public health issue in rural and economically weaker regions. Although health data is collected, it is often not analyzed effectively.

This project uses Python data analysis and a Flask web interface to:

- Identify high-risk malnutrition groups
- Analyze nutrition patterns by age, gender, and region
- Visualize malnutrition trends
- Support data-driven health planning

---

## 🎯 Objectives

- Analyze nutrition and demographic data
- Detect malnutrition-prone regions and age groups
- Provide clear visual insights
- Support preventive health interventions

---

## 🛠️ Tech Stack

- **Python**
- **Pandas**
- **NumPy**
- **Matplotlib / Seaborn**
- **Flask (Web Framework)**

---

## 📊 Dataset Used

The dataset includes:

- Age
- Gender
- Height
- Weight
- BMI
- Region / District
- Nutrition Status (Underweight, Normal, Overweight)

(Simulated dataset used for demonstration)

---

## ⚙️ How It Works

1. Load dataset using Pandas
2. Clean and preprocess data
3. Calculate BMI and nutrition indicators
4. Group data by region and age
5. Generate visualizations
6. Display results on Flask dashboard

---

## 🖥️ Project Architecture

User → Flask Web Interface → Python Backend → Data Analysis → Visual Insights

- Python handles data processing and analysis.
- Flask displays results in a simple web dashboard.

---

## 📈 Key Features

✔ Malnutrition percentage calculation  
✔ Region-wise analysis  
✔ Age-group comparison  
✔ Interactive dashboard  
✔ Visual charts and graphs  

---


## What's Combined

| Feature | Source |
|---|---|
| AI Risk Predictor, Food Analyzer, Chatbot, Alerts | NutriScan |
| Activity Tracker, Diet Plan, Impact Model | NutriScan |
| Health Worker + Admin Dashboards | NutriScan |
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


---

## 📌 Impact

- Enables early identification of malnutrition risks
- Helps target high-risk regions
- Supports better public health planning
- Promotes data-driven decision making

---

## 🔮 Future Scope

- Add Machine Learning prediction model
- Integrate real government datasets
- Deploy on cloud platform
- Mobile-friendly dashboard

---

## 👨‍💻 Team Roles

### Research & Architecture Lead
- Studied rural health challenges
- Designed data workflow
- Structured dataset and key indicators
- Planned analysis and visualization pipeline

---

## 📃 License

This project is developed for academic and hackathon purposes.
