import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useT } from './components/UI';

import Dashboard from './pages/Dashboard';
import Dataset from './pages/Dataset';
import Analytics from './pages/Analytics';
import RiskPredictor from './pages/RiskPredictor';
import FoodAnalyzer from './pages/FoodAnalyzer';
import ActivityTracker from './pages/ActivityTracker';
import Recommendation from './pages/Recommendation';
import ImpactSim from './pages/ImpactSim';
import AlertsPanel from './pages/AlertsPanel';
import HealthWorker from './pages/HealthWorker';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './pages/Chatbot';
import Helpline from './pages/Helpline';
import Login from './pages/Login';

// Nutrition Story (novel showcase)
import NutritionStory from './pages/NutritionStory';

// NutriTrack report pages (merged)
import ReportProblem from './pages/ReportProblem';
import ReportAnalysis from './pages/ReportAnalysis';
import ReportDisease from './pages/ReportDisease';
import ReportSolutions from './pages/ReportSolutions';

const PY = process.env.REACT_APP_PY_URL || 'http://localhost:8000';

const NAV_SECTIONS = [
  { section: 'Core', items: [
    { path:'/', label:'Overview', icon:'⬡', end:true },
    { path:'/nutrition-story', label:'Nutrition Story', icon:'📖', badge:'new' },
    { path:'/alerts', label:'Live Alerts', icon:'🚨', badge:'live' },
    { path:'/analytics', label:'Analytics', icon:'◈' },
    { path:'/dataset', label:'Dataset', icon:'◫' },
  ]},
  { section: 'AI Tools', items: [
    { path:'/predict', label:'Risk AI', icon:'🧠' },
    { path:'/food', label:'Food Analyzer', icon:'🍛' },
    { path:'/activity', label:'Activity Tracker', icon:'◎' },
    { path:'/recommend', label:'Diet Plan', icon:'◑' },
    { path:'/impact', label:'Impact Model', icon:'📈' },
    { path:'/chatbot', label:'AI Chatbot', icon:'💬' },
  ]},
  { section: 'Dashboards', items: [
    { path:'/health-worker', label:'Health Worker', icon:'👩‍⚕️' },
    { path:'/admin', label:'Admin Panel', icon:'🏛' },
  ]},
  { section: 'Research Report', badge:'rpt-section', items: [
    { path:'/report/problem', label:'The Problem', icon:'📋', badge:'rpt' },
    { path:'/report/analysis', label:'Data Analysis', icon:'📊', badge:'rpt' },
    { path:'/report/disease', label:'Disease Impact', icon:'🏥', badge:'rpt' },
    { path:'/report/solutions', label:'Solutions', icon:'💡', badge:'rpt' },
  ]},
  { section: 'Support', items: [
    { path:'/helpline', label:'Helpline', icon:'📞' },
  ]},
];

