import React, { useState, useEffect } from 'react';
import { useT, Card, PageWrap, SectionTitle } from '../components/UI';

const API = 'http://localhost:5000/api';

export default function Helpline() {
  const t = useT();
  const [helplines, setHelplines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stateQ, setStateQ] = useState('');

  useEffect(() => {
    fetch(`${API}/helpline`).then(r=>r.json()).then(setHelplines);
    fetch(`${API}/helpline/hospitals`).then(r=>r.json()).then(setHospitals);
  }, []);

  const tC = type => ({emergency:t.danger,health:t.accent2,nutrition:t.accent,mental:t.accent3})[type]||t.sub;
  const filtered = filter==='all'?helplines:helplines.filter(h=>h.type===filter);
  const filtHosp = stateQ?hospitals.filter(h=>h.state.toLowerCase().includes(stateQ.toLowerCase())):hospitals;

  const inp = {padding:'9px 14px',borderRadius:8,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif"};

  return (
    <PageWrap>
      <div style={{marginBottom:24}}>
        <h1 style={{margin:'0 0 6px',fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>◈ Helpline Center</h1>
        <p style={{margin:0,color:t.sub,fontSize:14}}>Emergency contacts, health helplines, and government hospitals across India</p>
      </div>

      {/* Emergency Banner */}
      <div style={{background:`linear-gradient(135deg,${t.danger},#b91c1c)`,borderRadius:18,padding:'20px 26px',marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12,boxShadow:`0 0 40px ${t.danger}30`}}>
        <div>
          <div style={{color:'#fff',fontWeight:900,fontSize:20,marginBottom:4}}>🆘 Emergency Contacts — Available 24/7</div>
          <div style={{color:'rgba(255,255,255,0.75)',fontSize:13}}>Free calls across all of India. Save these numbers.</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[['🚑 Ambulance','108'],['👶 Child Help','1098'],['🚔 Police','100'],['👩 Women','181']].map(([label,num])=>(
            <a key={num} href={`tel:${num}`} style={{background:'rgba(255,255,255,0.15)',color:'#fff',padding:'10px 16px',borderRadius:10,textDecoration:'none',fontWeight:700,fontSize:15,border:'1px solid rgba(255,255,255,0.25)',fontFamily:t.mono}}>
              {label} · {num}
            </a>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {[['all','All Helplines'],['emergency','🆘 Emergency'],['health','🏥 Health'],['nutrition','🥗 Nutrition'],['mental','🧠 Mental Health']].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:'8px 16px',borderRadius:10,border:`1px solid ${filter===v?tC(v):t.border}`,background:filter===v?`${tC(v)}18`:t.card,color:filter===v?tC(v):t.sub,cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:'all 0.15s'}}>
            {l}
          </button>
        ))}
      </div>

      {/* Helplines grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:32}}>
        {filtered.map(h => (
          <div key={h.id} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:18,borderLeft:`4px solid ${tC(h.type)}`,transition:'all 0.15s'}}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <span style={{fontSize:24}}>{h.icon}</span>
                <div>
                  <div style={{fontWeight:700,color:t.text,fontSize:13}}>{h.name}</div>
                  <div style={{fontSize:11,color:t.sub,marginTop:1}}>{h.hours}</div>
                </div>
              </div>
              <span style={{background:`${tC(h.type)}15`,color:tC(h.type),padding:'2px 8px',borderRadius:6,fontSize:10,fontWeight:700,textTransform:'uppercase'}}>{h.type}</span>
            </div>
            <p style={{color:t.sub,fontSize:12,margin:'0 0 12px',lineHeight:1.5}}>{h.desc}</p>
            <a href={`tel:${h.number.replace(/-/g,'').split(' ')[0]}`}
              style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:10,background:`${tC(h.type)}12`,color:tC(h.type),textDecoration:'none',fontWeight:800,fontSize:15,fontFamily:t.mono,border:`1px solid ${tC(h.type)}20`}}>
              📞 {h.number}
            </a>
          </div>
        ))}
      </div>

      {/* Hospitals */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:12}}>
          <h2 style={{fontWeight:900,fontSize:20,color:t.text,margin:0}}>🏥 Government Hospitals</h2>
          <input placeholder="Search by state..." value={stateQ} onChange={e=>setStateQ(e.target.value)} style={{...inp,minWidth:220}} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {filtHosp.map(h => (
            <div key={h.id} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:14,padding:16,transition:'all 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div style={{fontWeight:700,color:t.text,fontSize:14}}>{h.name}</div>
                <span style={{background:`${t.accent2}15`,color:t.accent2,padding:'2px 8px',borderRadius:6,fontSize:10,fontWeight:700}}>{h.type}</span>
              </div>
              <div style={{fontSize:12,color:t.sub,marginBottom:2}}>📍 {h.address}, {h.city}</div>
              <div style={{fontSize:12,color:t.sub,marginBottom:12}}>🗺️ {h.state}</div>
              <a href={`tel:${h.phone.replace(/-/g,'')}`} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:10,background:`${t.accent}10`,color:t.accent,textDecoration:'none',fontWeight:700,fontSize:13,fontFamily:t.mono}}>
                📞 {h.phone}
              </a>
            </div>
          ))}
        </div>
        <div style={{marginTop:18,padding:'14px 18px',background:`${t.accent}08`,border:`1px solid ${t.accent}20`,borderRadius:12,color:t.sub,fontSize:13}}>
          📍 <strong style={{color:t.accent}}>Coming Soon:</strong> GPS-based "Find Nearest Anganwadi / PHC" with Google Maps integration.
        </div>
      </div>
    </PageWrap>
  );
}
