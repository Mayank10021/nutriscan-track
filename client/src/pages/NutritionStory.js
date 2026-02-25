import React, { useState, useEffect, useRef } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from 'recharts';
import { useT, PageWrap, Card } from '../components/UI';

// ─── Nutrients config (sample profile — in production connect to real user data) ──
const NUTRIENTS = [
  { key: 'protein', label: 'Protein',  unit: 'g',     rda: 56,   userVal: 32,   color: '#10b981', icon: '💪', desc: 'Builds muscles, enzymes & immunity' },
  { key: 'carbs',   label: 'Carbs',    unit: 'g',     rda: 310,  userVal: 430,  color: '#f59e0b', icon: '⚡', desc: 'Primary energy source for the body' },
  { key: 'fat',     label: 'Fat',      unit: 'g',     rda: 78,   userVal: 95,   color: '#ef4444', icon: '🧠', desc: 'Brain function, hormones & vitamins' },
  { key: 'iron',    label: 'Iron',     unit: 'mg',    rda: 18,   userVal: 7,    color: '#ec4899', icon: '🩸', desc: 'Carries oxygen through the blood' },
  { key: 'fiber',   label: 'Fibre',    unit: 'g',     rda: 28,   userVal: 11,   color: '#8b5cf6', icon: '🌿', desc: 'Gut health & blood sugar control' },
  { key: 'bmi',     label: 'BMI',      unit: 'kg/m²', rda: 22.5, userVal: 27.3, color: '#06b6d4', icon: '⚖️', desc: 'Body mass index (ideal: 18.5–24.9)' },
];

