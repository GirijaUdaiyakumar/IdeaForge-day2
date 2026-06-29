import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import api from "../services/api";

export default function StartupRadarPage() {
  const [form, setForm] = useState({ startup: "", stage: "idea", description: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleAnalyze = async () => {
    if (!form.startup.trim()) { toast.error("Please enter your startup details"); return; }
    setLoading(true); setResult(null);
    try {
      const prompt = `Analyze the startup readiness for: "${form.startup}" at ${form.stage} stage. ${form.description}

Return ONLY valid JSON with scores 1-10 for each dimension and a brief insight:
{
  "scores": {
    "problemSolutionFit": 0,
    "marketSize": 0,
    "competitiveMoat": 0,
    "revenueModel": 0,
    "teamStrength": 0,
    "technicalFeasibility": 0,
    "goToMarket": 0,
    "fundability": 0
  },
  "overallScore": "X/10",
  "readinessLevel": "Concept/MVP/Growth/Scale",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "nextSteps": ["step1", "step2", "step3"],
  "investorReadiness": "percentage",
  "summary": "2-3 sentence overall assessment"
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setResult(res.data.data); toast.success("Radar analysis complete! 🎯"); }
      else toast.error("Analysis failed");
    } catch { toast.error("Failed to analyze startup readiness"); }
    finally { setLoading(false); }
  };

  const radarData = result?.scores ? [
    { dimension: "Problem Fit", score: result.scores.problemSolutionFit || 0 },
    { dimension: "Market Size", score: result.scores.marketSize || 0 },
    { dimension: "Moat", score: result.scores.competitiveMoat || 0 },
    { dimension: "Revenue", score: result.scores.revenueModel || 0 },
    { dimension: "Team", score: result.scores.teamStrength || 0 },
    { dimension: "Technical", score: result.scores.technicalFeasibility || 0 },
    { dimension: "GTM", score: result.scores.goToMarket || 0 },
    { dimension: "Fundability", score: result.scores.fundability || 0 },
  ] : [];

  const scoreColor = (s) => s >= 8 ? "var(--emerald)" : s >= 6 ? "var(--gold)" : s >= 4 ? "var(--orange)" : "var(--red)";

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📡 Startup Readiness Radar</h1>
        <p className="page-subtitle">Get a multi-dimensional AI assessment of your startup's readiness</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Startup Assessment</h3>
          <div className="form-group">
            <label className="label-text">Startup Name / Description *</label>
            <textarea className="textarea-field" rows={4} placeholder="Describe your startup..." value={form.startup} onChange={set("startup")} />
          </div>
          <div className="form-group">
            <label className="label-text">Current Stage</label>
            <select className="input-field" value={form.stage} onChange={set("stage")} style={{ cursor: "pointer" }}>
              {["idea","prototype","mvp","beta","revenue","growth","scale"].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label-text">Additional Context</label>
            <textarea className="textarea-field" rows={3} placeholder="Team size, traction, unique advantages..." value={form.description} onChange={set("description")} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleAnalyze} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Analyzing...</span> : "📡 Analyze Readiness"}
          </button>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📡</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Startup Readiness Radar</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 340 }}>Get scored across 8 critical startup dimensions with actionable insights.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Running deep analysis...</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Overall score */}
                <div className="luxury-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>OVERALL READINESS</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--gold)" }}>{result.overallScore}</div>
                      {result.readinessLevel && <span className="badge badge-emerald" style={{ marginTop: 8 }}>{result.readinessLevel}</span>}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>INVESTOR READINESS</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28 }}>{result.investorReadiness}</div>
                    </div>
                  </div>
                  {result.summary && <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{result.summary}</p>}
                </div>

                {/* Radar Chart */}
                {radarData.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Dimension Scores</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                        <Radar name="Score" dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "var(--gold)", r: 4 }} />
                        <Tooltip formatter={(v) => [`${v}/10`, "Score"]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Score bars */}
                {result.scores && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Detailed Breakdown</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {Object.entries(result.scores).map(([key, score]) => {
                        const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                        return (
                          <div key={key}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                              <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                              <span style={{ fontWeight: 700, color: scoreColor(score) }}>{score}/10</span>
                            </div>
                            <div style={{ height: 6, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(score/10)*100}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                                style={{ height: "100%", background: scoreColor(score), borderRadius: "var(--radius-full)" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Strengths & Improvements */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {result.strengths?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--emerald)", marginBottom: 14 }}>💪 Strengths</div>
                      {result.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "flex", gap: 8 }}><span style={{ color: "var(--emerald)" }}>✓</span>{s}</div>)}
                    </div>
                  )}
                  {result.improvements?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--orange)", marginBottom: 14 }}>🎯 Improvements</div>
                      {result.improvements.map((s, i) => <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, display: "flex", gap: 8 }}><span style={{ color: "var(--orange)" }}>→</span>{s}</div>)}
                    </div>
                  )}
                </div>

                {/* Next Steps */}
                {result.nextSteps?.length > 0 && (
                  <div className="glass-card" style={{ padding: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--gold)", marginBottom: 14 }}>🚀 Next Steps</div>
                    {result.nextSteps.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 24, height: 24, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>{i+1}</div>
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{s}</span>
                      </div>
                    ))}
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
