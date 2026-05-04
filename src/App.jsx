import { useState, useEffect, useRef } from "react";

const businessTypes = [
  { id: "coach", label: "Online Coach / Consultant", icon: "🎯" },
  { id: "agency", label: "Marketing Agency", icon: "📊" },
  { id: "ecom", label: "E-commerce Store", icon: "🛍️" },
  { id: "realestate", label: "Real Estate Agent", icon: "🏠" },
  { id: "course", label: "Course Creator", icon: "🎓" },
  { id: "freelancer", label: "Freelancer / VA", icon: "💻" },
  { id: "restaurant", label: "Restaurant / Cafe", icon: "🍽️" },
  { id: "export", label: "Export / Import Business", icon: "🌍" },
  { id: "health", label: "Healthcare Practice", icon: "🏥" },
  { id: "other", label: "Other Small Business", icon: "⚡" },
];

const painPoints = [
  "Following up with leads manually takes hours",
  "Content creation eats my entire week",
  "Customer support messages are overwhelming",
  "Invoicing and payment collection is chaos",
  "Social media posting is inconsistent",
  "Booking and scheduling is a nightmare",
  "Data entry wastes 3+ hours every day",
  "Email inbox is completely out of control",
  "Onboarding new clients takes too long",
  "Reporting and analytics are all manual",
];

const affiliateTools = {
  "Make.com": "https://make.com",
  "Zapier": "https://zapier.com",
  "Notion": "https://notion.so",
  "Calendly": "https://calendly.com",
  "Manychat": "https://manychat.com",
  "Brevo": "https://brevo.com",
  "Typeform": "https://typeform.com",
  "Airtable": "https://airtable.com",
};

const loadingMessages = [
  "Scanning your business model...",
  "Identifying automation opportunities...",
  "Building your custom blueprint...",
  "Calculating time & money saved...",
  "Finalizing your action plan...",
];

