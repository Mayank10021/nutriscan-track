// Dataset.js - placeholder, import from nutriscan2 concept
import React, { useState, useEffect } from 'react';
import { useT, Card, PageWrap } from '../components/UI';
const API = 'http://localhost:5000/api';
const COLS = ['Patient_ID','Region','State','District','Gender','Age','Age_Group','Height_cm','Weight_kg','BMI','BMI_Category','Calories','Protein_g','Fat_g','Carbs_g','Fiber_g','Iron_mg','Calcium_mg','Nutrition_Status','Risk_Level','Steps_Per_Day','Sitting_Hours','Sleep_Hours','Sedentary_Alert','Income_Group','Education_Level','Activity_Level','Food_Habit','Water_Intake','Health_Condition','Stunting_Status','Wasting_Status','Year'];

export default function Dataset() {
  const t = useT();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ region:'', gender:'', ageGroup:'', bmiCategory:'', riskLevel:'', nutritionStatus:'', year:'', search:'', sedentaryAlert:'', incomeGroup:'', state:'' });

  useEffect(() => { fetchData(); }, [page, filters]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 50, ...Object.fromEntries(Object.entries(filters).filter(([,v])=>v)) });
    const res = await fetch(`${API}/dataset?${params}`).then(r=>r.json()).catch(()=>({ data:[], total:0, totalPages:1 }));
    setData(res.data||[]); setTotal(res.total||0); setTotalPages(res.totalPages||1);
    setLoading(false);
  };

  const set = (k,v) => { setFilters(f=>({...f,[k]:v})); setPage(1); };
  const clear = () => { setFilters({ region:'', gender:'', ageGroup:'', bmiCategory:'', riskLevel:'', nutritionStatus:'', year:'', search:'', sedentaryAlert:'', incomeGroup:'', state:'' }); setPage(1); };

  const inp = { padding:'8px 12px', borderRadius:8, border:`1px solid ${t.border}`, background:t.dark?'#0f1f36':'#f8fffc', color:t.text, fontSize:12, fontFamily:"'Plus Jakarta Sans', sans-serif" };
  const sel = (key, opts, lbl) => <select value={filters[key]} onChange={e=>set(key,e.target.value)} style={inp}><option value="">{lbl}</option>{opts.map(o=><option key={o}>{o}</option>)}</select>;
  const rC = v => v==='High'?t.danger:v==='Medium'?t.warn:t.accent;
  const nC = v => v==='Poor'?t.danger:v==='Moderate'?t.warn:t.accent;

  return (
    <PageWrap>
      <div style={{marginBottom:20}}>
        <h1 style={{margin:'0 0 6px',fontWeight:900,fontSize:26,color:t.text,letterSpacing:-0.8}}>◫ Dataset</h1>
        <p style={{margin:0,color:t.sub,fontSize:14}}>55,000+ records · 42 health indicators · CSV-powered with in-memory caching</p>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,alignItems:'center'}}>
          <span style={{color:t.text,fontWeight:700,fontSize:13}}>Filters</span>
          <button onClick={clear} style={{padding:'5px 14px',borderRadius:8,border:`1px solid ${t.danger}40`,background:`${t.danger}10`,color:t.danger,cursor:'pointer',fontSize:12,fontFamily:"'Plus Jakarta Sans', sans-serif"}}>Clear All</button>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <input placeholder="Search district, state, patient..." value={filters.search} onChange={e=>set('search',e.target.value)} style={{...inp,minWidth:220}} />
          {sel('region',['North','South','East','West','Central','Northeast'],'Region')}
          {sel('gender',['Male','Female'],'Gender')}
          {sel('ageGroup',['Child','Teen','Young Adult','Adult','Middle Age','Senior'],'Age Group')}
          {sel('bmiCategory',['Underweight','Normal','Overweight','Obese'],'BMI')}
          {sel('riskLevel',['Low','Medium','High'],'Risk')}
          {sel('nutritionStatus',['Good','Moderate','Poor'],'Nutrition')}
          {sel('year',['2020','2021','2022','2023','2024'],'Year')}
          {sel('incomeGroup',['Below Poverty Line','Low Income','Middle Income','Upper Middle Income','High Income'],'Income')}
          {sel('sedentaryAlert',['Yes','No'],'Sedentary')}
        </div>
      </Card>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:10,padding:'8px 14px',background:t.card,border:`1px solid ${t.border}`,borderRadius:10,fontSize:12}}>
        <span style={{color:t.text,fontWeight:600}}>Showing <span style={{color:t.accent,fontFamily:t.mono}}>{data.length}</span> of <span style={{color:t.accent,fontFamily:t.mono}}>{total.toLocaleString()}</span></span>
        <span style={{color:t.sub}}>Page {page}/{totalPages}</span>
        {loading && <span style={{color:t.warn}} className="pulse">● Loading...</span>}
      </div>
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead>
              <tr style={{background:t.dark?'#0f1f36':'#f0fdf4'}}>
                {COLS.map(c=><th key={c} style={{padding:'10px 10px',textAlign:'left',color:t.sub,fontWeight:700,borderBottom:`1px solid ${t.border}`,whiteSpace:'nowrap',fontFamily:t.mono,fontSize:10}}>{c.replace(/_/g,' ')}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${t.border}`}}
                  onMouseEnter={e=>e.currentTarget.style.background=t.dark?'#0f1f36':'#f8fffc'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  {COLS.map(col=>(
                    <td key={col} style={{padding:'8px 10px',whiteSpace:'nowrap',
                      color:col==='Risk_Level'?rC(row[col]):col==='Nutrition_Status'?nC(row[col]):col==='Sedentary_Alert'&&row[col]==='Yes'?t.warn:col==='BMI_Category'&&row[col]==='Underweight'?t.danger:t.text,
                      fontWeight:['Risk_Level','Nutrition_Status'].includes(col)?700:400,
                      fontFamily:['BMI','Calories','Protein_g','Age','Steps_Per_Day'].includes(col)?t.mono:'inherit'
                    }}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{display:'flex',gap:6,justifyContent:'center',marginTop:16,flexWrap:'wrap'}}>
        {[['⟸',1],['←',page-1],...([...Array(Math.min(5,totalPages))].map((_,i)=>[null,Math.max(1,Math.min(page-2,totalPages-4))+i])),['→',page+1],['⟹',totalPages]].filter(([,p])=>p>=1&&p<=totalPages).map(([label,p],idx)=>(
          <button key={idx} onClick={()=>setPage(p)} style={{padding:'7px 12px',borderRadius:8,border:`1px solid ${p===page?t.accent:t.border}`,background:p===page?`${t.accent}18`:t.card,color:p===page?t.accent:t.sub,cursor:'pointer',fontWeight:p===page?700:400,fontSize:12,fontFamily:t.mono,minWidth:34}}>
            {label===null?p:label}
          </button>
        ))}
      </div>
    </PageWrap>
  );
}
