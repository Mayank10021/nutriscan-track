import { useTheme } from '../context/ThemeContext';

export function useT() {
  const { dark } = useTheme();
  if (dark) return {
    bg: '#030712', card: '#0a1628', card2: '#0f1f36', border: 'rgba(16,185,129,0.15)',
    borderStrong: 'rgba(16,185,129,0.35)', accent: '#10b981', accent2: '#06b6d4',
    accent3: '#8b5cf6', danger: '#ef4444', warn: '#f59e0b', info: '#3b82f6',
    text: '#f0fdf4', sub: '#4ade80', muted: '#1a3a2a', mono: "'Space Mono', monospace",
    success: '#10b981', dark: true
  };
  return {
    bg: '#f0fdf4', card: '#ffffff', card2: '#f8fffc', border: 'rgba(16,120,80,0.12)',
    borderStrong: 'rgba(16,120,80,0.3)', accent: '#059669', accent2: '#0891b2',
    accent3: '#7c3aed', danger: '#dc2626', warn: '#d97706', info: '#2563eb',
    text: '#022c22', sub: '#065f46', muted: '#d1fae5', mono: "'Space Mono', monospace",
    success: '#059669', dark: false
  };
}

export function Card({ children, style={}, glow=false, hover=false }) {
  const t = useT();
  return (
    <div style={{
      background: t.card, border: `1px solid ${glow ? t.borderStrong : t.border}`,
      borderRadius: 16, padding: 20, transition: 'all 0.2s',
      boxShadow: glow ? `0 0 30px ${t.accent}18, inset 0 0 30px ${t.accent}05` : 'none',
      ...style
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = 'translateY(-1px)'; } : null}
    onMouseLeave={hover ? e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = 'none'; } : null}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, color, trend }) {
  const t = useT();
  const c = color || t.accent;
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${c}15, transparent 70%)` }} />
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color: c, fontFamily: t.mono, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: c, marginTop: 2, fontFamily: t.mono, opacity: 0.7 }}>{sub}</div>}
      <div style={{ fontSize: 12, color: t.sub, marginTop: 6, fontWeight: 500 }}>{label}</div>
      {trend && <div style={{ position: 'absolute', bottom: 14, right: 16, fontSize: 11, color: trend > 0 ? t.danger : t.success, fontWeight: 700 }}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</div>}
    </div>
  );
}

export function Badge({ children, color, size='sm' }) {
  const t = useT();
  const c = color || t.accent;
  return (
    <span style={{ background: `${c}18`, color: c, padding: size==='sm' ? '3px 10px' : '5px 14px', borderRadius: 20, fontSize: size==='sm' ? 11 : 13, fontWeight: 700, border: `1px solid ${c}30`, display: 'inline-block' }}>
      {children}
    </span>
  );
}

export function RiskBadge({ level }) {
  const t = useT();
  const map = { High: { color: t.danger, icon: '🔴' }, Medium: { color: t.warn, icon: '🟡' }, Low: { color: t.success, icon: '🟢' } };
  const m = map[level] || map.Low;
  return <Badge color={m.color}>{m.icon} {level} Risk</Badge>;
}

export function Btn({ children, onClick, variant='primary', size='md', disabled, style={} }) {
  const t = useT();
  const variants = {
    primary: { bg: t.accent, color: t.dark ? '#030712' : '#fff', border: 'none' },
    secondary: { bg: 'transparent', color: t.accent, border: `1px solid ${t.accent}` },
    danger: { bg: t.danger, color: '#fff', border: 'none' },
    ghost: { bg: 'transparent', color: t.sub, border: `1px solid ${t.border}` },
  };
  const v = variants[variant];
  const sizes = { sm: '7px 14px', md: '10px 20px', lg: '13px 28px' };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...v, padding: sizes[size], borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 700, fontSize: size==='lg' ? 16 : size==='sm' ? 12 : 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
      transition: 'all 0.15s', opacity: disabled ? 0.5 : 1, ...style
    }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = '0.85')}
    onMouseLeave={e => !disabled && (e.currentTarget.style.opacity = '1')}
    >{children}</button>
  );
}

export function Input({ label, value, onChange, placeholder, type='text', style={} }) {
  const t = useT();
  return (
    <div style={{ ...style }}>
      {label && <label style={{ display: 'block', fontSize: 11, color: t.sub, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${t.border}`,
        background: t.dark ? '#0f1f36' : '#f8fffc', color: t.text, fontSize: 13,
        fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box', outline: 'none',
        transition: 'border-color 0.15s'
      }}
      onFocus={e => e.target.style.borderColor = t.accent}
      onBlur={e => e.target.style.borderColor = t.border}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, style={} }) {
  const t = useT();
  return (
    <div style={{ ...style }}>
      {label && <label style={{ display: 'block', fontSize: 11, color: t.sub, marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>}
      <select value={value} onChange={onChange} style={{
        width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${t.border}`,
        background: t.dark ? '#0f1f36' : '#f8fffc', color: t.text, fontSize: 13,
        fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box', cursor: 'pointer'
      }}>
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function SectionTitle({ children, sub }) {
  const t = useT();
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: t.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, fontFamily: t.mono, marginBottom: 4 }}>◈ {children}</div>
      {sub && <p style={{ margin: 0, color: t.sub, fontSize: 13 }}>{sub}</p>}
    </div>
  );
}

export function PageWrap({ children, style={} }) {
  const t = useT();
  return (
    <div className="animate-in" style={{ padding: '28px 32px', background: t.bg, minHeight: '100vh', ...style }}>
      {children}
    </div>
  );
}

export function TooltipStyle(t) {
  return {
    contentStyle: { background: t.card, border: `1px solid ${t.border}`, color: t.text, borderRadius: 10, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" },
    labelStyle: { color: t.accent, fontWeight: 700 }
  };
}

export function AxisStyle(t) {
  return { tick: { fill: t.sub, fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif" } };
}
