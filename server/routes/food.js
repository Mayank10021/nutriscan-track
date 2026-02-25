const express = require('express');
const router = express.Router();

const FOODS = [
  { name:"Roti (Chapati)", cat:"Grains", cal:104, prot:3.1, fat:0.9, carbs:22.5, fiber:2.7, iron:1.8, calcium:15, vitA:0, vitC:0, score:85, healthy:true, desc:"Whole wheat flatbread. Low calorie, good fiber, ideal daily staple.", govtScheme:"Midday Meal Scheme" },
  { name:"Dal (Lentil Soup)", cat:"Legumes", cal:120, prot:9, fat:0.4, carbs:20, fiber:8, iron:3.2, calcium:20, vitA:0, vitC:1, score:92, healthy:true, desc:"High protein, fiber-rich. Best cheap protein source for rural India.", govtScheme:"ICDS Program" },
  { name:"Rice (Cooked)", cat:"Grains", cal:206, prot:4.2, fat:0.4, carbs:44.5, fiber:0.6, iron:0.2, calcium:10, vitA:0, vitC:0, score:72, healthy:true, desc:"Good energy source. Combine with dal for complete nutrition.", govtScheme:"PDS (Ration)" },
  { name:"Idli (2 pcs)", cat:"Breakfast", cal:78, prot:4, fat:0.2, carbs:16.4, fiber:1, iron:1.1, calcium:18, vitA:0, vitC:0, score:88, healthy:true, desc:"Fermented, low calorie, light on digestion. Best breakfast.", govtScheme:null },
  { name:"Sambar", cat:"Legumes", cal:50, prot:3.5, fat:1.2, carbs:7.5, fiber:3.2, iron:2.1, calcium:30, vitA:120, vitC:15, score:90, healthy:true, desc:"Nutritious lentil-vegetable stew. Rich in iron and fiber.", govtScheme:"Midday Meal" },
  { name:"Poha", cat:"Breakfast", cal:76, prot:1.6, fat:0.6, carbs:15.5, fiber:0.5, iron:2.8, calcium:5, vitA:0, vitC:0, score:78, healthy:true, desc:"Flattened rice, light breakfast. Add peanuts for protein.", govtScheme:null },
  { name:"Paneer (Cottage Cheese)", cat:"Dairy", cal:265, prot:18, fat:20, carbs:1.2, fiber:0, iron:0.4, calcium:208, vitA:90, vitC:0, score:80, healthy:true, desc:"High protein dairy. Good calcium source. Best for vegetarians.", govtScheme:null },
  { name:"Khichdi", cat:"Main", cal:155, prot:6, fat:2, carbs:29, fiber:2.5, iron:2, calcium:25, vitA:0, vitC:0, score:87, healthy:true, desc:"Balanced rice-lentil dish. Easily digestible. Perfect recovery food.", govtScheme:"ICDS Supplementary" },
  { name:"Chole (Chickpea Curry)", cat:"Legumes", cal:269, prot:14.5, fat:4, carbs:45, fiber:12, iron:4.7, calcium:80, vitA:0, vitC:5, score:91, healthy:true, desc:"High protein, fiber-rich, iron-packed. Excellent for protein deficiency.", govtScheme:"School Lunch" },
  { name:"Rajma (Kidney Beans)", cat:"Legumes", cal:127, prot:7.8, fat:0.5, carbs:23, fiber:6.4, iron:2.2, calcium:40, vitA:0, vitC:2, score:89, healthy:true, desc:"Protein and fiber powerhouse. Affordable. Best for North India.", govtScheme:null },
  { name:"Palak Paneer", cat:"Main", cal:185, prot:10, fat:12, carbs:8, fiber:3.2, iron:5.1, calcium:230, vitA:520, vitC:18, score:86, healthy:true, desc:"Iron-rich spinach + calcium paneer. Excellent for anaemia prevention.", govtScheme:null },
  { name:"Dosa", cat:"Breakfast", cal:133, prot:3.4, fat:3.7, carbs:22.5, fiber:1.2, iron:0.9, calcium:12, vitA:0, vitC:0, score:80, healthy:true, desc:"Fermented rice crepe. Light, nutritious. Serve with sambar.", govtScheme:null },
  { name:"Upma", cat:"Breakfast", cal:177, prot:4.8, fat:4, carbs:31, fiber:1.8, iron:1.5, calcium:20, vitA:0, vitC:0, score:76, healthy:true, desc:"Semolina porridge. Good morning fuel. Add veggies for boost.", govtScheme:null },
  { name:"Egg (Boiled)", cat:"Non-Veg", cal:78, prot:6.3, fat:5.3, carbs:0.6, fiber:0, iron:0.9, calcium:25, vitA:85, vitC:0, score:90, healthy:true, desc:"Complete protein. All essential amino acids. Cheap nutrition.", govtScheme:"Midday Meal (eggs)" },
  { name:"Chicken (Grilled)", cat:"Non-Veg", cal:165, prot:31, fat:3.6, carbs:0, fiber:0, iron:1.1, calcium:10, vitA:0, vitC:0, score:87, healthy:true, desc:"Lean protein powerhouse. Low fat. Best non-veg option.", govtScheme:null },
  { name:"Fish Curry", cat:"Non-Veg", cal:180, prot:25, fat:8, carbs:6, fiber:1, iron:1.2, calcium:35, vitA:50, vitC:0, score:88, healthy:true, desc:"Omega-3 rich, high protein. Excellent for coastal regions.", govtScheme:null },
  { name:"Banana", cat:"Fruits", cal:89, prot:1.1, fat:0.3, carbs:23, fiber:2.6, iron:0.3, calcium:5, vitA:4, vitC:8.7, score:88, healthy:true, desc:"Natural energy, potassium-rich. Best pre-workout snack.", govtScheme:"ICDS distribution" },
  { name:"Apple", cat:"Fruits", cal:52, prot:0.3, fat:0.2, carbs:14, fiber:2.4, iron:0.1, calcium:6, vitA:3, vitC:4.6, score:92, healthy:true, desc:"Antioxidant-rich, good fiber. Daily apple for good health.", govtScheme:null },
  { name:"Mango", cat:"Fruits", cal:60, prot:0.8, fat:0.4, carbs:15, fiber:1.6, iron:0.2, calcium:11, vitA:765, vitC:36, score:85, healthy:true, desc:"Vitamin A and C rich. Natural energy. Seasonal superfood.", govtScheme:null },
  { name:"Milk (Full Fat)", cat:"Dairy", cal:61, prot:3.2, fat:3.3, carbs:4.8, fiber:0, iron:0, calcium:113, vitA:46, vitC:0, score:84, healthy:true, desc:"Calcium and Vitamin D. Essential for bone health in children.", govtScheme:"POSHAN Abhiyan milk" },
  { name:"Curd / Yogurt", cat:"Dairy", cal:61, prot:3.5, fat:3.3, carbs:4.7, fiber:0, iron:0.1, calcium:120, vitA:28, vitC:0, score:86, healthy:true, desc:"Probiotic-rich, gut health. Cheaper than milk, more beneficial.", govtScheme:null },
  { name:"Peanuts (Roasted)", cat:"Nuts", cal:567, prot:25.8, fat:49.2, carbs:16.1, fiber:8.5, iron:2.5, calcium:50, vitA:0, vitC:0, score:78, healthy:true, desc:"Cheapest protein source in India. Excellent for rural areas.", govtScheme:"School Nutrition" },
  { name:"Sprouts (Mixed)", cat:"Legumes", cal:62, prot:4.3, fat:0.4, carbs:11.4, fiber:1.8, iron:1.4, calcium:30, vitA:0, vitC:10, score:95, healthy:true, desc:"Nutrient powerhouse, high bioavailability. Zero cooking needed.", govtScheme:null },
  { name:"Oats (Cooked)", cat:"Grains", cal:71, prot:2.5, fat:1.4, carbs:12, fiber:1.7, iron:1.8, calcium:20, vitA:0, vitC:0, score:91, healthy:true, desc:"Heart-healthy, beta-glucan fiber. Reduces cholesterol.", govtScheme:null },
  { name:"Moringa / Drumstick Leaves", cat:"Vegetables", cal:64, prot:9.4, fat:1.4, carbs:8.3, fiber:2, iron:4, calcium:185, vitA:378, vitC:51, score:99, healthy:true, desc:"Indian superfood. Highest nutrition density. Available everywhere.", govtScheme:"POSHAN Abhiyan" },
  { name:"Spinach (Palak)", cat:"Vegetables", cal:23, prot:2.9, fat:0.4, carbs:3.6, fiber:2.2, iron:3.5, calcium:99, vitA:469, vitC:28, score:97, healthy:true, desc:"Iron and folate superfood. Key for anaemia prevention.", govtScheme:null },
  { name:"Sattu (Roasted Gram Flour)", cat:"Grains", cal:406, prot:22, fat:7, carbs:65, fiber:18, iron:9, calcium:90, vitA:0, vitC:0, score:94, healthy:true, desc:"Traditional Bihar/UP superfood. Highest protein+fiber combo.", govtScheme:"POSHAN Abhiyan" },
  { name:"Besan Chilla", cat:"Breakfast", cal:165, prot:9, fat:4, carbs:24, fiber:5, iron:3, calcium:45, vitA:0, vitC:0, score:88, healthy:true, desc:"Chickpea flour pancake. High protein breakfast, easy to make.", govtScheme:null },
  { name:"Amla (Indian Gooseberry)", cat:"Fruits", cal:44, prot:0.9, fat:0.6, carbs:10, fiber:4.3, iron:0.3, calcium:25, vitA:0, vitC:600, score:98, healthy:true, desc:"Highest Vitamin C source in India (600mg!). Immunity booster.", govtScheme:null },
  { name:"Ragi (Finger Millet)", cat:"Grains", cal:328, prot:7.3, fat:1.3, carbs:72, fiber:3.6, iron:3.9, calcium:344, vitA:0, vitC:0, score:93, healthy:true, desc:"Highest calcium grain in India. Excellent for bone health & anaemia.", govtScheme:"POSHAN Abhiyan" },
  { name:"Soya Chunks", cat:"Legumes", cal:345, prot:52, fat:0.5, carbs:33, fiber:13, iron:10, calcium:350, vitA:0, vitC:0, score:91, healthy:true, desc:"Highest plant protein source. 52g protein per 100g.", govtScheme:"School Nutrition" },
  { name:"Samosa (Fried)", cat:"Snacks", cal:262, prot:4.4, fat:13.4, carbs:32, fiber:2.3, iron:1, calcium:15, vitA:0, vitC:0, score:35, healthy:false, desc:"Deep fried, high fat. Limit to once a week.", govtScheme:null, alternative:"Steamed Dhokla or Baked Tikki" },
  { name:"Jalebi", cat:"Sweets", cal:377, prot:2, fat:14, carbs:65, fiber:0.5, iron:0.5, calcium:10, vitA:0, vitC:0, score:15, healthy:false, desc:"Very high sugar. Avoid if diabetic or overweight.", govtScheme:null, alternative:"Fresh Fruits or Dates" },
  { name:"Packaged Biscuits", cat:"Snacks", cal:480, prot:5.5, fat:20, carbs:70, fiber:1, iron:2, calcium:30, vitA:0, vitC:0, score:20, healthy:false, desc:"High sugar+trans fat. Avoid daily consumption.", govtScheme:null, alternative:"Roasted Chana or Peanuts" },
  { name:"Cold Drink / Soda", cat:"Beverages", cal:140, prot:0, fat:0, carbs:39, fiber:0, iron:0, calcium:0, vitA:0, vitC:0, score:5, healthy:false, desc:"Empty calories, high sugar. No nutritional value.", govtScheme:null, alternative:"Coconut Water or Buttermilk" },
  { name:"Coconut Water", cat:"Beverages", cal:19, prot:0.7, fat:0.2, carbs:3.7, fiber:1.1, iron:0.3, calcium:24, vitA:0, vitC:2.4, score:93, healthy:true, desc:"Natural electrolytes. Ideal post-exercise drink.", govtScheme:null },
  { name:"Green Salad", cat:"Vegetables", cal:20, prot:1.5, fat:0.2, carbs:3.5, fiber:2, iron:0.8, calcium:40, vitA:150, vitC:20, score:98, healthy:true, desc:"Very low calorie, high vitamins. Add daily to any meal.", govtScheme:null },
];

