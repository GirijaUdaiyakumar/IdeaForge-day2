import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { generateStartupIdea } from "../services/aiService";
import { createIdea } from "../services/ideaService";
import { awardXP } from "../services/userService";
import useAuth from "../hooks/useAuth";
import {
  RiFlashlightLine, RiSaveLine, RiRefreshLine,
  RiLightbulbLine, RiBarChartLine, RiTeamLine,
  RiMoneyDollarCircleLine, RiCodeLine, RiRocketLine,
  RiShieldLine, RiGlobalLine,
} from "react-icons/ri";

const CATEGORIES = ["Fintech","Healthtech","Edtech","AgriTech","ClimaTech","Logistics","SaaS","AI/ML","E-commerce","Social","Gaming","IoT","Blockchain","HR Tech","LegalTech"];
const EXAMPLE_PROMPTS = [
  "AI-powered mental health platform for remote workers",
  "Blockchain solution for supply chain transparency in food",
  "AR navigation app for visually impaired people",
  "AI tutor that personalizes learning for underprivileged kids",
  "On-demand skilled labor marketplace for rural India",
];

export default function GenerateIdeaPage() {
  const { updateUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your startup idea");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const fullPrompt = category ? `[Category: ${category}] ${prompt}` : prompt;
      const res = await generateStartupIdea(fullPrompt, false);
      if (res.success) {
        setResult(res.data);
        toast.success("Startup idea generated! 🚀");
      } else {
        toast.error(res.message || "Generation failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await createIdea({
        title: result.title,
        category: category || "AI Generated",
        description: result.solution || "",
        problem: result.problem || "",
        solution: result.solution || "",
        audience: result.audience || "",
        revenue: result.revenue || "",
        techStack: result.techStack || "",
        growth: result.growth || "",
        investment: result.investment || "",
        score: result.score || "",
        marketSize: result.marketSize || "",
        competitors: result.competitors || "",
        pitchLine: result.pitchLine || "",
        aiGenerated: true,
      });
      // Award XP (non-critical)
      try {
        const xpRes = await awardXP("save_ai_idea", 15);
        if (xpRes?.xp !== undefined) updateUser({ xp: xpRes.xp, level: xpRes.level });
      } catch { /* silently ignore XP errors */ }
      toast.success("Idea saved to your workspace! +15 XP 💾");
    } catch {
      toast.error("Failed to save idea");
    } finally {
      setSaving(false);
    }
  };

  const RESULT_FIELDS = [
    { key: "problem", label: "Problem", icon: RiLightbulbLine, color: "var(--red)" },
    { key: "solution", label: "Solution", icon: RiRocketLine, color: "var(--gold)" },
    { key: "audience", label: "Target Audience", icon: RiTeamLine, color: "var(--blue)" },
    { key: "revenue", label: "Revenue Model", icon: RiMoneyDollarCircleLine, color: "var(--emerald)" },
    { key: "techStack", label: "Tech Stack", icon: RiCodeLine, color: "var(--purple)" },
    { key: "growth", label: "Growth Strategy", icon: RiBarChartLine, color: "var(--cyan)" },
    { key: "investment", label: "Investment Needed", icon: RiShieldLine, color: "var(--orange)" },
    { key: "marketSize", label: "Market Size", icon: RiGlobalLine, color: "var(--magenta)" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">⚡ AI Startup Generator</h1>
        <p className="page-subtitle">Describe any idea and get a complete startup analysis powered by AI</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Input Panel */}
        <div>
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Describe Your Idea</h3>

            {/* Category */}
            <div className="form-group">
              <label className="label-text">Industry / Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label-text">Your Startup Idea</label>
              <textarea
                className="textarea-field"
                rows={6}
                placeholder="Example: AI-powered crop monitoring platform for small farmers using satellite imagery and machine learning to predict yields, detect diseases, and optimize harvest timing..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Example prompts */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Try an example:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {EXAMPLE_PROMPTS.map((p) => (
                  <button key={p} onClick={() => setPrompt(p)} style={{ background: "var(--glass-1)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "8px 12px", textAlign: "left", fontSize: 12, color: "var(--text-muted)", cursor: "pointer", transition: "var(--transition-fast)" }}
                    onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                  >
                    💡 {p}
                  </button>
                ))}
              </div>
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
                  Generating your startup...
                </span>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <RiFlashlightLine /> Generate Startup
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div className="glass-card" style={{ padding: 28, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Ready to Generate</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Your AI-generated startup analysis will appear here.</p>
              </div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 28, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Analyzing your idea...</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Our AI is generating a comprehensive startup analysis</div>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Header */}
                <div className="luxury-card" style={{ padding: 24, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>STARTUP NAME</div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, marginBottom: 8 }}>{result.title}</h2>
                      {result.pitchLine && <p style={{ color: "var(--text-muted)", fontSize: 14, fontStyle: "italic" }}>"{result.pitchLine}"</p>}
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>{result.score}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>AI Score</div>
                    </div>
                  </div>
                  {result.competitors && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text-muted)" }}>
                      🔍 {result.competitors}
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {RESULT_FIELDS.filter(f => result[f.key]).map(({ key, label, icon: Icon, color }) => (
                    <div key={key} className="result-section">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <Icon style={{ color, fontSize: 14 }} />
                        <div className="result-section-label">{label}</div>
                      </div>
                      <div className="result-section-value">{result[key]}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: "center" }}>
                    {saving ? "Saving..." : <><RiSaveLine /> Save to Workspace</>}
                  </button>
                  <button className="btn btn-secondary" onClick={handleGenerate} disabled={loading}>
                    <RiRefreshLine /> Regenerate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
