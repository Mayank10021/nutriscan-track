import React, { useState, useRef, useEffect } from 'react';
import { useT, Card, PageWrap, Btn } from '../components/UI';

const API = 'http://localhost:5000/api';

const QUICK = [
  { label: 'Protein sources', msg: 'What are best protein sources?' },
  { label: 'BMI guide', msg: 'How to calculate BMI?' },
  { label: 'Child malnutrition', msg: 'My child has malnutrition, what should I do?' },
  { label: 'Moringa nutrition', msg: 'Tell me about moringa' },
  { label: 'Helpline numbers', msg: 'Helpline numbers for child nutrition' },
  { label: 'Daily diet plan', msg: 'Give me a daily diet plan' },
  { label: 'Iron deficiency', msg: 'Iron rich foods in India' },
  { label: 'Hindi mein poochho', msg: 'Protein ke liye kya khaana chahiye?' },
];

function formatMsg(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 2 }}>{line.replace(/\*\*/g, '')}</div>;
    }
    if (line.startsWith('• ') || line.startsWith('- ')) {
      return <div key={i} style={{ paddingLeft: 14, marginBottom: 2 }}>{line}</div>;
    }
    if (line === '') return <div key={i} style={{ height: 6 }} />;
    return <div key={i}>{line.replace(/\*\*/g, '')}</div>;
  });
}

export default function Chatbot() {
  const t = useT();
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: 'Namaste! 🙏 Main NutriScan AI Nutrition Assistant hoon.\n\nAap mujhse pooch sakte hain:\n• Protein, calories, vitamins ke baare mein\n• BMI aur malnutrition guide\n• Indian foods nutrition data\n• Government schemes (POSHAN, ICDS)\n• Emergency helpline numbers\n\nHindi ya English — dono mein baat kar sakte hain!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async (msg = input) => {
    if (!msg.trim()) return;
    const newMsgs = [...msgs, { role: 'user', text: msg }];
    setMsgs(newMsgs);
    setInput('');
    setLoading(true);
    const res = await fetch(`${API}/chatbot/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }) }).then(r => r.json()).catch(() => ({ response: 'Sorry, chatbot not connected. Make sure server is running.' }));
    setMsgs([...newMsgs, { role: 'bot', text: res.response }]);
    setLoading(false);
  };

  return (
    <PageWrap style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 0 }}>
      {/* Header */}
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${t.border}`, background: t.card, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💬</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: t.text }}>NutriBot — AI Nutrition Advisor</div>
            <div style={{ fontSize: 12, color: t.accent }}>🟢 Online · Hindi + English · Powered by Rule-based NLP</div>
          </div>
          <div style={{ marginLeft: 'auto', background: `${t.accent}12`, border: `1px solid ${t.accent}25`, borderRadius: 10, padding: '6px 14px', fontSize: 12, color: t.accent, fontWeight: 700 }}>🌟 Bonus Feature</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '10px 28px', background: t.bg, borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
        {QUICK.map(q => (
          <button key={q.label} onClick={() => send(q.msg)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${t.border}`, background: t.card, color: t.sub, cursor: 'pointer', fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.sub; }}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: t.bg }}>
        {msgs.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }} className="animate-in">
            {msg.role === 'bot' && (
              <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginRight: 10, flexShrink: 0, marginTop: 4 }}>🤖</div>
            )}
            <div style={{
              maxWidth: '72%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? `linear-gradient(135deg, ${t.accent}, ${t.accent2})` : t.card,
              color: msg.role === 'user' ? (t.dark ? '#030712' : '#fff') : t.text,
              border: msg.role === 'bot' ? `1px solid ${t.border}` : 'none',
              fontSize: 13, lineHeight: 1.6
            }}>
              {msg.role === 'bot' ? formatMsg(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, padding: '12px 20px' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: t.accent, animation: `pulse 1.4s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 28px', background: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} placeholder="Ask about nutrition, foods, BMI, helplines... (Hindi or English)" style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.dark ? '#0f1f36' : '#f8fffc', color: t.text, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", outline: 'none' }}
          onFocus={e => e.target.style.borderColor = t.accent}
          onBlur={e => e.target.style.borderColor = t.border} />
        <Btn onClick={() => send()} size="lg" disabled={loading || !input.trim()}>Send →</Btn>
      </div>
    </PageWrap>
  );
}
