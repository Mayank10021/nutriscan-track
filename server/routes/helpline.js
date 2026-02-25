const express = require('express');
const router = express.Router();

const HELPLINES = [
  { id:1, name:"Child Helpline India", number:"1098", type:"emergency", desc:"24/7 child protection, abuse, malnutrition emergency", icon:"🧒", hours:"24/7", free:true },
  { id:2, name:"National Ambulance", number:"108", type:"emergency", desc:"Free emergency ambulance across India", icon:"🚑", hours:"24/7", free:true },
  { id:3, name:"Police Emergency", number:"100", type:"emergency", desc:"Police emergency services", icon:"🚔", hours:"24/7", free:true },
  { id:4, name:"Women Helpline", number:"181", type:"emergency", desc:"Women safety, health and nutrition support", icon:"👩", hours:"24/7", free:true },
  { id:5, name:"National Health Mission", number:"1800-180-1104", type:"health", desc:"Health information, nearest PHC/CHC locator", icon:"🏥", hours:"9AM-5PM", free:true },
  { id:6, name:"POSHAN Abhiyan Helpline", number:"1800-11-0234", type:"nutrition", desc:"National nutrition mission, Anganwadi support", icon:"🌾", hours:"10AM-6PM", free:true },
  { id:7, name:"ICDS / Anganwadi Helpline", number:"1800-180-1104", type:"nutrition", desc:"Child nutrition, development monitoring, supplements", icon:"🍼", hours:"9AM-5PM", free:true },
  { id:8, name:"Anemia Mukt Bharat", number:"1800-11-0061", type:"nutrition", desc:"Anaemia prevention, iron-folic acid distribution", icon:"🩸", hours:"9AM-5PM", free:true },
  { id:9, name:"Mental Health (iCall)", number:"9152987821", type:"mental", desc:"Free psychological counseling, stress, depression", icon:"🧠", hours:"8AM-10PM", free:true },
  { id:10, name:"Disaster Management", number:"1078", type:"emergency", desc:"National disaster response, food relief", icon:"⚠️", hours:"24/7", free:true },
  { id:11, name:"PDS / Ration Helpline", number:"14445", type:"nutrition", desc:"Ration card issues, food grain entitlement", icon:"🌾", hours:"9AM-5PM", free:true },
  { id:12, name:"PM Matru Vandana", number:"1800-419-0920", type:"nutrition", desc:"Maternity benefit scheme, ₹5000 cash transfer", icon:"🤰", hours:"10AM-5PM", free:true },
];

const HOSPITALS = [
  { id:1, name:"AIIMS New Delhi", state:"Delhi", city:"New Delhi", type:"Apex Institute", speciality:"All specialities", phone:"011-26588500", beds:2478 },
  { id:2, name:"PGI Chandigarh", state:"Punjab", city:"Chandigarh", type:"Govt Institute", speciality:"Paediatric Nutrition", phone:"0172-2755555", beds:1800 },
  { id:3, name:"AIIMS Patna", state:"Bihar", city:"Patna", type:"Apex Institute", speciality:"Child Health, Nutrition", phone:"0612-2451070", beds:960 },
  { id:4, name:"JIPMER Puducherry", state:"Puducherry", city:"Puducherry", type:"Govt Institute", speciality:"All specialities", phone:"0413-2272380", beds:1944 },
  { id:5, name:"Rajiv Gandhi Govt Hospital", state:"Tamil Nadu", city:"Chennai", type:"Govt Hospital", speciality:"General, Paediatrics", phone:"044-25305600", beds:2352 },
  { id:6, name:"KEM Hospital Mumbai", state:"Maharashtra", city:"Mumbai", type:"Govt Hospital", speciality:"Nutrition, Paediatrics", phone:"022-24107000", beds:1791 },
  { id:7, name:"IPGMER & SSKM Kolkata", state:"West Bengal", city:"Kolkata", type:"Govt Institute", speciality:"General, Nutrition", phone:"033-22041680", beds:2500 },
  { id:8, name:"AIIMS Bhopal", state:"Madhya Pradesh", city:"Bhopal", type:"Apex Institute", speciality:"All specialities", phone:"0755-2672335", beds:960 },
  { id:9, name:"AIIMS Bhubaneswar", state:"Odisha", city:"Bhubaneswar", type:"Apex Institute", speciality:"Child Nutrition, General", phone:"0674-2476789", beds:960 },
  { id:10, name:"Govt Medical College Kozhikode", state:"Kerala", city:"Kozhikode", type:"Govt Hospital", speciality:"Paediatrics, General", phone:"0495-2350216", beds:1800 },
];

router.get('/', (req, res) => {
  const { type } = req.query;
  res.json(type && type!=='all' ? HELPLINES.filter(h => h.type===type) : HELPLINES);
});

router.get('/hospitals', (req, res) => {
  const { state } = req.query;
  res.json(state ? HOSPITALS.filter(h => h.state.toLowerCase().includes(state.toLowerCase())) : HOSPITALS);
});

module.exports = router;
