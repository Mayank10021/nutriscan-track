import React, { useState } from 'react';
import { useT, Card, PageWrap, Input, Select, Btn } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function RiskPredictor() {
  const t = useT();
  const [form, setForm] = useState({ age:'30', weight:'55', height:'160', calories:'450', protein:'25', fat:'20', carbs:'150', fiber:'10', steps:'2000', sittingHours:'8', sleepHours:'6', ageGroup:'Adult', region:'North', incomeGroup:'Low Income' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}));
  const rC = r => r==='High'?t.danger:r==='Medium'?t.warn:t.accent;

  const predict = async () => {
    setLoading(true); setError(''); setResult(null);
    const bmi = parseFloat(form.weight)/((parseFloat(form.height)/100)**2);
    const payload = {...form, bmi, ...Object.fromEntries(['age','weight','height','calories','protein','fat','carbs','fiber','steps','sittingHours','sleepHours'].map(k=>[k,parseFloat(form[k])||0]))};
    const res = await fetch(`${API}/predict/risk`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(r=>r.json()).catch(e=>({message:e.message}));
    if (res.message && !res.riskLevel) setError(res.message);
    else setResult(res);
    setLoading(false);
  };

  return (
    <PageWrap>
      <div style={{marginBottom:24}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6,flexWrap:'wrap'}}>
          <h1 style={{margin:0,fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>🧠 Malnutrition Risk AI</h1>
          <span style={{background:`${t.accent}15`,color:t.accent,padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:800,border:`1px solid ${t.accent}30`}}>PYTHON ML ENGINE</span>
        </div>
        <p style={{margin:0,color:t.sub,fontSize:14}}>Random Forest (99.97% acc) + Logistic Regression (81.91% acc) — 14 health indicators → explainable risk score</p>
      </div>

      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {[['🌲 Random Forest','99.97% Accuracy',t.accent],['📈 Logistic Regression','81.91% Accuracy',t.accent2],['📊 Training Set','44,000 records','#8b5cf6'],['🔬 SHAP','Feature Importance',t.warn]].map(([l,v,c])=>(
          <div key={l} style={{background:`${c}10`,border:`1px solid ${c}20`,borderRadius:10,padding:'8px 14px',fontSize:12}}>
            <span style={{color:t.sub}}>{l}: </span><span style={{color:c,fontWeight:700,fontFamily:t.mono}}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'400px 1fr',gap:20}}>
        <Card>
          <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:18}}>Patient Data Input</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            {[['age','Age (yrs)','30'],['weight','Weight (kg)','55'],['height','Height (cm)','160'],['calories','Calories/day','450'],['protein','Protein (g)','25'],['fat','Fat (g)','20'],['carbs','Carbs (g)','150'],['fiber','Fiber (g)','10'],['steps','Steps/day','2000'],['sittingHours','Sitting Hrs','8'],['sleepHours','Sleep Hrs','6']].map(([k,l,p])=>(
              <Input key={k} label={l} type="number" value={form[k]} onChange={set(k)} placeholder={p} />
            ))}
            <Select label="Age Group" value={form.ageGroup} onChange={set('ageGroup')} options={['Child','Teen','Young Adult','Adult','Middle Age','Senior']} />
          </div>
          <Select label="Region" value={form.region} onChange={set('region')} options={['North','South','East','West','Central','Northeast']} style={{marginBottom:10}} />
          <Select label="Income Group" value={form.incomeGroup} onChange={set('incomeGroup')} options={['Below Poverty Line','Low Income','Middle Income','Upper Middle Income','High Income']} style={{marginBottom:16}} />
          {error && <div style={{marginBottom:12,padding:'10px 14px',background:`${t.danger}12`,borderRadius:8,color:t.danger,fontSize:13}}>{error}</div>}
          <Btn onClick={predict} disabled={loading} size="lg" style={{width:'100%'}}>{loading?'⟳ Running Python ML...':'🧠 Predict Risk with AI'}</Btn>
        </Card>

        <div>
          {result ? (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <Card glow style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:t.sub,fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:10,fontFamily:t.mono}}>Malnutrition Risk Score</div>
                <div style={{fontSize:88,fontWeight:900,color:rC(result.riskLevel),fontFamily:t.mono,lineHeight:1}}>{result.riskScore?.toFixed(0)}</div>
                <div style={{color:t.sub,fontSize:12,margin:'4px 0 16px'}}>/100</div>
                <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
                  <span style={{background:`${rC(result.riskLevel)}20`,color:rC(result.riskLevel),padding:'8px 22px',borderRadius:20,fontWeight:800,fontSize:16,border:`1px solid ${rC(result.riskLevel)}40`}}>
                    {result.riskLevel==='High'?'🔴':result.riskLevel==='Medium'?'🟡':'🟢'} {result.riskLevel} Risk
                  </span>
                  <span style={{background:`${t.accent2}15`,color:t.accent2,padding:'8px 22px',borderRadius:20,fontWeight:700,fontSize:14}}>{result.confidence}% Confidence</span>
                  <span style={{background:`${t.sub}12`,color:t.sub,padding:'8px 16px',borderRadius:20,fontSize:12}}>BMI: {result.bmi} — {result.bmiCategory}</span>
                </div>
              </Card>

              {result.models && (
                <Card>
                  <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:14}}>Model Comparison</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {Object.entries(result.models).map(([key,m])=>(
                      <div key={key} style={{border:`1px solid ${t.border}`,borderRadius:12,padding:14}}>
                        <div style={{fontWeight:700,color:t.text,fontSize:13,marginBottom:8}}>{key==='randomForest'?'🌲 Random Forest':'📈 Logistic Regression'}</div>
                        <div style={{fontSize:11,color:t.sub,marginBottom:6}}>Accuracy: <span style={{color:t.accent,fontFamily:t.mono}}>{m.accuracy}%</span></div>
                        <div style={{fontWeight:800,color:rC(m.prediction),marginBottom:8,fontSize:14}}>{m.prediction} Risk</div>
                        {m.probabilities&&<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                          {Object.entries(m.probabilities).map(([k,v])=>(
                            <span key={k} style={{fontSize:11,padding:'2px 8px',borderRadius:6,background:`${rC(k)}12`,color:rC(k),fontFamily:t.mono}}>{k}: {v}%</span>
                          ))}
                        </div>}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {result.featureImportance && (
                <Card>
                  <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:14}}>SHAP Feature Importance — Why This Prediction?</div>
                  {result.featureImportance.slice(0,8).map((f,i)=>(
                    <div key={i} style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                        <span style={{color:t.text,fontSize:13}}>{f.name}</span>
                        <span style={{color:t.accent,fontWeight:700,fontSize:12,fontFamily:t.mono}}>{f.importance}%</span>
                      </div>
                      <div style={{height:5,borderRadius:3,background:t.dark?'#0f1f36':'#f0fdf4',overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${f.importance}%`,background:`linear-gradient(90deg,${t.accent},${t.accent2})`,borderRadius:3}} />
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {result.recommendations && (
                <Card>
                  <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:14}}>Personalized Recommendations</div>
                  {result.recommendations.map((r,i)=>(
                    <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:i<result.recommendations.length-1?`1px solid ${t.border}`:'none'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:r.impact==='high'?t.danger:r.impact==='medium'?t.warn:t.accent,marginTop:4,flexShrink:0}} />
                      <div>
                        <div style={{fontWeight:700,fontSize:13,color:t.text}}>{r.factor}</div>
                        <div style={{fontSize:12,color:t.sub,marginTop:2}}>{r.advice}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          ) : (
            <Card style={{textAlign:'center',padding:60}}>
              <div style={{fontSize:64,marginBottom:16}}>🧠</div>
              <div style={{fontWeight:800,fontSize:20,color:t.text,marginBottom:10}}>Python ML Model Ready</div>
              <div style={{color:t.sub,fontSize:14,maxWidth:340,margin:'0 auto',lineHeight:1.7}}>Enter patient data and click predict. The pre-trained Random Forest model will analyze 14 health indicators and return an explainable risk score with SHAP feature importance.</div>
            </Card>
          )}
        </div>
      </div>
    </PageWrap>
  );
}
