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

router.get('/', async (req, res) => {
  try {
    const data = await loadCSV();
    const alerts = [];

    // District-level alerts
    const districtMap = {};
    data.forEach(r => {
      if (!districtMap[r.District]) districtMap[r.District] = { district:r.District, state:r.State, region:r.Region, count:0, highRisk:0, protDef:0, sedentary:0, childUnderweight:0 };
      districtMap[r.District].count++;
      if (r.Risk_Level==='High') districtMap[r.District].highRisk++;
      if (r.Protein_Deficient==='Yes') districtMap[r.District].protDef++;
      if (r.Sedentary_Alert==='Yes') districtMap[r.District].sedentary++;
      if (r.Age_Group==='Child' && r.BMI_Category==='Underweight') districtMap[r.District].childUnderweight++;
    });

    Object.values(districtMap).forEach(d => {
      const riskPct = (d.highRisk/d.count)*100;
      const protPct = (d.protDef/d.count)*100;
      const childUWPct = (d.childUnderweight/d.count)*100;

      if (riskPct > 40) {
        alerts.push({ id:`risk-${d.district}`, type:'critical', category:'High Risk Zone', district:d.district, state:d.state, region:d.region, value:riskPct.toFixed(1), message:`${d.district} has ${riskPct.toFixed(1)}% high-risk cases — urgent intervention required`, affected:d.highRisk, icon:'🔴', priority:1 });
      } else if (riskPct > 30) {
        alerts.push({ id:`risk-med-${d.district}`, type:'warning', category:'Elevated Risk', district:d.district, state:d.state, region:d.region, value:riskPct.toFixed(1), message:`${d.district}: ${riskPct.toFixed(1)}% high-risk cases above threshold`, affected:d.highRisk, icon:'🟡', priority:2 });
      }

      if (protPct > 45) {
        alerts.push({ id:`prot-${d.district}`, type:'critical', category:'Protein Crisis', district:d.district, state:d.state, region:d.region, value:protPct.toFixed(1), message:`${d.district} has ${protPct.toFixed(1)}% severe protein deficiency — add dal/egg/peanuts to diet`, affected:d.protDef, icon:'🟠', priority:1 });
      }

      if (childUWPct > 20) {
        alerts.push({ id:`child-${d.district}`, type:'warning', category:'Child Malnutrition', district:d.district, state:d.state, region:d.region, value:childUWPct.toFixed(1), message:`${d.district}: ${childUWPct.toFixed(1)}% children are underweight — Anganwadi intervention needed`, affected:d.childUnderweight, icon:'👶', priority:2 });
      }
    });

    // Region-level alerts
    const regionMap = {};
    data.forEach(r => {
      if (!regionMap[r.Region]) regionMap[r.Region]={count:0,highRisk:0,protDef:0};
      regionMap[r.Region].count++;
      if (r.Risk_Level==='High') regionMap[r.Region].highRisk++;
      if (r.Protein_Deficient==='Yes') regionMap[r.Region].protDef++;
    });
    Object.entries(regionMap).forEach(([reg, d]) => {
      const riskPct = (d.highRisk/d.count)*100;
      if (riskPct > 35) {
        alerts.push({ id:`region-${reg}`, type:'info', category:'Region Alert', district:'Regional', state:reg, region:reg, value:riskPct.toFixed(1), message:`${reg} region: ${riskPct.toFixed(1)}% population at high malnutrition risk`, affected:d.highRisk, icon:'🗺️', priority:3 });
      }
    });

    // Sort by priority
    alerts.sort((a,b) => a.priority-b.priority);

    res.json({
      alerts: alerts.slice(0, 50),
      summary: {
        critical: alerts.filter(a=>a.type==='critical').length,
        warning: alerts.filter(a=>a.type==='warning').length,
        info: alerts.filter(a=>a.type==='info').length,
        total: alerts.length
      }
    });
  } catch(err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
