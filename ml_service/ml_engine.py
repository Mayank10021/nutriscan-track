#!/usr/bin/env python3
"""
NutriScan India — ML Prediction Engine
Trains RandomForest + LogisticRegression on nutrition data
Usage:
  python3 ml_engine.py train              -> trains and saves model
  python3 ml_engine.py predict <json>    -> predicts risk from JSON input
"""

import sys
import json
import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
CSV_PATH = os.path.join(os.path.dirname(__file__), '../dataset/nutrition_data.csv')

FEATURES = ['Age', 'BMI', 'Calories', 'Protein_g', 'Fat_g', 'Carbs_g',
            'Fiber_g', 'Steps_Per_Day', 'Sitting_Hours', 'Sleep_Hours',
            'Age_Group_enc', 'Region_enc', 'Income_enc', 'BMI_Category_enc']

AGE_GROUP_MAP = {'Child': 0, 'Teen': 1, 'Young Adult': 2, 'Adult': 3, 'Middle Age': 4, 'Senior': 5}
REGION_MAP = {'North': 0, 'South': 1, 'East': 2, 'West': 3, 'Central': 4, 'Northeast': 5}
INCOME_MAP = {'Below Poverty Line': 0, 'Low Income': 1, 'Middle Income': 2, 'Upper Middle Income': 3, 'High Income': 4}
BMI_MAP = {'Underweight': 0, 'Normal': 1, 'Overweight': 2, 'Obese': 3}
RISK_MAP = {'Low': 0, 'Medium': 1, 'High': 2}
RISK_REVERSE = {0: 'Low', 1: 'Medium', 2: 'High'}

def train():
    print("Loading dataset...", file=sys.stderr)
    df = pd.read_csv(CSV_PATH)
    df = df.dropna(subset=FEATURES[:10] + ['Risk_Level'])

    df['Age_Group_enc'] = df['Age_Group'].map(AGE_GROUP_MAP).fillna(3)
    df['Region_enc'] = df['Region'].map(REGION_MAP).fillna(0)
    df['Income_enc'] = df['Income_Group'].map(INCOME_MAP).fillna(2)
    df['BMI_Category_enc'] = df['BMI_Category'].map(BMI_MAP).fillna(1)
    df['risk_num'] = df['Risk_Level'].map(RISK_MAP)

    X = df[FEATURES].astype(float)
    y = df['risk_num']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    # Random Forest
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_acc = accuracy_score(y_test, rf.predict(X_test))

    # Logistic Regression
    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train_sc, y_train)
    lr_acc = accuracy_score(y_test, lr.predict(X_test_sc))

    # Feature importance
    feat_imp = dict(zip(FEATURES, rf.feature_importances_.tolist()))

    model_data = {
        'rf': rf, 'lr': lr, 'scaler': scaler,
        'rf_acc': round(rf_acc * 100, 2),
        'lr_acc': round(lr_acc * 100, 2),
        'feat_imp': feat_imp,
        'features': FEATURES
    }

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model_data, f)

    print(json.dumps({
        'status': 'trained',
        'rf_accuracy': round(rf_acc * 100, 2),
        'lr_accuracy': round(lr_acc * 100, 2),
        'samples': len(df)
    }))