function Sidebar({ collapsed, setCollapsed }) {
  const t = useT();
  const { dark, toggle } = useTheme();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/alerts').then(r=>r.json()).then(d=>setAlertCount(d?.summary?.critical||0)).catch(()=>{});
  }, []);

  return (
    <aside style={{
      width: collapsed ? 64 : 238, background: t.card, borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column', position: 'fixed', top:0, bottom:0, left:0, zIndex:200,
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden'
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed?'18px 0':'18px 16px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${t.border}`, justifyContent: collapsed?'center':'flex-start', flexShrink:0 }}>
        <div style={{ width:36, height:36, background:`linear-gradient(135deg, ${t.accent}, ${t.accent2})`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#030712', flexShrink:0, boxShadow:`0 0 16px ${t.accent}40` }}>N</div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight:900, fontSize:13, color:t.accent, letterSpacing:-0.3, lineHeight:1.2 }}>NutriScan <span style={{color:t.accent2}}>+</span> NutriTrack</div>
            <div style={{ fontSize:10, color:t.sub, fontFamily:t.mono }}>INDIA</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, overflowY:'auto', padding:'10px 6px', scrollbarWidth:'thin' }}>
        {NAV_SECTIONS.map(sec => (
          <div key={sec.section} style={{ marginBottom:8 }}>
            {!collapsed && (
              <div style={{
                fontSize:9, fontWeight:800, textTransform:'uppercase',
                letterSpacing:2, padding:'6px 8px 3px', fontFamily:t.mono,
                display:'flex', alignItems:'center', gap:6,
                color: sec.badge==='rpt-section' ? t.accent2 : t.sub
              }}>
                {sec.badge==='rpt-section' ? (
                  <>
                    <span style={{ background:`${t.accent2}20`, color:t.accent2, padding:'2px 6px', borderRadius:8, fontSize:8, fontWeight:900 }}>NT</span>
                    Research Report
                  </>
                ) : sec.section}
              </div>
            )}
            {sec.items.map(item => (
              <NavLink key={item.path} to={item.path} end={item.end} style={{ textDecoration:'none', display:'block', marginBottom:2 }}>
                {({ isActive }) => (
                  <div style={{
                    display:'flex', alignItems:'center', gap:9, padding: collapsed?'10px 0':'8px 10px',
                    justifyContent: collapsed?'center':'flex-start', borderRadius:10,
                    color: isActive ? (item.badge==='rpt' ? t.accent2 : t.accent) : t.sub,
                    background: isActive ? (item.badge==='rpt' ? `${t.accent2}12` : `${t.accent}12`) : 'transparent',
                    fontSize:13, fontWeight: isActive?700:500, transition:'all 0.12s',
                    borderLeft: isActive ? `2px solid ${item.badge==='rpt' ? t.accent2 : t.accent}` : '2px solid transparent',
                    position:'relative'
                  }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                    {!collapsed && <span style={{ whiteSpace:'nowrap' }}>{item.label}</span>}
                    {item.badge==='live' && alertCount>0 && !collapsed && (
                      <span style={{ marginLeft:'auto', background:t.danger, color:'#fff', borderRadius:10, fontSize:10, fontWeight:800, padding:'1px 6px', fontFamily:t.mono }}>{alertCount}</span>
                    )}
                    {item.badge==='live' && alertCount>0 && collapsed && (
                      <span style={{ position:'absolute', top:6, right:6, width:8, height:8, background:t.danger, borderRadius:'50%' }} />
                    )}
                    {item.badge==='rpt' && !isActive && !collapsed && (
                      <span style={{ marginLeft:'auto', background:`${t.accent2}15`, color:t.accent2, borderRadius:8, fontSize:9, fontWeight:800, padding:'1px 5px', fontFamily:t.mono }}>RPT</span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'10px 6px', borderTop:`1px solid ${t.border}`, flexShrink:0 }}>
        <button onClick={toggle} style={{ width:'100%', padding:collapsed?'9px 0':'8px 10px', borderRadius:10, border:'none', background:'transparent', color:t.sub, cursor:'pointer', display:'flex', alignItems:'center', gap:9, justifyContent:collapsed?'center':'flex-start', fontSize:13, fontFamily:"'Plus Jakarta Sans', sans-serif", marginBottom:4 }}>
          <span style={{ fontSize:16 }}>{dark?'☀':'🌙'}</span>
          {!collapsed && <span>{dark?'Light Mode':'Dark Mode'}</span>}
        </button>
        <button onClick={() => setCollapsed(c=>!c)} style={{ width:'100%', padding:collapsed?'9px 0':'8px 10px', borderRadius:10, border:'none', background:'transparent', color:t.sub, cursor:'pointer', display:'flex', alignItems:'center', gap:9, justifyContent:collapsed?'center':'flex-start', fontSize:12, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
          <span style={{ fontSize:14 }}>{collapsed?'▷':'◁'}</span>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

// Wrapper for NutriTrack report pages — injects editorial CSS scoped to .nt-report
function ReportWrapper({ children }) {
  const t = useT();
  return (
    <div style={{ background: t.bg, minHeight:'100vh' }}>
      {/* Editorial topbar */}
      <div style={{
        background: t.card, borderBottom:`2px solid ${t.accent2}`,
        padding:'0 40px', height:54, display:'flex', alignItems:'center',
        justifyContent:'space-between', position:'sticky', top:0, zIndex:50
      }}>
        <div style={{ fontFamily:"'Georgia', serif", fontSize:16, fontWeight:700, color:t.accent2 }}>
          📊 Research Report — India Malnutrition Analysis
        </div>
        <div style={{ fontSize:11, color:t.sub, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ background:`${t.accent2}18`, color:t.accent2, padding:'3px 10px', borderRadius:20, fontWeight:700, fontSize:10, fontFamily:t.mono }}>NutriTrack Data</span>
          <span>NFHS-4 & NFHS-5 · MoHFW, GoI · 50,000 Records</span>
        </div>
      </div>
      <style>{`
        .nt-report{padding:36px 40px;max-width:1080px;font-family:'Georgia',serif}
        .nt-report .page-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${t.sub};margin-bottom:8px;font-family:${t.mono}}
        .nt-report .page-title{font-family:'Georgia',serif;font-size:30px;font-weight:700;color:${t.text};line-height:1.25;margin-bottom:10px}
        .nt-report .page-intro{font-size:15px;color:${t.sub};line-height:1.8;max-width:760px;margin-bottom:32px;border-left:3px solid ${t.accent2};padding:12px 16px;background:${t.accent2}08;border-radius:0 8px 8px 0}
        .nt-report .stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:14px;margin-bottom:36px}
        .nt-report .stat-card{background:${t.card};border:1px solid ${t.border};border-top:3px solid ${t.border};padding:16px 14px;border-radius:8px}
        .nt-report .stat-card.red{border-top-color:#ef4444}.nt-report .stat-card.orange{border-top-color:#f97316}
        .nt-report .stat-card.blue{border-top-color:#3b82f6}.nt-report .stat-card.green{border-top-color:#10b981}
        .nt-report .stat-card.yellow{border-top-color:#f59e0b}.nt-report .stat-card.teal{border-top-color:#14b8a6}
        .nt-report .stat-value{font-family:'Georgia',serif;font-size:30px;font-weight:700;line-height:1;margin-bottom:5px}
        .nt-report .stat-card.red .stat-value{color:#ef4444}.nt-report .stat-card.orange .stat-value{color:#f97316}
        .nt-report .stat-card.blue .stat-value{color:#3b82f6}.nt-report .stat-card.green .stat-value{color:#10b981}
        .nt-report .stat-card.yellow .stat-value{color:#f59e0b}.nt-report .stat-card.teal .stat-value{color:#14b8a6}
        .nt-report .stat-label{font-size:13px;font-weight:600;color:${t.text};margin-bottom:2px;font-family:${t.mono}}
        .nt-report .stat-sub{font-size:11px;color:${t.sub}}
        .nt-report .chart-block{background:${t.card};border:1px solid ${t.border};margin-bottom:24px;overflow:hidden;border-radius:12px}
        .nt-report .chart-header{padding:16px 20px 12px;border-bottom:1px solid ${t.border};display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
        .nt-report .chart-title{font-family:'Georgia',serif;font-size:17px;font-weight:600;color:${t.text};margin-bottom:3px}
        .nt-report .chart-sub{font-size:12px;color:${t.sub}}
        .nt-report .source-badge{font-size:10px;color:${t.sub};background:${t.accent2}15;border:1px solid ${t.accent2}30;padding:3px 8px;border-radius:20px;white-space:nowrap;flex-shrink:0;margin-top:2px}
        .nt-report .chart-img{width:100%;display:block}
        .nt-report .chart-insight{padding:12px 20px;border-top:1px solid ${t.border};background:${t.accent}06;font-size:13px;color:${t.sub};line-height:1.7;font-family:sans-serif}
        .nt-report .chart-insight strong{color:${t.text}}
        .nt-report .chart-loading{min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:${t.sub};font-size:13px}
        .nt-report .spinner-ring{width:28px;height:28px;border:3px solid ${t.border};border-top-color:${t.accent2};border-radius:50%;animation:ntspin 0.8s linear infinite}
        @keyframes ntspin{to{transform:rotate(360deg)}}
        .nt-report .chart-error{margin:16px 20px;padding:12px 16px;background:${t.danger}10;border:1px solid ${t.danger}30;border-left:3px solid ${t.danger};font-size:13px;color:${t.danger};border-radius:0 8px 8px 0}
        .nt-report .chart-error code{display:block;margin-top:6px;background:${t.card};border:1px solid ${t.border};padding:3px 8px;font-size:12px;color:${t.text};font-family:${t.mono}}
        .nt-report .fact-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:24px}
        .nt-report .fact-card{border-left:4px solid ${t.border};padding:14px 16px;background:${t.card};border-radius:0 8px 8px 0;border-top:1px solid ${t.border};border-right:1px solid ${t.border};border-bottom:1px solid ${t.border}}
        .nt-report .fact-card.red{border-left-color:#ef4444}.nt-report .fact-card.orange{border-left-color:#f97316}
        .nt-report .fact-card.blue{border-left-color:#3b82f6}.nt-report .fact-card.green{border-left-color:#10b981}
        .nt-report .fact-figure{font-family:'Georgia',serif;font-size:26px;font-weight:700;margin-bottom:4px}
        .nt-report .fact-card.red .fact-figure{color:#ef4444}.nt-report .fact-card.orange .fact-figure{color:#f97316}
        .nt-report .fact-card.blue .fact-figure{color:#3b82f6}.nt-report .fact-card.green .fact-figure{color:#10b981}
        .nt-report .fact-text{font-size:13px;color:${t.sub};line-height:1.6;font-family:sans-serif}
        .nt-report .fact-source{font-size:11px;color:${t.sub};margin-top:6px;font-style:italic;opacity:0.7}
        .nt-report .section-rule{height:1px;background:${t.border};margin:28px 0}
        .nt-report .section-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${t.sub};margin-bottom:16px;font-family:${t.mono}}
        .nt-report .policy-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:24px}
        .nt-report .policy-card{background:${t.card};border:1px solid ${t.border};padding:18px;border-top:3px solid #3b82f6;border-radius:8px}
        .nt-report .policy-card.green{border-top-color:#10b981}.nt-report .policy-card.orange{border-top-color:#f97316}
        .nt-report .policy-card.red{border-top-color:#ef4444}.nt-report .policy-card.teal{border-top-color:#14b8a6}
        .nt-report .policy-card.blue{border-top-color:#3b82f6}
        .nt-report .policy-title{font-family:'Georgia',serif;font-size:15px;font-weight:600;color:${t.text};margin-bottom:7px}
        .nt-report .policy-body{font-size:13px;color:${t.sub};line-height:1.7;font-family:sans-serif}
        .nt-report .policy-impact{margin-top:8px;font-size:12px;font-weight:600;color:#10b981;font-family:${t.mono}}
        .nt-report .offline-banner{background:${t.warn}10;border:1px solid ${t.warn}40;border-left:4px solid ${t.warn};padding:11px 16px;margin-bottom:20px;font-size:13px;color:${t.warn};border-radius:0 8px 8px 0;font-family:sans-serif}
        .nt-report .offline-banner code{background:${t.card};border:1px solid ${t.border};padding:2px 6px;font-size:12px;color:${t.text};font-family:${t.mono}}
        .nt-report .footnote{font-size:11px;color:${t.sub};margin-top:8px;font-style:italic}
      `}</style>
      <div className="nt-report">{children}</div>
    </div>
  );
}

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [pySvcOk, setPySvcOk] = useState(null);

  useEffect(() => {
    fetch(`${PY}/api/py/health`).then(r=>r.json()).then(()=>setPySvcOk(true)).catch(()=>setPySvcOk(false));
  }, []);

  const rProps = { PY, svcOk: pySvcOk };

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ marginLeft: collapsed?64:238, flex:1, transition:'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)', minHeight:'100vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nutrition-story" element={<NutritionStory />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/predict" element={<RiskPredictor />} />
          <Route path="/food" element={<FoodAnalyzer />} />
          <Route path="/activity" element={<ActivityTracker />} />
          <Route path="/recommend" element={<Recommendation />} />
          <Route path="/impact" element={<ImpactSim />} />
          <Route path="/alerts" element={<AlertsPanel />} />
          <Route path="/health-worker" element={<HealthWorker />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/helpline" element={<Helpline />} />
          <Route path="/login" element={<Login />} />
          {/* NutriTrack Research Report Pages */}
          <Route path="/report/problem" element={<ReportWrapper><ReportProblem {...rProps} /></ReportWrapper>} />
          <Route path="/report/analysis" element={<ReportWrapper><ReportAnalysis {...rProps} /></ReportWrapper>} />
          <Route path="/report/disease" element={<ReportWrapper><ReportDisease {...rProps} /></ReportWrapper>} />
          <Route path="/report/solutions" element={<ReportWrapper><ReportSolutions {...rProps} /></ReportWrapper>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
