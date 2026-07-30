import { useState, useEffect, useCallback } from 'react';
import { CHAPTERS } from './data';

/* ═══════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════ */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700;900&display=swap');`;

const mkStyles = (dark) => ({
  bg:      dark ? '#0d1117' : '#f7f9fc',
  surface: dark ? '#161b22' : '#ffffff',
  card:    dark ? '#1f2937' : '#ffffff',
  border:  dark ? '#30363d' : '#e8edf3',
  text:    dark ? '#e6edf3' : '#1a1f2e',
  sub:     dark ? '#8b949e' : '#64748b',
  accent:  '#2e7d52',
  gold:    '#c9a227',
  quranic: dark ? '#ffd700' : '#8b6914',
});

/* ═══════════════════════════════════════════════════
   SPLASH / HOME
═══════════════════════════════════════════════════ */
function HomeScreen({ onSelect, dark, toggleDark, progress }) {
  const S = mkStyles(dark);
  const [search, setSearch] = useState('');
  const filtered = CHAPTERS.filter(c =>
    c.title.includes(search) || c.subtitle.includes(search)
  );

  return (
    <div style={{ minHeight:'100vh', background: S.bg, color: S.text, fontFamily:"'Cairo', sans-serif", direction:'rtl' }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${S.accent}; border-radius:2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .chap-card:hover { transform:translateY(-2px); }
        .chap-card { transition:transform .2s,box-shadow .2s; }
        input::placeholder { color: ${S.sub}; }
        input { outline:none; font-family:'Cairo',sans-serif; }
      `}</style>

      {/* Header */}
      <div style={{ background: dark ? '#0d1117' : 'linear-gradient(135deg,#1a472a 0%,#2e7d52 100%)', padding:'0 0 32px' }}>
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'16px 16px 0' }}>
          <button onClick={toggleDark}
            style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:12, padding:'8px 14px', color:'#fff', fontSize:20, cursor:'pointer' }}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
        <div style={{ textAlign:'center', padding:'8px 20px 0', animation:'fadeUp .5s ease' }}>
          <div style={{ fontSize:60, marginBottom:8 }}>📖</div>
          <h1 style={{ fontFamily:"'Amiri', serif", fontSize:28, fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:4 }}>
            أحكام التجويد
          </h1>
          <p style={{ color:'rgba(255,255,255,.75)', fontSize:14 }}>
            برواية ورش عن نافع من طريق الأزرق
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:16, flexWrap:'wrap' }}>
            <Stat label="فصلًا" value={CHAPTERS.length} />
            <Stat label="قاعدة" value="120+" />
            <Stat label="سؤالًا" value={CHAPTERS.reduce((a,c)=>a+c.quiz.length,0)} />
          </div>
        </div>

        {/* Progress bar */}
        {progress.total > 0 && (
          <div style={{ margin:'16px 20px 0', background:'rgba(255,255,255,.15)', borderRadius:99, height:6, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(progress.done/progress.total*100).toFixed(0)}%`, background:'#ffd700', borderRadius:99, transition:'width .5s' }} />
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ padding:'16px 16px 8px', position:'sticky', top:0, zIndex:10, background: S.bg }}>
        <div style={{ position:'relative' }}>
          <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', fontSize:18, color: S.sub }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="ابحث عن فصل..."
            style={{ width:'100%', background: S.surface, border:`1.5px solid ${S.border}`, borderRadius:14, padding:'12px 44px 12px 16px', fontSize:15, color: S.text }} />
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ padding:'4px 16px 80px', display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map((ch, i) => {
          const done = progress.chapters?.[ch.id];
          return (
            <button key={ch.id} className="chap-card"
              onClick={() => onSelect(ch.id)}
              style={{ background: S.card, border:`1.5px solid ${S.border}`, borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, textAlign:'right', cursor:'pointer', width:'100%',
                animation:`fadeUp .3s ease ${i*0.04}s both`,
                boxShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,.06)'
              }}>
              {/* Icon */}
              <div style={{ width:50, height:50, borderRadius:15, background: ch.lightBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, border:`2px solid ${ch.color}30` }}>
                {ch.icon}
              </div>
              {/* Text */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:15, fontWeight:700, color: S.text, marginBottom:2 }}>{ch.title}</p>
                <p style={{ fontSize:12, color: S.sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ch.subtitle}</p>
              </div>
              {/* Done badge */}
              {done && <span style={{ fontSize:18 }}>✅</span>}
              <span style={{ color: S.sub, fontSize:16 }}>◀</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'48px', color: S.sub }}>
            <div style={{ fontSize:48 }}>🔍</div>
            <p style={{ marginTop:12, fontSize:15 }}>لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background:'rgba(255,255,255,.15)', borderRadius:12, padding:'8px 16px', textAlign:'center' }}>
      <p style={{ color:'#fff', fontSize:20, fontWeight:900 }}>{value}</p>
      <p style={{ color:'rgba(255,255,255,.7)', fontSize:12 }}>{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHAPTER SCREEN
═══════════════════════════════════════════════════ */
function ChapterScreen({ chapterId, onBack, dark, onComplete }) {
  const S = mkStyles(dark);
  const ch = CHAPTERS[chapterId];
  const [tab, setTab] = useState('content'); // content | summary | quiz
  const [quizState, setQuizState] = useState({ step:0, selected:null, score:0, done:false });

  const resetQuiz = () => setQuizState({ step:0, selected:null, score:0, done:false });

  useEffect(() => { window.scrollTo(0,0); }, [tab]);

  return (
    <div style={{ minHeight:'100vh', background: S.bg, color: S.text, fontFamily:"'Cairo', sans-serif", direction:'rtl' }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        .section-card { animation: fadeUp .3s ease both; }
      `}</style>

      {/* Header */}
      <div style={{ background: ch.color, padding:'0 0 20px', position:'sticky', top:0, zIndex:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px 8px' }}>
          <button onClick={onBack}
            style={{ background:'rgba(255,255,255,.2)', border:'none', borderRadius:12, padding:'8px 12px', color:'#fff', fontSize:18, cursor:'pointer', flexShrink:0 }}>
            ▶
          </button>
          <div style={{ flex:1 }}>
            <p style={{ color:'rgba(255,255,255,.75)', fontSize:12 }}>الفصل {ch.id + 1}</p>
            <h2 style={{ color:'#fff', fontSize:18, fontWeight:800, lineHeight:1.2 }}>{ch.title}</h2>
          </div>
          <span style={{ fontSize:28 }}>{ch.icon}</span>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', margin:'0 16px', background:'rgba(0,0,0,.2)', borderRadius:14, padding:4, gap:4 }}>
          {[['content','📝 المحتوى'],['summary','📋 الملخص'],['quiz','🎯 الامتحان']].map(([id,label])=>(
            <button key={id} onClick={()=>{setTab(id);if(id==='quiz')resetQuiz();}}
              style={{ flex:1, padding:'8px 4px', borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:"'Cairo',sans-serif",
                background: tab===id ? '#fff' : 'transparent',
                color: tab===id ? ch.color : 'rgba(255,255,255,.8)'
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'16px', paddingBottom:40 }}>
        {tab === 'content' && <ContentTab ch={ch} S={S} dark={dark} />}
        {tab === 'summary' && <SummaryTab ch={ch} S={S} />}
        {tab === 'quiz' && <QuizTab ch={ch} S={S} state={quizState} setState={setQuizState} onComplete={onComplete} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONTENT TAB
═══════════════════════════════════════════════════ */
function ContentTab({ ch, S, dark }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {ch.sections.map((sec, i) => (
        <SectionRenderer key={i} sec={sec} idx={i} S={S} dark={dark} ch={ch} />
      ))}
    </div>
  );
}

function SectionRenderer({ sec, idx, S, dark, ch }) {
  const delay = `${idx * 0.06}s`;

  switch(sec.type) {
    case 'definition':
      return (
        <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <p style={{ color: S.text, fontSize:15, lineHeight:1.8, marginBottom:sec.items?12:0 }}>{sec.content}</p>
          {sec.items && sec.items.map((item, j) => (
            <DefinitionItem key={j} label={item.label} text={item.text} S={S} />
          ))}
        </div>
      );

    case 'ruling':
      return (
        <div className="section-card" style={{ background: dark ? '#1a2412' : '#f0fff4', borderRadius:18, padding:18, border:`2px solid ${ch.color}40`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} icon="⚖️" />
          <p style={{ color: S.text, fontSize:15, lineHeight:1.9 }}>{sec.mainText}</p>
          {sec.note && (
            <div style={{ marginTop:12, background: dark ? '#0d1f15' : '#e8f5ee', borderRadius:12, padding:12 }}>
              <p style={{ color: ch.color, fontSize:14, lineHeight:1.7, whiteSpace:'pre-line' }}>{sec.note}</p>
            </div>
          )}
        </div>
      );

    case 'evidence':
      return (
        <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} icon="📜" />
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {sec.items.map((item, j) => (
              <div key={j} style={{ background: dark ? '#1a1a2e' : '#f0f4ff', borderRadius:12, padding:12, borderRight:`3px solid ${ch.color}` }}>
                <p style={{ color: ch.color, fontWeight:700, fontSize:13, marginBottom:4 }}>{item.label}</p>
                <p style={{ color: S.text, fontSize:14, lineHeight:1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className="section-card" style={{ background:`linear-gradient(135deg, ${ch.color}15, ${ch.color}05)`, borderRadius:18, padding:20, border:`1.5px solid ${ch.color}30`, textAlign:'center', animationDelay:delay }}>
          <div style={{ fontSize:32, marginBottom:8 }}>✨</div>
          <p style={{ fontFamily:"'Amiri',serif", fontSize:18, color: S.text, lineHeight:2.2, whiteSpace:'pre-line', direction:'rtl' }}>{sec.text}</p>
          <p style={{ color: ch.color, fontWeight:700, marginTop:10, fontSize:13 }}>{sec.title}</p>
        </div>
      );

    case 'intro':
      return (
        <div className="section-card" style={{ background:`linear-gradient(135deg, ${ch.color}20, ${ch.color}05)`, borderRadius:18, padding:18, border:`1.5px solid ${ch.color}25`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <p style={{ color: S.text, fontSize:15, lineHeight:1.9 }}>{sec.content}</p>
        </div>
      );

    case 'info':
      return (
        <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          {sec.items && sec.items.map((item, j) => (
            <DefinitionItem key={j} label={item.label} text={item.text} S={S} />
          ))}
        </div>
      );

    case 'note':
      return (
        <div className="section-card" style={{ background: dark ? '#1a1500' : '#fffbe6', borderRadius:18, padding:16, border:`1.5px solid #c9a22740`, animationDelay:delay }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <span style={{ fontSize:20 }}>💡</span>
            <p style={{ color:'#c9a227', fontWeight:800, fontSize:14 }}>{sec.title}</p>
          </div>
          <p style={{ color: S.text, fontSize:14, lineHeight:1.8 }}>{sec.content}</p>
        </div>
      );

    case 'diagram':
      return <DiagramSection sec={sec} S={S} dark={dark} ch={ch} delay={delay} />;

    case 'cards':
      return (
        <div className="section-card" style={{ animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sec.cards.map((card, j) => (
              <CardItem key={j} card={card} S={S} dark={dark} />
            ))}
          </div>
        </div>
      );

    case 'pairs':
      return (
        <div className="section-card" style={{ animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sec.pairs.map((pair, j) => (
              <PairItem key={j} pair={pair} S={S} dark={dark} />
            ))}
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="section-card" style={{ animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {sec.items.map((item, j) => (
              <ListItem key={j} item={item} S={S} dark={dark} />
            ))}
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay, overflowX:'auto' }}>
          <SectionTitle title={sec.title} color={ch.color} />
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr>{sec.headers.map((h,j)=><th key={j} style={{ background: ch.color, color:'#fff', padding:'8px 10px', textAlign:'right', fontWeight:700, fontSize:12 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {sec.rows.map((row,j)=>(
                <tr key={j} style={{ background: j%2===0?(dark?'#1f2937':'#f8faff'):(dark?'#161b22':'#fff') }}>
                  {row.map((cell,k)=><td key={k} style={{ padding:'8px 10px', color: S.text, borderBottom:`1px solid ${S.border}` }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'section':
      return (
        <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay }}>
          <SectionTitle title={sec.title} color={ch.color} />
          {sec.content && <p style={{ color: S.text, fontSize:14, lineHeight:1.8, marginBottom:12 }}>{sec.content}</p>}
          {sec.subsections && sec.subsections.map((sub, j) => (
            <SubSection key={j} sub={sub} S={S} dark={dark} />
          ))}
        </div>
      );

    default:
      return null;
  }
}

function SectionTitle({ title, color, icon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      {icon && <span style={{ fontSize:18 }}>{icon}</span>}
      <div style={{ width:4, height:20, background:color, borderRadius:2, flexShrink:0 }}/>
      <h3 style={{ color, fontWeight:800, fontSize:16 }}>{title}</h3>
    </div>
  );
}

function DefinitionItem({ label, text, S }) {
  return (
    <div style={{ marginBottom:10, padding:'10px', background: S.bg, borderRadius:12 }}>
      <p style={{ color: S.sub, fontWeight:700, fontSize:12, marginBottom:4 }}>{label}</p>
      <p style={{ color: S.text, fontSize:14, lineHeight:1.75 }}>{text}</p>
    </div>
  );
}

function CardItem({ card, S, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: dark ? '#1f2937' : card.color+'10', borderRadius:16, border:`1.5px solid ${card.color}30`, overflow:'hidden' }}>
      <button onClick={()=>setOpen(!open)}
        style={{ width:'100%', padding:'14px 16px', display:'flex', alignItems:'center', gap:12, background:'transparent', border:'none', cursor:'pointer', textAlign:'right' }}>
        <div style={{ width:34, height:34, borderRadius:10, background:card.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ color:'#fff', fontWeight:900, fontSize:16 }}>{card.num}</span>
        </div>
        <p style={{ flex:1, color: S.text, fontWeight:700, fontSize:15 }}>{card.title}</p>
        <span style={{ color: S.sub, transition:'transform .2s', transform: open?'rotate(90deg)':'none' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding:'0 16px 14px', animation:'fadeUp .2s ease' }}>
          {card.def && <p style={{ color: S.sub, fontSize:13, marginBottom:8 }}>{card.def}</p>}
          <p style={{ color: S.text, fontSize:14, lineHeight:1.8, whiteSpace:'pre-line' }}>{card.detail}</p>
          {card.note && (
            <div style={{ marginTop:10, background: dark?'#0d1a0d':'#e8f5ee', borderRadius:10, padding:10 }}>
              <p style={{ color:'#2e7d52', fontSize:13, lineHeight:1.7 }}>💡 {card.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PairItem({ pair, S, dark }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      {[pair.left, pair.right].filter(p=>p.name!=='——').map((side, j) => (
        <div key={j} style={{ background: dark ? '#1f2937' : side.color+'12', borderRadius:14, padding:12, border:`1.5px solid ${side.color}30` }}>
          <p style={{ color:side.color, fontWeight:800, fontSize:14, marginBottom:6 }}>{side.name}</p>
          <p style={{ color: S.text, fontSize:12, lineHeight:1.7 }}>{side.def}</p>
        </div>
      ))}
    </div>
  );
}

function ListItem({ item, S, dark }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: dark ? '#1f2937' : item.color+'10', borderRadius:14, border:`1.5px solid ${item.color}25` }}>
      <button onClick={()=>setOpen(!open)}
        style={{ width:'100%', padding:'12px 14px', display:'flex', alignItems:'center', gap:10, background:'transparent', border:'none', cursor:'pointer', textAlign:'right' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:item.color, flexShrink:0 }}/>
        <p style={{ flex:1, color: S.text, fontWeight:700, fontSize:14 }}>{item.name}</p>
        <span style={{ color: S.sub }}>▼</span>
      </button>
      {open && (
        <div style={{ padding:'0 14px 12px' }}>
          <p style={{ color: S.text, fontSize:13, lineHeight:1.8 }}>{item.def}</p>
          {item.example && (
            <div style={{ marginTop:8, background: dark?'#111':'#fff', borderRadius:10, padding:'8px 12px', border:`1px solid ${S.border}` }}>
              <p style={{ color:'#c9a227', fontSize:13, lineHeight:1.7, whiteSpace:'pre-line' }}>📌 {item.example}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SubSection({ sub, S, dark }) {
  return (
    <div style={{ marginBottom:12, borderRight:`3px solid ${sub.color}`, paddingRight:12 }}>
      <p style={{ color:sub.color, fontWeight:800, fontSize:14, marginBottom:8 }}>{sub.title}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {sub.rules && sub.rules.map((rule, i) => (
          <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
            <span style={{ color:sub.color, flexShrink:0, marginTop:3 }}>•</span>
            <p style={{ color: S.text, fontSize:13, lineHeight:1.75 }}>{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DIAGRAM SECTIONS
═══════════════════════════════════════════════════ */
function DiagramSection({ sec, S, dark, ch, delay }) {
  if (sec.diagramType === 'tree') return <TreeDiagram sec={sec} S={S} dark={dark} ch={ch} delay={delay} />;
  if (sec.diagramType === 'fourRules') return <FourRulesDiagram sec={sec} S={S} dark={dark} ch={ch} delay={delay} />;
  if (sec.diagramType === 'threeRules') return <ThreeRulesDiagram sec={sec} S={S} dark={dark} ch={ch} delay={delay} />;
  if (sec.diagramType === 'makharij') return <MakharijDiagram sec={sec} S={S} dark={dark} ch={ch} delay={delay} />;
  return null;
}

function TreeDiagram({ sec, S, dark, ch, delay }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="section-card" style={{ background: S.card, borderRadius:18, padding:18, border:`1.5px solid ${S.border}`, animationDelay:delay }}>
      <SectionTitle title={sec.title} color={ch.color} />
      {/* Root */}
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <div style={{ display:'inline-block', background:ch.color, color:'#fff', borderRadius:14, padding:'10px 28px', fontWeight:800, fontSize:16 }}>
          {sec.root}
        </div>
      </div>
      {/* Branches */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {sec.branches.map((br, i) => (
          <div key={i} style={{ background: dark ? '#1f2937' : br.color+'12', borderRadius:14, border:`1.5px solid ${br.color}30`, overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===i?null:i)}
              style={{ width:'100%', padding:'12px 14px', background:'transparent', border:'none', cursor:'pointer', textAlign:'center' }}>
              <p style={{ color:br.color, fontWeight:800, fontSize:14 }}>{br.label}</p>
            </button>
            {open===i && (
              <div style={{ padding:'0 12px 12px', animation:'scaleIn .2s ease' }}>
                <p style={{ color: S.text, fontSize:12, lineHeight:1.7, marginBottom:8 }}>{br.desc}</p>
                {br.examples && br.examples.map((ex,j)=>(
                  <p key={j} style={{ color:'#c9a227', fontSize:12, marginBottom:3 }}>• {ex}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FourRulesDiagram({ sec, S, dark, ch, delay }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="section-card" style={{ animationDelay:delay }}>
      <SectionTitle title={sec.title} color={ch.color} />
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {sec.rules.map((rule, i) => (
          <div key={i} style={{ background: dark ? '#1f2937' : rule.color+'10', borderRadius:16, border:`2px solid ${rule.color}30`, overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===i?null:i)}
              style={{ width:'100%', padding:'14px 16px', display:'flex', alignItems:'center', gap:12, background:'transparent', border:'none', cursor:'pointer', textAlign:'right' }}>
              <div style={{ width:36, height:36, borderRadius:12, background:rule.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'#fff', fontWeight:900, fontSize:16 }}>{rule.num}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color: S.text, fontWeight:800, fontSize:15 }}>{rule.name}</p>
                <p style={{ color: S.sub, fontSize:12, marginTop:2 }}>{rule.condition}</p>
              </div>
              <span style={{ color: S.sub }}>▼</span>
            </button>
            {open===i && (
              <div style={{ padding:'0 16px 16px', animation:'fadeUp .2s ease' }}>
                {/* Letters display */}
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                  {rule.letters && rule.letters.split(/\s+/).filter(Boolean).map((l,j)=>(
                    <span key={j} style={{ background:rule.color, color:'#fff', borderRadius:8, padding:'4px 10px', fontSize:16, fontWeight:700, fontFamily:"'Amiri',serif" }}>{l}</span>
                  ))}
                </div>
                <p style={{ color: S.text, fontSize:14, lineHeight:1.8, marginBottom:10 }}>{rule.def}</p>
                {/* Examples */}
                {rule.examples && (
                  <div style={{ background: dark?'#111':'#f8f9fa', borderRadius:12, padding:12 }}>
                    <p style={{ color:'#c9a227', fontWeight:700, fontSize:12, marginBottom:6 }}>أمثلة:</p>
                    {rule.examples.map((ex,j)=>(
                      <p key={j} style={{ color: S.text, fontSize:14, marginBottom:4, fontFamily:"'Amiri',serif" }}>• {ex}</p>
                    ))}
                  </div>
                )}
                {/* Sub-rules (for إدغام) */}
                {rule.sub && rule.sub.map((s,j)=>(
                  <div key={j} style={{ marginTop:10, background: dark?'#0d1117':'#fff', borderRadius:12, padding:12, border:`1px solid ${S.border}` }}>
                    <p style={{ color:rule.color, fontWeight:700, fontSize:13, marginBottom:6 }}>الإدغام {s.name}:</p>
                    <p style={{ color:'#c9a227', fontSize:13, marginBottom:6 }}>الحروف: {s.letters}</p>
                    {s.examples.map((ex,k)=>(
                      <p key={k} style={{ color: S.text, fontSize:13, fontFamily:"'Amiri',serif" }}>• {ex}</p>
                    ))}
                    {s.note && <p style={{ color: S.sub, fontSize:12, marginTop:6 }}>💡 {s.note}</p>}
                  </div>
                ))}
                {rule.exceptions && (
                  <div style={{ marginTop:10, background: dark?'#1a1a0d':'#fffbe6', borderRadius:10, padding:10 }}>
                    <p style={{ color:'#c9a227', fontSize:13 }}>⚠️ {rule.exceptions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThreeRulesDiagram({ sec, S, dark, ch, delay }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="section-card" style={{ animationDelay:delay }}>
      <SectionTitle title={sec.title} color={ch.color} />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {sec.rules.map((rule, i) => (
          <div key={i} style={{ background: dark ? '#1f2937' : rule.color+'10', borderRadius:16, border:`2px solid ${rule.color}30`, overflow:'hidden' }}>
            <button onClick={()=>setOpen(open===i?null:i)}
              style={{ width:'100%', padding:'13px 16px', display:'flex', alignItems:'center', gap:12, background:'transparent', border:'none', cursor:'pointer' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:rule.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:'#fff', fontWeight:900 }}>{rule.num}</span>
              </div>
              <div style={{ flex:1, textAlign:'right' }}>
                <p style={{ color: S.text, fontWeight:800, fontSize:15 }}>{rule.name}</p>
                <p style={{ color: S.sub, fontSize:12 }}>الحرف: <span style={{ color:rule.color, fontWeight:700, fontFamily:"'Amiri',serif" }}>{rule.letter}</span></p>
              </div>
              <span style={{ color: S.sub }}>▼</span>
            </button>
            {open===i && (
              <div style={{ padding:'0 16px 14px', animation:'fadeUp .2s ease' }}>
                <p style={{ color: S.text, fontSize:14, lineHeight:1.8, marginBottom:10 }}>{rule.def}</p>
                <div style={{ background: dark?'#111':'#f8f9fa', borderRadius:12, padding:10 }}>
                  {rule.examples.map((ex,j)=>(
                    <p key={j} style={{ color:'#c9a227', fontSize:14, fontFamily:"'Amiri',serif", marginBottom:3 }}>• {ex}</p>
                  ))}
                </div>
                {rule.note && <p style={{ color: S.sub, fontSize:12, marginTop:8 }}>💡 {rule.note}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MakharijDiagram({ sec, S, dark, ch, delay }) {
  const [active, setActive] = useState(null);
  return (
    <div className="section-card" style={{ animationDelay:delay }}>
      <SectionTitle title={sec.title} color={ch.color} />
      {/* SVG diagram of speech organs */}
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <svg viewBox="0 0 300 220" width="100%" style={{ maxWidth:300 }}>
          {/* Head outline */}
          <ellipse cx="150" cy="80" rx="70" ry="75" fill={dark?'#1f2937':'#f0f4f8'} stroke={S.border} strokeWidth="2"/>
          {/* Mouth */}
          <path d="M 110 140 Q 150 165 190 140" fill="none" stroke={dark?'#60a5fa':'#3b82f6'} strokeWidth="2.5"/>
          {/* Lips */}
          <ellipse cx="150" cy="148" rx="40" ry="12" fill={dark?'#374151':'#e2e8f0'} stroke={dark?'#60a5fa':'#3b82f6'} strokeWidth="1.5"/>
          {/* Tongue */}
          <path d="M 120 150 Q 150 130 180 150" fill={dark?'#dc2626':'#ef4444'} opacity=".7"/>
          {/* Throat */}
          <rect x="130" y="155" width="40" height="45" rx="8" fill={dark?'#1e3a5f':'#dbeafe'}/>
          {/* Labels */}
          <text x="150" y="30" textAnchor="middle" fontSize="11" fill={dark?'#e6edf3':'#1a1f2e'} fontFamily="Cairo,sans-serif">الجوف</text>
          <circle cx="150" cy="55" r="4" fill="#2e7d52"/>
          <line x1="150" y1="35" x2="150" y2="51" stroke="#2e7d52" strokeWidth="1.5"/>

          <text x="235" y="105" textAnchor="middle" fontSize="10" fill={dark?'#e6edf3':'#1a1f2e'} fontFamily="Cairo,sans-serif">الحلق</text>
          <circle cx="175" cy="115" r="4" fill="#1a4a8b"/>
          <line x1="215" y1="105" x2="179" y2="115" stroke="#1a4a8b" strokeWidth="1.5"/>

          <text x="63" y="135" textAnchor="middle" fontSize="10" fill={dark?'#e6edf3':'#1a1f2e'} fontFamily="Cairo,sans-serif">اللسان</text>
          <circle cx="135" cy="138" r="4" fill="#8b1a1a"/>
          <line x1="83" y1="135" x2="131" y2="137" stroke="#8b1a1a" strokeWidth="1.5"/>

          <text x="150" y="210" textAnchor="middle" fontSize="10" fill={dark?'#e6edf3':'#1a1f2e'} fontFamily="Cairo,sans-serif">الشفتان</text>
          <circle cx="150" cy="155" r="4" fill="#5a1a8b"/>
          <line x1="150" y1="200" x2="150" y2="159" stroke="#5a1a8b" strokeWidth="1.5"/>

          <text x="30" y="55" textAnchor="middle" fontSize="10" fill={dark?'#e6edf3':'#1a1f2e'} fontFamily="Cairo,sans-serif">الخيشوم</text>
          <circle cx="120" cy="70" r="4" fill="#8b6914"/>
          <line x1="60" y1="55" x2="116" y2="68" stroke="#8b6914" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Makharij cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {sec.items.map((item, i) => (
          <div key={i} style={{ background: dark ? '#1f2937' : item.color+'10', borderRadius:14, border:`1.5px solid ${item.color}30`, overflow:'hidden' }}>
            <button onClick={()=>setActive(active===i?null:i)}
              style={{ width:'100%', padding:'13px 14px', display:'flex', alignItems:'center', gap:12, background:'transparent', border:'none', cursor:'pointer' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:item.color+'20', border:`2px solid ${item.color}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:item.color, fontWeight:900, fontFamily:"'Amiri',serif", fontSize:16 }}>{item.arabic}</span>
              </div>
              <div style={{ flex:1, textAlign:'right' }}>
                <p style={{ color: S.text, fontWeight:800, fontSize:15 }}>{item.name}</p>
                <p style={{ color:item.color, fontSize:13, fontFamily:"'Amiri',serif" }}>{item.letters}</p>
              </div>
              <span style={{ color: S.sub }}>▼</span>
            </button>
            {active===i && (
              <div style={{ padding:'0 14px 14px', animation:'fadeUp .2s ease' }}>
                <p style={{ color: S.text, fontSize:14, lineHeight:1.8, whiteSpace:'pre-line' }}>{item.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUMMARY TAB
═══════════════════════════════════════════════════ */
function SummaryTab({ ch, S }) {
  return (
    <div style={{ animation:'fadeUp .3s ease' }}>
      <div style={{ background:`linear-gradient(135deg, ${ch.color}20, ${ch.color}05)`, borderRadius:18, padding:20, border:`2px solid ${ch.color}30`, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <span style={{ fontSize:28 }}>📋</span>
          <div>
            <h3 style={{ color:ch.color, fontWeight:800, fontSize:18 }}>ملخص الفصل</h3>
            <p style={{ color: S.sub, fontSize:13 }}>{ch.title}</p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {ch.summary.map((point, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', background: S.card, borderRadius:12, padding:12 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:ch.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                <span style={{ color:'#fff', fontSize:13, fontWeight:900 }}>{i+1}</span>
              </div>
              <p style={{ color: S.text, fontSize:14, lineHeight:1.8, flex:1 }}>{point}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: S.card, borderRadius:16, padding:16, border:`1.5px solid ${S.border}`, textAlign:'center' }}>
        <p style={{ color: S.sub, fontSize:13 }}>اختبر نفسك على هذا الفصل</p>
        <p style={{ color:ch.color, fontWeight:700, fontSize:15, marginTop:4 }}>اضغط على تبويب "الامتحان" ←</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   QUIZ TAB
═══════════════════════════════════════════════════ */
function QuizTab({ ch, S, state, setState, onComplete }) {
  const { step, selected, score, done } = state;
  const q = ch.quiz[step];

  const choose = (idx) => {
    if (selected !== null) return;
    const correct = idx === q.ans;
    setState(s => ({ ...s, selected:idx, score: correct ? s.score+1 : s.score }));
  };

  const next = () => {
    if (step >= ch.quiz.length - 1) {
      setState(s => ({ ...s, done:true }));
      onComplete(ch.id);
    } else {
      setState(s => ({ ...s, step: s.step+1, selected:null }));
    }
  };

  if (done) {
    const pct = Math.round(score / ch.quiz.length * 100);
    const grade = pct >= 80 ? { msg:'ممتاز! أحسنت 🏆', color:'#2e7d52' } :
                  pct >= 60 ? { msg:'جيد! استمر 👍', color:'#c9a227' } :
                             { msg:'راجع الفصل مرة أخرى 📖', color:'#8b1a1a' };
    return (
      <div style={{ textAlign:'center', animation:'scaleIn .3s ease', padding:'20px 0' }}>
        <div style={{ fontSize:80, marginBottom:16 }}>{pct>=80?'🏆':pct>=60?'👍':'📖'}</div>
        <h3 style={{ color:grade.color, fontSize:24, fontWeight:900, marginBottom:8 }}>{grade.msg}</h3>
        <p style={{ color: S.text, fontSize:20, fontWeight:700, marginBottom:4 }}>{score} / {ch.quiz.length}</p>
        <p style={{ color: S.sub, fontSize:16, marginBottom:32 }}>{pct}%</p>
        <div style={{ background: S.card, borderRadius:16, padding:16, marginBottom:16, border:`1.5px solid ${S.border}` }}>
          <div style={{ background: S.bg, borderRadius:99, height:12, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:grade.color, borderRadius:99, transition:'width 1s ease' }}/>
          </div>
        </div>
        <button onClick={()=>setState({step:0,selected:null,score:0,done:false})}
          style={{ background:ch.color, color:'#fff', border:'none', borderRadius:16, padding:'14px 32px', fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>
          أعد الامتحان 🔄
        </button>
      </div>
    );
  }

  return (
    <div style={{ animation:'fadeUp .3s ease' }}>
      {/* Progress */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <div style={{ flex:1, background: S.border, borderRadius:99, height:8, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(step/ch.quiz.length)*100}%`, background:ch.color, borderRadius:99 }}/>
        </div>
        <span style={{ color: S.sub, fontSize:13, flexShrink:0 }}>{step+1}/{ch.quiz.length}</span>
      </div>

      {/* Question */}
      <div style={{ background: S.card, borderRadius:18, padding:20, marginBottom:16, border:`1.5px solid ${S.border}` }}>
        <div style={{ display:'flex', gap:10, marginBottom:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:ch.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:'#fff', fontWeight:900, fontSize:13 }}>؟</span>
          </div>
          <p style={{ color: S.text, fontSize:16, fontWeight:700, lineHeight:1.7, flex:1 }}>{q.q}</p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
        {q.opts.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.ans;
          const showResult = selected !== null;
          let bg = S.card, border = S.border, textColor = S.text;
          if (showResult && isCorrect) { bg = '#e8f5ee'; border = '#2e7d52'; textColor = '#1a5a2e'; }
          else if (showResult && isSelected && !isCorrect) { bg = '#fef2f2'; border = '#8b1a1a'; textColor = '#8b1a1a'; }

          return (
            <button key={i} onClick={() => choose(i)}
              style={{ background: dark => bg, border:`2px solid ${border}`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, textAlign:'right', cursor: selected===null?'pointer':'default', width:'100%',
                background: bg, transition:'all .2s'
              }}>
              <div style={{ width:28, height:28, borderRadius:8, background:
                showResult && isCorrect ? '#2e7d52' :
                showResult && isSelected && !isCorrect ? '#8b1a1a' :
                S.border, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color: showResult && (isCorrect || (isSelected&&!isCorrect)) ? '#fff' : S.sub, fontSize:14, fontWeight:700 }}>
                  {showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : ['أ','ب','ج','د'][i]}
                </span>
              </div>
              <p style={{ color: textColor, fontSize:15, fontWeight: isSelected||isCorrect ? 700:500, flex:1, fontFamily:"'Cairo',sans-serif" }}>{opt}</p>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {selected !== null && (
        <div style={{ animation:'fadeUp .2s ease' }}>
          <div style={{ background: selected===q.ans ? '#e8f5ee' : '#fef2f2', borderRadius:14, padding:14, marginBottom:16, border:`1.5px solid ${selected===q.ans?'#2e7d52':'#8b1a1a'}` }}>
            <p style={{ color: selected===q.ans ? '#1a5a2e':'#8b1a1a', fontSize:14, fontWeight:700 }}>
              {selected===q.ans ? '✅ إجابة صحيحة!' : `❌ الإجابة الصحيحة: ${q.opts[q.ans]}`}
            </p>
          </div>
          <button onClick={next}
            style={{ width:'100%', background:ch.color, color:'#fff', border:'none', borderRadius:16, padding:'14px', fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:"'Cairo',sans-serif" }}>
            {step < ch.quiz.length-1 ? 'السؤال التالي ◀' : 'عرض النتيجة 🏆'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('taj-dark') === '1'; } catch { return false; }
  });
  const [activeChapter, setActiveChapter] = useState(null);
  const [progress, setProgress] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('taj-progress') || '{}');
      return { chapters: p, done: Object.keys(p).length, total: CHAPTERS.length };
    } catch { return { chapters:{}, done:0, total: CHAPTERS.length }; }
  });

  const toggleDark = useCallback(() => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem('taj-dark', next?'1':'0'); } catch {}
      return next;
    });
  }, []);

  const handleComplete = useCallback((id) => {
    setProgress(p => {
      const chapters = { ...p.chapters, [id]: true };
      try { localStorage.setItem('taj-progress', JSON.stringify(chapters)); } catch {}
      return { chapters, done: Object.keys(chapters).length, total: CHAPTERS.length };
    });
  }, []);

  if (activeChapter !== null) {
    return (
      <ChapterScreen
        chapterId={activeChapter}
        onBack={() => setActiveChapter(null)}
        dark={dark}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <HomeScreen
      onSelect={setActiveChapter}
      dark={dark}
      toggleDark={toggleDark}
      progress={progress}
    />
  );
}