def predict(input_json):
    if not os.path.exists(MODEL_PATH):
        # Auto-train if model not found
        train()

    with open(MODEL_PATH, 'rb') as f:
        m = pickle.load(f)

    data = json.loads(input_json)

    age = float(data.get('age', 25))
    bmi = float(data.get('bmi', 22))
    calories = float(data.get('calories', 500))
    protein = float(data.get('protein', 40))
    fat = float(data.get('fat', 20))
    carbs = float(data.get('carbs', 150))
    fiber = float(data.get('fiber', 10))
    steps = float(data.get('steps', 5000))
    sitting = float(data.get('sittingHours', 6))
    sleep = float(data.get('sleepHours', 7))
    age_group_enc = float(AGE_GROUP_MAP.get(data.get('ageGroup', 'Adult'), 3))
    region_enc = float(REGION_MAP.get(data.get('region', 'North'), 0))
    income_enc = float(INCOME_MAP.get(data.get('incomeGroup', 'Middle Income'), 2))
    bmi_cat = 'Underweight' if bmi < 18.5 else 'Normal' if bmi < 25 else 'Overweight' if bmi < 30 else 'Obese'
    bmi_cat_enc = float(BMI_MAP.get(bmi_cat, 1))

    X = np.array([[age, bmi, calories, protein, fat, carbs, fiber,
                   steps, sitting, sleep, age_group_enc, region_enc, income_enc, bmi_cat_enc]])

    # RF prediction
    rf_pred = int(m['rf'].predict(X)[0])
    rf_proba = m['rf'].predict_proba(X)[0].tolist()

    # LR prediction
    X_sc = m['scaler'].transform(X)
    lr_pred = int(m['lr'].predict(X_sc)[0])
    lr_proba = m['lr'].predict_proba(X_sc)[0].tolist()

    # Feature importance for this prediction
    fi = m['feat_imp']
    feat_display = {
        'Age': fi.get('Age', 0),
        'BMI': fi.get('BMI', 0),
        'Calories': fi.get('Calories', 0),
        'Protein': fi.get('Protein_g', 0),
        'Steps': fi.get('Steps_Per_Day', 0),
        'Sleep': fi.get('Sleep_Hours', 0),
        'Sitting': fi.get('Sitting_Hours', 0),
        'Income': fi.get('Income_enc', 0),
        'Region': fi.get('Region_enc', 0),
    }

    risk_level = RISK_REVERSE[rf_pred]
    confidence = round(max(rf_proba) * 100, 1)
    risk_score = round(rf_proba[2] * 100 + rf_proba[1] * 40, 1)

    # Generate recommendations
    recs = []
    protein_req = {'Child': 20, 'Teen': 35, 'Young Adult': 50, 'Adult': 55, 'Middle Age': 55, 'Senior': 60}
    req_p = protein_req.get(data.get('ageGroup', 'Adult'), 50)

    if bmi < 18.5: recs.append({'factor': 'Underweight BMI', 'advice': 'Increase calorie-dense foods: peanuts, ghee, banana, milk', 'impact': 'high'})
    if protein < req_p: recs.append({'factor': f'Low Protein (need {req_p}g)', 'advice': 'Add dal, egg, paneer, soya, sprouted legumes daily', 'impact': 'high'})
    if calories < 400: recs.append({'factor': 'Very Low Calorie Intake', 'advice': 'Add 3-4 balanced meals with whole grains and lentils', 'impact': 'high'})
    if steps < 3000: recs.append({'factor': 'Sedentary Lifestyle', 'advice': 'Walk 30 mins daily, target 7000+ steps for metabolic health', 'impact': 'medium'})
    if sleep < 6: recs.append({'factor': 'Sleep Deprivation', 'advice': 'Aim for 7-9 hours sleep; poor sleep increases malnutrition risk', 'impact': 'medium'})
    if sitting > 6: recs.append({'factor': 'Prolonged Sitting', 'advice': 'Take 5-min breaks every 30 mins; stand or stretch', 'impact': 'low'})
    if not recs: recs.append({'factor': 'Overall Health', 'advice': 'Maintain current habits. Add seasonal fruits and more fiber.', 'impact': 'low'})

    result = {
        'riskLevel': risk_level,
        'riskScore': min(100, risk_score),
        'confidence': confidence,
        'bmiCategory': bmi_cat,
        'bmi': round(bmi, 2),
        'models': {
            'randomForest': {
                'prediction': RISK_REVERSE[rf_pred],
                'accuracy': m['rf_acc'],
                'probabilities': {'Low': round(rf_proba[0]*100,1), 'Medium': round(rf_proba[1]*100,1), 'High': round(rf_proba[2]*100,1)}
            },
            'logisticRegression': {
                'prediction': RISK_REVERSE[lr_pred],
                'accuracy': m['lr_acc'],
                'probabilities': {'Low': round(lr_proba[0]*100,1), 'Medium': round(lr_proba[1]*100,1), 'High': round(lr_proba[2]*100,1)}
            }
        },
        'featureImportance': [{'name': k, 'importance': round(v*100, 2)} for k, v in sorted(feat_display.items(), key=lambda x: -x[1])],
        'recommendations': recs
    }

    print(json.dumps(result))

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'train'
    if cmd == 'train':
        train()
    elif cmd == 'predict':
        predict(sys.argv[2])
