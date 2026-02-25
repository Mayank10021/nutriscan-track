import React, { useEffect, useState } from 'react';
import { useT, Card, PageWrap, TooltipStyle, AxisStyle } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend, LineChart, Line } from 'recharts';

const API = 'http://localhost:5000/api';
const COLORS = ['#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899'];

export default function AdminDashboard() {
  const t = useT();
  const [heatmap, setHeatmap] = useState([]);
  const [charts, setCharts] = useState(null);
  const [trends, setTrends] = useState([]);
  const [ageFilter, setAgeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const tt = TooltipStyle(t);
  const ax = AxisStyle(t);

  useEffect(() => {
    const heatParam = ageFilter ? `?ageGroup=${ageFilter}` : '';
    Promise.all([
      fetch(`${API}/dataset/district-heatmap${heatParam}`).then(r=>r.json()),
      fetch(`${API}/analytics/charts`).then(r=>r.json()),
      fetch(`${API}/dataset/trends`).then(r=>r.json()),
    ]).then(([h,c,tr]) => { setHeatmap(h); setCharts(c); setTrends(tr); setLoading(false); });
  }, [ageFilter]);

  const riskColor = pct => parseFloat(pct)>40?t.danger:parseFloat(pct)>25?t.warn:t.accent;

  return (
    <PageWrap>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ margin:'0 0 6px', fontWeight:900, fontSize:26, color:t.text, letterSpacing:-0.8 }}>🏛 Admin / District Dashboard</h1>
        <p style={{ margin:0, color:t.sub, fontSize:14 }}>Region comparison, district heatmap, demographic trends — for state health officers & policy makers</p>
      </div>

      {/* Heatmap Filter */}
      <Card style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>District Heatmap — Filter:</div>
          {['','Child','Teen','Young Adult','Adult','Middle Age','Senior'].map(ag=>(
            <button key={ag} onClick={()=>setAgeFilter(ag)} style={{ padding:'7px 16px', borderRadius:10, border:`1px solid ${ageFilter===ag?t.accent:t.border}`, background:ageFilter===ag?`${t.accent}15`:t.dark?'#0f1f36':'#f8fffc', color:ageFilter===ag?t.accent:t.sub, cursor:'pointer', fontWeight:600, fontSize:12, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
              {ag||'All Ages'}
            </button>
          ))}
        </div>
      </Card>

      {/* District Heatmap Table */}
      <Card style={{ marginBottom:24, padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>🗺️ District Risk Heatmap — Top 40 Highest Risk</div>
          {loading && <span style={{ color:t.warn, fontSize:12 }} className="pulse">● Updating...</span>}
        </div>
        <div style={{ overflowX:'auto', maxHeight:400, overflowY:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead style={{ position:'sticky', top:0, zIndex:10 }}>
              <tr style={{ background:t.dark?'#0f1f36':'#f0fdf4' }}>
                {['#','District','State','Region','Records','High Risk %','Prot Def %','Avg Cal','Avg BMI'].map(h=>(
                  <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:t.sub, fontWeight:700, borderBottom:`1px solid ${t.border}`, whiteSpace:'nowrap', fontSize:11, fontFamily:t.mono }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.slice(0,40).map((d,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${t.border}` }}
                  onMouseEnter={e=>e.currentTarget.style.background=t.dark?'#0f1f36':'#f8fffc'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'9px 12px', color:t.sub, fontFamily:t.mono }}>{i+1}</td>
                  <td style={{ padding:'9px 12px', color:t.text, fontWeight:600 }}>{d.district}</td>
                  <td style={{ padding:'9px 12px', color:t.sub }}>{d.state}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <span style={{ background:`${t.accent}12`, color:t.accent, padding:'2px 8px', borderRadius:6, fontSize:10, fontWeight:700 }}>{d.region}</span>
                  </td>
                  <td style={{ padding:'9px 12px', color:t.text, fontFamily:t.mono }}>{d.count}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:70, height:6, borderRadius:3, background:t.dark?'#0f1f36':'#f0fdf4', overflow:'hidden', flexShrink:0 }}>
                        <div style={{ height:'100%', width:`${Math.min(100,d.riskPercent)}%`, background:riskColor(d.riskPercent), borderRadius:3 }} />
                      </div>
                      <span style={{ color:riskColor(d.riskPercent), fontWeight:800, fontFamily:t.mono, fontSize:11 }}>{d.riskPercent}%</span>
                    </div>
                  </td>
                  <td style={{ padding:'9px 12px' }}>
                    <span style={{ color:parseFloat(d.protDefPercent)>40?t.danger:t.warn, fontWeight:700, fontFamily:t.mono }}>{d.protDefPercent}%</span>
                  </td>
                  <td style={{ padding:'9px 12px', color:t.text, fontFamily:t.mono }}>{d.avgCalories}</td>
                  <td style={{ padding:'9px 12px', color:t.text, fontFamily:t.mono }}>{d.avgBMI}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts Grid */}
      {charts && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(360px,1fr))', gap:18 }}>
          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Region-wise Nutrition (Stacked)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(charts.regionNutrition).map(([k,v])=>({name:k,...v}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="name" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Legend />
                <Bar dataKey="Good" stackId="a" fill={t.accent} />
                <Bar dataKey="Moderate" stackId="a" fill={t.warn} />
                <Bar dataKey="Poor" stackId="a" fill={t.danger} radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Age Group Malnutrition Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(charts.proteinDefByAge).map(([k,v])=>({ name:k, deficient:v.deficient, normal:v.total-v.deficient }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="name" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Legend />
                <Bar dataKey="normal" stackId="a" fill={t.accent} name="Adequate" />
                <Bar dataKey="deficient" stackId="a" fill={t.danger} name="Deficient" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Income vs Nutrition (Policy View)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(charts.incomeNutrition).map(([k,v])=>({ name:k.replace(' Income','').replace('Below Poverty Line','BPL'), ...v }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="name" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Legend />
                <Bar dataKey="Good" fill={t.accent} />
                <Bar dataKey="Moderate" fill={t.warn} />
                <Bar dataKey="Poor" fill={t.danger} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Year-wise Risk & Protein Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="year" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Legend />
                <Line type="monotone" dataKey="riskRate" name="Risk %" stroke={t.danger} strokeWidth={2} dot={{ r:4, fill:t.danger }} />
                <Line type="monotone" dataKey="protDefRate" name="ProtDef %" stroke={t.warn} strokeWidth={2} dot={{ r:4, fill:t.warn }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Gender-wise Risk Split</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(charts.genderRisk).map(([k,v])=>({name:k,...v}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="name" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Legend />
                <Bar dataKey="Low" fill={t.accent} />
                <Bar dataKey="Medium" fill={t.warn} />
                <Bar dataKey="High" fill={t.danger} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Health Condition Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Object.entries(charts.healthConditionDist||{}).slice(0,8).map(([k,v])=>({name:k.replace(' ',' '),count:v}))}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
                <XAxis dataKey="name" {...ax} />
                <YAxis {...ax} />
                <Tooltip {...tt} />
                <Bar dataKey="count" radius={[5,5,0,0]}>{Object.keys(charts.healthConditionDist||{}).map((_,i)=><Cell key={i} fill={COLORS[i%6]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </PageWrap>
  );
}
