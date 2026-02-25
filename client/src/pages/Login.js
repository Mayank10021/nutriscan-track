import React, { useState } from 'react';
import { useT } from '../components/UI';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const ROLES = [
  { value:'user', label:'👤 General User', desc:'Personal health tracking' },
  { value:'health_worker', label:'👩‍⚕️ ASHA / Health Worker', desc:'Add child records, field data' },
  { value:'ngo', label:'🤝 NGO Worker', desc:'District-level analytics' },
  { value:'admin', label:'🏛 Admin / District Officer', desc:'Full access, all regions' },
];

export default function Login() {
  const t = useT();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user', district:'', state:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inp = {width:'100%',padding:'12px 14px',borderRadius:10,border:`1px solid ${t.border}`,background:t.dark?'#0f1f36':'#f8fffc',color:t.text,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",boxSizing:'border-box',marginBottom:12};

  const submit = async () => {
    setLoading(true); setErr('');
    const body = tab==='login'?{email:form.email,password:form.password}:form;
    try {
      const res = await fetch(`${API}/auth/${tab}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(r=>r.json());
      if (res.token) {
        localStorage.setItem('nutriscan_token', res.token);
        localStorage.setItem('nutriscan_user', JSON.stringify(res.user));
        navigate('/');
      } else setErr(res.message||'Something went wrong');
    } catch { setErr('Server not running. Start with: cd server && node index.js'); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:t.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      {/* BG Effect */}
      <div style={{position:'fixed',inset:0,background:`radial-gradient(ellipse 80% 60% at 50% -20%, ${t.accent}12, transparent)`,pointerEvents:'none'}}/>

      <div style={{width:'100%',maxWidth:460,padding:'0 20px',position:'relative',zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:64,height:64,background:`linear-gradient(135deg,${t.accent},${t.accent2})`,borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,color:'#fff',margin:'0 auto 16px',boxShadow:`0 0 40px ${t.accent}40`}}>N</div>
          <div style={{fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>NutriScan India</div>
          <div style={{color:t.sub,fontSize:13,marginTop:4,fontFamily:t.mono}}>v3.0 — AI Health Intelligence Platform</div>
        </div>

        <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:28,boxShadow:`0 0 60px ${t.accent}10`}}>
          {/* Tabs */}
          <div style={{display:'flex',gap:6,marginBottom:24,background:t.dark?'#0a1628':'#f0fdf4',borderRadius:12,padding:4}}>
            {[['login','Login'],['register','Register']].map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{flex:1,padding:'10px',borderRadius:9,border:'none',background:tab===v?(t.dark?'#0f1f36':'#fff'):'transparent',color:tab===v?t.accent:t.sub,cursor:'pointer',fontWeight:600,fontSize:14,fontFamily:"'Plus Jakarta Sans',sans-serif",transition:'all 0.15s',boxShadow:tab===v?`0 0 10px ${t.accent}20`:undefined}}>
                {l}
              </button>
            ))}
          </div>

          {tab==='register' && <input placeholder="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} />}
          <input placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} />
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} style={inp} />

          {tab==='register' && (
            <>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:t.sub,fontWeight:600,marginBottom:8,textTransform:'uppercase',letterSpacing:0.5}}>Role</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {ROLES.map(r=>(
                    <button key={r.value} onClick={()=>setForm(f=>({...f,role:r.value}))}
                      style={{padding:'10px 12px',borderRadius:10,border:`2px solid ${form.role===r.value?t.accent:t.border}`,background:form.role===r.value?`${t.accent}12`:t.dark?'#0a1628':'#f8fffc',cursor:'pointer',textAlign:'left',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                      <div style={{fontWeight:700,fontSize:12,color:form.role===r.value?t.accent:t.text}}>{r.label}</div>
                      <div style={{fontSize:10,color:t.sub,marginTop:2}}>{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                <input placeholder="District" value={form.district} onChange={e=>setForm(f=>({...f,district:e.target.value}))} style={{...inp,marginBottom:0}}/>
                <input placeholder="State" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} style={{...inp,marginBottom:0}}/>
              </div>
            </>
          )}

          {err && <div style={{marginBottom:12,padding:'10px 14px',background:`${t.danger}12`,borderRadius:8,color:t.danger,fontSize:13}}>{err}</div>}

          <button onClick={submit} disabled={loading}
            style={{width:'100%',padding:14,borderRadius:12,border:'none',background:`linear-gradient(135deg,${t.accent},${t.accent2})`,color:'#fff',cursor:loading?'wait':'pointer',fontWeight:700,fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif",boxShadow:`0 4px 20px ${t.accent}30`}}>
            {loading?'Please wait...':tab==='login'?'Login to NutriScan':'Create Account'}
          </button>

          <div style={{textAlign:'center',marginTop:16,fontSize:12,color:t.sub}}>
            Demo credentials: <span style={{color:t.accent,fontFamily:t.mono}}>demo@nutriscan.in / password123</span>
          </div>
        </div>

        {/* Feature bullets */}
        <div style={{display:'flex',gap:8,justifyContent:'center',marginTop:20,flexWrap:'wrap'}}>
          {['🧠 Python ML','📊 55K Records','🏥 Health Worker Mode','🤖 AI Chatbot'].map(f=>(
            <span key={f} style={{background:`${t.accent}12`,color:t.accent,padding:'4px 12px',borderRadius:20,fontSize:11,fontWeight:600}}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
