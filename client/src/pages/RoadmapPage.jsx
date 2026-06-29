import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import api from "../services/api";

const PLANS = [
  { key: "30day",   label: "30-Day Plan",  emoji: "🚀", desc: "Launch your MVP" },
  { key: "90day",   label: "90-Day Plan",  emoji: "📈", desc: "Find product-market fit" },
  { key: "6month",  label: "6-Month Plan", emoji: "🏗️", desc: "Build & scale" },
  { key: "1year",   label: "1-Year Plan",  emoji: "🏆", desc: "Become market leader" },
];

const MILESTONE_COLORS = ["var(--gold)","var(--emerald)","var(--blue)","var(--purple)","var(--magenta)","var(--orange)","var(--cyan)","var(--red)"];

export default function RoadmapPage() {
  const [startup, setStartup] = useState("");
  const [stage, setStage]     = useState("idea");
  const [planType, setPlanType] = useState("90day");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const handleGenerate = async () => {
    if (!startup.trim()) { toast.error("Describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const planLabel = PLANS.find(p => p.key === planType)?.label;
      const prompt = `Create a detailed ${planLabel} startup roadmap for: "${startup}" at the ${stage} stage.

Return ONLY valid JSON:
{
  "title": "Roadmap title",
  "objective": "Main objective for this period",
  "phases": [
    {
      "phase": "Phase name",
      "week": "Week 1-2",
      "focus": "Main focus",
      "milestones": ["milestone 1", "milestone 2", "milestone 3"],
      "kpis": ["KPI 1", "KPI 2"],
      "resources": ["Resource needed"]
    }
  ],
  "successMetrics": ["metric 1", "metric 2", "metric 3"],
  "criticalRisks": ["risk 1", "risk 2"],
  "estimatedBudget": "Budget range",
  "teamRequired": ["role 1", "role 2"]
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setResult(res.data.data); setCheckedItems({}); toast.success(`${planLabel} generated! 🚀`); }
      else toast.error("Generation failed");
    } catch { toast.error("Failed to generate roadmap"); }
    finally { setLoading(false); }
  };

  const toggleCheck = (phaseIdx, mIdx) => {
    const key = `${phaseIdx}-${mIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalMilestones = result?.phases?.reduce((s, p) => s + (p.milestones?.length || 0), 0) || 0;
  const completedMilestones = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🗺️ Startup Roadmap</h1>
        <p className="page-subtitle">AI-generated execution roadmap with milestones and KPIs</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Generate Roadmap</h3>
            <div className="form-group">
              <label className="label-text">Your Startup *</label>
              <textarea className="textarea-field" rows={4} placeholder="Describe your startup..." value={startup} onChange={e => setStartup(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label-text">Current Stage</label>
              <select className="input-field" value={stage} onChange={e => setStage(e.target.value)} style={{ cursor: "pointer" }}>
                {["idea","prototype","mvp","beta","revenue","growth"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label-text">Plan Duration</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PLANS.map(p => (
                  <button key={p.key} onClick={() => setPlanType(p.key)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--radius-sm)", background: planType === p.key ? "rgba(245,158,11,0.12)" : "var(--glass-1)", border: `1px solid ${planType === p.key ? "rgba(245,158,11,0.3)" : "var(--border-subtle)"}`, cursor: "pointer", transition: "var(--transition-fast)", textAlign: "left" }}>
                    <span style={{ fontSize: 18 }}>{p.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: planType === p.key ? "var(--gold)" : "var(--text-primary)" }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleGenerate} disabled={loading}>
              {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Generating...</span> : "🗺️ Generate Roadmap"}
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🗺️</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Ready to Map Your Journey</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 360 }}>Generate a step-by-step execution roadmap with phases, milestones, and KPIs.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 48, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Building your roadmap...</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Header */}
                <div className="luxury-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>ROADMAP</div>
                      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{result.title}</h2>
                      <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{result.objective}</p>
                    </div>
                    {totalMilestones > 0 && (
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: progress >= 80 ? "var(--emerald)" : "var(--gold)" }}>{progress}%</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{completedMilestones}/{totalMilestones}</div>
                      </div>
                    )}
                  </div>
                  {totalMilestones > 0 && (
                    <div style={{ marginTop: 16, height: 6, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }}
                        style={{ height: "100%", background: "linear-gradient(90deg,var(--gold),var(--orange))", borderRadius: "var(--radius-full)" }} />
                    </div>
                  )}
                </div>

                {/* Timeline phases */}
                {result.phases?.map((phase, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass-card" style={{ padding: 22, borderLeft: `3px solid ${MILESTONE_COLORS[i % MILESTONE_COLORS.length]}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: MILESTONE_COLORS[i % MILESTONE_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000", flexShrink: 0 }}>{i + 1}</div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{phase.phase}</h3>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 34 }}>{phase.focus}</div>
                      </div>
                      <span className="badge badge-gold" style={{ fontSize: 10, flexShrink: 0 }}>{phase.week}</span>
                    </div>
                    {phase.milestones?.length > 0 && (
                      <div style={{ paddingLeft: 34 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Milestones</div>
                        {phase.milestones.map((m, mi) => {
                          const key = `${i}-${mi}`;
                          const done = !!checkedItems[key];
                          return (
                            <div key={mi} onClick={() => toggleCheck(i, mi)}
                              style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 7, cursor: "pointer" }}>
                              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${done ? "var(--emerald)" : "var(--border-default)"}`, background: done ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--emerald)", flexShrink: 0, marginTop: 1, transition: "var(--transition-fast)" }}>
                                {done ? "✓" : ""}
                              </div>
                              <span style={{ fontSize: 13, color: done ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: done ? "line-through" : "none", lineHeight: 1.5 }}>{m}</span>
                            </div>
                          );
                        })}
                        {phase.kpis?.length > 0 && (
                          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {phase.kpis.map((k, ki) => (
                              <span key={ki} style={{ fontSize: 11, padding: "3px 10px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "var(--radius-full)", color: "var(--blue)" }}>📊 {k}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Footer info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {result.successMetrics?.length > 0 && (
                    <div className="glass-card" style={{ padding: 18 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--emerald)", marginBottom: 10 }}>✅ Success Metrics</div>
                      {result.successMetrics.map((m, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>• {m}</div>)}
                    </div>
                  )}
                  {result.criticalRisks?.length > 0 && (
                    <div className="glass-card" style={{ padding: 18 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--red)", marginBottom: 10 }}>⚠️ Critical Risks</div>
                      {result.criticalRisks.map((r, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>• {r}</div>)}
                    </div>
                  )}
                </div>
                {(result.estimatedBudget || result.teamRequired?.length) && (
                  <div className="glass-card" style={{ padding: 18, display: "flex", gap: 32, flexWrap: "wrap" }}>
                    {result.estimatedBudget && <div><div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>BUDGET</div><div style={{ fontWeight: 700, color: "var(--gold)" }}>{result.estimatedBudget}</div></div>}
                    {result.teamRequired?.length > 0 && <div><div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>TEAM NEEDED</div><div style={{ fontWeight: 600, fontSize: 13 }}>{result.teamRequired.join(", ")}</div></div>}
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
