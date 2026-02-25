const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

const ML_SCRIPT = path.join(__dirname, '../../ml_service/ml_engine.py');

function runPython(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('python3', [ML_SCRIPT, ...args]);
    let stdout='', stderr='';
    proc.stdout.on('data', d => stdout+=d);
    proc.stderr.on('data', d => stderr+=d);
    proc.on('close', () => {
      try {
        const lines = stdout.trim().split('\n');
        const jsonLine = lines.filter(l => l.startsWith('{')).pop();
        resolve(JSON.parse(jsonLine));
      } catch(e) { reject(new Error(`Python error: ${stderr||stdout}`)); }
    });
  });
}

router.post('/risk', async (req, res) => {
  try {
    const { age, weight, height, calories, protein, fat, carbs, fiber=10, steps, sittingHours, sleepHours, ageGroup, region, incomeGroup } = req.body;
    const bmi = (weight && height) ? parseFloat(weight)/((parseFloat(height)/100)**2) : 22;
    const inputData = JSON.stringify({ age, bmi:bmi.toFixed(2), calories, protein, fat, carbs, fiber, steps, sittingHours, sleepHours, ageGroup, region:region||'North', incomeGroup });
    const result = await runPython(['predict', inputData]);
    res.json(result);
  } catch(err) { res.status(500).json({ message: err.message }); }
});

router.post('/impact', (req, res) => {
  const { proteinIncrease=10, calorieIncrease=0, activityIncrease=0, region='All India', months=6 } = req.body;
  const baseRed = proteinIncrease * 0.022 + calorieIncrease * 0.004 + activityIncrease * 0.015;
  const timeMultiplier = months / 6;
  const reduction = Math.min(50, baseRed * timeMultiplier * 100);
  const childrenImpacted = Math.floor(55000 * 0.38 * (reduction/100));
  const costSaved = Math.floor(childrenImpacted * 12000);
  res.json({
    scenario: `+${proteinIncrease}g protein/day${calorieIncrease?`, +${calorieIncrease}kcal/day`:''}${activityIncrease?`, +${activityIncrease}% activity`:''}  for ${months} months in ${region}`,
    region, projectedReduction: reduction.toFixed(1), childrenImpacted, costSaved,
    improvements: [
      { metric:'High-Risk Cases', reduction:(reduction*0.85).toFixed(1)+'%', description:'Direct reduction through improved nutrition' },
      { metric:'Protein Deficiency', reduction:(reduction*1.25).toFixed(1)+'%', description:'Primary target metric' },
      { metric:'Child Stunting', reduction:(reduction*0.62).toFixed(1)+'%', description:'Long-term growth improvement' },
      { metric:'Anaemia Cases', reduction:(reduction*0.48).toFixed(1)+'%', description:'Iron-protein interaction effect' },
      { metric:'Sedentary Risk', reduction:(reduction*0.35).toFixed(1)+'%', description:'Lifestyle co-benefit' },
    ],
    yearlyProjection: [3,6,9,12,18,24].filter(m => m<=Math.max(months,24)).map(m => ({
      month: m, reduction: Math.min(50, (baseRed*(m/6)*100)).toFixed(1)
    }))
  });
});

module.exports = router;
