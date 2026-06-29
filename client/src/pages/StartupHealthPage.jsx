import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import api from "../services/api";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const DIMENSIONS = [
  { key: "productMarketFit",  label: "PMF",           icon: "🎯" },
  { key: "teamStrength",      label: "Team",          icon: "👥" },
  { key: "financialHealth",   label: "Finance",       icon: "💰" },
  { key: "marketTraction",    label: "Traction",      icon: "📈" },
  { key: "competitiveEdge",   label: "Moat",          icon: "🔰" },
  { key: "operationalEfficiency", label: "Ops",       icon: "⚙️" },
  { key: "customerSatisfaction",  label: "NPS",       icon: "😊" },
  { key: "fundingReadiness",  label: "Funding",       icon: "🤝" },
];

const scoreColor = s => s >= 8 ? "var(--emerald)" : s >= 6 ? "var(--gold)" : s >= 4 ? "var(--orange)" : "var(--red)";
const healthLabel = s => s >= 8 ? "Excellent" : s >= 6 ? "Good" : s >= 4 ? "Needs Work" : "Critical";

export default function StartupHealthPage() {
  const [form, setForm] = useState({ startup: "", mrr: "", teamSize: "", stage: "mvp", notes: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleAnalyze = async () => {
    if (!form.startup.trim()) { toast.error("Describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const prompt = `Analyze the startup health for:
Startup: "${form.startup}"
Stage: ${form.stage}
MRR: ${form.mrr || "not specified"}
Team size: ${form.teamSize || "not specified"}
Additional context: ${form.notes || "none"}

Return ONLY valid JSON:
{
  "scores": {
    "productMarketFit": 0,
    "teamStrength": 0,
    "financialHealth": 0,
    "marketTraction": 0,
    "competitiveEdge": 0,
    "operationalEfficiency": 0,
    "customerSatisfaction": 0,
    "fundingReadiness": 0
  },
  "overallHealth": 0,
  "healthStatus": "Healthy/At Risk/Critical",
  "keyInsights": ["insight 1","insight 2","insight 3"],
  "criticalIssues": ["issue 1","issue 2"],
  "quickWins": ["action 1","action 2","action 3"],
  "thirtyDayPlan": "What to focus on in the next 30 days",
  "investorReadiness": "percentage as string like 65%"
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setResult(res.data.data); toast.success("Health analysis complete! 💊"); }
      else toast.error("Analysis failed");
    } catch { toast.error("Failed to analyze"); }
    finally { setLoading(false); }
  };

  const radarData = result?.scores
    ? DIMENSIONS.map(d => ({ dimension: d.label, score: result.scores[d.key] || 0 }))
    : [];

  const avgScore = result?.overallHealth ||
    (radarData.length ? radarData.reduce((s, d) => s + d.score, 0) / radarData.length : 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">💊 Startup Health Check</h1>
        <p className="page-subtitle">Comprehensive 8-dimension health analysis of your startup</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Your Startup</h3>
            <div className="form-group">
              <label className="label-text">Startup Description *</label>
              <textarea className="textarea-field" rows={4} placeholder="Describe what your startup does, the problem you solve..." value={form.startup} onChange={set("startup")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">MRR (₹)</label>
                <input className="input-field" placeholder="e.g. 200000" value={form.mrr} onChange={set("mrr")} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">Team Size</label>
                <input className="input-field" placeholder="e.g. 5" value={form.teamSize} onChange={set("teamSize")} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="label-text">Stage</label>
              <select className="input-field" value={form.stage} onChange={set("stage")} style={{ cursor: "pointer" }}>
                {["idea","prototype","mvp","beta","revenue","growth","scale"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="label-text">Additional Context</label>
              <textarea className="textarea-field" rows={2} placeholder="Traction, team background, key challenges..." value={form.notes} onChange={set("notes")} />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleAnalyze} disabled={loading}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                    Analyzing...
                  </span>
                : "💊 Run Health Check"
              }
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💊</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Startup Health Check</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 360 }}>Get a comprehensive health assessment across 8 critical startup dimensions with actionable insights.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" className="glass-card" style={{ padding: 48, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Running health diagnostics...</div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Overall score */}
                <div className="luxury-card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>OVERALL HEALTH</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, color: scoreColor(avgScore), lineHeight: 1 }}>
                        {typeof avgScore === "number" ? avgScore.toFixed(1) : avgScore}<span style={{ fontSize: 20 }}>/10</span>
                      </div>
                      <span className="badge" style={{ marginTop: 10, background: `${scoreColor(avgScore)}18`, color: scoreColor(avgScore), border: `1px solid ${scoreColor(avgScore)}30`, fontSize: 12 }}>
                        {result.healthStatus || healthLabel(avgScore)}
                      </span>
                    </div>
                    {result.investorReadiness && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>INVESTOR READY</div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: "var(--purple)" }}>{result.investorReadiness}</div>
                      </div>
                    )}
                  </div>

                  {/* Score bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {DIMENSIONS.map(d => {
                      const score = result.scores?.[d.key] || 0;
                      return (
                        <div key={d.key}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                            <span style={{ color: "var(--text-secondary)", display: "flex", gap: 6 }}>
                              <span>{d.icon}</span> {d.label}
                            </span>
                            <span style={{ fontWeight: 700, color: scoreColor(score) }}>{score}/10</span>
                          </div>
                          <div style={{ height: 5, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(score / 10) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                              style={{ height: "100%", background: scoreColor(score), borderRadius: "var(--radius-full)" }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Radar chart */}
                {radarData.length > 0 && (
                  <div className="glass-card" style={{ padding: 22 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Health Radar</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                        <Radar dataKey="score" stroke="var(--gold)" fill="var(--gold)" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "var(--gold)", r: 4 }} />
                        <Tooltip formatter={v => [`${v}/10`, "Score"]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Insights & Quick wins */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {result.keyInsights?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--blue)", marginBottom: 12 }}>💡 Key Insights</div>
                      {result.keyInsights.map((i, idx) => (
                        <div key={idx} style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, display: "flex", gap: 8 }}>
                          <span style={{ color: "var(--blue)", flexShrink: 0 }}>→</span> {i}
                        </div>
                      ))}
                    </div>
                  )}
                  {result.quickWins?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--emerald)", marginBottom: 12 }}>⚡ Quick Wins</div>
                      {result.quickWins.map((w, idx) => (
                        <div key={idx} style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, display: "flex", gap: 8 }}>
                          <span style={{ color: "var(--emerald)", flexShrink: 0 }}>✓</span> {w}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {result.criticalIssues?.length > 0 && (
                  <div className="glass-card" style={{ padding: 20, border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--red)", marginBottom: 12 }}>🚨 Critical Issues</div>
                    {result.criticalIssues.map((i, idx) => (
                      <div key={idx} style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--red)", flexShrink: 0 }}>⚠</span> {i}
                      </div>
                    ))}
                  </div>
                )}

                {result.thirtyDayPlan && (
                  <div className="glass-card" style={{ padding: 20, borderLeft: "3px solid var(--gold)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>30-Day Focus</div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>{result.thirtyDayPlan}</p>
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
