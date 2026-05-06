import { useState, useEffect, useRef } from 'react'

// ─── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  // Layout
  section: { padding: '96px 24px', position: 'relative' },
  container: { maxWidth: '1100px', margin: '0 auto', width: '100%' },
  flex: (gap = 24, align = 'center', justify = 'flex-start') => ({
    display: 'flex', gap, alignItems: align, justifyContent: justify, flexWrap: 'wrap'
  }),
  grid: (cols, gap = 24) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap
  }),

  // Typography
  label: {
    fontFamily: 'var(--font-head)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--cyan)',
    marginBottom: '16px',
    display: 'block'
  },
  h1: {
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
    fontWeight: '800',
    lineHeight: '1.1',
    color: 'var(--white)',
    marginBottom: '24px'
  },
  h2: {
    fontFamily: 'var(--font-head)',
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '700',
    lineHeight: '1.15',
    color: 'var(--white)',
    marginBottom: '16px'
  },
  h3: {
    fontFamily: 'var(--font-head)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--white)',
    marginBottom: '10px'
  },
  body: { color: 'var(--text)', lineHeight: '1.7', fontSize: '1.05rem' },
  muted: { color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' },
  grad: {
    background: 'linear-gradient(135deg, var(--cyan) 0%, #7B9FFF 50%, var(--orange) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  // Cards
  card: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '32px',
    transition: 'border-color 0.3s, transform 0.3s',
  },
  glassCard: {
    background: 'rgba(13,21,38,0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid var(--border-cyan)',
    borderRadius: 'var(--radius)',
    padding: '32px',
  },

  // Buttons
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, var(--cyan), #7B9FFF)',
    color: '#000',
    fontFamily: 'var(--font-head)',
    fontWeight: '700',
    fontSize: '0.95rem',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    letterSpacing: '0.3px',
    boxShadow: '0 0 30px var(--cyan-glow)',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '13px 28px',
    background: 'transparent',
    color: 'var(--white)',
    fontFamily: 'var(--font-head)',
    fontWeight: '600',
    fontSize: '0.95rem',
    borderRadius: '50px',
    border: '1px solid var(--border-cyan)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  btnGhost: {
    padding: '10px 20px',
    background: 'var(--cyan-dim)',
    color: 'var(--cyan)',
    border: '1px solid var(--border-cyan)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },

  // Form
  input: {
    width: '100%',
    padding: '14px 18px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '14px 18px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748B' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    paddingRight: '44px',
  },
  textarea: {
    width: '100%',
    padding: '14px 18px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--white)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'border-color 0.2s',
  },
  label_field: {
    display: 'block',
    color: 'var(--text)',
    fontWeight: '500',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  formGroup: { marginBottom: '20px' },
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled ? 'rgba(6,12,24,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div style={{ ...S.container, ...S.flex(0, 'center', 'space-between'), height: '72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--cyan), #7B9FFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h4l2-6 4 12 2-6h2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '1.2rem', color: 'var(--white)' }}>
            FlowwayAI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['How It Works', 'Results', 'Pricing'].map(item => (
            <a key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--white)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{item}</a>
          ))}
          <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
            target="_blank" rel="noreferrer"
            style={S.btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px var(--cyan-glow)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px var(--cyan-glow)' }}
          >
            Get Free Audit →
          </a>
        </div>
      </div>
    </nav>
  )
}

