import React, { useEffect, useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ReferenceLine, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ─── Static fallback data for each chart endpoint ───────────────────────────
const STATIC_CHARTS = {
  "/api/py/chart/india-map": {
    type: "bubble-map",
    title: "Child Stunting by State — NFHS-4 vs NFHS-5",
    data: [
      { state: "Bihar",         nfhs4: 48.3, nfhs5: 42.9 },
      { state: "Jharkhand",     nfhs4: 47.8, nfhs5: 39.4 },
      { state: "Uttar Pradesh", nfhs4: 46.3, nfhs5: 39.7 },
      { state: "Madhya Pradesh",nfhs4: 42.0, nfhs5: 35.7 },
      { state: "Meghalaya",     nfhs4: 43.8, nfhs5: 46.5 },
      { state: "Gujarat",       nfhs4: 38.5, nfhs5: 25.1 },
      { state: "Rajasthan",     nfhs4: 39.1, nfhs5: 31.8 },
      { state: "Odisha",        nfhs4: 34.1, nfhs5: 31.2 },
      { state: "Assam",         nfhs4: 36.4, nfhs5: 35.3 },
      { state: "Chhattisgarh",  nfhs4: 37.6, nfhs5: 34.5 },
      { state: "Maharashtra",   nfhs4: 34.4, nfhs5: 25.6 },
      { state: "West Bengal",   nfhs4: 32.5, nfhs5: 33.8 },
      { state: "Karnataka",     nfhs4: 36.2, nfhs5: 35.4 },
      { state: "Tamil Nadu",    nfhs4: 27.1, nfhs5: 25.5 },
      { state: "Andhra Pradesh",nfhs4: 31.4, nfhs5: 31.8 },
      { state: "Telangana",     nfhs4: 28.0, nfhs5: 33.1 },
      { state: "Punjab",        nfhs4: 25.7, nfhs5: 24.5 },
      { state: "Haryana",       nfhs4: 34.0, nfhs5: 27.0 },
      { state: "Kerala",        nfhs4: 19.7, nfhs5: 23.4 },
      { state: "Himachal Pr.",  nfhs4: 26.3, nfhs5: 26.3 },
    ],
  },
  "/api/py/chart/nfhs-stunting": {
    type: "bar-compare",
    title: "Stunting Rate by State (NFHS-5, 2019-21)",
    data: [
      { state: "Meghalaya", value: 46.5 },
      { state: "Bihar",     value: 42.9 },
      { state: "UP",        value: 39.7 },
      { state: "Jharkhand", value: 39.4 },
      { state: "MP",        value: 35.7 },
      { state: "Karnataka", value: 35.4 },
      { state: "Assam",     value: 35.3 },
      { state: "Odisha",    value: 31.2 },
      { state: "Rajasthan", value: 31.8 },
      { state: "Gujarat",   value: 25.1 },
      { state: "Kerala",    value: 23.4 },
      { state: "Punjab",    value: 24.5 },
    ],
    yLabel: "Stunting %",
  },
  "/api/py/chart/nfhs-change": {
    type: "bar-grouped",
    title: "Change in Malnutrition Indicators: NFHS-4 → NFHS-5",
    data: [
      { state: "Bihar",     stunting: -5.4, underweight: -3.1, wasting: 1.2 },
      { state: "UP",        stunting: -6.6, underweight: -5.3, wasting: -0.8 },
      { state: "Gujarat",   stunting: -13.4, underweight: -6.2, wasting: -3.1 },
      { state: "Rajasthan", stunting: -7.3, underweight: -4.1, wasting: 0.2 },
      { state: "Meghalaya", stunting: 2.7, underweight: 0.4,  wasting: 1.1 },
      { state: "Telangana", stunting: 5.1, underweight: 2.3,  wasting: 1.9 },
      { state: "Kerala",    stunting: 3.7, underweight: 0.8,  wasting: 0.5 },
      { state: "Tamil Nadu",stunting: -1.6, underweight: -0.2, wasting: 0.7 },
    ],
  },
  "/api/py/chart/protein-gap": {
    type: "bar-compare",
    title: "Protein Intake Gap by Income Group",
    data: [
      { state: "Below Poverty", value: 32 },
      { state: "Low Income",    value: 41 },
      { state: "Middle Income", value: 52 },
      { state: "Upper-Middle",  value: 63 },
      { state: "High Income",   value: 78 },
    ],
    yLabel: "Avg Protein (g/day)",
    reference: { value: 56, label: "RDA 56g" },
  },
  "/api/py/chart/economic-gap": {
    type: "bar-compare",
    title: "Malnutrition Rate by Wealth Quintile",
    data: [
      { state: "Poorest",      value: 51.2 },
      { state: "Poor",         value: 43.1 },
      { state: "Middle",       value: 35.4 },
      { state: "Wealthy",      value: 25.6 },
      { state: "Wealthiest",   value: 16.8 },
    ],
    yLabel: "Stunting %",
  },
  "/api/py/chart/worst-states": {
    type: "bar-compare",
    title: "10 Worst-Performing States — Composite Malnutrition Index",
    data: [
      { state: "Meghalaya",  value: 71 },
      { state: "Bihar",      value: 68 },
      { state: "Jharkhand",  value: 65 },
      { state: "UP",         value: 63 },
      { state: "MP",         value: 59 },
      { state: "Assam",      value: 56 },
      { state: "Odisha",     value: 54 },
      { state: "Rajasthan",  value: 52 },
      { state: "Telangana",  value: 49 },
      { state: "W. Bengal",  value: 47 },
    ],
    yLabel: "Malnutrition Index",
  },
  "/api/py/chart/disease-burden": {
    type: "bar-compare",
    title: "Anaemia Prevalence by Age Group (NFHS-5)",
    data: [
      { state: "Children 6-59m", value: 67.1 },
      { state: "Women 15-49yr",  value: 57.0 },
      { state: "Men 15-49yr",    value: 25.0 },
      { state: "Pregnant Women", value: 52.2 },
      { state: "Adolescent Girls",value: 59.1 },
    ],
    yLabel: "Anaemia Prevalence %",
  },
  "/api/py/chart/stunting-wasting": {
    type: "scatter",
    title: "Stunting vs Wasting — Double Burden Analysis by State",
    data: [
      { state: "Bihar",     x: 42.9, y: 22.9 },
      { state: "Jharkhand", x: 39.4, y: 29.0 },
      { state: "UP",        x: 39.7, y: 18.0 },
      { state: "MP",        x: 35.7, y: 25.8 },
      { state: "Meghalaya", x: 46.5, y: 15.3 },
      { state: "Gujarat",   x: 25.1, y: 25.1 },
      { state: "Rajasthan", x: 31.8, y: 23.0 },
      { state: "Karnataka", x: 35.4, y: 19.5 },
      { state: "Assam",     x: 35.3, y: 17.3 },
      { state: "Tamil Nadu",x: 25.5, y: 19.7 },
      { state: "Kerala",    x: 23.4, y: 15.7 },
      { state: "Punjab",    x: 24.5, y: 15.0 },
      { state: "Telangana", x: 33.1, y: 21.0 },
      { state: "Odisha",    x: 31.2, y: 20.4 },
    ],
  },
  "/api/py/chart/scheme-effectiveness": {
    type: "bar-grouped",
    title: "Government Scheme Reach vs. Outcome (% Improvement)",
    data: [
      { state: "ICDS",       reach: 82, improvement: 12 },
      { state: "MDM",        reach: 91, improvement: 18 },
      { state: "PMMVY",      reach: 43, improvement: 9 },
      { state: "NHM",        reach: 67, improvement: 14 },
      { state: "PM-POSHAN",  reach: 88, improvement: 21 },
      { state: "Poshan 2.0", reach: 55, improvement: 11 },
    ],
  },
  "/api/py/chart/education-impact": {
    type: "bar-compare",
    title: "Stunting Rate by Mother's Education Level",
    data: [
      { state: "No Education",  value: 51.4 },
      { state: "Primary",       value: 42.3 },
      { state: "Middle School", value: 35.8 },
      { state: "Secondary",     value: 27.2 },
      { state: "Higher Sec.",   value: 20.1 },
      { state: "Graduate+",     value: 13.6 },
    ],
    yLabel: "Child Stunting %",
  },
};

// ─── Color utilities ─────────────────────────────────────────────────────────
function colorForVal(val, max = 55) {
  const pct = Math.min(val / max, 1);
  if (pct > 0.75) return "#b52b27";
  if (pct > 0.55) return "#e07020";
  if (pct > 0.35) return "#f5c842";
  return "#4caf88";
}

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0a1628",
    border: "1px solid rgba(16,185,129,0.2)",
    borderRadius: 10,
    color: "#f0fdf4",
    fontSize: 12,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  labelStyle: { color: "#10b981", fontWeight: 700 },
};

