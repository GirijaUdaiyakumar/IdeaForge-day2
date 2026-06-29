import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import api from "../services/api";

const SWOT_CONFIG = [
  { key: "strengths",    label: "Strengths",    emoji: "💪", color: "var(--emerald)", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
  { key: "weaknesses",   label: "Weaknesses",   emoji: "⚠️", color: "var(--red)",     bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)" },
  { key: "opportunities",label: "Opportunities",emoji: "🚀", color: "var(--gold)",    bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  { key: "threats",      label: "Threats",      emoji: "🔥", color: "var(--orange)",  bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)" },
];

export default function SWOTPage() {
  const [startup, setStartup] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!startup.trim()) { toast.error("Please describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const prompt = `Perform a comprehensive SWOT analysis for this startup: "${startup}" in the ${industry || "technology"} industry.

Return ONLY valid JSON:
{
  "companyName": "Name or description of the startup",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"],
  "threats": ["threat 1", "threat 2", "threat 3"],
  "strategicInsight": "2-3 sentence strategic recommendation based on the SWOT",
  "priorityAction": "The single most important action to take right now",
  "overallScore": "X/10"
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setResult(res.data.data); toast.success("SWOT analysis complete! 📊"); }
      else toast.error("Analysis failed");
    } catch { toast.error("Failed to generate SWOT analysis"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📊 SWOT Analysis Generator</h1>
        <p className="page-subtitle">AI-powered Strengths, Weaknesses, Opportunities & Threats analysis</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
            Startup Details
          </h3>
          <div className="form-group">
            <label className="label-text">Startup Description *</label>
            <textarea
              className="textarea-field" rows={5}
              placeholder="Describe your startup, its product, target market, and current stage..."
              value={startup}
              onChange={e => setStartup(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label-text">Industry</label>
            <input
              className="input-field"
              placeholder="e.g. Fintech, Healthtech, SaaS"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                Analyzing...
              </span>
            ) : "📊 Generate SWOT"}
          </button>
        </div>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
                  SWOT Analysis Ready
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 360 }}>
                  Enter your startup details to generate a comprehensive SWOT analysis with strategic insights.
                </p>
              </motion.div>
            )}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Running SWOT analysis...</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Evaluating competitive position</div>
              </motion.div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Header */}
                <div className="luxury-card" style={{ padding: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      SWOT ANALYSIS
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
                      {result.companyName || startup}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>
                      {result.overallScore}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Overall Score</div>
                  </div>
                </div>

                {/* 2×2 SWOT Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {SWOT_CONFIG.map(({ key, label, emoji, color, bg, border }) => (
                    result[key]?.length > 0 && (
                      <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "var(--radius-lg)", padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color }}>
                          <span style={{ fontSize: 20 }}>{emoji}</span> {label}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {result[key].map((item, i) => (
                            <motion.div key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07 }}
                              style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
                            >
                              <div style={{
                                width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                background: `${color}18`, border: `1px solid ${color}30`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 700, color, marginTop: 1,
                              }}>
                                {i + 1}
                              </div>
                              <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                                {item}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Strategic Insight */}
                {result.strategicInsight && (
                  <div className="glass-card" style={{ padding: 20, borderLeft: "3px solid var(--gold)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
                      Strategic Insight
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                      {result.strategicInsight}
                    </p>
                  </div>
                )}

                {/* Priority Action */}
                {result.priorityAction && (
                  <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "var(--radius-md)", padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>⚡</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", marginBottom: 4 }}>TOP PRIORITY ACTION</div>
                      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{result.priorityAction}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
