const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CSV_PATH = path.join(__dirname, '../../dataset/nutrition_data.csv');
let cachedData = null;

function loadCSV() {
  return new Promise((resolve, reject) => {
    if (cachedData) return resolve(cachedData);
    const results = [];
    fs.createReadStream(CSV_PATH).pipe(csv())
      .on('data', d => results.push(d))
      .on('end', () => { cachedData = results; resolve(results); })
      .on('error', reject);
  });
}

router.get('/', async (req, res) => {
  try {
    let data = await loadCSV();
    const { page=1, limit=50, region, gender, ageGroup, bmiCategory, riskLevel, nutritionStatus, year, search, sedentaryAlert, incomeGroup, state, healthCondition } = req.query;
    if (region) data = data.filter(r => r.Region === region);
    if (gender) data = data.filter(r => r.Gender === gender);
    if (ageGroup) data = data.filter(r => r.Age_Group === ageGroup);
    if (bmiCategory) data = data.filter(r => r.BMI_Category === bmiCategory);
    if (riskLevel) data = data.filter(r => r.Risk_Level === riskLevel);
    if (nutritionStatus) data = data.filter(r => r.Nutrition_Status === nutritionStatus);
    if (year) data = data.filter(r => r.Year === year);
    if (sedentaryAlert) data = data.filter(r => r.Sedentary_Alert === sedentaryAlert);
    if (incomeGroup) data = data.filter(r => r.Income_Group === incomeGroup);
    if (state) data = data.filter(r => r.State?.toLowerCase().includes(state.toLowerCase()));
    if (healthCondition) data = data.filter(r => r.Health_Condition === healthCondition);
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(r => r.District?.toLowerCase().includes(s) || r.State?.toLowerCase().includes(s) || r.Patient_ID?.toLowerCase().includes(s));
    }
    const total = data.length;
    const start = (parseInt(page)-1) * parseInt(limit);
    res.json({ data: data.slice(start, start+parseInt(limit)), total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/parseInt(limit)) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/summary', async (req, res) => {
  try {
    const data = await loadCSV();
    const total = data.length;
    const avgBMI = (data.reduce((s,r) => s+parseFloat(r.BMI||0), 0)/total).toFixed(2);
    const avgCalories = (data.reduce((s,r) => s+parseFloat(r.Calories||0), 0)/total).toFixed(1);
    const avgProtein = (data.reduce((s,r) => s+parseFloat(r.Protein_g||0), 0)/total).toFixed(1);
    const highRisk = data.filter(r => r.Risk_Level==='High').length;
    const proteinDeficient = data.filter(r => r.Protein_Deficient==='Yes').length;
    const sedentaryCount = data.filter(r => r.Sedentary_Alert==='Yes').length;
    const byRegion={}, byNutrition={}, byBMI={}, byRisk={}, byAgeGroup={}, byGender={};
    data.forEach(r => {
      byRegion[r.Region]=(byRegion[r.Region]||0)+1;
      byNutrition[r.Nutrition_Status]=(byNutrition[r.Nutrition_Status]||0)+1;
      byBMI[r.BMI_Category]=(byBMI[r.BMI_Category]||0)+1;
      byRisk[r.Risk_Level]=(byRisk[r.Risk_Level]||0)+1;
      byAgeGroup[r.Age_Group]=(byAgeGroup[r.Age_Group]||0)+1;
      byGender[r.Gender]=(byGender[r.Gender]||0)+1;
    });
    res.json({ total, avgBMI, avgCalories, avgProtein, highRisk, proteinDeficient, sedentaryCount, byRegion, byNutrition, byBMI, byRisk, byAgeGroup, byGender });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/district-heatmap', async (req, res) => {
  try {
    const data = await loadCSV();
    const { ageGroup } = req.query;
    let filtered = ageGroup ? data.filter(r => r.Age_Group === ageGroup) : data;
    const map = {};
    filtered.forEach(r => {
      if (!map[r.District]) map[r.District] = { district:r.District, state:r.State, region:r.Region, count:0, highRisk:0, totalCal:0, totalBMI:0, protDeficient:0 };
      map[r.District].count++;
      if (r.Risk_Level==='High') map[r.District].highRisk++;
      if (r.Protein_Deficient==='Yes') map[r.District].protDeficient++;
      map[r.District].totalCal += parseFloat(r.Calories||0);
      map[r.District].totalBMI += parseFloat(r.BMI||0);
    });
    const result = Object.values(map).map(d => ({
      ...d, avgCalories:(d.totalCal/d.count).toFixed(1), avgBMI:(d.totalBMI/d.count).toFixed(2),
      riskPercent:((d.highRisk/d.count)*100).toFixed(1),
      protDefPercent:((d.protDeficient/d.count)*100).toFixed(1)
    })).sort((a,b) => b.riskPercent-a.riskPercent);
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/trends', async (req, res) => {
  try {
    const data = await loadCSV();
    const byYear = {};
    data.forEach(r => {
      const yr = r.Year;
      if (!byYear[yr]) byYear[yr] = { year:yr, count:0, highRisk:0, avgBMI:0, avgCalories:0, protDeficient:0 };
      byYear[yr].count++;
      if (r.Risk_Level==='High') byYear[yr].highRisk++;
      if (r.Protein_Deficient==='Yes') byYear[yr].protDeficient++;
      byYear[yr].avgBMI += parseFloat(r.BMI||0);
      byYear[yr].avgCalories += parseFloat(r.Calories||0);
    });
    res.json(Object.values(byYear).map(y => ({
      ...y, avgBMI:(y.avgBMI/y.count).toFixed(2), avgCalories:(y.avgCalories/y.count).toFixed(1),
      riskRate:((y.highRisk/y.count)*100).toFixed(1), protDefRate:((y.protDeficient/y.count)*100).toFixed(1)
    })).sort((a,b) => a.year-b.year));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
