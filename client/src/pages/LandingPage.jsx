import { useState, useRef, lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { useTypewriter } from "react-simple-typewriter";
import FloatingParticles from "../components/FloatingParticles";

const HeroScene3D = lazy(() => import("../components/HeroScene3D"));

/* ── Animation variants ── */
const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };
const stag = (delay = 0) => ({ visible: { transition: { staggerChildren: 0.1, delayChildren: delay } } });

/* ── Scroll reveal wrapper ── */
function InView({ children, className, style, variants = reveal }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className} style={style}
      initial="hidden" animate={inView ? "visible" : "hidden"} variants={variants}>
      {children}
    </motion.div>
  );
}

/* ── Magnetic button ── */
function MagBtn({ children, className, style, to, onClick }) {
  const ref = useRef(null);
  const handleMove = e => {
    if (!ref.current) return;
    const b = ref.current.getBoundingClientRect();
    const dx = e.clientX - (b.left + b.width / 2);
    const dy = e.clientY - (b.top + b.height / 2);
    ref.current.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  };
  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0)";
  };
  const btn = (
    <button
      ref={ref}
      className={className}
      style={{ ...style, transition: "transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.25s" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
  return to ? <Link to={to}>{btn}</Link> : btn;
}

/* ── Data ── */
const FEATURES = [
  { icon: "⚡", title: "AI Startup Generator",   desc: "Complete startup analysis with market, revenue, tech stack and pitch in 10 seconds.", color: "#f59e0b" },
  { icon: "🎯", title: "Market Validation",       desc: "AI-powered TAM/SAM/SOM analysis. Know your market before you invest a dollar.",       color: "#3b82f6" },
  { icon: "📊", title: "Business Planner",        desc: "Full business plan with 3-year financial projections and go-to-market strategy.",      color: "#8b5cf6" },
  { icon: "🚀", title: "Investor Pitch AI",       desc: "Generate slide-by-slide investor pitch decks with compelling narratives.",             color: "#10b981" },
  { icon: "🔍", title: "Competitor Analysis",     desc: "Deep competitive intelligence. Find gaps, build moats, dominate your market.",         color: "#06b6d4" },
  { icon: "🤖", title: "AI Mentor Chat",          desc: "7 expert AI personas available 24/7 — VC Investor, CTO, CMO, CFO, and more.",         color: "#d946ef" },
  { icon: "📈", title: "Revenue Forecast",        desc: "AI-powered 12-month projection with interactive charts and break-even analysis.",      color: "#f97316" },
  { icon: "📡", title: "Startup Radar",           desc: "Score your startup across 8 critical dimensions. Know exactly where you stand.",       color: "#f59e0b" },
];

const STEPS = [
  { n: "01", icon: "💡", title: "Describe",  desc: "Tell IdeaForge AI what you want to build. Any idea, any industry, any stage." },
  { n: "02", icon: "🧠", title: "Analyze",   desc: "AI runs market validation, competitor scan, and viability scoring in real-time." },
  { n: "03", icon: "📋", title: "Plan",      desc: "Get a complete business plan, revenue model, and go-to-market strategy instantly." },
  { n: "04", icon: "🚀", title: "Launch",    desc: "Generate your investor pitch, build your MVP roadmap, and launch with confidence." },
];

const TESTIMONIALS = [
  { name: "Arjun Mehta",  role: "Founder, FinFlow AI",     avatar: "AM", rating: 5, quote: "IdeaForge validated my fintech idea and generated the pitch that landed our ₹2Cr seed round. The AI Investor persona asked every question our actual VCs asked." },
  { name: "Priya Sharma", role: "Co-founder, EduVerse",    avatar: "PS", rating: 5, quote: "We pivoted three times based on IdeaForge competitor analysis. Each time the insights were spot-on. Found PMF 4x faster than our previous startup." },
  { name: "Rahul Nair",   role: "CTO, AgriVision",         avatar: "RN", rating: 5, quote: "As a technical founder, the business model and financial projection tools were a game-changer. I stopped guessing and started building with a real plan." },
];

const FAQS = [
  { q: "Is IdeaForge AI free to start?",          a: "Yes. The free plan includes 10 AI generations per day, full dashboard, idea storage, and AI chat. No credit card required." },
  { q: "Which AI model powers IdeaForge?",        a: "We use Groq's LLaMA 3.3 70B for fast, high-quality responses. This is a frontier-class model comparable to GPT-4." },
  { q: "Can I save and export my work?",           a: "Every idea, analysis, pitch, and plan is saved to your workspace. Export features are available on Pro plan." },
  { q: "Is my startup data private?",             a: "Absolutely. Your data is encrypted and private by default. We never use your ideas for training or share them with third parties." },
  { q: "How is IdeaForge different from ChatGPT?", a: "IdeaForge is purpose-built for startups with structured outputs, saved workspaces, analytics, and specialized AI personas — not a generic chatbot." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [typeText] = useTypewriter({
    words: [
      "From Idea → Validation → Revenue → Investment",
      "Build. Validate. Launch. Repeat.",
      "Your AI Co-Founder is Ready. Let's Build.",
      "Turn Any Idea into a Funded Startup.",
    ],
    loop: true,
    delaySpeed: 2800,
    typeSpeed: 55,
    deleteSpeed: 40,
  });

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="landing-page" style={{ overflow: "hidden" }}>

      {/* ─── NAVBAR ─── */}
      <motion.nav className="landing-navbar"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <Link to="/" className="landing-brand">⚡ IdeaForge AI</Link>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login"><button className="btn btn-secondary btn-sm">Sign in</button></Link>
          <MagBtn className="btn btn-primary btn-sm" to="/signup">Start Free →</MagBtn>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="hero-section" style={{ position: "relative", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.9, y: heroY }}>
          <Suspense fallback={null}><HeroScene3D /></Suspense>
        </motion.div>
        <FloatingParticles count={40} color="rgba(245,158,11,0.25)" mouseConnect={false} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 30% 50%, rgba(3,7,18,0.15) 0%, rgba(3,7,18,0.6) 100%)", zIndex: 1, pointerEvents: "none" }} />

        <motion.div style={{ position: "relative", zIndex: 2, opacity: heroOp }}
          initial="hidden" animate="visible" variants={stag(0.1)}>
          <motion.div variants={reveal}>
            <span className="hero-eyebrow">🚀 AI-POWERED STARTUP INCUBATOR</span>
          </motion.div>
          <motion.h1 className="hero-title" variants={reveal}>
            Build the Next<br /><span className="gradient-text">Billion-Dollar</span><br />Startup with AI
          </motion.h1>
          <motion.p className="hero-subtitle" variants={reveal}>
            {typeText}<span style={{ color: "var(--gold)", animation: "blink 1s step-end infinite" }}>|</span>
          </motion.p>
          <motion.p className="hero-desc" variants={reveal}>
            IdeaForge AI gives you a complete startup team in your browser — AI Generator, Market Validation,
            Competitor Analysis, Investor Pitch, Business Planner, and expert AI Mentors.
          </motion.p>
          <motion.div className="hero-tags" variants={reveal}>
            {["AI Generator","Market Validation","Investor Pitch","Competitor Analysis","Revenue Forecast","Startup Radar","SWOT Analysis","AI Mentor"].map(t => (
              <motion.span key={t} className="hero-tag" whileHover={{ y: -2, borderColor: "rgba(245,158,11,0.4)", color: "var(--gold)" }}>{t}</motion.span>
            ))}
          </motion.div>
          <motion.div className="hero-buttons" variants={reveal}>
            <MagBtn className="btn btn-primary btn-xl" to="/signup">Start Building Free</MagBtn>
            <MagBtn className="btn btn-secondary btn-xl" to="/dashboard">View Dashboard →</MagBtn>
          </motion.div>
          <motion.div className="hero-stats" variants={stag(0.5)}>
            {[{ end: 12400, suffix: "+", label: "Ideas Generated" }, { end: 98, suffix: "%", label: "AI Accuracy" }, { end: 2800, suffix: "+", label: "Founders" }].map(s => (
              <motion.div key={s.label} className="hero-stat" variants={reveal} whileHover={{ y: -4, borderColor: "rgba(245,158,11,0.35)" }}>
                <div className="hero-stat-value">
                  <CountUp end={s.end} suffix={s.suffix} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />
                </div>
                <div className="hero-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hero preview card */}
        <motion.div className="hero-visual" style={{ position: "relative", zIndex: 2 }}
          initial={{ opacity: 0, x: 50, scale: 0.94 }} animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="hero-card-preview" whileHover={{ y: -6 }}>
            <div className="preview-header-bar">
              <span className="preview-dot red" /><span className="preview-dot yellow" /><span className="preview-dot green" />
              <span className="preview-title">ideaforge.ai — AI Generator</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>PROMPT</div>
              <div style={{ background: "var(--bg-elevated)", padding: "10px 14px", borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--text-secondary)", border: "1px solid var(--border-subtle)", lineHeight: 1.5 }}>
                AI platform for rural healthcare diagnostics in India...
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
              style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(249,115,22,0.06))", border: "1px solid rgba(245,158,11,0.22)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>MediReach AI</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                🎯 850M rural patients underserved<br />
                💰 ₹499/month per clinic · 18% CAGR market<br />
                📊 $4.2B TAM · Break-even Month 14
              </div>
            </motion.div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="badge badge-emerald" style={{ fontSize: 11 }}>Score: 9.2/10</span>
              <div style={{ display: "flex", gap: 6 }}>
                {["Save", "Pitch", "Validate"].map(l => (
                  <motion.button key={l} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} whileHover={{ y: -1 }}>{l}</motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <div style={{ padding: "18px 6%", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", background: "rgba(3,7,18,0.6)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {["Powered by Groq LLaMA 3.3 70B", "JWT Secured", "MongoDB Atlas", "React 19", "Open Source Ready"].map(item => (
            <div key={item} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" className="landing-section">
        <InView>
          <div className="section-header">
            <span className="section-eyebrow">FULL AI STARTUP STACK</span>
            <h2 className="section-title">Everything You Need<br /><span className="gradient-text">to Go From Idea to Funded</span></h2>
            <p className="section-subtitle">One platform replaces a team of consultants, researchers, and advisors.</p>
          </div>
        </InView>
        <motion.div className="features-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
          {FEATURES.map(f => (
            <motion.div key={f.title} variants={reveal} className="feature-card"
              whileHover={{ y: -6, borderColor: `${f.color}40`, boxShadow: `0 20px 60px ${f.color}15` }}>
              <div className="feature-icon" style={{ color: f.color, background: `${f.color}15`, border: `1px solid ${f.color}25` }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="landing-section" style={{ background: "linear-gradient(180deg,transparent,rgba(245,158,11,0.02),transparent)" }}>
        <InView>
          <div className="section-header">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2 className="section-title">From <span className="gradient-text">Idea to Investor</span> in 4 Steps</h2>
          </div>
        </InView>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, maxWidth: 1080, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <InView key={s.n} style={{ height: "100%" }}>
              <motion.div
                style={{ textAlign: "center", padding: "28px 20px", background: "var(--glass-2)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", position: "relative", height: "100%" }}
                whileHover={{ y: -4, borderColor: "rgba(245,158,11,0.25)" }}>
                <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", width: 32, height: 32, background: "linear-gradient(135deg,var(--gold),var(--orange))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000" }}>{s.n}</div>
                <div style={{ fontSize: 44, marginBottom: 14, marginTop: 8 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.75 }}>{s.desc}</p>
                {i < STEPS.length - 1 && <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "var(--gold)", zIndex: 1 }}>→</div>}
              </motion.div>
            </InView>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="landing-section">
        <InView>
          <div className="section-header">
            <span className="section-eyebrow">PRICING</span>
            <h2 className="section-title">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
            <p className="section-subtitle">Start free. No credit card. Upgrade when you're ready.</p>
          </div>
        </InView>
        <div className="pricing-grid">
          {[
            { plan: "Free", price: "₹0", period: "forever", badge: null, features: ["10 AI Generations/day", "Dashboard & Workspace", "10 Idea slots", "Basic AI Chat", "Idea Analytics"], cta: "Get Started Free", featured: false },
            { plan: "Pro", price: "₹499", period: "per month", badge: "BEST VALUE", features: ["Unlimited AI Generation", "Market Validation", "Competitor Analysis", "Pitch Deck AI", "Business Planner", "Revenue Forecast", "Startup Radar", "SWOT Analysis", "Priority Support"], cta: "Upgrade to Pro", featured: true },
            { plan: "Business", price: "₹1,999", period: "per month", badge: null, features: ["Everything in Pro", "Unlimited Team", "Custom AI Personas", "API Access", "White-label Reports", "Dedicated Manager"], cta: "Start Business", featured: false },
          ].map(p => (
            <InView key={p.plan} style={{ height: "100%" }}>
              <motion.div className={`price-card${p.featured ? " featured" : ""}`} style={{ height: "100%", display: "flex", flexDirection: "column" }} whileHover={{ y: -6 }}>
                {p.badge && <span className="price-badge">{p.badge}</span>}
                <div className="price-plan">{p.plan}</div>
                <div className="price-amount gradient-text">{p.price}</div>
                <div className="price-period">{p.period}</div>
                <ul className="price-features" style={{ flex: 1 }}>
                  {p.features.map(f => <li key={f}><span className="price-check">✓</span>{f}</li>)}
                </ul>
                <Link to="/signup">
                  <button className={`btn ${p.featured ? "btn-primary" : "btn-secondary"} btn-lg`} style={{ width: "100%", justifyContent: "center" }}>{p.cta}</button>
                </Link>
              </motion.div>
            </InView>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="reviews" className="landing-section">
        <InView>
          <div className="section-header">
            <span className="section-eyebrow">FOUNDER STORIES</span>
            <h2 className="section-title">Trusted by <span className="gradient-text">Builders</span></h2>
            <p className="section-subtitle">Real founders. Real results. Real startups built with IdeaForge AI.</p>
          </div>
        </InView>

        {/* Auto-rotating featured testimonial */}
        <div style={{ maxWidth: 680, margin: "0 auto 40px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTestimonial}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }} className="testimonial-card"
              style={{ textAlign: "center", padding: "40px 48px" }}>
              <div className="stars" style={{ fontSize: 18, marginBottom: 20, letterSpacing: 3 }}>{"⭐".repeat(TESTIMONIALS[activeTestimonial].rating)}</div>
              <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 28, fontStyle: "italic" }}>
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <div className="testimonial-avatar">{TESTIMONIALS[activeTestimonial].avatar}</div>
                <div style={{ textAlign: "left" }}>
                  <div className="testimonial-name">{TESTIMONIALS[activeTestimonial].name}</div>
                  <div className="testimonial-role">{TESTIMONIALS[activeTestimonial].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
            {TESTIMONIALS.map((_, i) => (
              <motion.button key={i} onClick={() => setActiveTestimonial(i)}
                animate={{ width: i === activeTestimonial ? 24 : 8, background: i === activeTestimonial ? "var(--gold)" : "var(--glass-3)" }}
                style={{ height: 8, borderRadius: "var(--radius-full)", border: "none", cursor: "pointer" }} />
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div className="testimonials-grid" initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {TESTIMONIALS.map(t => (
            <motion.div key={t.name} variants={reveal} className="testimonial-card" whileHover={{ y: -4 }}>
              <div className="stars">{"⭐".repeat(t.rating)}</div>
              <p className="testimonial-quote">"{t.quote.slice(0, 120)}..."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="landing-section">
        <InView>
          <div className="section-header">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">Common <span className="gradient-text">Questions</span></h2>
          </div>
        </InView>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <InView key={i}>
              <div className="faq-item" style={{ cursor: "pointer" }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{f.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                    style={{ color: "var(--gold)", fontSize: 22, fontWeight: 300, display: "inline-block", lineHeight: 1 }}>+</motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div className="faq-answer"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="landing-section" style={{ paddingBottom: 80 }}>
        <InView>
          <motion.div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(249,115,22,0.06))", border: "1px solid rgba(245,158,11,0.22)", borderRadius: "var(--radius-xl)", padding: "72px 48px", textAlign: "center", maxWidth: 860, margin: "0 auto", position: "relative", overflow: "hidden" }}
            whileHover={{ boxShadow: "0 0 80px rgba(245,158,11,0.12)" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}>
              <FloatingParticles count={20} color="rgba(245,158,11,0.4)" mouseConnect={false} />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>START FOR FREE TODAY</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 800, marginBottom: 18, lineHeight: 1.1 }}>
                Ready to Build Your<br /><span className="gradient-text">Billion-Dollar Startup?</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 17, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
                Join 2,800+ founders using IdeaForge AI to validate, plan, and pitch their startup ideas.
              </p>
              <MagBtn className="btn btn-primary btn-xl" to="/signup">Start Building for Free →</MagBtn>
            </div>
          </motion.div>
        </InView>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚡ IdeaForge AI</div>
            <p className="footer-desc">Transform startup ideas into billion-dollar companies with Artificial Intelligence. Built for founders who move fast.</p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <div className="footer-links">
              <a href="#features">Features</a><a href="#pricing">Pricing</a>
              <Link to="/dashboard">Dashboard</Link><Link to="/generate">AI Generator</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">AI Tools</div>
            <div className="footer-links">
              <Link to="/validate">Market Validation</Link>
              <Link to="/competitors">Competitor Analysis</Link>
              <Link to="/pitch">Pitch Deck AI</Link>
              <Link to="/radar">Startup Radar</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Get Started</div>
            <div className="footer-links">
              <Link to="/signup">Create Free Account</Link>
              <Link to="/login">Sign In</Link>
              <Link to="/analytics">Analytics</Link>
              <Link to="/achievements">Achievements</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 IdeaForge AI · All rights reserved · Built for founders 🚀</div>
          <div className="footer-copy" style={{ display: "flex", gap: 16 }}>
            <a href="#" style={{ color: "var(--text-muted)", fontSize: 13 }}>Privacy</a>
            <a href="#" style={{ color: "var(--text-muted)", fontSize: 13 }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
