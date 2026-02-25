import React, { useState, useEffect } from 'react';
import { useT, Card, PageWrap, Btn } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function FoodAnalyzer() {
  const t = useT();
  const [foods, setAll] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('');
  const [cats, setCats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [analyzeInput, setAnalyzeInput] = useState('');
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [tab, setTab] = useState('browse');

  useEffect(() => {
    fetch(`${API}/food/list`).then(r=>r.json()).then(d=>{ setAll(d); setDisplayed(d); });
    fetch(`${API}/food/categories`).then(r=>r.json()).then(setCats);
  }, []);

  const doFilter = (s=search, c=cat) => {
    let f = foods;
    if (s) f = f.filter(x => x.name.toLowerCase().includes(s.toLowerCase()) || x.aliases?.some(a=>a.includes(s.toLowerCase())));
    if (c) f = f.filter(x => x.cat === c);
    setDisplayed(f);
  };

  const analyze = async () => {
    if (!analyzeInput.trim()) return;
    const [name, ...qtyParts] = analyzeInput.split(' ');
    const qty = qtyParts.length ? parseFloat(qtyParts.join(' '))||1 : 1;
    const res = await fetch(`${API}/food/analyze-name`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ foodName:name, quantity:qty }) }).then(r=>r.json());
    setAnalyzeResult(res);
  };

  const sC = s => s>=80?t.accent:s>=55?t.warn:t.danger;
  const sL = s => s>=80?'✅ Healthy':s>=55?'⚠️ Moderate':'❌ Avoid';

  const NutrientBar = ({ label, val, max, unit, color }) => (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3, fontSize:12 }}>
        <span style={{ color:t.sub }}>{label}</span>
        <span style={{ color:t.text, fontWeight:700, fontFamily:t.mono }}>{val}{unit}</span>
      </div>
      <div style={{ height:5, borderRadius:3, background:t.dark?'#0f1f36':'#f0fdf4', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${Math.min(100,(val/max)*100)}%`, background:color, borderRadius:3, transition:'width 0.5s ease' }} />
      </div>
    </div>
  );

  return (
    <PageWrap>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:'0 0 6px', fontWeight:900, fontSize:26, color:t.text, letterSpacing:-0.8 }}>🍛 Smart Food Analyzer</h1>
        <p style={{ margin:0, color:t.sub, fontSize:14 }}>30+ Indian foods — type any food name to get instant nutrition analysis, health score, and meal recommendations</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['browse','🔍 Browse Foods'],['analyze','⚡ Smart Analyze']].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{ padding:'10px 20px', borderRadius:10, border:`1px solid ${tab===v?t.accent:t.border}`, background:tab===v?`${t.accent}12`:t.card, color:tab===v?t.accent:t.sub, cursor:'pointer', fontWeight:700, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>{l}</button>
        ))}
      </div>

      {tab==='analyze' && (
        <div style={{ marginBottom:24 }}>
          <Card glow>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>⚡ Smart Food Analyzer — Type any Indian food name</div>
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <input value={analyzeInput} onChange={e=>setAnalyzeInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&analyze()} placeholder="e.g. dal  or  roti 2  or  egg 3..." style={{ flex:1, padding:'12px 16px', borderRadius:10, border:`1px solid ${t.accent}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:14, fontFamily:"'Plus Jakarta Sans', sans-serif", minWidth:200 }} />
              <Btn onClick={analyze} size="lg">Analyze Food</Btn>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['roti','dal','egg','moringa','banana','chole','paneer','samosa','khichdi','sattu'].map(f=>(
                <button key={f} onClick={()=>{ setAnalyzeInput(f); }} style={{ padding:'5px 14px', borderRadius:20, border:`1px solid ${t.border}`, background:'transparent', color:t.sub, cursor:'pointer', fontSize:12, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>{f}</button>
              ))}
            </div>
          </Card>

          {analyzeResult && (
            <Card style={{ marginTop:16 }}>
              {analyzeResult.found ? (
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div>
                      <h2 style={{ margin:'0 0 4px', fontWeight:900, fontSize:22, color:t.text }}>{analyzeResult.food.name}</h2>
                      <div style={{ color:t.sub, fontSize:13 }}>{analyzeResult.food.cat} · {analyzeResult.scaled.quantity} serving{analyzeResult.scaled.quantity>1?'s':''}</div>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:42, fontWeight:900, color:sC(analyzeResult.score), fontFamily:t.mono }}>{analyzeResult.score}</div>
                      <div style={{ fontSize:11, color:t.sub }}>Health Score</div>
                    </div>
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))', gap:10, marginBottom:16 }}>
                    {[['🔥','Calories',analyzeResult.scaled.calories,'kcal','#f97316'],['💪','Protein',analyzeResult.scaled.protein,'g',t.accent],['🧈','Fat',analyzeResult.scaled.fat,'g',t.warn],['🍞','Carbs',analyzeResult.scaled.carbs,'g',t.accent2],['🌾','Fiber',analyzeResult.scaled.fiber,'g','#8b5cf6'],['🩸','Iron',analyzeResult.scaled.iron,'mg',t.danger]].map(([icon,label,val,unit,color])=>(
                      <div key={label} style={{ background:`${color}10`, border:`1px solid ${color}20`, borderRadius:10, padding:'12px 10px', textAlign:'center' }}>
                        <div style={{ fontSize:18 }}>{icon}</div>
                        <div style={{ fontWeight:900, color, fontSize:16, fontFamily:t.mono }}>{val}</div>
                        <div style={{ fontSize:10, color:t.sub }}>{label} ({unit})</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding:'10px 14px', background:`${sC(analyzeResult.score)}10`, borderRadius:10, marginBottom:12, fontWeight:700, color:sC(analyzeResult.score) }}>
                    {sL(analyzeResult.score)}
                  </div>

                  {analyzeResult.insights?.length>0 && (
                    <div style={{ marginBottom:12 }}>
                      {analyzeResult.insights.map((ins,i)=>(
                        <div key={i} style={{ padding:'8px 12px', borderRadius:8, marginBottom:6, background:ins.type==='good'?`${t.accent}10`:`${t.warn}10`, color:ins.type==='good'?t.accent:t.warn, fontSize:13 }}>
                          {ins.type==='good'?'✅ ':'⚠️ '}{ins.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {analyzeResult.alternative && (
                    <div style={{ padding:'10px 14px', background:`${t.accent2}10`, border:`1px solid ${t.accent2}20`, borderRadius:10, color:t.accent2, fontSize:13, marginBottom:10 }}>
                      💡 <strong>Better Option:</strong> {analyzeResult.alternative}
                    </div>
                  )}

                  {analyzeResult.govtScheme && (
                    <div style={{ padding:'8px 14px', background:`${t.info}10`, borderRadius:10, fontSize:12, color:t.info, fontWeight:600 }}>
                      🏛 Available via: {analyzeResult.govtScheme}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ color:t.warn, fontWeight:700, marginBottom:8 }}>⚠️ "{analyzeInput}" not found in database</div>
                  {analyzeResult.suggestions?.length>0 && (
                    <div>
                      <div style={{ color:t.sub, fontSize:13, marginBottom:8 }}>Did you mean:</div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {analyzeResult.suggestions.map(s=>(
                          <button key={s} onClick={()=>{ setAnalyzeInput(s); }} style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${t.accent}`, color:t.accent, background:`${t.accent}10`, cursor:'pointer', fontSize:12, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>{s}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      {tab==='browse' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20 }}>
          <div>
            <Card style={{ marginBottom:16 }}>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <input placeholder="Search roti, dal, egg, moringa..." value={search} onChange={e=>{ setSearch(e.target.value); doFilter(e.target.value, cat); }} style={{ flex:1, padding:'9px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif", minWidth:200 }} />
                <select value={cat} onChange={e=>{ setCat(e.target.value); doFilter(search,e.target.value); }} style={{ padding:'9px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
                  <option value="">All Categories</option>
                  {cats.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <Btn onClick={()=>{ setSearch(''); setCat(''); setDisplayed(foods); }} variant="ghost">Reset</Btn>
              </div>
            </Card>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(190px,1fr))', gap:12 }}>
              {displayed.map((f,i)=>(
                <div key={i} onClick={()=>{ setSelected(f); setQty(1); }} style={{ background:t.card, border:`2px solid ${selected?.id===f.id?t.accent:t.border}`, borderRadius:14, padding:14, cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=selected?.id===f.id?t.accent:t.border}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <div>
                      <div style={{ fontWeight:700, color:t.text, fontSize:13 }}>{f.name}</div>
                      <div style={{ fontSize:10, color:t.sub, background:`${t.accent}12`, display:'inline-block', padding:'1px 7px', borderRadius:10, marginTop:3 }}>{f.cat}</div>
                    </div>
                    <div style={{ background:`${sC(f.score)}18`, color:sC(f.score), padding:'4px 8px', borderRadius:8, fontSize:13, fontWeight:900, fontFamily:t.mono }}>{f.score}</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                    <div style={{ fontSize:11, color:t.sub }}>🔥 <span style={{ color:t.text, fontWeight:600 }}>{f.cal}</span>kcal</div>
                    <div style={{ fontSize:11, color:t.sub }}>💪 <span style={{ color:t.accent, fontWeight:600 }}>{f.prot}g</span></div>
                    <div style={{ fontSize:11, color:t.sub }}>🧈 <span style={{ color:t.text }}>{f.fat}g</span></div>
                    <div style={{ fontSize:11, color:t.sub }}>🍞 <span style={{ color:t.text }}>{f.carbs}g</span></div>
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:sC(f.score), fontWeight:700 }}>{sL(f.score)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div>
            {selected ? (
              <div style={{ position:'sticky', top:20 }}>
                <Card glow>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <div>
                      <h2 style={{ margin:'0 0 4px', fontWeight:900, fontSize:20, color:t.text }}>{selected.name}</h2>
                      <span style={{ color:t.sub, fontSize:12 }}>{selected.cat} · {selected.region}</span>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontSize:36, fontWeight:900, color:sC(selected.score), fontFamily:t.mono }}>{selected.score}</div>
                      <div style={{ fontSize:10, color:t.sub }}>Score</div>
                    </div>
                  </div>
                  <p style={{ color:t.sub, fontSize:13, lineHeight:1.6, margin:'0 0 16px' }}>{selected.desc}</p>

                  <NutrientBar label="Calories" val={selected.cal} max={600} unit="kcal" color="#f97316" />
                  <NutrientBar label="Protein" val={selected.prot} max={35} unit="g" color={t.accent} />
                  <NutrientBar label="Fat" val={selected.fat} max={50} unit="g" color={t.warn} />
                  <NutrientBar label="Carbs" val={selected.carbs} max={60} unit="g" color={t.accent2} />
                  <NutrientBar label="Fiber" val={selected.fiber} max={15} unit="g" color="#8b5cf6" />
                  <NutrientBar label="Iron" val={selected.iron} max={10} unit="mg" color={t.danger} />
                  <NutrientBar label="Calcium" val={selected.calcium} max={250} unit="mg" color="#06b6d4" />

                  <div style={{ margin:'14px 0', padding:'10px 14px', background:`${sC(selected.score)}10`, borderRadius:10, color:sC(selected.score), fontWeight:700 }}>
                    {sL(selected.score)} {selected.alternative ? `— Better: ${selected.alternative}` : ''}
                  </div>

                  {selected.govtScheme && (
                    <div style={{ padding:'8px 12px', background:`${t.accent2}10`, borderRadius:8, fontSize:12, color:t.accent2, marginBottom:12 }}>
                      🏛 {selected.govtScheme}
                    </div>
                  )}

                  <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:14 }}>
                    <label style={{ fontSize:12, color:t.sub, whiteSpace:'nowrap' }}>Servings:</label>
                    <input type="number" min="0.5" step="0.5" value={qty} onChange={e=>setQty(parseFloat(e.target.value)||1)} style={{ width:70, padding:'7px 10px', borderRadius:8, border:`1px solid ${t.border}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:13, fontFamily:t.mono, textAlign:'center' }} />
                    <div style={{ flex:1, fontSize:12, color:t.accent, fontFamily:t.mono, fontWeight:700 }}>= {Math.round(selected.cal*qty)}kcal · {(selected.prot*qty).toFixed(1)}g prot</div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card style={{ textAlign:'center', padding:50 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🍛</div>
                <div style={{ fontWeight:700, fontSize:16, color:t.text, marginBottom:8 }}>Select a Food</div>
                <div style={{ color:t.sub, fontSize:13 }}>Click any food to see full nutrition breakdown</div>
              </Card>
            )}
          </div>
        </div>
      )}
    </PageWrap>
  );
}