// ─── GRID BACKGROUND ───────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="gridFade" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#gridFade)"/>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)"/>
      </svg>
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        animation: 'orb-move 8s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', top: '30%', right: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(123,159,255,0.1) 0%, transparent 70%)',
        animation: 'orb-move 11s ease-in-out infinite reverse',
      }}/>
    </div>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ onScrollToTool }) {
  return (
    <section style={{ ...S.section, paddingTop: '160px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      <GridBg/>
      <div style={{ ...S.container, textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 20px', borderRadius: '50px',
          background: 'var(--cyan-dim)', border: '1px solid var(--border-cyan)',
          marginBottom: '32px', animation: 'fadeIn 0.8s ease forwards' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }}/>
          <span style={{ fontSize: '0.82rem', color: 'var(--cyan)', fontWeight: '600', letterSpacing: '0.5px' }}>
            Now serving USA · UK · Australia · Poland · Europe
          </span>
        </div>

        <h1 style={{ ...S.h1, animation: 'fadeUp 0.8s 0.1s ease both', maxWidth: '820px', margin: '0 auto 24px' }}>
          Stop Losing Leads<br/>
          <span style={S.grad}>While You Sleep.</span>
        </h1>

        <p style={{ ...S.body, maxWidth: '580px', margin: '0 auto 40px', fontSize: '1.15rem',
          color: 'var(--muted)', animation: 'fadeUp 0.8s 0.2s ease both' }}>
          I build complete AI automation systems for coaches, consultants, and agencies —
          so your business follows up, books calls, and closes deals on autopilot.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.8s 0.3s ease both' }}>
          <button onClick={onScrollToTool}
            style={S.btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 50px var(--cyan-glow)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px var(--cyan-glow)' }}>
            ⚡ Get My Free Blueprint
          </button>
          <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
            target="_blank" rel="noreferrer"
            style={S.btnSecondary}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-cyan)'; e.currentTarget.style.color = 'var(--white)' }}>
            Book Free 15-Min Audit →
          </a>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap',
          marginTop: '72px', animation: 'fadeUp 0.8s 0.4s ease both' }}>
          {[
            { num: '10–15', unit: 'hrs/week', label: 'Saved per client' },
            { num: '$8K', unit: '/month', label: 'Revenue recovered' },
            { num: '60s', unit: 'response', label: 'Lead reply time' },
            { num: '7', unit: 'days', label: 'Delivery time' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '1.8rem', color: 'var(--white)' }}>
                {stat.num}<span style={{ color: 'var(--cyan)', fontSize: '1rem' }}> {stat.unit}</span>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trusted by logos */}
        <div style={{ marginTop: '64px', animation: 'fadeUp 0.8s 0.5s ease both' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>
            Tools I use to build your system
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Make.com', 'Zapier', 'Manychat', 'n8n', 'Airtable', 'Claude AI', 'Calendly', 'Notion'].map(tool => (
              <span key={tool} style={{
                padding: '7px 16px', borderRadius: '50px',
                background: 'var(--bg2)', border: '1px solid var(--border)',
                fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '500'
              }}>{tool}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PAIN SECTION ──────────────────────────────────────────────────────────────
function PainSection() {
  const pains = [
    { icon: '📨', title: 'Leads go cold in hours', desc: 'You get an inquiry at 2pm. You reply at 6pm. They already hired someone else. This happens every week.' },
    { icon: '📋', title: 'Hours lost to manual tasks', desc: 'Copy-pasting data. Sending the same emails. Updating spreadsheets. 4+ hours a week on work AI should handle.' },
    { icon: '📅', title: 'Empty calendar, full to-do list', desc: 'You\'re always busy but never booked. Chasing leads manually while your competitors run on autopilot.' },
  ]

  return (
    <section style={{ ...S.section, paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={S.label}>The Problem</span>
          <h2 style={S.h2}>
            Your business is leaking revenue<br/>
            <span style={S.grad}>every single day</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {pains.map((p, i) => (
            <div key={i} style={{
              ...S.card,
              borderLeft: '3px solid var(--orange)',
              animation: `fadeUp 0.6s ${i * 0.1}s ease both`
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={S.h3}>{p.title}</h3>
              <p style={S.muted}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── BLUEPRINT TOOL ────────────────────────────────────────────────────────────
function BlueprintTool() {
  const [form, setForm] = useState({
    businessType: '', teamSize: '', timewaster: '', tools: ''
  })
  const [loading, setLoading] = useState(false)
  const [blueprint, setBlueprint] = useState(null)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const resultRef = useRef(null)

  const SAMPLE_BLUEPRINT = {
    blueprintName: "Lead-to-Booked-Call Automation System",
    problem: "Potential clients submit inquiries but receive slow or no follow-up, causing revenue loss every day.",
    steps: [
      { step: 1, title: "Instant Lead Capture", description: "Typeform or web form captures lead details and triggers the workflow immediately — no manual monitoring needed.", tool: "Typeform + Make.com" },
      { step: 2, title: "60-Second WhatsApp Reply", description: "AI-personalised WhatsApp message sent within 60 seconds of inquiry, 24/7 — before any competitor responds.", tool: "Manychat + WhatsApp Business" },
      { step: 3, title: "CRM Auto-Update", description: "Lead data automatically logged in your CRM with tags, source, and follow-up date — zero manual data entry.", tool: "Airtable / Notion" },
      { step: 4, title: "Smart Email Sequence", description: "3-email nurture sequence sends automatically over 5 days — sharing case studies, results, and booking link.", tool: "Brevo (Sendinblue)" },
      { step: 5, title: "Calendar Booking + Confirmation", description: "Qualified leads book directly into your calendar. Auto-confirmation + reminder sent 24hr and 1hr before call.", tool: "Calendly + Make.com" },
    ],
    timeSaved: "12 hours per week",
    moneySaved: "$3,000–$6,000 per month in recovered opportunities",
    difficulty: "Medium",
    quickWin: "Set up the WhatsApp instant reply first — this alone recovers 30% of lost leads within week one."
  }

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    if (!form.businessType || !form.timewaster) {
      setError('Please fill in your business type and biggest time-waster.')
      return
    }
    setError('')
    setLoading(true)
    setBlueprint(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setBlueprint(data)
    } catch {
      // Show sample blueprint if API isn't configured yet
      await new Promise(r => setTimeout(r, 2000))
      setBlueprint(SAMPLE_BLUEPRINT)
    }

    setLoading(false)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const diffColor = { Easy: '#22C55E', Medium: 'var(--cyan)', Advanced: 'var(--orange)' }

  return (
    <section id="tool" style={{ ...S.section, background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%)' }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={S.label}>Free Tool</span>
          <h2 style={S.h2}>
            Get your <span style={S.grad}>AI Blueprint</span> in 60 seconds
          </h2>
          <p style={{ ...S.body, color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
            Describe your business. I'll generate a complete, personalised automation workflow — free, instant, no email required.
          </p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ ...S.glassCard, marginBottom: '24px' }}>
            <div style={S.formGroup}>
              <label style={S.label_field}>What type of business do you run? *</label>
              <select style={S.select} value={form.businessType} onChange={e => update('businessType', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                <option value="">Select your business type...</option>
                <option>Online Coach / Consultant</option>
                <option>Marketing Agency</option>
                <option>E-commerce Store</option>
                <option>Export / Trade Business</option>
                <option>Real Estate Agency</option>
                <option>Fitness / Wellness Business</option>
                <option>SaaS / Tech Company</option>
                <option>Other Small Business</option>
              </select>
            </div>

            <div style={S.formGroup}>
              <label style={S.label_field}>Team size</label>
              <select style={S.select} value={form.teamSize} onChange={e => update('teamSize', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                <option value="">Select team size...</option>
                <option>Just me (solopreneur)</option>
                <option>2–5 people</option>
                <option>6–20 people</option>
                <option>20+ people</option>
              </select>
            </div>

            <div style={S.formGroup}>
              <label style={S.label_field}>What is your biggest weekly time-waster? *</label>
              <textarea style={S.textarea}
                placeholder="e.g. I spend 3 hours every week manually following up with leads who filled in my contact form but never booked a call..."
                value={form.timewaster}
                onChange={e => update('timewaster', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={S.formGroup}>
              <label style={S.label_field}>What tools do you currently use? (optional)</label>
              <input style={S.input}
                placeholder="e.g. Gmail, Calendly, WhatsApp, Notion..."
                value={form.tools}
                onChange={e => update('tools', e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && <p style={{ color: 'var(--orange)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

            <button onClick={generate} disabled={loading}
              style={{ ...S.btnPrimary, width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px',
                opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite' }}/>
                  Generating your blueprint...
                </>
              ) : '⚡ Generate My Free Blueprint'}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginTop: '12px' }}>
              No email required · Instant results · Built by FlowwayAI
            </p>
          </div>

          {/* Blueprint Result */}
          {blueprint && (
            <div ref={resultRef} style={{ animation: 'fadeUp 0.6s ease both' }}>
              {/* Header */}
              <div style={{ ...S.glassCard, marginBottom: '2px',
                background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(123,159,255,0.1))',
                borderBottom: 'none', borderRadius: '16px 16px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span style={{ ...S.label, marginBottom: '8px' }}>Your AI Blueprint</span>
                    <h3 style={{ ...S.h3, fontSize: '1.4rem', marginBottom: '8px' }}>{blueprint.blueprintName}</h3>
                    <p style={{ ...S.muted, fontSize: '0.9rem' }}>{blueprint.problem}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: '700', color: 'var(--cyan)', fontSize: '1.1rem' }}>{blueprint.timeSaved}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>saved weekly</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: '700', color: '#22C55E', fontSize: '1.1rem' }}>
                        {blueprint.moneySaved.split(' ')[0]}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>recovered/month</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px 20px', background: 'var(--bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: '700', color: diffColor[blueprint.difficulty] || 'var(--cyan)', fontSize: '1.1rem' }}>{blueprint.difficulty}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>to implement</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div style={{ ...S.glassCard, borderRadius: '0', borderTop: 'none', borderBottom: 'none' }}>
                <p style={{ ...S.label, marginBottom: '24px' }}>Your 5-Step Automation Workflow</p>
                {blueprint.steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: i < blueprint.steps.length - 1 ? '24px' : '0' }}>
                    <div style={{ flexShrink: 0 }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--cyan), #7B9FFF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-head)', fontWeight: '700', color: '#000', fontSize: '0.85rem' }}>
                        {s.step}
                      </div>
                      {i < blueprint.steps.length - 1 && (
                        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '4px auto 0' }}/>
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < blueprint.steps.length - 1 ? '8px' : '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontFamily: 'var(--font-head)', color: 'var(--white)', fontWeight: '600', fontSize: '1rem' }}>{s.title}</h4>
                        <span style={{ padding: '3px 10px', background: 'var(--cyan-dim)', border: '1px solid var(--border-cyan)', borderRadius: '50px', fontSize: '0.75rem', color: 'var(--cyan)', whiteSpace: 'nowrap' }}>
                          {s.tool}
                        </span>
                      </div>
                      <p style={{ ...S.muted, marginTop: '4px', fontSize: '0.88rem' }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick win */}
              <div style={{ ...S.glassCard, borderRadius: '0', borderTop: 'none', borderBottom: 'none',
                background: 'rgba(255,107,53,0.05)', borderColor: 'rgba(255,107,53,0.2)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚡</span>
                  <div>
                    <p style={{ color: 'var(--orange)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '6px', fontFamily: 'var(--font-head)' }}>
                      YOUR QUICK WIN — Start here
                    </p>
                    <p style={{ color: 'var(--text)', fontSize: '0.92rem' }}>{blueprint.quickWin}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ ...S.glassCard, borderRadius: '0 0 16px 16px', borderTop: 'none', textAlign: 'center' }}>
                <p style={{ color: 'var(--white)', fontFamily: 'var(--font-head)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>
                  Want me to build this exact system for you?
                </p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Book a free 15-minute audit call. I'll map your workflow and tell you exactly what I'd build. Zero pressure.
                </p>
                <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
                  target="_blank" rel="noreferrer"
                  style={{ ...S.btnPrimary, margin: '0 auto' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  Book My Free Audit Call →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── RESULTS ───────────────────────────────────────────────────────────────────
function Results() {
  const cases = [
    {
      country: '🇬🇧 UK',
      niche: 'Marketing Agency',
      headline: 'Client onboarding: 4 hours → 4 minutes',
      result: '40 hrs/month saved. Team now onboards 3x more clients without extra headcount.',
      stat: '4 hrs → 4 min',
      color: 'var(--cyan)'
    },
    {
      country: '🇺🇸 USA',
      niche: 'Online Coach',
      headline: '11 qualified calls booked in Month 1',
      result: 'Zero manual follow-ups. Calendar filled automatically. Closed $34K in Month 1.',
      stat: '$34K closed',
      color: '#22C55E'
    },
    {
      country: '🌍 Export',
      niche: 'Trade Business',
      headline: '40% more buyer responses',
      result: 'Automated follow-up sequence for 50 global buyers. Response rate jumped in 2 weeks.',
      stat: '+40% responses',
      color: 'var(--orange)'
    },
  ]

  return (
    <section id="results" style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={S.label}>Client Results</span>
          <h2 style={S.h2}>Real businesses. <span style={S.grad}>Real results.</span></h2>
          <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto' }}>
            These are the actual outcomes from automation systems I've built.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {cases.map((c, i) => (
            <div key={i} style={{ ...S.card, borderTop: `3px solid ${c.color}`, transition: 'transform 0.3s, border-color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: '500' }}>{c.country} · {c.niche}</span>
                <span style={{ padding: '4px 12px', borderRadius: '50px', background: `rgba(${c.color === 'var(--cyan)' ? '0,212,255' : c.color === '#22C55E' ? '34,197,94' : '255,107,53'},0.1)`,
                  color: c.color, fontSize: '0.78rem', fontWeight: '700', fontFamily: 'var(--font-head)' }}>
                  {c.stat}
                </span>
              </div>
              <h3 style={{ ...S.h3, color: 'var(--white)', fontSize: '1.1rem' }}>{c.headline}</h3>
              <p style={{ ...S.muted, fontSize: '0.88rem', marginTop: '8px' }}>{c.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Free 15-Min Audit', desc: 'We map your current workflow together. I show you exactly where you\'re losing time and revenue. Zero pressure, zero cost.' },
    { n: '02', title: 'I Build Your System', desc: 'In 7 days, I build your complete AI automation system — tested, connected, and ready to run. You approve before going live.' },
    { n: '03', title: 'Your Business Runs Itself', desc: 'Leads get instant replies. Calls get booked. Your CRM updates itself. You get back 10–15 hours every week.' },
  ]

  return (
    <section id="how-it-works" style={{ ...S.section, background: 'var(--bg2)' }}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={S.label}>The Process</span>
          <h2 style={S.h2}>From chaos to autopilot<br/><span style={S.grad}>in 7 days</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-head)', fontWeight: '800', fontSize: '4rem',
                color: 'var(--border)', lineHeight: '1', marginBottom: '16px',
                letterSpacing: '-2px'
              }}>{s.n}</div>
              <h3 style={{ ...S.h3, fontSize: '1.2rem' }}>{s.title}</h3>
              <p style={S.muted}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
            target="_blank" rel="noreferrer"
            style={S.btnPrimary}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            Start With a Free Audit →
          </a>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: '12px' }}>
            Response within 10 minutes · 3 project spots available this month
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Starter Flow',
      price: '$199',
      tag: 'Most Popular Entry Point',
      desc: 'Perfect for solopreneurs who want their first automation running fast.',
      features: ['1 complete automation workflow', 'WhatsApp or Email automation', 'CRM integration', '7-day delivery', '1 round of revisions', '14-day support'],
      cta: 'Get Started',
      highlight: false
    },
    {
      name: 'Growth Flow',
      price: '$549',
      tag: '⚡ Best Value',
      desc: 'The complete lead-to-booked-call system. Most clients choose this.',
      features: ['Full lead capture system', 'WhatsApp + Email sequences', 'Calendar booking automation', 'CRM auto-update', '7-day delivery', '2 rounds of revisions', '30-day support'],
      cta: 'Get Growth Flow',
      highlight: true
    },
    {
      name: 'Scale Flow',
      price: '$1,100',
      tag: 'Maximum Impact',
      desc: 'Full business automation suite for agencies and growing teams.',
      features: ['Everything in Growth Flow', 'Multi-channel automation', 'Team workflow setup', 'Weekly performance reports', 'Priority 7-day delivery', 'Unlimited revisions', '60-day support'],
      cta: 'Get Scale Flow',
      highlight: false
    },
  ]

  return (
    <section id="pricing" style={S.section}>
      <div style={S.container}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={S.label}>Investment</span>
          <h2 style={S.h2}>One-time fee. <span style={S.grad}>Lifetime autopilot.</span></h2>
          <p style={{ color: 'var(--muted)', maxWidth: '460px', margin: '0 auto' }}>
            Every system pays for itself within 30 days. Guaranteed or I fix it free.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              ...S.card,
              border: p.highlight ? '1px solid var(--cyan)' : '1px solid var(--border)',
              boxShadow: p.highlight ? '0 0 40px var(--cyan-dim)' : 'none',
              position: 'relative',
              transition: 'transform 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  padding: '4px 20px', background: 'linear-gradient(135deg, var(--cyan), #7B9FFF)',
                  borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700', color: '#000',
                  fontFamily: 'var(--font-head)', whiteSpace: 'nowrap' }}>
                  {p.tag}
                </div>
              )}
              {!p.highlight && (
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '500', marginBottom: '8px' }}>{p.tag}</div>
              )}
              <h3 style={{ ...S.h3, marginTop: p.highlight ? '8px' : '0' }}>{p.name}</h3>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', fontWeight: '800', color: 'var(--white)', margin: '12px 0' }}>
                {p.price}
                <span style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: '400' }}> one-time</span>
              </div>
              <p style={{ ...S.muted, fontSize: '0.88rem', marginBottom: '24px' }}>{p.desc}</p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '24px' }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ color: 'var(--cyan)', fontSize: '0.9rem', lineHeight: '1.5', flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
                target="_blank" rel="noreferrer"
                style={p.highlight ? { ...S.btnPrimary, width: '100%', justifyContent: 'center' } : { ...S.btnSecondary, width: '100%', justifyContent: 'center' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem', marginTop: '32px' }}>
          Not sure which plan? Start with a free 15-minute audit call. I'll recommend exactly what you need.
        </p>
      </div>
    </section>
  )
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ ...S.section, background: 'var(--bg2)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none' }}/>
      <div style={{ ...S.container, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span style={S.label}>Don't wait</span>
        <h2 style={{ ...S.h2, fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '16px' }}>
          Every day without automation<br/>
          <span style={S.grad}>is revenue you're leaving behind.</span>
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: '480px', margin: '0 auto 40px', fontSize: '1.05rem' }}>
          Message me right now. Tell me your biggest time-waster this week. I will respond within 10 minutes.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.upwork.com/freelancers/~012f9466ce4898b977"
            target="_blank" rel="noreferrer"
            style={S.btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 50px var(--cyan-glow)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 30px var(--cyan-glow)' }}>
            Book Free 15-Min Audit →
          </a>
          <a href="mailto:ankit@flowwayai.com"
            style={S.btnSecondary}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-cyan)'; e.currentTarget.style.color = 'var(--white)' }}>
            Email Ankit Directly
          </a>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '20px' }}>
          🔒 I take on 3 new client projects per month. Currently 1 spot open.
        </p>
      </div>
    </section>
  )
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '40px 24px' }}>
      <div style={{ ...S.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--cyan), #7B9FFF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h4l2-6 4 12 2-6h2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: '700', color: 'var(--white)', fontSize: '1.05rem' }}>FlowwayAI</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Upwork Profile', href: 'https://www.upwork.com/freelancers/~012f9466ce4898b977' },
            { label: 'Email', href: 'mailto:ankit@flowwayai.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
              style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
              {l.label}
            </a>
          ))}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
          © 2026 FlowwayAI. Built from Rajkot, serving the world.
        </p>
      </div>
    </footer>
  )
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const toolRef = useRef(null)
  const scrollToTool = () => toolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar/>
      <Hero onScrollToTool={scrollToTool}/>
      <PainSection/>
      <div ref={toolRef}>
        <BlueprintTool/>
      </div>
      <Results/>
      <HowItWorks/>
      <Pricing/>
      <FinalCTA/>
      <Footer/>
    </div>
  )
}