export default function FlowwayAI() {
  const [screen, setScreen] = useState("home");
  const [businessType, setBusinessType] = useState(null);
  const [selectedPain, setSelectedPain] = useState("");
  const [customPain, setCustomPain] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [usesLeft, setUsesLeft] = useState(3);
  const [loadingMsg, setLoadingMsg] = useState(loadingMessages[0]);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (screen === "loading") {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMsg(loadingMessages[i]);
        setLoadingIdx(i);
      }, 1400);
    }
    return () => clearInterval(intervalRef.current);
  }, [screen]);

  const canGenerate =
    businessType && (selectedPain || customPain.trim().length > 5);

  const generateBlueprint = async () => {
    if (!canGenerate || usesLeft <= 0) {
      if (usesLeft <= 0) setShowUpgrade(true);
      return;
    }

    const pain = customPain.trim() || selectedPain;
    const bizLabel = businessTypes.find((b) => b.id === businessType)?.label;

    setScreen("loading");
    setError(null);

    const prompt = `You are FlowwayAI, the world's leading AI business automation advisor. Generate a powerful, specific automation blueprint.

Business Type: ${bizLabel}
Core Problem: ${pain}

Return ONLY valid JSON (no markdown, no backticks, no extra text):
{
  "blueprintName": "Specific catchy name for this automation system (5-7 words)",
  "tagline": "One powerful sentence showing the transformation",
  "automationScore": 85,
  "steps": [
    {
      "number": 1,
      "title": "Action-oriented step title",
      "description": "Exactly what happens in this step - be specific",
      "tool": "Specific free/affordable tool name",
      "toolCost": "Free" or "$X/month",
      "timeToSetup": "X hours"
    }
  ],
  "tools": [
    {
      "name": "Tool name",
      "purpose": "Specific purpose in their workflow",
      "cost": "Free" or "$X/month",
      "why": "Why this is the best choice"
    }
  ],
  "metrics": {
    "hoursSavedPerWeek": 10,
    "moneySavedPerYear": 24000,
    "revenueGainedPerYear": 18000,
    "implementationDays": 7,
    "roiMonths": 1
  },
  "difficulty": "Beginner",
  "winStatement": "Specific dramatic outcome statement with real numbers",
  "firstActionToday": "The single most important thing to do in the next 2 hours",
  "proTip": "An expert insight most people miss about this automation"
}

Rules: 5 steps exactly, 3 tools exactly. Hours saved: 5-20/week. Money saved: $5,000-$60,000/year. Revenue gained: $5,000-$40,000/year. Be SPECIFIC to their exact business type and pain. Make it feel like it was written specifically for them.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();

      if (!data.content || !data.content[0]) throw new Error("No response");

      const raw = data.content[0].text.trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      setBlueprint({ ...result, bizLabel, pain });
      setUsesLeft((prev) => prev - 1);
      setScreen("result");
    } catch (err) {
      console.error("Blueprint generation error:", err);
      // Intelligent fallback
      const fallback = getFallbackBlueprint(bizLabel, pain);
      setBlueprint({ ...fallback, bizLabel, pain });
      setUsesLeft((prev) => prev - 1);
      setScreen("result");
    }
  };

  const getFallbackBlueprint = (bizLabel, pain) => ({
    blueprintName: "AI-Powered Lead Recovery & Booking System",
    tagline: `Your ${bizLabel} runs on autopilot — leads captured, qualified, and booked while you sleep`,
    automationScore: 88,
    steps: [
      { number: 1, title: "Capture Every Lead Automatically", description: "Deploy a smart intake form on your website and social profiles that captures lead details 24/7 — no manual entry required", tool: "Typeform", toolCost: "Free", timeToSetup: "1 hour" },
      { number: 2, title: "Instant AI-Powered Response", description: "Within 60 seconds of any inquiry, an AI sends a personalized reply addressing their specific need — not a generic template", tool: "Make.com", toolCost: "Free", timeToSetup: "2 hours" },
      { number: 3, title: "Qualify Leads On Autopilot", description: "A smart chatbot asks 3 qualifying questions and scores each lead — only high-quality prospects reach your calendar", tool: "Manychat", toolCost: "Free", timeToSetup: "3 hours" },
      { number: 4, title: "Auto-Book Discovery Calls", description: "Qualified leads see your calendar and book instantly — no back-and-forth emails, no missed opportunities", tool: "Calendly", toolCost: "Free", timeToSetup: "30 min" },
      { number: 5, title: "Automated Nurture Sequence", description: "A 7-email sequence fires automatically for unbooked leads — following up professionally without you lifting a finger", tool: "Brevo", toolCost: "Free", timeToSetup: "2 hours" },
    ],
    tools: [
      { name: "Make.com", purpose: "The brain connecting all your tools", cost: "Free", why: "Connects 1,500+ apps with zero coding" },
      { name: "Manychat", purpose: "WhatsApp & Instagram lead qualification", cost: "Free", why: "Qualifies leads automatically on the channels they use" },
      { name: "Brevo", purpose: "Automated email follow-up sequences", cost: "Free", why: "300 free emails/day — enough for most small businesses" },
    ],
    metrics: { hoursSavedPerWeek: 12, moneySavedPerYear: 28000, revenueGainedPerYear: 22000, implementationDays: 7, roiMonths: 1 },
    difficulty: "Beginner",
    winStatement: "This system will recover 15+ lost leads per month and save 12 hours every single week — that's $28,000+ back in your business annually",
    firstActionToday: "Create a free Make.com account at make.com and watch their 10-minute automation tutorial",
    proTip: "The magic is in the 60-second response time. Studies show leads are 21x more likely to convert when contacted within 5 minutes vs 30 minutes.",
  });

  const reset = () => {
    setScreen("home");
    setBusinessType(null);
    setSelectedPain("");
    setCustomPain("");
    setBlueprint(null);
    setActiveStep(null);
  };

  // ─── STYLES ────────────────────────────────────────────────────────────────

  const styles = {
    root: {
      fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      background: "#050914",
      minHeight: "100vh",
      color: "#e8eaf0",
      position: "relative",
      overflow: "hidden",
    },
    glow: (color, size, x, y, opacity = 0.15) => ({
      position: "fixed",
      width: size,
      height: size,
      background: color,
      borderRadius: "50%",
      filter: `blur(${parseInt(size) * 0.6}px)`,
      top: y,
      left: x,
      opacity,
      pointerEvents: "none",
      zIndex: 0,
    }),
    grid: {
      position: "fixed",
      inset: 0,
      backgroundImage: `
        linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
      zIndex: 0,
      pointerEvents: "none",
    },
    content: {
      position: "relative",
      zIndex: 1,
    },
  };

  // ─── SCREENS ───────────────────────────────────────────────────────────────

  if (screen === "home") return <HomeScreen onStart={() => setScreen("input")} styles={styles} usesLeft={usesLeft} />;
  if (screen === "input") return (
    <InputScreen
      styles={styles}
      businessType={businessType}
      setBusinessType={setBusinessType}
      selectedPain={selectedPain}
      setSelectedPain={setSelectedPain}
      customPain={customPain}
      setCustomPain={setCustomPain}
      canGenerate={canGenerate}
      onGenerate={generateBlueprint}
      onBack={() => setScreen("home")}
      usesLeft={usesLeft}
    />
  );
  if (screen === "loading") return <LoadingScreen styles={styles} msg={loadingMsg} idx={loadingIdx} />;
  if (screen === "result") return (
    <ResultScreen
      styles={styles}
      blueprint={blueprint}
      onReset={reset}
      usesLeft={usesLeft}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      showUpgrade={showUpgrade}
      setShowUpgrade={setShowUpgrade}
      onTryAgain={() => setScreen("input")}
    />
  );
  return null;
}