// ─── Food recommendations per nutrient ───────────────────────────────────────
const FOOD_MAP = {
  protein: {
    note: null,
    veg: [
      { name: 'Moong Dal (Yellow Lentils)', amount: '1 cup cooked', nutrients: { Protein: '14g' }, tags: ['High Protein', 'Easy to Digest'], tip: 'Dal tadka — cooks in 20 min, pairs with rice or roti' },
      { name: 'Paneer (Cottage Cheese)',    amount: '100g',          nutrients: { Protein: '18g' }, tags: ['Complete Protein', 'Calcium-rich'], tip: 'Palak paneer is a nutritional powerhouse — spinach + paneer = iron + protein' },
      { name: 'Chana (Chickpeas)',          amount: '1 cup cooked',  nutrients: { Protein: '15g' }, tags: ['Fibre + Protein', 'Slow energy'], tip: 'Chana masala or roasted as a crunchy snack' },
      { name: 'Dahi (Greek-style Yogurt)',  amount: '200g',          nutrients: { Protein: '17g' }, tags: ['Probiotic', 'Protein-rich'], tip: 'Have as raita with meals or plain with rock salt' },
      { name: 'Tofu / Soybeans',           amount: '100g',          nutrients: { Protein: '17g' }, tags: ['Plant Complete Protein', 'Iron'], tip: 'Tofu bhurji — tastes like scrambled eggs, replaces them perfectly' },
      { name: 'Rajma (Kidney Beans)',       amount: '1 cup cooked',  nutrients: { Protein: '13g', Iron: '4mg' }, tags: ['Iron + Protein', 'Budget-friendly'], tip: 'Rajma-chawal is a complete amino acid meal' },
    ],
    nonVeg: [
      { name: 'Chicken Breast (Boneless)', amount: '100g',  nutrients: { Protein: '31g' }, tags: ['Lean', 'Highest Protein Density'], tip: 'Grill or boil — avoid deep frying to preserve nutrition' },
      { name: 'Whole Eggs',               amount: '2 large', nutrients: { Protein: '12g', Fat: '10g' }, tags: ['Complete AA Profile', 'Budget-friendly'], tip: 'Eat the yolk too — that is where B12 and choline live' },
      { name: 'Rohu / Katla Fish',        amount: '100g',  nutrients: { Protein: '20g' }, tags: ['Omega-3', 'Protein'], tip: 'Bengali fish curry — traditional, affordable, nutritious' },
      { name: 'Mutton (Lean cuts)',        amount: '100g',  nutrients: { Protein: '25g', Iron: '2.7mg' }, tags: ['Iron + Protein', 'B12'], tip: 'Limit to 2x per week; choose lean cuts over fatty ones' },
    ],
  },
  iron: {
    note: null,
    veg: [
      { name: 'Spinach (Palak)',              amount: '1 cup cooked', nutrients: { Iron: '6.4mg' }, tags: ['Iron-rich', 'Folate', 'Vit K'], tip: 'Add a squeeze of lemon — Vit C triples non-heme iron absorption' },
      { name: 'Moringa / Drumstick Leaves',   amount: '50g',          nutrients: { Iron: '4mg', 'Vit A': 'High' }, tags: ['Superfood', 'Iron', 'Calcium'], tip: 'Add to dal or knead into roti atta' },
      { name: 'Sesame Seeds (Til)',           amount: '2 tbsp',       nutrients: { Iron: '2.6mg', Calcium: '175mg' }, tags: ['Iron', 'Calcium', 'Quick'], tip: 'Sprinkle on salads or make til-gud chikki' },
      { name: 'Jaggery (Gud)',               amount: '20g',          nutrients: { Iron: '2mg' }, tags: ['Natural Iron', 'Affordable', 'Traditional'], tip: 'Replace refined sugar in chai with jaggery — small habit, big gain' },
      { name: 'Masoor Dal (Red Lentils)',    amount: '1 cup cooked', nutrients: { Iron: '6mg', Protein: '9g' }, tags: ['Iron', 'Fastest-cooking dal'], tip: 'Ready in 15 min, richest iron source among dals' },
      { name: 'Amla (Indian Gooseberry)',    amount: '2 pieces',     nutrients: { 'Vit C': '600mg' }, tags: ['Iron Booster', 'Vit C'], tip: 'Eat alongside iron-rich foods — Vit C multiplies iron absorption by 3x' },
    ],
    nonVeg: [
      { name: 'Chicken Liver (Kaleji)',  amount: '70g',  nutrients: { Iron: '7.2mg', 'Vit A': 'High' }, tags: ['Heme Iron', 'Highest bioavailability'], tip: 'Kaleji masala — best weekly iron supplement, no capsule needed' },
      { name: 'Mutton / Lamb',          amount: '100g', nutrients: { Iron: '2.7mg', B12: 'High' }, tags: ['Heme Iron', 'B12', 'Zinc'], tip: 'Heme iron absorbs 2–3x better than plant-based iron' },
      { name: 'Sardines / Bangda Fish', amount: '100g', nutrients: { Iron: '2.9mg', Omega3: '1.5g' }, tags: ['Iron', 'Omega-3', 'Affordable'], tip: 'Coastal staple — tawa-fried or in curry, extremely economical' },
      { name: 'Eggs (especially yolk)', amount: '2 yolks', nutrients: { Iron: '1.8mg', B12: '1.1µg' }, tags: ['Iron', 'B12', 'Budget-friendly'], tip: 'The yolk is where all the iron, B12 and choline concentrate' },
    ],
  },
  fiber: {
    note: null,
    veg: [
      { name: 'Oats / Oat Upma',            amount: '50g dry',      nutrients: { Fibre: '4g' }, tags: ['Soluble Fibre', 'Heart-healthy', 'Low GI'], tip: 'Masala oats with onion, tomato — tastes like upma, hits like a health bomb' },
      { name: 'Flaxseeds (Alsi)',            amount: '1 tbsp ground', nutrients: { Fibre: '2.8g', Omega3: '2.3g' }, tags: ['Fibre + Omega-3', 'Easy to add'], tip: 'Grind and mix into roti atta daily — invisible but powerful' },
      { name: 'Apple (with skin)',           amount: '1 medium',     nutrients: { Fibre: '4.4g' }, tags: ['Pectin', 'Gut microbiome'], tip: 'Never peel — 60% of the fibre is in the skin' },
      { name: 'Sweet Potato (with skin)',    amount: '1 medium baked', nutrients: { Fibre: '3.8g', 'Vit A': 'High' }, tags: ['Fibre', 'Vitamin A', 'Slow carb'], tip: 'Boil and eat with skin for full fibre benefit' },
      { name: 'Broccoli / Cauliflower',     amount: '1 cup steamed', nutrients: { Fibre: '5g', 'Vit C': '85mg' }, tags: ['Cruciferous', 'Fibre + Vit C'], tip: 'Steam or stir-fry — do not boil to mush' },
    ],
    nonVeg: [
      { name: 'Prawn Sabzi with Vegetables', amount: '1 bowl', nutrients: { Fibre: '3g (from veg)' }, tags: ['Protein + Fibre combo'], tip: 'Load with broccoli, carrots — the veg does the fibre work' },
      { name: 'Whole Wheat Roti Fish Curry', amount: '2 rotis + curry', nutrients: { Fibre: '5g' }, tags: ['Whole grain + Protein'], tip: 'Replace maida rotis with atta — simple swap, huge fibre boost' },
    ],
  },
  fat: {
    note: 'Fat intake is above RDA. Focus on replacing saturated fats (fried food, dalda) with healthy unsaturated sources.',
    veg: [
      { name: 'Walnuts (Akhrot)',            amount: '7 halves (28g)',  nutrients: { 'Omega-3': '2.5g', Fat: '18g (healthy)' }, tags: ['Brain health', 'Anti-inflammatory'], tip: 'Eat 7 walnuts every morning — easiest habit for heart and brain' },
      { name: 'Avocado / Butter Fruit',      amount: '½ fruit',         nutrients: { Fat: '15g (MUFA)' }, tags: ['Monounsaturated', 'Heart-healthy'], tip: 'Mash on toast or add to smoothies — replace butter entirely' },
      { name: 'Cold-pressed Coconut Oil',    amount: '1 tsp for cooking', nutrients: { Fat: 'MCT fats' }, tags: ['Medium-chain', 'Use sparingly'], tip: 'Good for high-heat cooking but limit to 1 tsp — excess becomes harmful' },
    ],
    nonVeg: [
      { name: 'Salmon / Rawas (Indian Salmon)', amount: '100g', nutrients: { 'Omega-3': '2g', Fat: '13g (healthy)' }, tags: ['Omega-3', 'Healthy fat'], tip: 'Bake or grill — swap one fried snack per day for this' },
      { name: 'Sardines (Canned or fresh)',      amount: '100g', nutrients: { 'Omega-3': '1.5g' }, tags: ['Affordable Omega-3', 'Brain health'], tip: 'Best budget Omega-3 in India — twice a week is enough' },
    ],
  },
  carbs: {
    note: 'Carb intake is significantly above RDA. Shift to complex, low-glycemic carbohydrates and reduce white rice/maida.',
    veg: [
      { name: 'Jowar / Bajra Roti',   amount: '2 rotis',     nutrients: { Carbs: '40g (complex)' }, tags: ['Traditional', 'Low GI', 'Iron'], tip: 'Ancient Indian millets — far superior to white flour rotis' },
      { name: 'Brown Rice / Red Rice', amount: '½ cup cooked', nutrients: { Carbs: '22g (complex)' }, tags: ['Complex Carbs', 'More nutrients'], tip: 'Replace 50% of white rice — gradual switch is easier to sustain' },
      { name: 'Quinoa Khichdi',        amount: '1 cup cooked', nutrients: { Carbs: '20g', Protein: '8g' }, tags: ['Protein + Carb balance', 'Low GI'], tip: 'Use as khichdi base — higher protein means better blood sugar control' },
    ],
    nonVeg: [
      { name: 'Whole Wheat Pasta + Grilled Chicken', amount: '1 bowl', nutrients: { Carbs: '35g (complex)' }, tags: ['Protein + Complex Carb'], tip: 'Pairing protein with carbs slows digestion and reduces sugar spikes' },
    ],
  },
  bmi: {
    note: 'BMI is in the overweight range (25–29.9). A combination of portion control, activity, and better food choices can help.',
    veg: [
      { name: 'Cucumber + Mint Infused Water', amount: '2L/day',         nutrients: { Calories: '0 kcal' }, tags: ['Hydration', 'Appetite control'], tip: 'Drink a full glass before every meal — reduces portion size naturally' },
      { name: 'Moong Sprouts Salad',           amount: '1 bowl as starter', nutrients: { Protein: '6g', Fibre: '3g' }, tags: ['Low calorie', 'Protein-dense'], tip: 'Start every meal with sprouts — fills you up, leaves less room for rice' },
      { name: 'Methi (Fenugreek) Tea',         amount: '1 cup morning',   nutrients: { 'Metabolism': 'Boost' }, tags: ['Metabolism', 'Blood sugar'], tip: 'Soak 1 tsp methi seeds overnight, drink the water in the morning' },
    ],
    nonVeg: [
      { name: 'Boiled Egg Whites',  amount: '3 whites',  nutrients: { Protein: '10g', Calories: '51 kcal' }, tags: ['Very low calorie', 'Filling'], tip: 'Egg whites are almost zero-fat — best protein source while cutting calories' },
      { name: 'Grilled Fish Tikka', amount: '100g',      nutrients: { Protein: '20g', Fat: '4g' }, tags: ['Low calorie', 'High protein'], tip: 'Grilled is always better than fried — same taste, half the calories' },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function statusOf(n) {
  const r = n.userVal / n.rda;
  if (n.key === 'bmi') {
    if (n.userVal < 18.5) return { label: 'Underweight', color: '#f59e0b', dir: 'low' };
    if (n.userVal <= 24.9) return { label: 'Ideal', color: '#10b981', dir: 'ok' };
    if (n.userVal <= 29.9) return { label: 'Overweight', color: '#f59e0b', dir: 'high' };
    return { label: 'Obese', color: '#ef4444', dir: 'high' };
  }
  if (n.key === 'carbs' || n.key === 'fat') {
    if (r < 0.8) return { label: 'Low', color: '#f59e0b', dir: 'low' };
    if (r <= 1.2) return { label: 'Ideal', color: '#10b981', dir: 'ok' };
    return { label: 'Excess', color: '#ef4444', dir: 'high' };
  }
  if (r < 0.6) return { label: 'Deficient', color: '#ef4444', dir: 'low' };
  if (r < 0.9) return { label: 'Low', color: '#f59e0b', dir: 'low' };
  if (r <= 1.1) return { label: 'Ideal', color: '#10b981', dir: 'ok' };
  return { label: 'Excess', color: '#06b6d4', dir: 'high' };
}

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// ─── Gauge Bar Card ────────────────────────────────────────────────────────────
function NutrientBar({ n }) {
  const t = useT();
  const status = statusOf(n);
  const maxD = Math.max(n.rda * 1.5, n.userVal * 1.05);
  const uPct  = clamp((n.userVal / maxD) * 100, 2, 100);
  const rPct  = clamp((n.rda / maxD) * 100, 2, 100);

  return (
    <div style={{
      background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: '18px 20px',
      position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${n.color}25`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 90, height: 90, background: `radial-gradient(circle at top right, ${n.color}18, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{n.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>{n.label}</div>
            <div style={{ fontSize: 10, color: t.sub, maxWidth: 160 }}>{n.desc}</div>
          </div>
        </div>
        <span style={{ background: `${status.color}18`, color: status.color, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, border: `1px solid ${status.color}30`, flexShrink: 0, marginLeft: 8 }}>{status.label}</span>
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: n.color, fontFamily: t.mono, lineHeight: 1 }}>{n.userVal}<span style={{ fontSize: 11 }}>{n.unit}</span></div>
          <div style={{ fontSize: 9, color: t.sub, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>Your Level</div>
        </div>
        <div style={{ borderLeft: `1px solid ${t.border}`, paddingLeft: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: t.sub, fontFamily: t.mono, lineHeight: 1 }}>{n.rda}<span style={{ fontSize: 11 }}>{n.unit}</span></div>
          <div style={{ fontSize: 9, color: t.sub, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>RDA Target</div>
        </div>
      </div>
      <div style={{ position: 'relative', height: 9, borderRadius: 9, background: t.dark ? '#1a2a3a' : '#e8f5e9' }}>
        <div style={{ position: 'absolute', left: `${rPct}%`, top: -2, bottom: -2, width: 2, background: '#ffffff50', zIndex: 2, borderRadius: 2, transform: 'translateX(-50%)' }} />
        <div style={{ width: `${uPct}%`, height: '100%', background: `linear-gradient(90deg, ${n.color}80, ${n.color})`, borderRadius: 9, transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 9, color: t.sub }}>0</span>
        <span style={{ fontSize: 9, color: '#ffffff50' }}>↑ RDA</span>
        <span style={{ fontSize: 9, color: t.sub }}>{Math.round(maxD)}{n.unit}</span>
      </div>
    </div>
  );
}

// ─── Radar Chart ──────────────────────────────────────────────────────────────
function RadarViz() {
  const t = useT();
  const data = NUTRIENTS.map(n => ({
    subject: n.label,
    You: Math.round(clamp((n.userVal / n.rda) * 100, 0, 190)),
    Ideal: 100,
  }));
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: t.accent, textTransform: 'uppercase', fontFamily: t.mono, marginBottom: 3 }}>◈ Radar — You vs. RDA</div>
      <div style={{ fontSize: 12, color: t.sub, marginBottom: 16 }}>100% = ideal. Under = deficiency. Over = excess.</div>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke={t.border} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: t.sub, fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 190]} tick={{ fill: t.sub, fontSize: 9 }} />
          <Radar name="Ideal" dataKey="Ideal" stroke="#ffffff25" fill="#ffffff05" strokeWidth={1} strokeDasharray="4 2" />
          <Radar name="You" dataKey="You" stroke={t.accent} fill={t.accent} fillOpacity={0.22} strokeWidth={2} />
          <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, color: t.text, borderRadius: 10, fontSize: 12 }} formatter={v => [`${v}%`]} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: t.sub, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 2, background: t.accent, display: 'inline-block', borderRadius: 2 }}/>Your Profile</span>
        <span style={{ fontSize: 11, color: t.sub, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 14, height: 2, background: '#ffffff40', display: 'inline-block', borderRadius: 2 }}/>RDA Ideal</span>
      </div>
    </Card>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function CompareBar() {
  const t = useT();
  const data = NUTRIENTS.map(n => {
    const s = statusOf(n);
    return { name: n.label, Achievement: Math.round((n.userVal / n.rda) * 100), color: s.color };
  });
  return (
    <Card style={{ padding: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: t.accent2, textTransform: 'uppercase', fontFamily: t.mono, marginBottom: 3 }}>◈ % of Daily Target Achieved</div>
      <div style={{ fontSize: 12, color: t.sub, marginBottom: 16 }}>Green line at 100% = your daily RDA. Bars show how close you are.</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: t.sub, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: t.sub, fontSize: 9 }} axisLine={false} tickLine={false} unit="%" domain={[0, 200]} />
          <ReferenceLine y={100} stroke="#ffffff45" strokeDasharray="5 3" label={{ value: '100% RDA', fill: '#ffffff55', fontSize: 9, position: 'insideTopRight' }} />
          <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, color: t.text, borderRadius: 10, fontSize: 12 }} formatter={v => [`${v}%`, 'Achievement']} />
          <Bar dataKey="Achievement" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Food Card ────────────────────────────────────────────────────────────────
