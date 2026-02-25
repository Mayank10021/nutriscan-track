const express = require('express');
const router = express.Router();
const Child = require('../models/Child');

// Add child record
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, weight, height, district, state, region, calories, protein, fat, carbs, incomeGroup, vaccinationStatus, notes } = req.body;
    const bmi = weight && height ? parseFloat(weight)/((parseFloat(height)/100)**2) : 0;
    const bmiCategory = bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';

    // Simple risk calculation
    let riskScore = 0;
    if (bmi < 16) riskScore += 35; else if (bmi < 18.5) riskScore += 20;
    if (calories < 300) riskScore += 25; else if (calories < 500) riskScore += 12;
    const protReq = age < 13 ? 20 : 35;
    if (protein < protReq * 0.5) riskScore += 20; else if (protein < protReq) riskScore += 10;
    if (incomeGroup === 'Below Poverty Line') riskScore += 10;
    const riskLevel = riskScore >= 50 ? 'High' : riskScore >= 25 ? 'Medium' : 'Low';

    const stuntingStatus = height && age ?
      (height < (85 + age*5) ? 'Moderate Stunting' : 'Normal') : 'Unknown';
    const wastingStatus = bmi < 15 ? 'Severe Wasting' : bmi < 17 ? 'Moderate Wasting' : 'Normal';

    const child = await Child.create({ name, age, gender, weight, height, bmi:parseFloat(bmi.toFixed(2)), bmiCategory, district, state, region, calories, protein, fat, carbs, incomeGroup, vaccinationStatus, stuntingStatus, wastingStatus, riskLevel, riskScore, notes });
    res.json({ child, riskScore, riskLevel, bmi:bmi.toFixed(2), bmiCategory, stuntingStatus, wastingStatus });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

// Get all children (with filters)
router.get('/', async (req, res) => {
  try {
    const { district, riskLevel, ageGroup } = req.query;
    const filter = {};
    if (district) filter.district = new RegExp(district, 'i');
    if (riskLevel) filter.riskLevel = riskLevel;
    if (ageGroup === 'Child') filter.age = { $lt: 13 };
    const children = await Child.find(filter).sort({ createdAt: -1 }).limit(100);
    const stats = { total: children.length, highRisk: children.filter(c=>c.riskLevel==='High').length, avgBMI: children.length ? (children.reduce((s,c)=>s+(c.bmi||0),0)/children.length).toFixed(2) : 0 };
    res.json({ children, stats });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try { await Child.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
