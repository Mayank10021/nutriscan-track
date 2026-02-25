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
    fs.createReadStream(CSV_PATH).pipe(csv()).on('data', d => results.push(d)).on('end', () => { cachedData=results; resolve(results); }).on('error', reject);
  });
}

router.get('/charts', async (req, res) => {
  try {
    const data = await loadCSV();
    const ageGroupDist={}, bmiDist={}, nutritionDist={}, regionNutrition={}, genderRisk={}, incomeNutrition={}, activityNutrition={}, caloriesBins={'0-200':0,'200-400':0,'400-600':0,'600-800':0,'800+':0}, proteinDefByAge={}, healthConditionDist={}, vaccinationDist={};
    data.forEach(r => {
      const cal = parseFloat(r.Calories);
      ageGroupDist[r.Age_Group]=(ageGroupDist[r.Age_Group]||0)+1;
      bmiDist[r.BMI_Category]=(bmiDist[r.BMI_Category]||0)+1;
      nutritionDist[r.Nutrition_Status]=(nutritionDist[r.Nutrition_Status]||0)+1;
      if (!regionNutrition[r.Region]) regionNutrition[r.Region]={Good:0,Moderate:0,Poor:0};
      regionNutrition[r.Region][r.Nutrition_Status]++;
      if (!genderRisk[r.Gender]) genderRisk[r.Gender]={Low:0,Medium:0,High:0};
      genderRisk[r.Gender][r.Risk_Level]++;
      if (!incomeNutrition[r.Income_Group]) incomeNutrition[r.Income_Group]={Good:0,Moderate:0,Poor:0};
      incomeNutrition[r.Income_Group][r.Nutrition_Status]++;
      if (!activityNutrition[r.Activity_Level]) activityNutrition[r.Activity_Level]={count:0,avgBMI:0};
      activityNutrition[r.Activity_Level].count++;
      activityNutrition[r.Activity_Level].avgBMI+=parseFloat(r.BMI);
      if (!proteinDefByAge[r.Age_Group]) proteinDefByAge[r.Age_Group]={total:0,deficient:0};
      proteinDefByAge[r.Age_Group].total++;
      if (r.Protein_Deficient==='Yes') proteinDefByAge[r.Age_Group].deficient++;
      healthConditionDist[r.Health_Condition]=(healthConditionDist[r.Health_Condition]||0)+1;
      vaccinationDist[r.Vaccination_Status]=(vaccinationDist[r.Vaccination_Status]||0)+1;
      if (cal<200) caloriesBins['0-200']++;
      else if (cal<400) caloriesBins['200-400']++;
      else if (cal<600) caloriesBins['400-600']++;
      else if (cal<800) caloriesBins['600-800']++;
      else caloriesBins['800+']++;
    });
    Object.values(activityNutrition).forEach(v => { v.avgBMI=(v.avgBMI/v.count).toFixed(2); });
    res.json({ ageGroupDist, bmiDist, nutritionDist, regionNutrition, genderRisk, incomeNutrition, activityNutrition, caloriesBins, proteinDefByAge, healthConditionDist, vaccinationDist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