router.get('/list', (req, res) => {
  const { category, search, healthy } = req.query;
  let foods = FOODS;
  if (category) foods = foods.filter(f => f.cat === category);
  if (search) foods = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  if (healthy !== undefined) foods = foods.filter(f => f.healthy === (healthy === 'true'));
  res.json(foods);
});

router.get('/categories', (req, res) => res.json([...new Set(FOODS.map(f => f.cat))]));

router.post('/log', (req, res) => {
  const { foodName, quantity=1 } = req.body;
  const food = FOODS.find(f => f.name.toLowerCase() === foodName.toLowerCase());
  if (!food) return res.status(404).json({ message: 'Food not found.' });
  res.json({ ...food, cal:Math.round(food.cal*quantity), prot:+(food.prot*quantity).toFixed(1), fat:+(food.fat*quantity).toFixed(1), carbs:+(food.carbs*quantity).toFixed(1), quantity });
});

router.get('/recommend', (req, res) => {
  const { ageGroup } = req.query;
  const proteinReq = { 'Child':20,'Teen':35,'Young Adult':50,'Adult':55,'Middle Age':55,'Senior':60 };
  const reqP = proteinReq[ageGroup] || 50;
  const recommended = FOODS.filter(f => f.healthy && f.prot >= reqP*0.2).sort((a,b) => b.score-a.score).slice(0, 10);
  const govtSchemes = [
    { name:'POSHAN Abhiyan', target:'Women & Children under 6', benefit:'Nutrition supplements, iron-folic acid tablets', contact:'1800-11-0234' },
    { name:'Midday Meal Scheme', target:'School Children (Class 1-8)', benefit:'Free nutritious lunch daily', contact:'School office' },
    { name:'PDS (Ration Card)', target:'BPL Families', benefit:'Subsidized rice, wheat, pulses at ₹2-3/kg', contact:'Local Fair Price Shop' },
    { name:'ICDS (Anganwadi)', target:'Children 0-6 yrs & Mothers', benefit:'Supplementary nutrition + health checkups', contact:'Nearest Anganwadi center' },
    { name:'PM Matru Vandana Yojana', target:'Pregnant & Lactating Women', benefit:'₹5000 cash transfer for nutrition', contact:'1800-180-1104' },
    { name:'National Iron Plus Initiative', target:'All age groups', benefit:'Free iron + folic acid supplements at PHC', contact:'1800-11-0061' },
  ];
  const mealPlan = {
    breakfast: FOODS.filter(f=>f.cat==='Breakfast'&&f.healthy)[0],
    morningSnack: FOODS.filter(f=>f.cat==='Fruits'&&f.healthy)[0],
    lunch: FOODS.filter(f=>f.cat==='Legumes'&&f.healthy&&f.prot>7)[0],
    lunchCereal: FOODS.filter(f=>f.cat==='Grains'&&f.healthy)[0],
    eveningSnack: FOODS.filter(f=>f.cat==='Nuts'&&f.healthy)[0],
    dinner: FOODS.filter(f=>f.cat==='Main'&&f.healthy)[1]
  };
  res.json({ recommended, govtSchemes, mealPlan, reqProtein:reqP });
});

module.exports = router;
