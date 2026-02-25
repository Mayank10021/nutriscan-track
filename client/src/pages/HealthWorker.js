import React, { useState, useEffect } from 'react';
import { useT, Card, PageWrap, Input, Select, Btn, RiskBadge } from '../components/UI';

const API = 'http://localhost:5000/api';

const EMPTY = { name:'', age:'', gender:'Male', weight:'', height:'', district:'', state:'', region:'North', calories:'', protein:'', fat:'', carbs:'', incomeGroup:'Middle Income', vaccinationStatus:'Complete', notes:'' };

export default function HealthWorker() {
  const t = useT();
  const [form, setForm] = useState(EMPTY);
  const [result, setResult] = useState(null);
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('add');

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => { fetchChildren(); }, []);

  const fetchChildren = () => {
    fetch(`${API}/child`).then(r=>r.json()).then(d=>{ setChildren(d.children||[]); setStats(d.stats||{}); }).catch(()=>{});
  };

  const submit = async () => {
    setLoading(true);
    const res = await fetch(`${API}/child`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, age:+form.age, weight:+form.weight, height:+form.height, calories:+form.calories, protein:+form.protein, fat:+form.fat, carbs:+form.carbs}) }).then(r=>r.json());
    setResult(res);
    setForm(EMPTY);
    fetchChildren();
    setLoading(false);
  };

  const del = async (id) => {
    await fetch(`${API}/child/${id}`, {method:'DELETE'});
    fetchChildren();
  };

  const rC = r => r==='High'?t.danger:r==='Medium'?t.warn:t.accent;

  return (
    <PageWrap>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:'0 0 6px', fontWeight:900, fontSize:26, color:t.text, letterSpacing:-0.8 }}>👩‍⚕️ Health Worker Panel</h1>
        <p style={{ margin:0, color:t.sub, fontSize:14 }}>Add child health records, scan BMI, get instant risk score — designed for ASHA workers & Anganwadi centers</p>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        {[
          { label:'Records Added', val:stats.total||0, color:t.accent },
          { label:'High Risk Children', val:stats.highRisk||0, color:t.danger },
          { label:'Avg BMI', val:stats.avgBMI||0, color:t.accent2 },
        ].map(s=>(
          <div key={s.label} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:12, padding:'14px 20px', flex:1, minWidth:140 }}>
            <div style={{ fontSize:26, fontWeight:900, color:s.color, fontFamily:t.mono }}>{s.val}</div>
            <div style={{ fontSize:12, color:t.sub, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['add','➕ Add Child Record'],['list','📋 View Records']].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ padding:'10px 20px', borderRadius:10, border:`1px solid ${tab===v?t.accent:t.border}`, background:tab===v?`${t.accent}15`:t.card, color:tab===v?t.accent:t.sub, cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
            {l}
          </button>
        ))}
      </div>

      {tab==='add' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20 }}>
          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>Child / Patient Information</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <Input label="Child Name" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ramesh Kumar" />
              <Input label="Age (years)" type="number" value={form.age} onChange={e=>set('age',e.target.value)} placeholder="7" />
              <Select label="Gender" value={form.gender} onChange={e=>set('gender',e.target.value)} options={['Male','Female','Other']} />
              <Input label="Weight (kg)" type="number" value={form.weight} onChange={e=>set('weight',e.target.value)} placeholder="18" />
              <Input label="Height (cm)" type="number" value={form.height} onChange={e=>set('height',e.target.value)} placeholder="110" />
              <Select label="Region" value={form.region} onChange={e=>set('region',e.target.value)} options={['North','South','East','West','Central','Northeast']} />
              <Input label="District" value={form.district} onChange={e=>set('district',e.target.value)} placeholder="Varanasi" />
              <Input label="State" value={form.state} onChange={e=>set('state',e.target.value)} placeholder="Uttar Pradesh" />
            </div>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, margin:'16px 0 12px' }}>Daily Nutrition Intake</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
              <Input label="Calories" type="number" value={form.calories} onChange={e=>set('calories',e.target.value)} placeholder="800" />
              <Input label="Protein (g)" type="number" value={form.protein} onChange={e=>set('protein',e.target.value)} placeholder="20" />
              <Input label="Fat (g)" type="number" value={form.fat} onChange={e=>set('fat',e.target.value)} placeholder="15" />
              <Input label="Carbs (g)" type="number" value={form.carbs} onChange={e=>set('carbs',e.target.value)} placeholder="120" />
              <Select label="Income Group" value={form.incomeGroup} onChange={e=>set('incomeGroup',e.target.value)} options={['Below Poverty Line','Low Income','Middle Income','Upper Middle Income','High Income']} />
              <Select label="Vaccination" value={form.vaccinationStatus} onChange={e=>set('vaccinationStatus',e.target.value)} options={['Complete','Partial','Not Vaccinated','Unknown']} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, color:t.sub, marginBottom:5, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>Health Worker Notes</label>
              <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Any observations, symptoms, follow-up notes..." style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif", resize:'vertical', minHeight:80, boxSizing:'border-box' }} />
            </div>
            <Btn onClick={submit} disabled={loading} size="lg" style={{ width:'100%' }}>
              {loading?'⟳ Analyzing...':'🔍 Add Record & Calculate Risk'}
            </Btn>
          </Card>

          {/* Result Panel */}
          <div>
            {result ? (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <Card glow>
                  <div style={{ textAlign:'center', padding:'8px 0' }}>
                    <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Risk Score</div>
                    <div style={{ fontSize:72, fontWeight:900, color:rC(result.riskLevel), fontFamily:t.mono, lineHeight:1 }}>{result.riskScore}</div>
                    <div style={{ color:t.sub, fontSize:12, margin:'4px 0 14px' }}>/ 100</div>
                    <RiskBadge level={result.riskLevel} />
                  </div>
                </Card>
                <Card>
                  <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Assessment Results</div>
                  {[
                    ['BMI', result.bmi, result.bmiCategory],
                    ['Stunting', null, result.stuntingStatus],
                    ['Wasting', null, result.wastingStatus],
                  ].map(([label, val, status])=>(
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${t.border}` }}>
                      <span style={{ color:t.sub, fontSize:13 }}>{label}</span>
                      <span style={{ color:status?.includes('Normal')?t.accent:t.danger, fontWeight:700, fontSize:13 }}>{val?`${val} — `:''}{status}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Immediate Actions</div>
                  {result.riskLevel==='High' && (
                    <div style={{ background:`${t.danger}12`, border:`1px solid ${t.danger}25`, borderRadius:10, padding:12, marginBottom:10 }}>
                      <div style={{ color:t.danger, fontWeight:700, fontSize:13, marginBottom:4 }}>🚨 Urgent Action Needed</div>
                      <div style={{ color:t.sub, fontSize:12 }}>Refer to PHC/Anganwadi immediately. Start therapeutic feeding. Call 1098 for support.</div>
                    </div>
                  )}
                  {result.riskLevel==='Medium' && (
                    <div style={{ background:`${t.warn}12`, border:`1px solid ${t.warn}25`, borderRadius:10, padding:12, marginBottom:10 }}>
                      <div style={{ color:t.warn, fontWeight:700, fontSize:13, marginBottom:4 }}>⚠️ Monitoring Required</div>
                      <div style={{ color:t.sub, fontSize:12 }}>Schedule follow-up in 2 weeks. Prescribe iron+folic acid supplements. Increase protein intake.</div>
                    </div>
                  )}
                  <div style={{ background:`${t.accent}10`, border:`1px solid ${t.accent}20`, borderRadius:10, padding:12 }}>
                    <div style={{ color:t.accent, fontWeight:700, fontSize:12 }}>Suggest: Dal + Egg + Moringa leaves daily</div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card style={{ textAlign:'center', padding:50 }}>
                <div style={{ fontSize:48, marginBottom:14 }}>👩‍⚕️</div>
                <div style={{ fontWeight:700, fontSize:16, color:t.text, marginBottom:8 }}>Add a Child Record</div>
                <div style={{ color:t.sub, fontSize:13, lineHeight:1.6 }}>Fill in the child's health data to get instant BMI, stunting assessment, and malnutrition risk score.</div>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab==='list' && (
        <Card style={{ padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:t.dark?'#0f1f36':'#f0fdf4' }}>
                  {['Name','Age','Gender','BMI','BMI Cat','Risk','Stunting','District','State','Date','Action'].map(h=>(
                    <th key={h} style={{ padding:'11px 12px', textAlign:'left', color:t.sub, fontWeight:700, borderBottom:`1px solid ${t.border}`, whiteSpace:'nowrap', fontSize:11, fontFamily:t.mono }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {children.length===0 && (
                  <tr><td colSpan={11} style={{ padding:30, textAlign:'center', color:t.sub }}>No records yet. Add a child from the "Add Record" tab.</td></tr>
                )}
                {children.map((c,i)=>(
                  <tr key={i} style={{ borderBottom:`1px solid ${t.border}` }}>
                    <td style={{ padding:'9px 12px', color:t.text, fontWeight:600 }}>{c.name}</td>
                    <td style={{ padding:'9px 12px', color:t.sub, fontFamily:t.mono }}>{c.age}</td>
                    <td style={{ padding:'9px 12px', color:t.sub }}>{c.gender}</td>
                    <td style={{ padding:'9px 12px', color:t.text, fontFamily:t.mono }}>{c.bmi}</td>
                    <td style={{ padding:'9px 12px', color:c.bmiCategory==='Underweight'?t.danger:t.accent }}>{c.bmiCategory}</td>
                    <td style={{ padding:'9px 12px' }}><RiskBadge level={c.riskLevel} /></td>
                    <td style={{ padding:'9px 12px', color:c.stuntingStatus?.includes('Stunting')?t.warn:t.accent, fontSize:11 }}>{c.stuntingStatus}</td>
                    <td style={{ padding:'9px 12px', color:t.sub }}>{c.district}</td>
                    <td style={{ padding:'9px 12px', color:t.sub }}>{c.state}</td>
                    <td style={{ padding:'9px 12px', color:t.sub, fontFamily:t.mono }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding:'9px 12px' }}>
                      <button onClick={()=>del(c._id)} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${t.danger}40`, background:`${t.danger}10`, color:t.danger, cursor:'pointer', fontSize:11, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>Delete</button>
                    </td>
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
