import React, { useState, useEffect } from 'react';
import { useT, Card, PageWrap, Input, Select, SectionTitle } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function ActivityTracker() {
  const t = useT();
  const [form, setForm] = useState({ steps:'', sittingHours:'', sleepHours:'', waterIntake:'', caloriesBurned:'', activityType:'Walking', notes:'' });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/activity/history`).then(r=>r.json()).then(setHistory).catch(()=>{});
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/activity/log`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, steps:+form.steps, sittingHours:+form.sittingHours, sleepHours:+form.sleepHours, waterIntake:+form.waterIntake, caloriesBurned:+form.caloriesBurned })
      }).then(r=>r.json());
      setResult(res);
      fetch(`${API}/activity/history`).then(r=>r.json()).then(setHistory).catch(()=>{});
    } catch(e) {}
    setLoading(false);
  };

  const aC = type => type==='danger' ? t.danger : type==='warning' ? t.warn : t.info;

  const targets = [
    { icon:'🚶', label:'Daily Steps', target:'3,000 min / 7,000 ideal', color:t.accent, val:form.steps, max:10000 },
    { icon:'🪑', label:'Max Sitting', target:'< 6 hours/day', color:t.warn, val:form.sittingHours, max:12 },
    { icon:'😴', label:'Sleep Target', target:'7–9 hours', color:t.accent2, val:form.sleepHours, max:12 },
    { icon:'💧', label:'Water Intake', target:'2–3 litres', color:t.accent3, val:form.waterIntake, max:5 },
  ];

  return (
    <PageWrap>
      {/* Header */}
      <div style={{marginBottom:28}}>
        <h1 style={{margin:'0 0 6px',fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>◎ Activity Tracker</h1>
        <p style={{margin:0,color:t.sub,fontSize:14}}>Sedentary alert engine — steps, sleep & sitting analysis with real-time risk scoring</p>
      </div>

      {/* Target Progress Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:24}}>
        {targets.map(item => {
          const pct = item.val ? Math.min(100, (parseFloat(item.val)/item.max)*100) : 0;
          return (
            <div key={item.label} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:22}}>{item.icon}</span>
                <span style={{color:item.color,fontWeight:800,fontSize:13,fontFamily:t.mono}}>{item.val || '—'}</span>
              </div>
              <div style={{height:4,borderRadius:2,background:t.dark?'#0f1f36':'#f0fdf4',marginBottom:8,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${pct}%`,background:item.color,borderRadius:2,transition:'width 0.3s'}}/>
              </div>
              <div style={{fontWeight:700,color:t.text,fontSize:12}}>{item.label}</div>
              <div style={{fontSize:11,color:t.sub,marginTop:2}}>{item.target}</div>
            </div>
          );
        })}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:20,alignItems:'start'}}>
        {/* Input Form */}
        <Card>
          <SectionTitle>Log Today's Activity</SectionTitle>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
            {[['steps','Steps Count','5000'],['sittingHours','Sitting Hours','6'],['sleepHours','Sleep Hours','7'],['waterIntake','Water (Litres)','2.5'],['caloriesBurned','Cal Burned','200']].map(([k,l,p]) => (
              <div key={k}>
                <label style={{display:'block',fontSize:11,color:t.sub,marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>{l}</label>
                <input type="number" step="0.5" placeholder={p} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                  style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:'border-box'}} />
              </div>
            ))}
            <div>
              <label style={{display:'block',fontSize:11,color:t.sub,marginBottom:4,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>Activity Type</label>
              <select value={form.activityType} onChange={e=>setForm(f=>({...f,activityType:e.target.value}))}
                style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:'border-box'}}>
                {['Walking','Running','Cycling','Swimming','Yoga','Gym','Sports','Sedentary','Housework'].map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <textarea placeholder="Notes..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
            style={{width:'100%',padding:'9px 12px',borderRadius:8,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",height:64,resize:'vertical',marginBottom:14,boxSizing:'border-box'}} />
          <button onClick={submit} disabled={loading}
            style={{width:'100%',padding:12,borderRadius:10,border:'none',background:loading?t.muted:`linear-gradient(135deg,${t.accent},${t.accent2})`,color:loading?t.sub:'#fff',cursor:loading?'wait':'pointer',fontWeight:700,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            {loading ? '⟳ Analyzing...' : '◎ Analyze Activity'}
          </button>

          {/* Rule Engine display */}
          <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${t.border}`}}>
            <div style={{fontSize:11,color:t.sub,fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>Risk Rule Engine</div>
            {[['Steps < 3000','+10% risk',t.danger],['Steps < 1000','+5% extra',t.danger],['Sitting > 6hrs','+8% risk',t.warn],['Sitting > 10hrs','+5% extra',t.warn],['Sleep < 6hrs','+5% risk',t.warn],['Water < 1.5L','+3% risk',t.info]].map(([cond,eff,c])=>(
              <div key={cond} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${t.border}`,fontSize:12}}>
                <code style={{color:t.sub,fontFamily:t.mono,fontSize:11}}>{cond}</code>
                <span style={{color:c,fontWeight:700}}>{eff}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Results */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {result && (
            <Card glow>
              <div style={{display:'flex',gap:14,marginBottom:16}}>
                <div style={{flex:1,textAlign:'center',background:result.sedentaryAlert?`${t.danger}12`:`${t.accent}12`,border:`1px solid ${result.sedentaryAlert?t.danger:t.accent}25`,borderRadius:12,padding:16}}>
                  <div style={{fontSize:32,marginBottom:6}}>{result.sedentaryAlert?'⚠️':'✅'}</div>
                  <div style={{fontWeight:800,color:result.sedentaryAlert?t.danger:t.accent,fontSize:14}}>{result.sedentaryAlert?'SEDENTARY ALERT':'ACTIVE TODAY'}</div>
                </div>
                <div style={{flex:1,textAlign:'center',background:`${result.riskIncrease>15?t.danger:t.warn}12`,border:`1px solid ${result.riskIncrease>15?t.danger:t.warn}25`,borderRadius:12,padding:16}}>
                  <div style={{fontSize:40,fontWeight:900,color:result.riskIncrease>15?t.danger:t.warn,fontFamily:t.mono,lineHeight:1}}>+{result.riskIncrease}%</div>
                  <div style={{fontWeight:600,color:t.sub,fontSize:12,marginTop:4}}>Risk Increase Today</div>
                </div>
              </div>
              {result.alerts?.map((a,i) => (
                <div key={i} style={{padding:'10px 14px',borderRadius:10,marginBottom:8,background:`${aC(a.type)}10`,border:`1px solid ${aC(a.type)}25`}}>
                  <div style={{fontWeight:700,color:aC(a.type),fontSize:13}}>{a.title}</div>
                  <div style={{color:t.sub,fontSize:12,marginTop:2}}>{a.message}</div>
                </div>
              ))}
              {!result.alerts?.length && <div style={{textAlign:'center',color:t.accent,fontWeight:700,padding:16}}>🎉 All activity goals met today! Keep it up!</div>}
            </Card>
          )}

          {!result && (
            <Card style={{textAlign:'center',padding:48}}>
              <div style={{fontSize:48,marginBottom:14,opacity:0.4}}>◎</div>
              <div style={{fontWeight:700,fontSize:16,color:t.text,marginBottom:6}}>Log Today's Activity</div>
              <div style={{color:t.sub,fontSize:13,lineHeight:1.6}}>Enter your steps, sitting hours, sleep, and water intake. The rule engine will calculate sedentary risk and generate personalized alerts.</div>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <SectionTitle>Daily Health Tips</SectionTitle>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[['🚶 Walk 30 min/day',t.accent,'Even 3 breaks of 10 min count'],['🧘 Stretch hourly',t.accent2,'5-min stretch every 30 mins sitting'],['💧 Drink before thirsty',t.accent3,'1 glass water every 2 hours'],['🌙 Sleep by 10pm',t.warn,'Consistent sleep schedule matters'],['🥗 Add green veggies',t.success,'1 serving spinach/moringa daily'],['📵 No screens at night',t.sub,'Blue light disrupts melatonin']].map(([tip,c,desc])=>(
                <div key={tip} style={{padding:'10px 12px',background:`${c}08`,border:`1px solid ${c}18`,borderRadius:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:3}}>{tip}</div>
                  <div style={{fontSize:11,color:t.sub}}>{desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card style={{marginTop:20}}>
          <SectionTitle>Activity History (Last 30 Days)</SectionTitle>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{background:t.dark?'#0f1f36':'#f0fdf4'}}>
                  {['Date','Steps','Sitting','Sleep','Water','Activity','Alert','Risk+'].map(h=>(
                    <th key={h} style={{padding:'9px 10px',textAlign:'left',color:t.sub,fontWeight:700,borderBottom:`1px solid ${t.border}`,fontFamily:t.mono,fontSize:11,textTransform:'uppercase'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((log,i) => (
                  <tr key={i} style={{borderBottom:`1px solid ${t.border}`}}>
                    <td style={{padding:'8px 10px',color:t.sub,fontFamily:t.mono,fontSize:11}}>{new Date(log.date).toLocaleDateString('en-IN')}</td>
                    <td style={{padding:'8px 10px',color:log.steps<3000?t.danger:t.accent,fontWeight:700,fontFamily:t.mono}}>{log.steps?.toLocaleString()}</td>
                    <td style={{padding:'8px 10px',color:log.sittingHours>6?t.danger:t.text,fontFamily:t.mono}}>{log.sittingHours}h</td>
                    <td style={{padding:'8px 10px',color:log.sleepHours<6?t.warn:t.text,fontFamily:t.mono}}>{log.sleepHours}h</td>
                    <td style={{padding:'8px 10px',color:t.text,fontFamily:t.mono}}>{log.waterIntake}L</td>
                    <td style={{padding:'8px 10px',color:t.sub}}>{log.activityType}</td>
                    <td style={{padding:'8px 10px',color:log.sedentaryAlert?t.danger:t.accent,fontWeight:700}}>{log.sedentaryAlert?'⚠ YES':'✓ NO'}</td>
                    <td style={{padding:'8px 10px',color:log.riskIncrease>10?t.danger:t.warn,fontWeight:700,fontFamily:t.mono}}>+{log.riskIncrease}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageWrap>
  );
}
