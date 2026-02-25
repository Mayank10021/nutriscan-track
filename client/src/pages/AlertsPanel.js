import React, { useEffect, useState } from 'react';
import { useT, Card, Badge, PageWrap } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function AlertsPanel() {
  const t = useT();
  const [data, setData] = useState({ alerts:[], summary:{} });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/alerts`).then(r=>r.json()).then(d=>{ setData(d); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const filtered = filter==='all' ? data.alerts : data.alerts.filter(a=>a.type===filter);
  const typeColor = { critical:t.danger, warning:t.warn, info:t.info };
  const typeBg = { critical:`${t.danger}12`, warning:`${t.warn}10`, info:`${t.info}10` };

  return (
    <PageWrap>
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <h1 style={{ margin:0, fontWeight:900, fontSize:26, color:t.text, letterSpacing:-0.8 }}>🚨 Live Alerts Dashboard</h1>
          {loading && <span style={{ color:t.warn, fontSize:12 }} className="pulse">● Loading...</span>}
        </div>
        <p style={{ margin:0, color:t.sub, fontSize:14 }}>Real-time malnutrition and risk alerts across all districts — auto-generated from 55,000 health records</p>
      </div>

      {/* Summary Strip */}
      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { label:'Critical', count:data.summary.critical||0, color:t.danger, icon:'🔴' },
          { label:'Warning', count:data.summary.warning||0, color:t.warn, icon:'🟡' },
          { label:'Info', count:data.summary.info||0, color:t.info, icon:'🔵' },
          { label:'Total Alerts', count:data.summary.total||0, color:t.accent, icon:'📋' },
        ].map(s=>(
          <div key={s.label} style={{ background:t.card, border:`1px solid ${s.color}30`, borderRadius:14, padding:'14px 20px', flex:1, minWidth:140 }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontSize:30, fontWeight:900, color:s.color, fontFamily:t.mono }}>{s.count}</div>
            <div style={{ fontSize:12, color:t.sub, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {[['all','All Alerts'],['critical','🔴 Critical'],['warning','🟡 Warning'],['info','🔵 Info']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:'8px 18px', borderRadius:10, border:`1px solid ${filter===v?typeColor[v]||t.accent:t.border}`, background:filter===v?`${typeColor[v]||t.accent}12`:t.card, color:filter===v?typeColor[v]||t.accent:t.sub, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 && !loading && (
          <Card style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:700, fontSize:16, color:t.text }}>No {filter==='all'?'':''+filter} alerts</div>
          </Card>
        )}
        {filtered.map((alert,i)=>(
          <div key={alert.id} style={{ background:typeBg[alert.type]||t.card, border:`1px solid ${typeColor[alert.type]||t.border}30`, borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:14, borderLeft:`4px solid ${typeColor[alert.type]||t.border}` }}
            className="animate-in">
            <span style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{alert.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, flexWrap:'wrap' }}>
                <span style={{ fontWeight:800, color:t.text, fontSize:14 }}>{alert.category}</span>
                <span style={{ background:`${typeColor[alert.type]}20`, color:typeColor[alert.type], padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:800, textTransform:'uppercase' }}>{alert.type}</span>
                <span style={{ background:`${t.accent}12`, color:t.accent, padding:'2px 8px', borderRadius:8, fontSize:10, fontWeight:700 }}>{alert.region}</span>
              </div>
              <p style={{ margin:'0 0 8px', color:t.text, fontSize:13, lineHeight:1.5 }}>{alert.message}</p>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                <span style={{ fontSize:12, color:t.sub }}>📍 {alert.district}, {alert.state}</span>
                <span style={{ fontSize:12, color:typeColor[alert.type], fontWeight:700, fontFamily:t.mono }}>{alert.value}%</span>
                <span style={{ fontSize:12, color:t.sub }}>Affected: <strong style={{ color:t.text }}>{alert.affected?.toLocaleString()}</strong> people</span>
              </div>
            </div>
            <div style={{ background:`${typeColor[alert.type]}15`, color:typeColor[alert.type], padding:'6px 12px', borderRadius:10, fontSize:12, fontWeight:800, fontFamily:t.mono, flexShrink:0 }}>
              {alert.value}%
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Actions */}
      <Card style={{ marginTop:24 }}>
        <div style={{ fontSize:11, color:t.sub, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Recommended Interventions</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:12 }}>
          {[
            { icon:'📞', title:'Activate POSHAN Abhiyan', desc:'Escalate critical districts to state nutrition officers', color:t.accent },
            { icon:'🚐', title:'Deploy Mobile Health Units', desc:'Send PHC teams to districts with >40% high risk', color:t.warn },
            { icon:'🥗', title:'Emergency Food Distribution', desc:'Prioritize dal, egg, peanut distribution via Anganwadi', color:'#f97316' },
            { icon:'📊', title:'Generate District Reports', desc:'Auto-generate PDF reports for district collectors', color:t.accent2 },
          ].map(a=>(
            <div key={a.title} style={{ background:`${a.color}08`, border:`1px solid ${a.color}20`, borderRadius:12, padding:14 }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{a.icon}</div>
              <div style={{ fontWeight:700, color:t.text, fontSize:13, marginBottom:4 }}>{a.title}</div>
              <div style={{ fontSize:12, color:t.sub }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </PageWrap>
  );
}