function FoodCard({ food, category }) {
  const t = useT();
  const isVeg = category === 'veg';
  const accent = isVeg ? '#10b981' : '#f59713';
  return (
    <div style={{
      background: isVeg ? (t.dark ? '#10b98108' : '#f0fff8') : (t.dark ? '#f5971308' : '#fff9f0'),
      border: `1px solid ${accent}22`, borderLeft: `3px solid ${accent}`,
      borderRadius: 12, padding: '14px 16px', transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${accent}20`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13.5, color: t.text, marginBottom: 2 }}>{food.name}</div>
          <div style={{ fontSize: 11, color: t.sub, fontFamily: t.mono }}>{food.amount}</div>
        </div>
        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: `${accent}15`, color: accent, fontWeight: 800, whiteSpace: 'nowrap', marginLeft: 8, border: `1px solid ${accent}25` }}>
          {isVeg ? '🌿 Veg' : '🍖 Non-Veg'}
        </span>
      </div>
      {/* Nutrient values */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
        {Object.entries(food.nutrients || {}).map(([k, v]) => (
          <span key={k} style={{ fontSize: 10, padding: '2px 9px', borderRadius: 8, background: `${accent}15`, color: accent, fontWeight: 700 }}>{k}: {v}</span>
        ))}
      </div>
      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {(food.tags || []).map(tag => (
          <span key={tag} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 20, background: t.dark ? '#1a2a3a' : '#f0f4f8', color: t.sub, fontWeight: 600 }}>{tag}</span>
        ))}
      </div>
      {/* Tip */}
      {food.tip && (
        <div style={{ fontSize: 11, color: t.sub, background: t.dark ? '#0a1628' : `${accent}08`, borderRadius: 8, padding: '7px 10px', display: 'flex', gap: 6, lineHeight: 1.55 }}>
          <span style={{ flexShrink: 0 }}>💡</span><span>{food.tip}</span>
        </div>
      )}
    </div>
  );
}

// ─── Food Section per nutrient ────────────────────────────────────────────────
function NutrientFoodSection({ n }) {
  const t = useT();
  const [diet, setDiet] = useState('both');
  const foods = FOOD_MAP[n.key];
  const status = statusOf(n);
  if (!foods) return null;

  return (
    <div style={{ border: `1px solid ${n.color}20`, borderRadius: 18, padding: 24, marginBottom: 20, background: t.dark ? `${n.color}05` : `${n.color}03` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, background: `${n.color}18`, border: `1px solid ${n.color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{n.icon}</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: t.text }}>{n.label}</div>
            <div style={{ fontSize: 11, color: t.sub, fontFamily: t.mono }}>
              {n.userVal}{n.unit} &nbsp;/&nbsp; {n.rda}{n.unit} RDA &nbsp;
              <span style={{ background: `${status.color}18`, color: status.color, padding: '1px 8px', borderRadius: 10, fontWeight: 800 }}>{status.label}</span>
            </div>
          </div>
        </div>
        {/* Diet toggle */}
        <div style={{ display: 'flex', background: t.dark ? '#0a1628' : '#e8f5e9', borderRadius: 10, padding: 3, gap: 2 }}>
          {[['both', '🍽 All'], ['veg', '🌿 Veg Only'], ['nonVeg', '🍖 Non-Veg']].map(([k, l]) => (
            <button key={k} onClick={() => setDiet(k)} style={{
              padding: '5px 11px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: diet === k ? n.color : 'transparent',
              color: diet === k ? '#fff' : t.sub, fontSize: 11, fontWeight: 700, transition: 'all 0.18s', whiteSpace: 'nowrap'
            }}>{l}</button>
          ))}
        </div>
      </div>
      {/* Note for excess */}
      {foods.note && (
        <div style={{ background: `${status.color}12`, border: `1px solid ${status.color}25`, borderRadius: 10, padding: '9px 14px', marginBottom: 14, fontSize: 12, color: status.color, fontWeight: 600, display: 'flex', gap: 8 }}>
          <span>⚠️</span><span>{foods.note}</span>
        </div>
      )}
      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {diet !== 'nonVeg' && (foods.veg || []).map((f, i) => <FoodCard key={`v${i}`} food={f} category="veg" />)}
        {diet !== 'veg'    && (foods.nonVeg || []).map((f, i) => <FoodCard key={`nv${i}`} food={f} category="nonVeg" />)}
      </div>
    </div>
  );
}

// ─── Chapter Header ───────────────────────────────────────────────────────────
function ChapterHeader({ num, title, emoji, color, body }) {
  const t = useT();
  return (
    <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${color}22` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{emoji}</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color, textTransform: 'uppercase', fontFamily: t.mono, marginBottom: 2 }}>{num}</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: t.text, letterSpacing: -0.5 }}>{title}</h2>
        </div>
      </div>
      {(body || []).map((p, i) => (
        <p key={i} style={{ margin: '0 0 10px', color: t.sub, fontSize: 14.5, lineHeight: 1.82, maxWidth: 820, fontStyle: i === 0 ? 'italic' : 'normal' }}>{p}</p>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function NutritionStory() {
  const t = useT();
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const h = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? Math.round((window.scrollY / total) * 100) : 0);
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const deficients = NUTRIENTS.filter(n => statusOf(n).dir === 'low');
  const excess     = NUTRIENTS.filter(n => statusOf(n).dir === 'high');
  const ideal      = NUTRIENTS.filter(n => statusOf(n).dir === 'ok');

  return (
    <PageWrap style={{ padding: 0 }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, width: `${scrollPct}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)', zIndex: 9999, transition: 'width 0.1s', borderRadius: '0 2px 2px 0' }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 24px 100px' }}>

        {/* ══════════════════════════════════════════════════════════
            BOOK COVER
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          background: t.dark
            ? 'linear-gradient(150deg, #041a10 0%, #030d1e 55%, #0c0520 100%)'
            : 'linear-gradient(150deg, #f0fff4 0%, #e0f2fe 55%, #faf5ff 100%)',
          border: `1px solid ${t.borderStrong}`, borderRadius: 28, padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 52px)',
          marginBottom: 52, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle, #10b98128, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: 40, width: 240, height: 240, background: 'radial-gradient(circle, #06b6d420, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '35%', left: '45%', width: 350, height: 350, background: 'radial-gradient(circle, #8b5cf610, transparent 70%)', pointerEvents: 'none', transform: 'translate(-50%,-50%)' }} />

          {/* Genre tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${t.accent}18`, border: `1px solid ${t.accent}30`, borderRadius: 30, padding: '6px 18px', marginBottom: 28 }}>
            <span>📖</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: t.accent, letterSpacing: 2, textTransform: 'uppercase', fontFamily: t.mono }}>A Data Story on Human Nutrition · India</span>
          </div>

          <h1 style={{ margin: '0 0 18px', fontSize: 'clamp(26px, 4.5vw, 50px)', fontWeight: 900, lineHeight: 1.12, color: t.text, letterSpacing: -1.5 }}>
            <span style={{ color: t.accent }}>Nutrition</span> Is A Right.<br />
            Yet We Still <span style={{ color: '#ef4444', textDecoration: 'underline', textDecorationStyle: 'line', textDecorationColor: '#ef444450' }}>Deny It.</span>
          </h1>

          <p style={{ margin: '0 0 36px', fontSize: 16, color: t.sub, maxWidth: 660, lineHeight: 1.85, fontStyle: 'italic' }}>
            A visual journey through India's nutritional crisis — what nutrients we lack, why the gap matters, and the exact foods every individual can eat to reclaim their health. For everyone. Veg or non-veg.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            {[
              { label: 'Malnourished Indians', value: '194M', icon: '🧍', color: '#ef4444' },
              { label: 'Children Stunted (<5yr)', value: '35.5%', icon: '📉', color: '#f59e0b' },
              { label: 'Women with Anaemia', value: '57%', icon: '🩸', color: '#ec4899' },
              { label: 'GHI Rank / 125 Nations', value: '#111', icon: '🌍', color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} style={{ background: t.dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${s.color}22`, borderRadius: 16, padding: '18px 16px' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: t.mono, letterSpacing: -1, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: t.sub, marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            PROLOGUE
        ══════════════════════════════════════════════════════════ */}
        <ChapterHeader
          num="Prologue" title="A Right Denied" emoji="⚖️" color="#ef4444"
          body={[
            'Food is not a privilege. Nutrition is not a luxury. Yet across India — in villages, in cities, in homes where mothers skip meals so children can eat — malnutrition remains one of the most silent emergencies of our time.',
            'The Global Hunger Index places India at rank 111 out of 125 nations. Over 35% of children under five are stunted. Anaemia affects nearly 57% of women of reproductive age. These are not just numbers — they are lives cut short, potential never realised.',
            'This is the story of that gap. And what we can do about it — starting with what we put on our plate.',
          ]}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 52 }}>
          {[
            { icon: '🌾', title: 'The Paradox', body: 'India is among the top food-producing nations globally — yet ranks 111th on the Global Hunger Index. Food production never guaranteed nutritional access.', color: '#ef4444' },
            { icon: '👶', title: 'The Hidden Cost', body: 'A malnourished child has 40% lower cognitive performance and earns 10–17% less in adult life. Malnutrition is not just a health crisis — it is an economic one.', color: '#f59e0b' },
            { icon: '🔑', title: 'The Solution', body: 'Awareness, access, and action. Knowing what nutrients your body needs — and which affordable foods deliver them — is the single most powerful first step.', color: '#10b981' },
          ].map(c => (
            <div key={c.title} style={{ background: t.card, border: `1px solid ${c.color}20`, borderLeft: `3px solid ${c.color}`, borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 30, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: t.text, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: t.sub, lineHeight: 1.75 }}>{c.body}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            CHAPTER I: THE NUTRIENTS WE MISS
        ══════════════════════════════════════════════════════════ */}
        <ChapterHeader
          num="Chapter I" title="The Nutrients We Miss" emoji="🔬" color="#f59e0b"
          body={[
            'Every body needs a precise orchestra of nutrients — protein to build and repair, carbohydrates to fuel, iron to carry oxygen, fat for brain and hormones, fibre for a healthy gut. When even one instrument falls silent, the whole body feels it.',
            'Below, explore how a typical malnourished individual\'s nutrient levels compare to recommended daily allowances (RDA). The gap is not only biological — it is economic, geographic, and systemic.',
          ]}
        />

        {/* Quick summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Deficient', items: deficients, color: '#ef4444', icon: '⬇️', note: 'Below recommended intake' },
            { label: 'Excess', items: excess, color: '#f59e0b', icon: '⬆️', note: 'Above recommended intake' },
            { label: 'Ideal', items: ideal, color: '#10b981', icon: '✅', note: 'Within healthy range' },
          ].map(g => (
            <div key={g.label} style={{ background: t.card, border: `1px solid ${g.color}22`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{g.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: g.color, fontFamily: t.mono }}>{g.items.length}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{g.label}</div>
              <div style={{ fontSize: 11, color: t.sub, marginTop: 2, marginBottom: 8 }}>{g.note}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {g.items.map(n => <span key={n.key} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: `${g.color}15`, color: g.color, fontWeight: 700 }}>{n.label}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Gauge bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16, marginBottom: 48 }}>
          {NUTRIENTS.map(n => <NutrientBar key={n.key} n={n} />)}
        </div>

        {/* ══════════════════════════════════════════════════════════
            CHAPTER II: WHAT THE BODY SIGNALS
        ══════════════════════════════════════════════════════════ */}
        <ChapterHeader
          num="Chapter II" title="What the Body Signals" emoji="📊" color="#10b981"
          body={[
            'BMI alone is not the full picture. A person can have a "normal" BMI yet be dangerously deficient in iron or protein — experts call this "hidden hunger." The radar and bar charts below reveal the complete nutritional fingerprint, so nothing slips through the cracks.',
          ]}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, marginBottom: 52 }}>
          <RadarViz />
          <CompareBar />
        </div>

        {/* ══════════════════════════════════════════════════════════
            CHAPTER III: FOOD AS MEDICINE
        ══════════════════════════════════════════════════════════ */}
        <ChapterHeader
          num="Chapter III" title="Food as Medicine" emoji="🥗" color="#06b6d4"
          body={[
            'The solution is not supplements alone. It is food — real, accessible, affordable, culturally rooted food. Whether you are vegetarian or non-vegetarian, Indian kitchens hold the answer to most nutritional deficiencies.',
            'Below are targeted food prescriptions for each nutritional need — with a toggle to switch between vegetarian and non-vegetarian options, so no one is excluded.',
          ]}
        />

        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#10b98112', border: '1px solid #10b98128', borderRadius: 10, padding: '8px 14px' }}>
            <span>🌿</span><span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>Vegetarian — plant-based solutions for every deficiency</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5971312', border: '1px solid #f5971328', borderRadius: 10, padding: '8px 14px' }}>
            <span>🍖</span><span style={{ fontSize: 12, fontWeight: 700, color: '#f59713' }}>Non-Vegetarian — higher bioavailability for certain nutrients</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${t.accent}10`, border: `1px solid ${t.accent}22`, borderRadius: 10, padding: '8px 14px' }}>
            <span>💡</span><span style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>Each card has a practical Indian cooking tip</span>
          </div>
        </div>

        {NUTRIENTS.map(n => <NutrientFoodSection key={n.key} n={n} />)}

        {/* ══════════════════════════════════════════════════════════
            EPILOGUE
        ══════════════════════════════════════════════════════════ */}
        <div style={{
          marginTop: 52, background: t.dark
            ? 'linear-gradient(135deg, #041a10, #030d1e)'
            : 'linear-gradient(135deg, #f0fff4, #e0f2fe)',
          border: `1px solid ${t.borderStrong}`, borderRadius: 28, padding: '44px 48px',
          textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, #10b98120, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, #06b6d415, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 44, marginBottom: 14 }}>🌱</div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: t.accent, textTransform: 'uppercase', fontFamily: t.mono, marginBottom: 8 }}>Epilogue</div>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, color: t.text }}>Every Plate Is a Choice. Every Choice, a Right.</h2>
          <p style={{ margin: '0 auto 28px', color: t.sub, fontSize: 15, maxWidth: 620, lineHeight: 1.85, fontStyle: 'italic' }}>
            "The future of India's nutrition isn't in a pill or a policy alone — it is in the awareness of every individual, the wisdom of every kitchen, and the data that guides every intervention."
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {NUTRIENTS.map(n => (
              <span key={n.key} style={{ padding: '7px 18px', borderRadius: 20, background: `${n.color}15`, color: n.color, fontSize: 12, fontWeight: 700, border: `1px solid ${n.color}28` }}>
                {n.icon} {n.label}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 28, fontSize: 10, color: t.sub, fontFamily: t.mono, letterSpacing: 1.5 }}>
            NUTRISCAN + NUTRITRACK · INDIA NUTRITION INTELLIGENCE PLATFORM · v1.0
          </div>
        </div>

      </div>
    </PageWrap>
  );
}
