import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT, Card, StatCard, Badge, PageWrap, TooltipStyle, AxisStyle } from '../components/UI';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const API = 'http://localhost:5000/api';
const COLORS = ['#10b981','#f59e0b','#ef4444','#06b6d4','#8b5cf6','#ec4899','#f97316'];

export default function Dashboard() {
  const t = useT();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [alerts, setAlerts] = useState({ summary: {} });
  const navigate = useNavigate();
  const tt = TooltipStyle(t);
  const ax = AxisStyle(t);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/dataset/summary`).then(r=>r.json()),
      fetch(`${API}/dataset/trends`).then(r=>r.json()),
      fetch(`${API}/alerts`).then(r=>r.json()),
    ]).then(([s,tr,al]) => { setSummary(s); setTrends(tr); setAlerts(al); }).catch(()=>{});
  }, []);

  return (
    <PageWrap>
      {/* HERO: Problem Statement */}
      <div style={{ background:`linear-gradient(135deg, ${t.dark?'#041a10':'#dcfce7'}, ${t.dark?'#03101f':'#dbeafe'})`, border:`1px solid ${t.borderStrong}`, borderRadius:20, padding:'28px 32px', marginBottom:28, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:`radial-gradient(circle, ${t.accent}20, transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-30, left:40, width:150, height:150, background:`radial-gradient(circle, ${t.accent2}15, transparent 70%)`, pointerEvents:'none' }} />

        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {['🏥 ASHA Workers','🍼 Anganwadi Centers','🤝 NGOs','🏛 Government'].map(tag=>(
            <span key={tag} style={{ background:`${t.accent}18`, color:t.accent, padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, border:`1px solid ${t.accent}25` }}>{tag}</span>
          ))}
        </div>

        <h1 style={{ margin:'0 0 12px', fontWeight:900, fontSize:26, color:t.text, letterSpacing:-0.8, lineHeight:1.3, maxWidth:750 }}>
          NutriScan India — AI-powered rural nutrition intelligence platform
        </h1>
        <p style={{ margin:'0 0 20px', color:t.sub, fontSize:14, maxWidth:700, lineHeight:1.7 }}>
          Detects malnutrition risk early using Python ML (99.97% accuracy), provides personalized Indian diet recommendations, and enables district-level health monitoring in real time — built for ground-level health workers, not just data analysts.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:12 }}>
          <div style={{ background:`${t.danger}12`, border:`1px solid ${t.danger}25`, borderRadius:12, padding:'12px 16px' }}>
            <div style={{ fontSize:11, color:t.danger, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>❌ Why Systems Fail</div>
            <div style={{ fontSize:12, color:t.sub, lineHeight:1.5 }}>Reactive only. No real-time risk scoring. Not designed for rural ASHA workers or Anganwadi centers.</div>
          </div>
          <div style={{ background:`${t.accent}10`, border:`1px solid ${t.accent}20`, borderRadius:12, padding:'12px 16px' }}>
            <div style={{ fontSize:11, color:t.accent, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>✅ Our Advantage</div>
            <div style={{ fontSize:12, color:t.sub, lineHeight:1.5 }}>Proactive ML risk detection + food analysis + lifestyle tracking = preventive, not reactive care.</div>
          </div>
          <div style={{ background:`${t.accent2}10`, border:`1px solid ${t.accent2}20`, borderRadius:12, padding:'12px 16px' }}>
            <div style={{ fontSize:11, color:t.accent2, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>📈 Scalability</div>
            <div style={{ fontSize:12, color:t.sub, lineHeight:1.5 }}>District-level data granularity. 90+ districts. 28+ states. Plugs into NFHS/ICDS data feeds.</div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.summary.critical > 0 && (
        <div onClick={()=>navigate('/alerts')} style={{ background:`${t.danger}12`, border:`1px solid ${t.danger}30`, borderRadius:14, padding:'12px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}
          onMouseEnter={e=>e.currentTarget.style.background=`${t.danger}20`}
          onMouseLeave={e=>e.currentTarget.style.background=`${t.danger}12`}>
          <span className="pulse" style={{ fontSize:20 }}>🚨</span>
          <div>
            <span style={{ fontWeight:700, color:t.danger }}>{alerts.summary.critical} Critical Alerts</span>
            <span style={{ color:t.sub, fontSize:13, marginLeft:8 }}>+ {alerts.summary.warning||0} warnings — districts need urgent intervention</span>
          </div>
          <span style={{ marginLeft:'auto', color:t.danger, fontSize:12, fontWeight:700 }}>View All →</span>
        </div>
      )}

      {/* KPI Stats */}
      {summary && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:14, marginBottom:24 }}>
          <StatCard icon="◫" label="Total Records" value={summary.total?.toLocaleString()} color={t.accent} />
          <StatCard icon="🔴" label="High Risk Cases" value={summary.highRisk?.toLocaleString()} sub={`${((summary.highRisk/summary.total)*100).toFixed(1)}% of total`} color={t.danger} />
          <StatCard icon="🟠" label="Protein Deficient" value={summary.proteinDeficient?.toLocaleString()} sub={`${((summary.proteinDeficient/summary.total)*100).toFixed(1)}% deficit`} color={t.warn} />
          <StatCard icon="🪑" label="Sedentary Alerts" value={summary.sedentaryCount?.toLocaleString()} color="#8b5cf6" />
          <StatCard icon="⚖️" label="Avg BMI" value={summary.avgBMI} color={t.accent2} />
          <StatCard icon="🔥" label="Avg Calories/Day" value={summary.avgCalories} color="#f97316" />
        </div>
      )}

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px,1fr))', gap:18, marginBottom:24 }}>
        <Card>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Nutrition Status Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={summary?Object.entries(summary.byNutrition).map(([k,v])=>({name:k,value:v})):[]} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {summary&&Object.keys(summary.byNutrition).map((_,i)=><Cell key={i} fill={[t.accent,t.warn,t.danger][i]} />)}
              </Pie>
              <Tooltip {...tt} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Year-wise Malnutrition Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="year" {...ax} />
              <YAxis {...ax} />
              <Tooltip {...tt} />
              <Legend />
              <Line type="monotone" dataKey="riskRate" name="High Risk %" stroke={t.danger} strokeWidth={2} dot={{ fill:t.danger, r:4 }} />
              <Line type="monotone" dataKey="protDefRate" name="Protein Deficient %" stroke={t.warn} strokeWidth={2} dot={{ fill:t.warn, r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Region-wise Records</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary?Object.entries(summary.byRegion).map(([k,v])=>({name:k,count:v})):[]}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="name" {...ax} />
              <YAxis {...ax} />
              <Tooltip {...tt} />
              <Bar dataKey="count" radius={[5,5,0,0]}>{COLORS.map((c,i)=><Cell key={i} fill={c} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>BMI Category Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={summary?Object.entries(summary.byBMI).map(([k,v])=>({name:k,value:v})):[]} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({name,percent})=>`${(percent*100).toFixed(0)}%`}>
                {summary&&Object.keys(summary.byBMI).map((_,i)=><Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip {...tt} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Quick Actions — Hackathon Demo Flow</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:12 }}>
          {[
            { label:'Predict Risk (AI)', sub:'Python ML · SHAP · 99.97%', icon:'🧠', path:'/predict', color:t.accent },
            { label:'Analyze Food', sub:'Smart Indian food DB', icon:'🍛', path:'/food', color:t.accent2 },
            { label:'Live Alerts', sub:'District red zones', icon:'🚨', path:'/alerts', color:t.danger },
            { label:'Health Worker Panel', sub:'Add child records', icon:'👩‍⚕️', path:'/health-worker', color:'#8b5cf6' },
            { label:'Impact Simulation', sub:'Policy projections', icon:'📈', path:'/impact', color:t.warn },
            { label:'AI Chatbot', sub:'Hindi + English advice', icon:'💬', path:'/chatbot', color:'#ec4899' },
            { label:'Diet Plan', sub:'Indian meal plans', icon:'◑', path:'/recommend', color:'#f97316' },
            { label:'Admin Dashboard', sub:'District heatmap', icon:'🏛', path:'/admin', color:t.accent },
          ].map(item=>(
            <button key={item.label} onClick={()=>navigate(item.path)} style={{ padding:'14px 16px', borderRadius:12, border:`1px solid ${item.color}22`, background:`${item.color}08`, cursor:'pointer', textAlign:'left', fontFamily:"'Plus Jakarta Sans', sans-serif", transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${item.color}18`;e.currentTarget.style.transform='translateY(-1px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${item.color}08`;e.currentTarget.style.transform='none';}}>
              <div style={{ fontSize:22, marginBottom:8 }}>{item.icon}</div>
              <div style={{ fontWeight:700, fontSize:13, color:t.text, marginBottom:3 }}>{item.label}</div>
              <div style={{ fontSize:11, color:t.sub }}>{item.sub}</div>
            </button>
          ))}
        </div>
      </Card>
    </PageWrap>
  );
}
