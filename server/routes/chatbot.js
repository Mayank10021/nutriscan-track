const express = require('express');
const router = express.Router();

// Rule-based nutrition chatbot with Hindi/English support
const KB = {
  greetings: { patterns:['hello','hi','namaste','namaskar','hola','hey'], response: 'Namaste! 🙏 Main NutriScan ka AI Nutrition Assistant hoon. Aap pooch sakte hain:\n• Kisi food ki calories/protein\n• BMI calculate karna\n• Diet tips\n• Malnutrition ke baare mein\n• Helpline numbers\n\nKya poochhna hai aapko?' },
  protein: { patterns:['protein','protien','prot'], response: '🥩 **Protein Requirements by Age:**\n• Children (5-12): 20g/day\n• Teens (13-19): 35g/day\n• Adults (20-45): 50-55g/day\n• Senior (60+): 60g/day\n\n**Best Indian Protein Sources:**\n🏆 Moringa leaves - 9.4g/100g\n🥜 Sattu - 22g/100g (Cheapest!)\n🫘 Rajma - 7.8g/cup\n🫛 Dal - 9g/bowl\n🥚 Egg - 6.3g each\n🧀 Paneer - 18g/100g\n\n**Tip:** Mix dal+roti = complete protein for vegetarians!' },
  bmi: { patterns:['bmi','weight','height','underweight','overweight','obese'], response: '⚖️ **BMI Calculator Guide:**\nFormula: Weight(kg) ÷ Height(m)²\n\n• < 18.5 = Underweight ❗\n• 18.5-24.9 = Normal ✅\n• 25-29.9 = Overweight ⚠️\n• ≥ 30 = Obese 🔴\n\n**For Underweight:**\nEat: Banana, peanuts, ghee, milk, paneer, eggs daily\nTarget: +300-500 extra calories/day\n\n**Government Help:** POSHAN Abhiyan, ICDS Anganwadi' },
  malnutrition: { patterns:['malnutrition','malnourish','stunting','wasting','severe'], response: '⚕️ **Malnutrition Types:**\n\n1. **Stunting** (low height-for-age)\n   → Chronic undernutrition\n   → Give: Iron, Zinc, Vitamin A\n\n2. **Wasting** (low weight-for-height)\n   → Acute malnutrition (URGENT)\n   → Call: 1098 Child Helpline\n\n3. **Underweight**\n   → Both stunting + wasting\n   → Anganwadi support needed\n\n**Warning Signs:** Swollen belly, hair loss, dry skin, lethargy → See doctor IMMEDIATELY' },
  diet: { patterns:['diet','food','khaana','khana','meal','breakfast','lunch','dinner','recipe'], response: '🍽️ **Affordable Nutrition Meal Plan (₹30/day):**\n\n🌅 Breakfast: Sattu drink (22g protein) or Besan chilla\n☀️ Lunch: Dal+Roti+Green vegetable (complete nutrition)\n🍎 Snack: Banana or Peanuts (5-10g protein)\n🌙 Dinner: Khichdi or Dal+Rice+Curd\n\n**Free via Government:**\n• Midday Meal (school children)\n• ICDS Anganwadi (0-6 yr + mothers)\n• PDS ration (BPL families)\n• POSHAN Abhiyan supplements' },
  calories: { patterns:['calorie','calori','kcal','energy'], response: '🔥 **Daily Calorie Needs:**\n• Child (5-12): 1200-1800 kcal\n• Teen: 1800-2200 kcal\n• Adult (sedentary): 1800-2000 kcal\n• Adult (active): 2200-2600 kcal\n• Pregnant woman: +300 kcal extra\n\n**Low Calorie Warning Signs:**\n• Always tired/fatigued\n• Can\'t concentrate\n• Weight loss\n• Weak immunity\n\n**Quick Calorie Boost:** Banana (89kcal), Peanuts (567kcal/100g), Ghee (900kcal/100g)' },
  helpline: { patterns:['helpline','number','call','emergency','help','1098','108'], response: '📞 **Emergency Helplines:**\n\n🆘 1098 — Child Helpline (24/7 FREE)\n🚑 108 — Ambulance (FREE)\n👩 181 — Women Helpline\n🏥 1800-180-1104 — Health Mission\n🌾 1800-11-0234 — POSHAN Abhiyan\n🩸 1800-11-0061 — Anaemia Helpline\n\n**For Severe Malnutrition:**\nCall 108 immediately OR\nGo to nearest Anganwadi/PHC' },
  iron: { patterns:['iron','anaemia','anemia','hemoglobin','blood'], response: '🩸 **Iron Deficiency / Anaemia:**\n\nSymptoms: Pale skin, fatigue, breathlessness, dizziness\n\n**Best Iron-Rich Indian Foods:**\n🌿 Moringa leaves - 4mg/100g\n🥬 Palak/Spinach - 3.5mg/100g\n🫛 Rajma - 2.2mg/cup\n🥜 Peanuts - 2.5mg/100g\n🫘 Chole - 4.7mg/cup\n\n**Government Program:**\nAnemia Mukt Bharat — free iron tablets at Anganwadi\nCall: 1800-11-0061' },
  vitamin: { patterns:['vitamin','vit','deficiency','calcium','bone'], response: '💊 **Key Vitamins for India:**\n\n**Vitamin A** (Night blindness)\n→ Carrot, mango, moringa, egg yolk\n\n**Vitamin D** (Bone health)\n→ Sunlight 15-20 min/day + milk, egg\n\n**Vitamin C** (Immunity)\n→ Amla (600mg!), lemon, tomato\n\n**Calcium** (Bones)\n→ Milk 113mg/100ml, paneer, ragi, moringa\n\n**Free Supplements:**\nVitamin A drops at Anganwadi (children)\nIron-Folic Acid at PHC (pregnant women)' },
  default: { response: 'Samajh nahi aaya 🤔 Aap yeh topics ke baare mein pooch sakte hain:\n\n• **Protein** — daily requirements, best sources\n• **BMI** — healthy weight check\n• **Diet** — meal plans, affordable foods\n• **Calories** — energy needs\n• **Iron** — anaemia prevention\n• **Vitamins** — deficiency guide\n• **Helpline** — emergency numbers\n• **Malnutrition** — types & treatment\n\nType karo kya jaanna hai!' }
};

