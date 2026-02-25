// activity.js
const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

router.post('/log', async (req, res) => {
  try {
    const { steps, sittingHours, sleepHours, waterIntake, caloriesBurned, activityType, notes } = req.body;
    let riskIncrease = 0;
    if (steps < 3000) riskIncrease += 10;
    if (steps < 1000) riskIncrease += 5;
    if (sittingHours > 6) riskIncrease += 8;
    if (sittingHours > 10) riskIncrease += 5;
    if (sleepHours < 6) riskIncrease += 5;
    if (waterIntake < 1.5) riskIncrease += 3;
    const sedentaryAlert = steps < 3000 || sittingHours > 6;
    const activity = await Activity.create({ steps, sittingHours, sleepHours, waterIntake, caloriesBurned, activityType, notes, sedentaryAlert, riskIncrease });
    const alerts = [];
    if (steps < 3000) alerts.push({ type:'danger', title:'Sedentary Alert 🚨', message:`Only ${steps?.toLocaleString()} steps today. Minimum 3,000 required. Risk +10%` });
    else if (steps < 7000) alerts.push({ type:'warning', title:'Low Activity ⚠️', message:`${steps?.toLocaleString()} steps. Target 7,000–10,000 for optimal health.` });
    else alerts.push({ type:'success', title:'Active Day ✅', message:`Great job! ${steps?.toLocaleString()} steps completed.` });
    if (sittingHours > 6) alerts.push({ type:'danger', title:'Prolonged Sitting 🪑', message:`${sittingHours} hours sitting. Stand & stretch every 30 minutes!` });
    if (sleepHours < 6) alerts.push({ type:'warning', title:'Sleep Deficit 😴', message:`Only ${sleepHours} hrs sleep. Aim for 7-9 hours nightly.` });
    if (waterIntake < 2) alerts.push({ type:'info', title:'Low Hydration 💧', message:`${waterIntake}L water today. Drink at least 2-3L.` });
    res.json({ activity, alerts, riskIncrease, sedentaryAlert });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

router.get('/history', async (req, res) => {
  try { const logs = await Activity.find().sort({ date:-1 }).limit(30); res.json(logs); }
  catch(err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
