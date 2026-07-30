import { useState, useEffect, useCallback, useRef } from 'react';
import { CHAPTERS } from './data';

/* ─── THEME ─────────────────────────────────────── */
const T = {
  light: {
    bg: '#f4f6f9', surface: '#ffffff', card: '#ffffff',
    border: '#e2e8f0', text: '#1a202c', sub: '#64748b',
    muted: '#94a3b8', input: '#f8fafc',
    shadow: '0 2px 12px rgba(0,0,0,.08)',
    shadowLg: '0 8px 32px rgba(0,0,0,.12)',
  },
  dark: {
    bg: '#0d1117', surface: '#161b22', card: '#1f2937',
    border: '#30363d', text: '#e6edf3', sub: '#8b949e',
    muted: '#484f58', input: '#1f2937',
    shadow: '0 2px 12px rgba(0,0,0,.4)',
    shadowLg: '0 8px 32px rgba(0,0,0,.5)',
  }
};

const GOLD = '#b8960c';
const GOLD_LIGHT = '#d4af37';

/* ─── GLOBAL CSS ─────────────────────────────────── */
const G = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600;700;900&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow-x: hidden; }
  body { font-family: 'Cairo', sans-serif; direction: rtl; background: ${dark ? '#0d1117' : '#f4f6f9'}; -webkit-tap-highlight-color: transparent; overscroll-behavior: none; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-thumb { background: ${dark ? '#30363d' : '#cbd5e1'}; border-radius: 2px; }
  button { font-family: 'Cairo', sans-serif; border: none; cursor: pointer; }
  input { font-family: 'Cairo', sans-serif; }

  @keyframes slideUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn   { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleUp   { from { opacity:0; transform:scale(.94) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes expand    { from{max-height:0;opacity:0} to{max-height:800px;opacity:1} }

  .aUp   { animation: slideUp  .36s cubic-bezier(.16,1,.3,1) both; }
  .aIn   { animation: slideIn  .32s cubic-bezier(.16,1,.3,1) both; }
  .aFade { animation: fadeIn   .24s ease both; }
  .aScale{ animation: scaleUp  .28s cubic-bezier(.16,1,.3,1) both; }
  .aExp  { animation: expand   .3s ease both; overflow: hidden; }

  .d1{animation-delay:.05s} .d2{animation-delay:.10s} .d3{animation-delay:.15s}
  .d4{animation-delay:.20s} .d5{animation-delay:.25s} .d6{animation-delay:.30s}
  .d7{animation-delay:.35s} .d8{animation-delay:.40s}

  .press { transition: transform .12s, opacity .12s; }
  .press:active { transform: scale(.96); opacity: .85; }

  .chap-row { transition: background .15s, transform .15s; }
  .chap-row:active { background: ${dark ? '#1f2937' : '#f1f5f9'} !important; transform: translateX(-4px); }

  .tab-btn { transition: all .2s; }
  .opt-btn { transition: background .15s, border-color .15s; }

  /* Jahan calligraphy */
  .jahan-text {
    font-family: 'Amiri', serif;
    background: linear-gradient(135deg, ${GOLD_LIGHT}, #c8a200, ${GOLD_LIGHT});
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
`;

/* ─── HELPERS ────────────────────────────────────── */
const useTheme = (dark) => dark ? T.dark : T.light;

function usePersist(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = useCallback(v => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, set];
}

/* ─── ANDROID BACK BUTTON ────────────────────────── */
function useBackButton(handler) {
  useEffect(() => {
    const h = (e) => { e.preventDefault(); handler(); };
    document.addEventListener('backbutton', h, false);
    return () => document.removeEventListener('backbutton', h, false);
  }, [handler]);
}

/* ─── MODAL ──────────────────────────────────────── */
function Modal({ open, onClose, title, children, S }) {
  useBackButton(useCallback(() => { if (open) onClose(); }, [open, onClose]));
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
      backdropFilter: 'blur(6px)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div onClick={e => e.stopPropagation()} className="aScale" style={{
        background: S.surface, width: '100%', maxWidth: 520,
        borderRadius: '22px 22px 0 0', maxHeight: '80vh', overflow: 'auto',
        boxShadow: '0 -12px 48px rgba(0,0,0,.25)'
      }}>
        <div style={{ width: 40, height: 4, background: S.border, borderRadius: 99, margin: '14px auto 0' }} />
        {title && (
          <div style={{ padding: '14px 20px 10px', borderBottom: `1px solid ${S.border}` }}>
            <p style={{ color: S.text, fontWeight: 800, fontSize: 17 }}>{title}</p>
          </div>
        )}
        <div style={{ padding: '16px 20px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── HOME SCREEN ────────────────────────────────── */
function HomeScreen({ onSelect, dark, toggleDark, progress }) {
  const S = useTheme(dark);
  const [search, setSearch] = useState('');
  const filtered = CHAPTERS.filter(c =>
    c.title.includes(search) || c.subtitle.includes(search)
  );

  return (
    <div style={{ minHeight: '100vh', background: S.bg, direction: 'rtl' }}>
      <style>{G(dark)}</style>

      {/* Header */}
      <div style={{
        background: dark ? '#111820' : '#0f2d1e',
        paddingBottom: 28, position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(184,150,12,.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(184,150,12,.05)', pointerEvents: 'none' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 18px 0' }}>
          <button onClick={toggleDark} className="press" style={{
            background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)',
            borderRadius: 12, padding: '8px 14px', color: '#fff', fontSize: 17
          }}>
            {dark ? '◑' : '◐'}
          </button>
        </div>

        {/* Brand */}
        <div className="aUp" style={{ textAlign: 'center', padding: '12px 24px 0' }}>
          {/* Decorative border */}
          <div style={{ display: 'inline-block', position: 'relative', marginBottom: 6 }}>
            <div style={{ position: 'absolute', top: -8, right: -12, left: -12, bottom: -8,
              border: `1px solid ${GOLD}40`, borderRadius: 16, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -12, right: -16, left: -16, bottom: -12,
              border: `1px solid ${GOLD}20`, borderRadius: 20, pointerEvents: 'none' }} />
            <h1 className="jahan-text" style={{ fontSize: 52, fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>
              جهان
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, letterSpacing: '.06em', marginBottom: 4, marginTop: 10 }}>
            ╌╌ أحكام التجويد ╌╌
          </p>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>
            برواية ورش عن نافع من طريق الأزرق
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            {[
              { v: CHAPTERS.length, l: 'فصل' },
              { v: CHAPTERS.reduce((a,c)=>a+c.quiz.length,0), l: 'سؤال' },
              { v: progress.done, l: 'مكتمل' }
            ].map(s => (
              <div key={s.l} style={{
                background: 'rgba(255,255,255,.07)', border: `1px solid ${GOLD}30`,
                borderRadius: 12, padding: '8px 16px', textAlign: 'center', minWidth: 70
              }}>
                <p style={{ color: GOLD_LIGHT, fontSize: 20, fontWeight: 900 }}>{s.v}</p>
                <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 11 }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Progress */}
          {progress.done > 0 && (
            <div className="aUp d2" style={{ margin: '14px 0 0', background: 'rgba(255,255,255,.06)', borderRadius: 10, height: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress.done / CHAPTERS.length * 100}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: 10, transition: 'width .8s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 16px 6px', position: 'sticky', top: 0, zIndex: 10, background: S.bg }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: S.muted, fontSize: 15, pointerEvents: 'none' }}>
            ⌕
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في الفصول…"
            style={{
              width: '100%', background: S.input, border: `1.5px solid ${S.border}`,
              borderRadius: 14, padding: '11px 42px 11px 16px', fontSize: 15,
              color: S.text, outline: 'none', transition: 'border-color .2s'
            }}
            onFocus={e => e.target.style.borderColor = GOLD}
            onBlur={e => e.target.style.borderColor = S.border}
          />
        </div>
      </div>

      {/* Chapter list */}
      <div style={{ padding: '4px 16px 80px' }}>
        {filtered.map((ch, i) => {
          const done = !!progress.chapters?.[ch.id];
          return (
            <button key={ch.id} className={`chap-row aUp d${Math.min(i+1,8)}`}
              onClick={() => onSelect(ch.id)}
              style={{
                width: '100%', background: S.surface, border: `1px solid ${S.border}`,
                borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center',
                gap: 14, marginBottom: 10, boxShadow: S.shadow, textAlign: 'right'
              }}>
              {/* Number */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: `${ch.color}18`, border: `1.5px solid ${ch.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ color: ch.color, fontWeight: 900, fontSize: 15, fontFamily: "'Cairo',sans-serif" }}>
                  {ch.id + 1}
                </span>
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 2 }}>{ch.title}</p>
                <p style={{ fontSize: 12, color: S.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.subtitle}</p>
              </div>
              {/* Status */}
              {done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />}
              <span style={{ color: S.muted, fontSize: 14, flexShrink: 0 }}>‹</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="aFade" style={{ textAlign: 'center', padding: '56px 24px' }}>
            <p style={{ color: S.muted, fontSize: 32, marginBottom: 10 }}>⌕</p>
            <p style={{ color: S.sub, fontSize: 15 }}>لا توجد نتائج للبحث</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CHAPTER SCREEN ─────────────────────────────── */
function ChapterScreen({ chapterId, onBack, dark, onComplete }) {
  const S = useTheme(dark);
  const ch = CHAPTERS[chapterId];
  const [tab, setTab] = useState('content');
  const [quiz, setQuiz] = useState({ step: 0, chosen: null, answers: [], done: false });
  const scrollRef = useRef(null);

  useBackButton(useCallback(() => { onBack(); }, [onBack]));

  const changeTab = (t) => {
    setTab(t);
    if (t === 'quiz') setQuiz({ step: 0, chosen: null, answers: [], done: false });
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TABS = [
    { id: 'content', label: 'المحتوى' },
    { id: 'summary', label: 'الملخص' },
    { id: 'quiz',    label: 'الاختبار' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: S.bg, direction: 'rtl' }}>
      <style>{G(dark)}</style>

      {/* Sticky header */}
      <div style={{ background: ch.color, flexShrink: 0 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 10px' }}>
          <button onClick={onBack} className="press" style={{
            background: 'rgba(255,255,255,.18)', border: 'none', borderRadius: 12,
            padding: '8px 14px', color: '#fff', fontSize: 18, flexShrink: 0
          }}>›</button>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, marginBottom: 1 }}>
              الفصل {ch.id + 1} من {CHAPTERS.length}
            </p>
            <h2 style={{ color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.2 }}>{ch.title}</h2>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display: 'flex', margin: '0 14px 12px', background: 'rgba(0,0,0,.2)', borderRadius: 14, padding: 3, gap: 3 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => changeTab(t.id)} className="tab-btn"
              style={{
                flex: 1, padding: '9px 6px', borderRadius: 11, border: 'none', fontSize: 13, fontWeight: 700,
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? ch.color : 'rgba(255,255,255,.75)',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 40px' }}>
        {tab === 'content' && <ContentTab ch={ch} S={S} dark={dark} />}
        {tab === 'summary' && <SummaryTab ch={ch} S={S} />}
        {tab === 'quiz'    && <QuizTab ch={ch} S={S} state={quiz} setState={setQuiz} onComplete={onComplete} dark={dark} />}
      </div>
    </div>
  );
}

/* ─── CONTENT TAB ────────────────────────────────── */
function ContentTab({ ch, S, dark }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {ch.sections.map((sec, i) => (
        <SectionBlock key={i} sec={sec} idx={i} ch={ch} S={S} dark={dark} />
      ))}
    </div>
  );
}

function SectionBlock({ sec, idx, ch, S, dark }) {
  const delay = `${idx * 0.07}s`;

  const Wrap = ({ children, noPad }) => (
    <div className={`aUp`} style={{ background: S.surface, borderRadius: 18, border: `1px solid ${S.border}`, overflow: 'hidden', animationDelay: delay }}>
      {children}
    </div>
  );

  const SecHead = ({ title }) => (
    <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${S.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 3, height: 18, background: ch.color, borderRadius: 2 }} />
      <p style={{ color: ch.color, fontWeight: 800, fontSize: 15 }}>{title}</p>
    </div>
  );

  switch (sec.type) {

    case 'definition':
    case 'intro':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '12px 16px' }}>
            <p style={{ color: S.sub, fontSize: 14, lineHeight: 1.9, marginBottom: sec.branches ? 12 : 0 }}>{sec.body}</p>
            {sec.branches && <ExpandList items={sec.branches} S={S} dark={dark} ch={ch} />}
          </div>
        </Wrap>
      );

    case 'tree':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px' }}>
            <ExpandList items={sec.nodes} S={S} dark={dark} ch={ch} labelKey="label" bodyKey="body" />
          </div>
        </Wrap>
      );

    case 'ruling':
      return (
        <div className="aUp" style={{ background: dark ? '#0d1f13' : ch.light, border: `1.5px solid ${ch.color}30`, borderRadius: 18, padding: '14px 16px', animationDelay: delay }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 18, background: ch.color, borderRadius: 2 }} />
            <p style={{ color: ch.color, fontWeight: 800, fontSize: 15 }}>{sec.title}</p>
          </div>
          <p style={{ color: S.text, fontSize: 14, lineHeight: 1.9, marginBottom: sec.parts ? 12 : 0 }}>{sec.body}</p>
          {sec.parts && sec.parts.map((p, j) => (
            <div key={j} style={{ background: S.surface, borderRadius: 12, padding: '10px 14px', marginTop: 8, borderRight: `3px solid ${ch.color}` }}>
              <p style={{ color: ch.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.label}</p>
              <p style={{ color: S.text, fontSize: 13, lineHeight: 1.75 }}>{p.body}</p>
            </div>
          ))}
        </div>
      );

    case 'evidence':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sec.items.map((it, j) => (
              <EvidenceCard key={j} item={it} S={S} dark={dark} ch={ch} />
            ))}
          </div>
        </Wrap>
      );

    case 'note':
      return (
        <div className="aUp" style={{ background: dark ? '#1a1500' : '#fffbeb', border: `1px solid ${GOLD}40`, borderRadius: 16, padding: '12px 14px', animationDelay: delay }}>
          <p style={{ color: GOLD, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>ملاحظة</p>
          <p style={{ color: S.text, fontSize: 14, lineHeight: 1.85 }}>{sec.body}</p>
        </div>
      );

    case 'split':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px' }}>
            <SplitPanel left={sec.left} right={sec.right} S={S} dark={dark} />
          </div>
        </Wrap>
      );

    case 'ranked':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sec.items.map((it, j) => (
              <RankedItem key={j} item={it} S={S} dark={dark} ch={ch} />
            ))}
          </div>
        </Wrap>
      );

    case 'four_rules':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sec.rules.map((r, j) => (
              <RuleCard key={j} rule={r} S={S} dark={dark} />
            ))}
          </div>
        </Wrap>
      );

    case 'three_rules':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sec.rules.map((r, j) => (
              <RuleCard key={j} rule={r} S={S} dark={dark} compact />
            ))}
          </div>
        </Wrap>
      );

    case 'four_types':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sec.items.map((it, j) => (
              <div key={j} style={{ background: dark ? '#1f2937' : it.color + '0d', borderRadius: 14, borderRight: `3px solid ${it.color}`, padding: '12px 14px' }}>
                <p style={{ color: it.color, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{it.name}</p>
                <p style={{ color: S.text, fontSize: 13, lineHeight: 1.8 }}>{it.body}</p>
              </div>
            ))}
          </div>
        </Wrap>
      );

    case 'pairs_list':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sec.pairs.map((pair, j) => (
              <PairRow key={j} pair={pair} S={S} dark={dark} />
            ))}
          </div>
        </Wrap>
      );

    case 'list_expand':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sec.items.map((it, j) => (
              <ExpandItem key={j} label={it.label} body={it.body} S={S} dark={dark} ch={ch} />
            ))}
          </div>
        </Wrap>
      );

    case 'madood_table':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sec.groups.map((g, j) => (
              <MadoodGroup key={j} group={g} S={S} dark={dark} />
            ))}
          </div>
        </Wrap>
      );

    case 'table_alt':
      return (
        <Wrap>
          <SecHead title={sec.title} />
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sec.rows.map((row, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: dark ? '#1f2937' : ch.light, borderRadius: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: ch.color, fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{row.label}</p>
                  <p style={{ color: S.sub, fontSize: 12 }}>{row.desc}</p>
                </div>
                <div style={{ background: ch.color, borderRadius: 10, padding: '6px 12px', flexShrink: 0 }}>
                  <p style={{ color: '#fff', fontFamily: "'Amiri',serif", fontSize: 16, fontWeight: 700 }}>{row.letters}</p>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      );

    default: return null;
  }
}

