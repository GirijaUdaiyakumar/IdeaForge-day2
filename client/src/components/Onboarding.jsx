import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    emoji: "⚡",
    title: "Welcome to IdeaForge AI",
    desc: "You now have access to a complete AI startup team. Let's show you how to get the most out of it.",
    cta: "Let's Go",
    color: "var(--gold)",
  },
  {
    emoji: "🧠",
    title: "Generate Startup Ideas",
    desc: "Describe any problem or industry — our AI generates complete startup analyses with market size, revenue model, tech stack, and investor pitch.",
    cta: "Got it",
    color: "var(--purple)",
    action: "/generate",
  },
  {
    emoji: "🤖",
    title: "Meet Your AI Mentors",
    desc: "7 expert personas are available 24/7: VC Investor, CTO, Marketing Expert, CFO, Co-Founder and more. Ask anything.",
    cta: "Got it",
    color: "var(--emerald)",
    action: "/ai-chat",
  },
  {
    emoji: "📊",
    title: "Validate Before You Build",
    desc: "Run market validation, competitor analysis, SWOT, startup radar, and revenue forecasts — before spending a single rupee.",
    cta: "Got it",
    color: "var(--blue)",
    action: "/validate",
  },
  {
    emoji: "⌨️",
    title: "Use Ctrl+K Anywhere",
    desc: "Press Ctrl+K to open the command palette — navigate any page instantly, search tools, and run quick actions.",
    cta: "Got it",
    color: "var(--orange)",
  },
  {
    emoji: "🚀",
    title: "You're Ready to Build!",
    desc: "Your AI startup team is standing by. Start with the AI Generator or chat with your mentor. Go build something amazing.",
    cta: "Start Building →",
    color: "var(--gold)",
    action: "/dashboard",
  },
];

const LS_KEY = "ideaforge_onboarding_done_v2";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(LS_KEY, "1");
    setVisible(false);
  };

  const next = () => {
    const current = STEPS[step];
    if (step === STEPS.length - 1) {
      dismiss();
      if (current.action) navigate(current.action);
    } else {
      setStep(s => s + 1);
    }
  };

  const s = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(3,7,18,0.8)", backdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(10,15,30,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)",
              padding: "44px 40px",
              maxWidth: 460,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              position: "relative",
            }}
          >
            {/* Skip */}
            <button
              onClick={dismiss}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "none", border: "none",
                color: "var(--text-muted)", cursor: "pointer",
                fontSize: 13, padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              Skip tour
            </button>

            {/* Progress bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 3, background: "var(--glass-2)",
              borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${s.color}, var(--orange))`,
                }}
              />
            </div>

            {/* Content */}
            <motion.div
              style={{ fontSize: 64, marginBottom: 20, display: "block" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {s.emoji}
            </motion.div>

            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: 24, marginBottom: 14, lineHeight: 1.2,
            }}>
              {s.title}
            </h2>

            <p style={{
              fontSize: 15, color: "var(--text-muted)",
              lineHeight: 1.8, marginBottom: 32,
            }}>
              {s.desc}
            </p>

            {/* Step dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ width: i === step ? 24 : 8, background: i === step ? s.color : "var(--glass-3)" }}
                  transition={{ duration: 0.3 }}
                  style={{ height: 8, borderRadius: "var(--radius-full)", cursor: "pointer" }}
                  onClick={() => setStep(i)}
                />
              ))}
            </div>

            <motion.button
              className="btn btn-primary btn-lg"
              style={{
                width: "100%", justifyContent: "center",
                background: `linear-gradient(135deg, ${s.color}, var(--orange))`,
              }}
              onClick={next}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {s.cta}
            </motion.button>

            <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>
              {step + 1} of {STEPS.length}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