router.post('/message', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'No message provided' });

  const msg = message.toLowerCase().trim();
  let response = KB.default.response;
  let matched = false;

  for (const [key, data] of Object.entries(KB)) {
    if (key === 'default') continue;
    if (data.patterns && data.patterns.some(p => msg.includes(p))) {
      response = data.response;
      matched = true;
      break;
    }
  }

  // Specific food lookups
  const foodMap = {
    'roti': '🫓 **Roti (1 piece):** 104kcal | Protein: 3.1g | Fat: 0.9g | Carbs: 22.5g | Fiber: 2.7g\nHealth Score: 85/100 ✅ Healthy — best daily staple',
    'dal': '🥣 **Dal (1 bowl):** 120kcal | Protein: 9g | Fat: 0.4g | Carbs: 20g | Fiber: 8g\nHealth Score: 92/100 ✅ Excellent protein source — eat daily',
    'idli': '🥘 **Idli (2 pcs):** 78kcal | Protein: 4g | Fat: 0.2g | Carbs: 16.4g\nHealth Score: 88/100 ✅ Light, fermented, easy to digest',
    'banana': '🍌 **Banana:** 89kcal | Protein: 1.1g | Fat: 0.3g | Carbs: 23g | Fiber: 2.6g\nHealth Score: 88/100 ✅ Natural energy, potassium-rich',
    'egg': '🥚 **Boiled Egg:** 78kcal | Protein: 6.3g | Fat: 5.3g | Carbs: 0.6g\nHealth Score: 90/100 ✅ Complete protein — cheapest nutrition',
    'moringa': '🌿 **Moringa Leaves (100g):** 64kcal | Protein: 9.4g | Iron: 4mg | Calcium: 185mg\nHealth Score: 99/100 🏆 Indian superfood — highest nutrition density!',
    'samosa': '🥟 **Samosa (1 pc):** 262kcal | Protein: 4.4g | Fat: 13.4g | Carbs: 32g\nHealth Score: 35/100 ❌ Unhealthy — deep fried, high fat. Alternative: Steamed Dhokla',
    'paneer': '🧀 **Paneer (100g):** 265kcal | Protein: 18g | Fat: 20g | Calcium: 208mg\nHealth Score: 80/100 ✅ High protein, calcium-rich for vegetarians',
  };

  if (!matched) {
    for (const [food, info] of Object.entries(foodMap)) {
      if (msg.includes(food)) { response = info; matched = true; break; }
    }
  }

  // Hindi language keywords
  if (!matched && (msg.includes('kya') || msg.includes('kaun') || msg.includes('kitna') || msg.includes('kaise'))) {
    response = 'Hindi mein bhi pooch sakte hain! 🙏\n\nBata dijiye:\n• "Protein ke liye kya khaana chahiye?"\n• "BMI kaise calculate karein?"\n• "Mera bacha underweight hai — kya karein?"\n• "Anganwadi helpline number"\n\nMain samjhaunga aur bata doonga! 😊';
  }

  res.json({ response, timestamp: new Date().toISOString() });
});

module.exports = router;