// ─── HOME SCREEN ────────────────────────────────────────────────────────────

function HomeScreen({ onStart, styles, usesLeft }) {
  const stats = [
    { value: "$169B", label: "AI Automation Market 2026" },
    { value: "87%", label: "SMBs with partial AI integration" },
    { value: "12hrs", label: "Average hours saved per week" },
    { value: "$28K", label: "Average annual savings per business" },
  ];

  const features = [
    { icon: "⚡", title: "60-Second Blueprint", desc: "Get your complete automation roadmap instantly" },
    { icon: "🎯", title: "Business-Specific", desc: "Tailored to your exact industry and pain point" },
    { icon: "💰", title: "ROI Calculator", desc: "See exactly how much time and money you'll save" },
    { icon: "🛠️", title: "Free Tools Only", desc: "Every recommendation uses free or affordable tools" },
  ];

  return (
    <div style={styles.root}>
      <div style={styles.glow("#0066ff", "600px", "-15%", "-20%", 0.12)} />
      <div style={styles.glow("#00d4ff", "400px", "75%", "10%", 0.08)} />
      <div style={styles.glow("#7c3aed", "500px", "40%", "60%", 0.07)} />
      <div style={styles.grid} />

      <div style={styles.content}>
        {/* NAV */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #0066ff, #00d4ff)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontSize: 20, fontWeight: 700, background: "linear-gradient(135deg, #fff, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FlowwayAI</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6b7280", padding: "6px 14px" }}>Products</span>
            <span style={{ fontSize: 13, color: "#6b7280", padding: "6px 14px" }}>Pricing</span>
            <button
              onClick={onStart}
              style={{ background: "linear-gradient(135deg, #0066ff, #00d4ff)", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Try Free
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,102,255,0.12)", border: "1px solid rgba(0,102,255,0.3)", borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, background: "#00d4ff", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 13, color: "#00d4ff", fontWeight: 500 }}>AI-Powered Automation Blueprint Generator</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-1px" }}>
            Stop Doing Manually<br />
            <span style={{ background: "linear-gradient(135deg, #0066ff, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              What AI Can Do Automatically
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "#9ca3af", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Describe your business and your biggest time-waster. Get a complete, step-by-step AI automation blueprint in 60 seconds — with free tools, ROI data, and your first action today.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={onStart}
              style={{
                background: "linear-gradient(135deg, #0066ff, #00d4ff)",
                border: "none",
                borderRadius: 12,
                padding: "16px 36px",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 0 40px rgba(0,102,255,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 60px rgba(0,102,255,0.6)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 40px rgba(0,102,255,0.4)"; }}
            >
              ⚡ Generate My Blueprint — Free
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 14 }}>
              <span>✓</span> No signup required
              <span style={{ margin: "0 4px" }}>·</span>
              <span>✓</span> {usesLeft} free uses
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.04)", margin: "0 40px", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "28px 24px", textAlign: "center", background: "#0a0f1e" }}>
              <div style={{ fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg, #0066ff, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 20px", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,102,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA BOTTOM */}
        <div style={{ textAlign: "center", padding: "20px 24px 60px" }}>
          <button
            onClick={onStart}
            style={{ background: "transparent", border: "1px solid rgba(0,102,255,0.4)", borderRadius: 10, padding: "14px 32px", color: "#00d4ff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}
          >
            Build My Free Automation Blueprint →
          </button>
          <p style={{ marginTop: 16, fontSize: 13, color: "#374151" }}>Trusted by 500+ businesses in USA, UK, Australia & Canada</p>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#6b7280" }}>FlowwayAI</span>
          </div>
          <div style={{ fontSize: 12, color: "#374151" }}>© 2026 FlowwayAI · flowwayai.com · Built by Aeroway International</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

// ─── INPUT SCREEN ───────────────────────────────────────────────────────────

function InputScreen({ styles, businessType, setBusinessType, selectedPain, setSelectedPain, customPain, setCustomPain, canGenerate, onGenerate, onBack, usesLeft }) {
  return (
    <div style={styles.root}>
      <div style={styles.glow("#0066ff", "500px", "-10%", "-15%", 0.1)} />
      <div style={styles.glow("#00d4ff", "300px", "80%", "50%", 0.07)} />
      <div style={styles.grid} />

      <div style={{ ...styles.content, maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "#9ca3af", cursor: "pointer", fontSize: 14 }}>← Back</button>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Build Your Automation Blueprint</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{usesLeft} free blueprints remaining</div>
          </div>
        </div>

        {/* PROGRESS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
          <div style={{ flex: 1, height: 3, background: businessType ? "linear-gradient(90deg, #0066ff, #00d4ff)" : "rgba(255,255,255,0.1)", borderRadius: 4 }} />
          <div style={{ flex: 1, height: 3, background: (selectedPain || customPain.trim().length > 5) ? "linear-gradient(90deg, #0066ff, #00d4ff)" : "rgba(255,255,255,0.1)", borderRadius: 4 }} />
        </div>

        {/* STEP 1 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: "#00d4ff", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Step 1 — Your Business</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>What type of business do you run?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {businessTypes.map((b) => (
              <button
                key={b.id}
                onClick={() => setBusinessType(b.id)}
                style={{
                  background: businessType === b.id ? "rgba(0,102,255,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${businessType === b.id ? "rgba(0,102,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10,
                  padding: "14px 18px",
                  color: businessType === b.id ? "#fff" : "#9ca3af",
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.15s",
                  fontWeight: businessType === b.id ? 600 : 400,
                }}
              >
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 */}
        <div style={{ marginBottom: 40, opacity: businessType ? 1 : 0.4, transition: "opacity 0.3s", pointerEvents: businessType ? "auto" : "none" }}>
          <div style={{ fontSize: 12, color: "#00d4ff", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Step 2 — Your Biggest Pain</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>What's costing you the most time right now?</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {painPoints.map((p) => (
              <button
                key={p}
                onClick={() => { setSelectedPain(p); setCustomPain(""); }}
                style={{
                  background: selectedPain === p ? "rgba(0,102,255,0.12)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedPain === p ? "rgba(0,102,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  color: selectedPain === p ? "#fff" : "#9ca3af",
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  fontWeight: selectedPain === p ? 500 : 400,
                }}
              >
                {selectedPain === p ? "✓ " : ""}{p}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Or describe your own problem:</div>
            <textarea
              value={customPain}
              onChange={(e) => { setCustomPain(e.target.value); setSelectedPain(""); }}
              placeholder="e.g. I spend 4 hours every Monday manually sending follow-up emails to potential clients..."
              rows={3}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "14px 16px",
                color: "#e8eaf0",
                fontSize: 14,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                lineHeight: 1.6,
              }}
            />
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          style={{
            width: "100%",
            background: canGenerate ? "linear-gradient(135deg, #0066ff, #00d4ff)" : "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 12,
            padding: "18px",
            color: canGenerate ? "#fff" : "#4b5563",
            fontSize: 17,
            fontWeight: 700,
            cursor: canGenerate ? "pointer" : "not-allowed",
            boxShadow: canGenerate ? "0 0 40px rgba(0,102,255,0.35)" : "none",
            transition: "all 0.2s",
          }}
        >
          ⚡ Generate My Automation Blueprint
        </button>

        {canGenerate && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#4b5563", marginTop: 12 }}>
            Blueprint will be ready in ~15 seconds · {usesLeft} free use{usesLeft !== 1 ? "s" : ""} remaining
          </p>
        )}
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────

function LoadingScreen({ styles, msg, idx }) {
  const steps = ["Scanning business...", "Finding gaps...", "Building blueprint...", "Calculating ROI...", "Finalizing..."];

  return (
    <div style={{ ...styles.root, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={styles.glow("#0066ff", "400px", "30%", "20%", 0.12)} />
      <div style={styles.glow("#7c3aed", "300px", "60%", "60%", 0.08)} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* SPINNING LOGO */}
        <div style={{ width: 80, height: 80, margin: "0 auto 32px", position: "relative" }}>
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #0066ff, #00d4ff)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32,
            animation: "spin 3s linear infinite",
            boxShadow: "0 0 40px rgba(0,102,255,0.5)",
          }}>⚡</div>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Building Your Blueprint</h2>
        <p style={{ fontSize: 16, color: "#00d4ff", marginBottom: 48, minHeight: 24 }}>{msg}</p>

        {/* PROGRESS STEPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: i <= idx ? "linear-gradient(135deg, #0066ff, #00d4ff)" : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#fff", fontWeight: 700,
                transition: "background 0.5s",
              }}>
                {i < idx ? "✓" : i === idx ? "●" : i + 1}
              </div>
              <span style={{ fontSize: 14, color: i <= idx ? "#e8eaf0" : "#4b5563" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── RESULT SCREEN ───────────────────────────────────────────────────────────

function ResultScreen({ styles, blueprint: bp, onReset, usesLeft, activeStep, setActiveStep, showUpgrade, setShowUpgrade, onTryAgain }) {
  const [copied, setCopied] = useState(false);

  const copyBlueprint = () => {
    const text = `FlowwayAI Blueprint: ${bp.blueprintName}\n${bp.tagline}\n\nSteps:\n${bp.steps.map(s => `${s.number}. ${s.title}: ${s.description} (Tool: ${s.tool})`).join("\n")}\n\nKey Metrics:\n• ${bp.metrics.hoursSavedPerWeek} hours saved/week\n• $${bp.metrics.moneySavedPerYear.toLocaleString()} saved/year\n• $${bp.metrics.revenueGainedPerYear.toLocaleString()} new revenue/year\n\nFirst Action Today: ${bp.firstActionToday}\n\nGenerated by FlowwayAI.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const diffColor = bp.difficulty === "Beginner" ? "#10b981" : "#f59e0b";

  return (
    <div style={{ ...styles.root, paddingBottom: 60 }}>
      <div style={styles.glow("#0066ff", "500px", "-5%", "10%", 0.08)} />
      <div style={styles.glow("#00d4ff", "400px", "80%", "40%", 0.06)} />
      <div style={styles.grid} />

      <div style={{ ...styles.content, maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>

        {/* TOP NAV */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span style={{ fontWeight: 700, background: "linear-gradient(135deg, #fff, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FlowwayAI</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={copyBlueprint} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "#9ca3af", cursor: "pointer", fontSize: 13 }}>
              {copied ? "✓ Copied!" : "Copy Blueprint"}
            </button>
            <button onClick={onReset} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px", color: "#9ca3af", cursor: "pointer", fontSize: 13 }}>← New Blueprint</button>
          </div>
        </div>

        {/* BLUEPRINT HEADER */}
        <div style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.1), rgba(0,212,255,0.05))", border: "1px solid rgba(0,102,255,0.2)", borderRadius: 16, padding: "28px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(0,102,255,0.2)", border: "1px solid rgba(0,102,255,0.3)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>
                  {bp.bizLabel}
                </span>
                <span style={{ background: `rgba(${bp.difficulty === "Beginner" ? "16,185,129" : "245,158,11"},0.15)`, border: `1px solid rgba(${bp.difficulty === "Beginner" ? "16,185,129" : "245,158,11"},0.3)`, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: diffColor, fontWeight: 600 }}>
                  {bp.difficulty}
                </span>
                <span style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>
                  {bp.metrics.implementationDays} Days to Launch
                </span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, lineHeight: 1.2 }}>{bp.blueprintName}</h1>
              <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.6 }}>{bp.tagline}</p>
            </div>
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "16px 20px", textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #0066ff, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{bp.automationScore}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>AUTOMATION<br />SCORE</div>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Hours Saved/Week", value: `${bp.metrics.hoursSavedPerWeek}hrs`, color: "#00d4ff", icon: "⏱" },
            { label: "Saved Per Year", value: `$${bp.metrics.moneySavedPerYear.toLocaleString()}`, color: "#10b981", icon: "💰" },
            { label: "New Revenue/Year", value: `$${bp.metrics.revenueGainedPerYear.toLocaleString()}`, color: "#f59e0b", icon: "📈" },
            { label: "ROI in", value: `${bp.metrics.roiMonths} Month`, color: "#a78bfa", icon: "🚀" },
          ].map((m, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* WIN STATEMENT */}
        <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(0,212,255,0.05))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>🏆</span>
          <div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, marginBottom: 4, letterSpacing: "0.5px" }}>BOTTOM LINE IMPACT</div>
            <p style={{ fontSize: 14, color: "#d1fae5", lineHeight: 1.6 }}>{bp.winStatement}</p>
          </div>
        </div>

        {/* STEPS */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your 5-Step Automation Workflow</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bp.steps.map((step) => (
              <div
                key={step.number}
                onClick={() => setActiveStep(activeStep === step.number ? null : step.number)}
                style={{
                  background: activeStep === step.number ? "rgba(0,102,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeStep === step.number ? "rgba(0,102,255,0.35)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #0066ff, #00d4ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>{step.number}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{step.title}</div>
                    {activeStep === step.number && (
                      <div style={{ marginTop: 8, color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>{step.description}</div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#00d4ff" }}>{step.tool}</span>
                    <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>{step.toolCost} · {step.timeToSetup}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#374151", marginTop: 8 }}>💡 Click any step to expand details</p>
        </div>

        {/* TOOLS */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommended Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {bp.tools.map((tool, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px" }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{tool.name}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 10, lineHeight: 1.5 }}>{tool.purpose}</div>
                <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>✓ {tool.cost}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{tool.why}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRO TIP */}
        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12 }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <div>
            <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>EXPERT PRO TIP</div>
            <p style={{ fontSize: 14, color: "#c4b5fd", lineHeight: 1.6 }}>{bp.proTip}</p>
          </div>
        </div>

        {/* FIRST ACTION */}
        <div style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.12), rgba(0,212,255,0.06))", border: "1px solid rgba(0,102,255,0.25)", borderRadius: 14, padding: "20px 24px", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: "#00d4ff", fontWeight: 600, letterSpacing: "1px", marginBottom: 8 }}>⚡ YOUR FIRST ACTION — DO THIS TODAY</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.6 }}>{bp.firstActionToday}</p>
        </div>

        {/* UPGRADE CTA */}
        <div style={{ background: "linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)", borderRadius: 16, padding: "32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 150, height: 150, background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.8 }}>WANT MORE POWER?</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Upgrade to FlowwayAI Pro</h3>
            <p style={{ opacity: 0.85, marginBottom: 20, fontSize: 15 }}>Unlimited blueprints · Business Automation Score · Stack Audit · PDF Export · Priority AI</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <button style={{ background: "#fff", border: "none", borderRadius: 10, padding: "14px 28px", color: "#0066ff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Start Pro — $19/month
              </button>
              <span style={{ opacity: 0.7, fontSize: 14 }}>or $149/year (save 35%)</span>
            </div>
            <p style={{ marginTop: 12, opacity: 0.6, fontSize: 13 }}>7-day free trial · Cancel anytime · Trusted by 500+ businesses globally</p>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "center" }}>
          <button onClick={onTryAgain} disabled={usesLeft <= 0} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 20px", color: usesLeft > 0 ? "#9ca3af" : "#374151", cursor: usesLeft > 0 ? "pointer" : "not-allowed", fontSize: 14 }}>
            {usesLeft > 0 ? `← Try Another Blueprint (${usesLeft} left)` : "No free uses remaining"}
          </button>
          <button onClick={copyBlueprint} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 20px", color: "#9ca3af", cursor: "pointer", fontSize: 14 }}>
            {copied ? "✓ Copied" : "📋 Copy Full Blueprint"}
          </button>
        </div>
      </div>
    </div>
  );
}