/* ─── SUB-COMPONENTS ─────────────────────────────── */
function ExpandList({ items, S, dark, ch, labelKey = 'label', bodyKey = 'body' }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ border: `1px solid ${S.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: open === i ? (dark ? '#1f2937' : ch.light) : 'transparent', transition: 'background .15s' }}>
            <p style={{ color: open === i ? ch.color : S.text, fontWeight: 700, fontSize: 14, flex: 1, textAlign: 'right' }}>{it[labelKey]}</p>
            <span style={{ color: S.muted, fontSize: 12, flexShrink: 0, transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>◂</span>
          </button>
          {open === i && (
            <div className="aExp" style={{ padding: '0 14px 12px', borderTop: `1px solid ${S.border}` }}>
              <p style={{ color: S.text, fontSize: 13, lineHeight: 1.85, paddingTop: 10, whiteSpace: 'pre-line' }}>{it[bodyKey]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ExpandItem({ label, body, S, dark, ch }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: open ? (dark ? '#1f2937' : ch.light) : 'transparent' }}>
        <p style={{ color: open ? ch.color : S.text, fontWeight: 700, fontSize: 14, flex: 1, textAlign: 'right' }}>{label}</p>
        <span style={{ color: S.muted, fontSize: 12, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>◂</span>
      </button>
      {open && (
        <div className="aExp" style={{ padding: '0 14px 12px', borderTop: `1px solid ${S.border}` }}>
          <p style={{ color: S.text, fontSize: 13, lineHeight: 1.85, paddingTop: 10 }}>{body}</p>
        </div>
      )}
    </div>
  );
}

function EvidenceCard({ item, S, dark, ch }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${S.border}`, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>{item.label.slice(0,1)}</span>
        </div>
        <p style={{ color: S.text, fontWeight: 700, fontSize: 14, flex: 1, textAlign: 'right' }}>{item.label}</p>
        <span style={{ color: S.muted, fontSize: 12, flexShrink: 0 }}>◂</span>
      </button>
      {open && (
        <div className="aExp" style={{ padding: '0 14px 12px', borderTop: `1px solid ${S.border}` }}>
          <p style={{ color: S.text, fontSize: 13, lineHeight: 1.9, paddingTop: 10 }}>{item.body}</p>
        </div>
      )}
    </div>
  );
}

