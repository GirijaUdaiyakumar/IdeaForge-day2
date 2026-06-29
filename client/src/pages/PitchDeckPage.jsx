import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { generatePitch } from "../services/aiService";

export default function PitchDeckPage() {
  const [form, setForm] = useState({ startup: "", problem: "", solution: "", market: "", traction: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.startup.trim()) { toast.error("Please enter your startup name/description"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await generatePitch(form);
      if (res.success) { setResult(res.data); toast.success("Pitch deck generated! 🚀"); }
      else toast.error(res.message || "Generation failed");
    } catch { toast.error("Failed to generate pitch"); }
    finally { setLoading(false); }
  };

  const SLIDES = [
    { key: "headline", label: "🎯 Headline", color: "var(--gold)" },
    { key: "problemSlide", label: "⚠️ The Problem" },
    { key: "solutionSlide", label: "💡 The Solution" },
    { key: "marketSlide", label: "📊 Market Opportunity" },
    { key: "businessModelSlide", label: "💰 Business Model" },
    { key: "tractionSlide", label: "📈 Traction & Metrics" },
    { key: "teamSlide", label: "👥 Team" },
    { key: "financialsSlide", label: "💵 Financials" },
    { key: "askSlide", label: "🤝 The Ask" },
    { key: "closingLine", label: "✨ Closing", color: "var(--gold)" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🚀 AI Pitch Deck Generator</h1>
        <p className="page-subtitle">Generate a compelling investor-ready pitch in seconds</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Startup Details</h3>
          {[
            { f: "startup", label: "Startup Name / Description *", ph: "e.g. MediReach AI — telemedicine for rural India" },
            { f: "problem", label: "Core Problem", ph: "What problem does it solve?" },
            { f: "solution", label: "Your Solution", ph: "How does your startup solve it?" },
            { f: "market", label: "Target Market", ph: "Market size and target customers" },
            { f: "traction", label: "Current Traction", ph: "e.g. 200 beta users, $5k MRR, or Pre-launch" },
          ].map(({ f, label, ph }) => (
            <div key={f} className="form-group">
              <label className="label-text">{label}</label>
              {f === "startup" || f === "problem" || f === "solution" ? (
                <textarea className="textarea-field" rows={2} placeholder={ph} value={form[f]} onChange={set(f)} />
              ) : (
                <input className="input-field" placeholder={ph} value={form[f]} onChange={set(f)} />
              )}
            </div>
          ))}
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                Generating pitch...
              </span>
            ) : "🚀 Generate Pitch Deck"}
          </button>
        </div>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 40, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎤</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Investor Pitch Ready</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 340 }}>Fill in your startup details and generate a complete slide-by-slide investor pitch.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 40, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Crafting your pitch...</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Building a compelling investor narrative</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Valuation highlight */}
                {result.valuationRange && (
                  <div className="luxury-card" style={{ padding: 20, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>Suggested Valuation Range</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--gold)" }}>{result.valuationRange}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SLIDES.map(({ key, label, color }) => result[key] && (
                    <div key={key} className="glass-card" style={{ padding: "18px 22px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: color || "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{label}</div>
                      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{result[key]}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
