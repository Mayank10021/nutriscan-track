import React, { useState } from 'react';
import { useT, Card, PageWrap, SectionTitle } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function Recommendation() {
  const t = useT();
  const [form, setForm] = useState({ ageGroup:'Adult', riskLevel:'Medium' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const sel = { width:'100%',padding:'10px 12px',borderRadius:8,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:'border-box' };

  const get = async () => {
    setLoading(true);
    const params = new URLSearchParams(form);
    const data = await fetch(`${API}/food/recommend?${params}`).then(r=>r.json());
    setResult(data);
    setLoading(false);
  };

  const sC = s => s>=80?t.accent:s>=55?t.warn:t.danger;

  const WEEK_PLAN = [
    { day:'Monday', breakfast:'Idli + Sambar', lunch:'Dal + Roti + Palak', dinner:'Khichdi + Curd', protein:48, cal:1650 },
    { day:'Tuesday', breakfast:'Besan Chilla', lunch:'Rajma + Rice', dinner:'Dal + Roti + Salad', protein:55, cal:1720 },
    { day:'Wednesday', breakfast:'Oats + Banana', lunch:'Chole + Roti', dinner:'Paneer + Rice + Dal', protein:52, cal:1800 },
    { day:'Thursday', breakfast:'Poha + Peanuts', lunch:'Soya Curry + Rice', dinner:'Khichdi + Papad', protein:58, cal:1690 },
    { day:'Friday', breakfast:'Dosa + Sambar', lunch:'Dal + Rice + Spinach', dinner:'Rajma + Roti', protein:50, cal:1750 },
    { day:'Saturday', breakfast:'Sattu Drink', lunch:'Fish Curry + Rice (non-veg)', dinner:'Dal + Roti + Salad', protein:62, cal:1820 },
    { day:'Sunday', breakfast:'Upma + Egg', lunch:'Palak Paneer + Roti', dinner:'Khichdi + Curd', protein:60, cal:1780 },
  ];

  return (
    <PageWrap>
      <div style={{marginBottom:28}}>
        <h1 style={{margin:'0 0 6px',fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>◑ Diet Recommendation Engine</h1>
        <p style={{margin:0,color:t.sub,fontSize:14}}>Personalized Indian meal plans with government scheme suggestions — free, affordable, local</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:20,alignItems:'start'}}>
        {/* Input */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Card>
            <SectionTitle>Your Profile</SectionTitle>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:11,color:t.sub,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5}}>Age Group</label>
              <select value={form.ageGroup} onChange={e=>setForm(f=>({...f,ageGroup:e.target.value}))} style={sel}>
                {['Child','Teen','Young Adult','Adult','Middle Age','Senior'].map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:11,color:t.sub,marginBottom:5,fontWeight:700,textTransform:'uppercase',letterSpacing:0.5}}>Risk Level</label>
              <select value={form.riskLevel} onChange={e=>setForm(f=>({...f,riskLevel:e.target.value}))} style={sel}>
                {['Low','Medium','High'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={get} disabled={loading}
              style={{width:'100%',padding:12,borderRadius:10,border:'none',background:`linear-gradient(135deg,${t.accent},${t.accent2})`,color:'#fff',cursor:loading?'wait':'pointer',fontWeight:700,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              {loading?'⟳ Loading...':'Get Diet Plan'}
            </button>
          </Card>

          {result && (
            <Card>
              <div style={{textAlign:'center',marginBottom:8}}>
                <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1}}>Daily Protein Target</div>
                <div style={{fontSize:48,fontWeight:900,color:t.accent,fontFamily:t.mono,lineHeight:1.1}}>{result.reqProtein}g</div>
              </div>
              <div style={{height:4,borderRadius:2,background:t.muted,overflow:'hidden',marginBottom:4}}>
                <div style={{height:'100%',width:'75%',background:`linear-gradient(90deg,${t.accent},${t.accent2})`,borderRadius:2}}/>
              </div>
              <div style={{fontSize:11,color:t.sub,textAlign:'center'}}>per day for {form.ageGroup}</div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              {/* Daily Meal Plan */}
              <Card>
                <SectionTitle>Today's Suggested Meal Plan</SectionTitle>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
                  {result.mealPlan && Object.entries(result.mealPlan).map(([meal,food]) => food && (
                    <div key={meal} style={{border:`1px solid ${t.border}`,borderRadius:12,padding:14,textAlign:'center'}}>
                      <div style={{fontSize:26,marginBottom:6}}>
                        {{'breakfast':'🌅','morningSnack':'🍎','lunch':'☀️','lunchCereal':'🌾','eveningSnack':'🥜','dinner':'🌙'}[meal]||'🍽️'}
                      </div>
                      <div style={{fontSize:10,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{meal.replace(/([A-Z])/g,' $1').trim()}</div>
                      <div style={{fontWeight:700,color:t.text,fontSize:13,marginBottom:4}}>{food.name}</div>
                      <div style={{fontSize:11,color:t.accent,fontFamily:t.mono}}>{food.cal}kcal · {food.prot}g prot</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Foods */}
              <Card>
                <SectionTitle>Top Recommended Indian Foods</SectionTitle>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
                  {result.recommended?.slice(0,8).map((food,i) => (
                    <div key={i} style={{border:`1px solid ${t.border}`,borderRadius:10,padding:12,transition:'all 0.15s'}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{fontWeight:700,color:t.text,fontSize:13}}>{food.name}</span>
                        <span style={{color:sC(food.score),fontWeight:800,fontSize:12,fontFamily:t.mono}}>{food.score}</span>
                      </div>
                      <div style={{fontSize:11,color:t.sub,marginBottom:4}}>{food.cat}</div>
                      <div style={{fontSize:11}}><span style={{color:t.sub}}>{food.cal}kcal · </span><strong style={{color:t.accent}}>{food.prot}g protein</strong></div>
                      {food.govtScheme && <div style={{marginTop:6,fontSize:10,color:t.accent2,fontWeight:600}}>🏛 {food.govtScheme}</div>}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Weekly Plan */}
              <Card>
                <SectionTitle>7-Day Weekly Meal Plan (Indian Style)</SectionTitle>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                    <thead>
                      <tr style={{background:t.dark?'#0f1f36':'#f0fdf4'}}>
                        {['Day','Breakfast','Lunch','Dinner','Protein','Calories'].map(h=>(
                          <th key={h} style={{padding:'9px 12px',textAlign:'left',color:t.sub,fontWeight:700,borderBottom:`1px solid ${t.border}`,fontFamily:t.mono,fontSize:11,textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {WEEK_PLAN.map((day,i) => (
                        <tr key={i} style={{borderBottom:`1px solid ${t.border}`}}>
                          <td style={{padding:'9px 12px',fontWeight:700,color:t.accent,fontFamily:t.mono,fontSize:11}}>{day.day}</td>
                          <td style={{padding:'9px 12px',color:t.text,fontSize:12}}>{day.breakfast}</td>
                          <td style={{padding:'9px 12px',color:t.text,fontSize:12}}>{day.lunch}</td>
                          <td style={{padding:'9px 12px',color:t.text,fontSize:12}}>{day.dinner}</td>
                          <td style={{padding:'9px 12px',color:t.accent,fontWeight:700,fontFamily:t.mono}}>{day.protein}g</td>
                          <td style={{padding:'9px 12px',color:t.sub,fontFamily:t.mono}}>{day.cal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Govt Schemes */}
              <Card>
                <SectionTitle>Government Nutrition Schemes</SectionTitle>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {result.govtSchemes?.map((scheme,i) => (
                    <div key={i} style={{display:'flex',gap:14,padding:'12px 16px',background:`${t.accent2}08`,border:`1px solid ${t.accent2}20`,borderRadius:12}}>
                      <div style={{width:6,borderRadius:3,background:t.accent2,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:t.text,fontSize:13}}>{scheme.name}</div>
                        <div style={{fontSize:12,color:t.sub,marginTop:2}}>👥 Target: {scheme.target}</div>
                        <div style={{fontSize:12,color:t.accent2,marginTop:2}}>✅ {scheme.benefit}</div>
                      </div>
                      <a href={`tel:${scheme.contact}`} style={{fontSize:12,color:t.accent,fontWeight:700,fontFamily:t.mono,textDecoration:'none',alignSelf:'center',whiteSpace:'nowrap'}}>📞 {scheme.contact}</a>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card style={{textAlign:'center',padding:60}}>
              <div style={{fontSize:48,marginBottom:14,opacity:0.4}}>◑</div>
              <div style={{fontWeight:700,fontSize:18,color:t.text,marginBottom:8}}>Personalized Plan Awaits</div>
              <div style={{color:t.sub,fontSize:13,maxWidth:320,margin:'0 auto',lineHeight:1.6}}>Select your age group and risk level to get an India-first diet plan with affordable local foods and government scheme information.</div>
            </Card>
          )}
        </div>
      </div>
    </PageWrap>
  );
}