function SplitPanel({ left, right, S, dark }) {
  const [active, setActive] = useState('left');
  const side = active === 'left' ? left : right;
  return (
    <div>
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[['left', left.label], ['right', right.label]].map(([k, l]) => (
          <button key={k} onClick={() => setActive(k)}
            style={{
              flex: 1, padding: '9px 10px', borderRadius: 12, border: `1.5px solid ${active === k ? side.color : S.border}`,
              background: active === k ? side.color + '15' : 'transparent',
              color: active === k ? side.color : S.sub, fontWeight: 700, fontSize: 13, transition: 'all .2s'
            }}>
            {l}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="aFade" key={active} style={{ background: dark ? '#1f2937' : side.color + '08', borderRadius: 14, padding: '12px 14px', borderRight: `3px solid ${side.color}` }}>
        <p style={{ color: S.text, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>{side.body}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {side.items?.map((it, j) => (
            <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: side.color, flexShrink: 0, marginTop: 3, fontSize: 12 }}>◆</span>
              <p style={{ color: S.text, fontSize: 13, lineHeight: 1.75 }}>{it}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RankedItem({ item, S, dark, ch }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 14, border: `1px solid ${S.border}`, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, background: open ? (dark ? '#1f2937' : ch.light) : 'transparent' }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>{item.num}</span>
        </div>
        <p style={{ color: S.text, fontWeight: 700, fontSize: 15, flex: 1, textAlign: 'right' }}>{item.label}</p>
        <span style={{ color: S.muted, fontSize: 12, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>◂</span>
      </button>
      {open && (
        <div className="aExp" style={{ padding: '0 14px 14px', borderTop: `1px solid ${S.border}` }}>
          <p style={{ color: S.text, fontSize: 13, lineHeight: 1.9, paddingTop: 10, whiteSpace: 'pre-line' }}>{item.body}</p>
        </div>
      )}
    </div>
  );
}

function RuleCard({ rule, S, dark, compact }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 14, border: `1.5px solid ${rule.color}25`, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12, background: open ? rule.color + '12' : 'transparent' }}>
        <div style={{ width: compact ? 30 : 34, height: compact ? 30 : 34, borderRadius: 10, background: rule.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: compact ? 13 : 15 }}>{rule.num}</span>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <p style={{ color: S.text, fontWeight: 800, fontSize: 15 }}>{rule.name}</p>
          {rule.letter && <p style={{ color: rule.color, fontSize: 13, marginTop: 1, fontFamily: "'Amiri',serif", fontWeight: 700 }}>{rule.letter}</p>}
          {rule.letters && !compact && <p style={{ color: rule.color, fontSize: 13, marginTop: 1 }}>الحروف: {rule.letters}</p>}
        </div>
        <span style={{ color: S.muted, fontSize: 12, flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>◂</span>
      </button>
      {open && (
        <div className="aExp" style={{ padding: '0 14px 14px', borderTop: `1px solid ${S.border}` }}>
          {rule.cond && <p style={{ color: S.sub, fontSize: 12, paddingTop: 10, marginBottom: 8, lineHeight: 1.6 }}>{rule.cond}</p>}
          {/* Letters */}
          {(rule.letters || rule.letter) && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {(rule.letters || rule.letter).split(/\s+/).filter(Boolean).map((l, j) => (
                <span key={j} style={{ background: rule.color, color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 15, fontWeight: 700, fontFamily: "'Amiri',serif" }}>{l}</span>
              ))}
            </div>
          )}
          <p style={{ color: S.text, fontSize: 13, lineHeight: 1.85, marginBottom: rule.ex || rule.sub ? 10 : 0 }}>{rule.def}</p>
          {rule.ex && (
            <div style={{ background: dark ? '#111' : '#f8f9fa', borderRadius: 10, padding: 10, marginBottom: rule.sub ? 10 : 0 }}>
              <p style={{ color: S.sub, fontSize: 11, marginBottom: 5, fontWeight: 700 }}>أمثلة:</p>
              {rule.ex.map((e, k) => (
                <p key={k} style={{ color: S.text, fontSize: 14, fontFamily: "'Amiri',serif", marginBottom: 3 }}>• {e}</p>
              ))}
            </div>
          )}
          {rule.sub && rule.sub.map((s, k) => (
            <div key={k} style={{ background: dark ? '#111820' : '#fff', borderRadius: 12, padding: '10px 12px', marginBottom: 8, border: `1px solid ${S.border}` }}>
              <p style={{ color: rule.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>الإدغام {s.name}: <span style={{ fontFamily: "'Amiri',serif", fontWeight: 700 }}>{s.letters}</span></p>
              <p style={{ color: S.text, fontSize: 13, fontFamily: "'Amiri',serif" }}>• {s.ex}</p>
            </div>
          ))}
          {rule.note && (
            <div style={{ background: dark ? '#1a1500' : '#fffbeb', borderRadius: 10, padding: '8px 12px', border: `1px solid ${GOLD}30`, marginTop: 6 }}>
              <p style={{ color: GOLD, fontSize: 12 }}>فائدة: {rule.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PairRow({ pair, S, dark }) {
  const [open, setOpen] = useState(null);
  const sides = [pair.a, pair.b].filter(s => s.name !== '—');
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: sides.length === 2 ? '1fr 1fr' : '1fr', gap: 8 }}>
        {sides.map((side, j) => (
          <button key={j} onClick={() => setOpen(open === j ? null : j)}
            style={{ borderRadius: 12, border: `1.5px solid ${open === j ? side.color : S.border}`, padding: '10px 12px', textAlign: 'center', background: open === j ? side.color + '12' : (dark ? '#1f2937' : '#f8f9fa'), transition: 'all .2s' }}>
            <p style={{ color: open === j ? side.color : S.text, fontWeight: 800, fontSize: 13, marginBottom: 3 }}>{side.name}</p>
            <p style={{ color: S.sub, fontSize: 11 }}>{side.letters}</p>
          </button>
        ))}
      </div>
      {open !== null && sides[open] && (
        <div className="aFade" style={{ marginTop: 8, background: dark ? '#1f2937' : sides[open].color + '08', borderRadius: 12, padding: '10px 14px', borderRight: `3px solid ${sides[open].color}` }}>
          <p style={{ color: S.text, fontSize: 13, lineHeight: 1.8 }}>{sides[open].body}</p>
        </div>
      )}
    </div>
  );
}

function MadoodGroup({ group, S, dark }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ border: `1.5px solid ${group.color}30`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ background: group.color + '18', padding: '9px 14px', borderBottom: `1px solid ${group.color}20` }}>
        <p style={{ color: group.color, fontWeight: 800, fontSize: 13 }}>{group.title}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {group.items.map((it, j) => (
          <div key={j} style={{ borderBottom: j < group.items.length - 1 ? `1px solid ${S.border}` : 'none' }}>
            <button onClick={() => setOpen(open === j ? null : j)}
              style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: 'transparent' }}>
              <p style={{ color: S.text, fontWeight: 700, fontSize: 13, flex: 1, textAlign: 'right' }}>{it.name}</p>
              <span style={{ color: S.muted, fontSize: 11 }}>◂</span>
            </button>
            {open === j && (
              <div className="aExp" style={{ padding: '0 14px 12px' }}>
                <p style={{ color: S.sub, fontSize: 13, lineHeight: 1.75, marginBottom: 6 }}>{it.def}</p>
                <p style={{ color: GOLD, fontSize: 13, fontFamily: "'Amiri',serif" }}>• {it.ex}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SUMMARY TAB ────────────────────────────────── */
function SummaryTab({ ch, S }) {
  return (
    <div className="aUp">
      {/* Header card */}
      <div style={{ background: ch.color, borderRadius: 18, padding: '18px 16px', marginBottom: 14 }}>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, marginBottom: 4 }}>ملخص الفصل</p>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{ch.title}</h3>
        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, marginTop: 4 }}>{ch.summary.length} نقاط رئيسية</p>
      </div>
      {/* Points */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ch.summary.map((point, i) => (
          <div key={i} className={`aUp d${Math.min(i+1,8)}`} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 14, padding: '13px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{i + 1}</span>
            </div>
            <p style={{ color: S.text, fontSize: 14, lineHeight: 1.85, flex: 1 }}>{point}</p>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{ marginTop: 20, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 16, padding: '14px 16px', textAlign: 'center' }}>
        <p style={{ color: S.sub, fontSize: 13 }}>هل أنت جاهز للاختبار؟</p>
        <p style={{ color: ch.color, fontWeight: 700, fontSize: 14, marginTop: 4 }}>اضغط على تبويب «الاختبار»</p>
      </div>
    </div>
  );
}

/* ─── QUIZ TAB ───────────────────────────────────── */
function QuizTab({ ch, S, state, setState, onComplete, dark }) {
  const { step, chosen, answers, done } = state;
  const q = ch.quiz[step];
  const total = ch.quiz.length;

  const choose = (i) => {
    if (chosen !== null) return;
    const correct = i === q.ans;
    setState(s => ({
      ...s,
      chosen: i,
      answers: [...s.answers, { chosen: i, correct, ans: q.ans }]
    }));
  };

  const next = () => {
    if (step >= total - 1) {
      const score = [...state.answers, { correct: state.chosen === q.ans }].filter(a => a.correct).length;
      setState(s => ({ ...s, done: true, finalScore: score }));
      onComplete(ch.id);
    } else {
      setState(s => ({ ...s, step: s.step + 1, chosen: null }));
    }
  };

  if (done) {
    const score = state.finalScore ?? answers.filter(a => a.correct).length;
    const pct = Math.round(score / total * 100);
    const grade = pct >= 80 ? { label: 'امتياز', color: '#16a34a' }
                : pct >= 60 ? { label: 'جيد', color: GOLD }
                :             { label: 'بحاجة للمراجعة', color: '#dc2626' };
    return (
      <div className="aScale" style={{ textAlign: 'center', padding: '20px 0' }}>
        {/* Score ring */}
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
          <svg viewBox="0 0 140 140" width="140" height="140">
            <circle cx="70" cy="70" r="60" fill="none" stroke={S.border} strokeWidth="8" />
            <circle cx="70" cy="70" r="60" fill="none" stroke={grade.color} strokeWidth="8"
              strokeDasharray={`${pct * 3.77} 377`} strokeDashoffset="94" strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease', transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: grade.color, fontSize: 32, fontWeight: 900 }}>{pct}%</p>
            <p style={{ color: S.sub, fontSize: 12 }}>{score}/{total}</p>
          </div>
        </div>
        <p style={{ color: grade.color, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{grade.label}</p>
        <p style={{ color: S.sub, fontSize: 14, marginBottom: 28 }}>أجبت صحيحًا على {score} من {total} أسئلة</p>
        <button onClick={() => setState({ step: 0, chosen: null, answers: [], done: false })}
          style={{ background: ch.color, color: '#fff', border: 'none', borderRadius: 16, padding: '13px 32px', fontSize: 15, fontWeight: 700 }}
          className="press">
          أعد الاختبار
        </button>
      </div>
    );
  }

  return (
    <div key={step} className="aIn">
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, background: S.border, borderRadius: 99, height: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${step / total * 100}%`, background: ch.color, borderRadius: 99, transition: 'width .4s' }} />
        </div>
        <span style={{ color: S.sub, fontSize: 12, flexShrink: 0 }}>{step + 1} / {total}</span>
      </div>

      {/* Question */}
      <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 18, padding: '16px 16px', marginBottom: 14 }}>
        <p style={{ color: S.sub, fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          سؤال {step + 1}
        </p>
        <p style={{ color: S.text, fontSize: 16, fontWeight: 700, lineHeight: 1.75 }}>{q.q}</p>
      </div>

      {/* Options — no color until answered */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
        {q.opts.map((opt, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === q.ans;
          const revealed = chosen !== null;

          let bg = S.surface, border = S.border, color = S.text;
          if (revealed && isChosen && isCorrect)  { bg = dark ? '#0d2a15' : '#f0fff4'; border = '#16a34a'; color = '#15803d'; }
          if (revealed && isChosen && !isCorrect) { bg = dark ? '#2a0d0d' : '#fef2f2'; border = '#dc2626'; color = '#b91c1c'; }

          return (
            <button key={i} onClick={() => choose(i)} className="opt-btn"
              style={{ padding: '13px 14px', borderRadius: 14, border: `1.5px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'right', cursor: chosen === null ? 'pointer' : 'default' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: revealed && (isChosen) ? (isCorrect ? '#16a34a' : '#dc2626') : 'transparent' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: revealed && isChosen ? '#fff' : S.muted }}>
                  {revealed && isChosen ? (isCorrect ? '✓' : '✗') : ['أ', 'ب', 'ج', 'د'][i]}
                </span>
              </div>
              <p style={{ color, fontSize: 14, flex: 1, fontWeight: isChosen ? 700 : 400 }}>{opt}</p>
            </button>
          );
        })}
      </div>

      {/* Next button — appears after answering */}
      {chosen !== null && (
        <div className="aUp">
          {chosen !== q.ans && (
            <div style={{ background: dark ? '#0d2a15' : '#f0fff4', border: '1px solid #16a34a30', borderRadius: 12, padding: '10px 14px', marginBottom: 12 }}>
              <p style={{ color: '#16a34a', fontSize: 13, fontWeight: 600 }}>
                الإجابة الصحيحة: {q.opts[q.ans]}
              </p>
            </div>
          )}
          <button onClick={next} className="press"
            style={{ width: '100%', background: ch.color, color: '#fff', border: 'none', borderRadius: 16, padding: '14px', fontSize: 15, fontWeight: 700 }}>
            {step < total - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── APP ROOT ───────────────────────────────────── */
export default function App() {
  const [dark, setDark] = usePersist('taj:dark', false);
  const [screen, setScreen] = useState('home');
  const [chId, setChId] = useState(null);
  const [progress, setProgress] = usePersist('taj:prog', { chapters: {}, done: 0 });

  const toggleDark = useCallback(() => setDark(d => !d), [setDark]);

  const openChapter = useCallback((id) => {
    setChId(id);
    setScreen('chapter');
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setChId(null);
  }, []);

  const markDone = useCallback((id) => {
    setProgress(p => {
      const chapters = { ...p.chapters, [id]: true };
      return { chapters, done: Object.keys(chapters).length };
    });
  }, [setProgress]);

  // Back button on home — do nothing (let system handle app exit)
  useBackButton(useCallback(() => {
    if (screen === 'home') return;
    goHome();
  }, [screen, goHome]));

  if (screen === 'chapter' && chId !== null) {
    return (
      <ChapterScreen
        chapterId={chId}
        onBack={goHome}
        dark={dark}
        onComplete={markDone}
      />
    );
  }

  return (
    <HomeScreen
      onSelect={openChapter}
      dark={dark}
      toggleDark={toggleDark}
      progress={progress}
    />
  );
}