const AXIS_TICK = { fill: "#4ade80", fontSize: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" };

// ─── Fallback chart renderers ─────────────────────────────────────────────────
function FallbackBubbleMap({ data }) {
  // Sort and show as grouped bar: NFHS-4 vs NFHS-5
  const sorted = [...data].sort((a, b) => b.nfhs5 - a.nfhs5);
  return (
    <div>
      <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 12, display: "flex", gap: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 12, height: 12, background: "#ef4444", borderRadius: 3, display: "inline-block" }} />
          NFHS-4 (2015-16)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 12, height: 12, background: "#10b981", borderRadius: 3, display: "inline-block" }} />
          NFHS-5 (2019-21)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sorted} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" vertical={false} />
          <XAxis dataKey="state" tick={{ ...AXIS_TICK, angle: -40, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit="%" domain={[0, 55]} />
          <ReferenceLine y={35.5} stroke="#ffffff30" strokeDasharray="4 2" label={{ value: "National Avg 35.5%", fill: "#ffffff50", fontSize: 9 }} />
          <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n === "nfhs4" ? "NFHS-4 2015-16" : "NFHS-5 2019-21"]} />
          <Bar dataKey="nfhs4" fill="#ef4444" opacity={0.7} radius={[3, 3, 0, 0]} />
          <Bar dataKey="nfhs5" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function FallbackBarCompare({ data, yLabel, reference }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" vertical={false} />
        <XAxis dataKey="state" tick={{ ...AXIS_TICK, angle: -35, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: "#4ade80", fontSize: 10, dx: -5 } : null} />
        {reference && (
          <ReferenceLine y={reference.value} stroke="#f59e0b80" strokeDasharray="5 3"
            label={{ value: reference.label, fill: "#f59e0b", fontSize: 9, position: "insideTopRight" }} />
        )}
        <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [typeof v === "number" ? `${v}${yLabel?.includes("%") ? "%" : ""}` : v]} />
        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
          {sorted.map((d, i) => <Cell key={i} fill={colorForVal(d.value, Math.max(...sorted.map(s => s.value)))} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function FallbackBarGrouped({ data }) {
  const keys = Object.keys(data[0]).filter(k => k !== "state");
  const colors = ["#10b981", "#ef4444", "#f59e0b", "#06b6d4", "#8b5cf6"];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" vertical={false} />
        <XAxis dataKey="state" tick={{ ...AXIS_TICK, angle: -30, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#4ade80", paddingTop: 10 }} />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[3, 3, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function FallbackScatter({ data }) {
  // Stunting vs Wasting scatter
  const avgX = data.reduce((s, d) => s + d.x, 0) / data.length;
  const avgY = data.reduce((s, d) => s + d.y, 0) / data.length;
  return (
    <div>
      <div style={{ fontSize: 11, color: "#4ade80aa", marginBottom: 8 }}>
        Top-right quadrant = <strong style={{ color: "#ef4444" }}>Double Burden</strong> — both high stunting &amp; wasting
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 5, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.1)" />
          <XAxis type="number" dataKey="x" name="Stunting %" tick={AXIS_TICK} axisLine={false} tickLine={false} label={{ value: "Stunting %", position: "insideBottom", offset: -10, fill: "#4ade80", fontSize: 10 }} domain={[10, 55]} />
          <YAxis type="number" dataKey="y" name="Wasting %" tick={AXIS_TICK} axisLine={false} tickLine={false} label={{ value: "Wasting %", angle: -90, position: "insideLeft", fill: "#4ade80", fontSize: 10 }} domain={[10, 35]} />
          <ReferenceLine x={avgX} stroke="#ffffff20" strokeDasharray="4 2" />
          <ReferenceLine y={avgY} stroke="#ffffff20" strokeDasharray="4 2" />
          <Tooltip
            {...TOOLTIP_STYLE}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div style={{ ...TOOLTIP_STYLE.contentStyle, padding: "10px 14px" }}>
                  <div style={{ fontWeight: 800, color: "#10b981", marginBottom: 4 }}>{d.state}</div>
                  <div>Stunting: <strong>{d.x}%</strong></div>
                  <div>Wasting: <strong>{d.y}%</strong></div>
                </div>
              );
            }}
          />
          <Scatter data={data} fill="#10b981">
            {data.map((d, i) => (
              <Cell key={i} fill={d.x > avgX && d.y > avgY ? "#ef4444" : d.x > avgX ? "#f59e0b" : "#10b981"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Intersection observer hook ───────────────────────────────────────────────
function useVisible(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.05 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

// ─── Main ChartBlock ──────────────────────────────────────────────────────────
export default function ChartBlock({ PY, endpoint, title, subtitle, insight, source, svcOk }) {
  const [img, setImg]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed]  = useState(false);
  const ref     = useRef();
  const visible = useVisible(ref);
  const staticChart = STATIC_CHARTS[endpoint];

  useEffect(() => {
    if (!visible || img || loading || failed) return;
    setLoading(true);
    fetch(`${PY}${endpoint}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { if (d.image) setImg(d.image); else setFailed(true); })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [visible]);

  const renderStaticChart = () => {
    if (!staticChart) return null;
    switch (staticChart.type) {
      case "bubble-map":   return <FallbackBubbleMap data={staticChart.data} />;
      case "bar-compare":  return <FallbackBarCompare data={staticChart.data} yLabel={staticChart.yLabel} reference={staticChart.reference} />;
      case "bar-grouped":  return <FallbackBarGrouped data={staticChart.data} />;
      case "scatter":      return <FallbackScatter data={staticChart.data} />;
      default: return null;
    }
  };

  return (
    <div ref={ref} className="chart-block">
      <div className="chart-header">
        <div>
          <div className="chart-title">{title || staticChart?.title}</div>
          {subtitle && <div className="chart-sub">{subtitle}</div>}
        </div>
        {source && <div className="source-badge">{source}</div>}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="chart-loading">
          <div className="spinner-ring" />
          Generating chart from data...
        </div>
      )}

      {/* Python image — when service is running */}
      {!loading && img && (
        <img className="chart-img" src={`data:image/png;base64,${img}`} alt={title} />
      )}

      {/* Static React fallback — when Python is offline */}
      {!loading && !img && (failed || svcOk === false) && staticChart && (
        <div style={{ padding: "4px 0 8px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 10, color: "#f59e0b", fontWeight: 700,
            background: "#f59e0b12", border: "1px solid #f59e0b25",
            borderRadius: 20, padding: "3px 10px", marginBottom: 14,
            fontFamily: "monospace"
          }}>
            ◎ Static view — start Python service for live charts
          </div>
          {renderStaticChart()}
        </div>
      )}

      {/* If Python fails and no static fallback */}
      {!loading && !img && (failed || svcOk === false) && !staticChart && (
        <div style={{
          background: "#f59e0b10", border: "1px solid #f59e0b25", borderRadius: 12,
          padding: "16px 20px", color: "#f59e0b", fontSize: 13, fontWeight: 600
        }}>
          ⚠️ Chart requires Python service &nbsp;
          <code style={{ background: "#1a2a3a", padding: "2px 8px", borderRadius: 6, fontSize: 11 }}>
            cd python-service &amp;&amp; python app.py
          </code>
        </div>
      )}

      {insight && <div className="chart-insight">{insight}</div>}
    </div>
  );
}
