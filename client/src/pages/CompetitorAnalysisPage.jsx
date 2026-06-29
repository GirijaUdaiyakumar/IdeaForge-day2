import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { analyzeCompetitors } from "../services/aiService";

const INDUSTRIES = ["Fintech","Healthtech","Edtech","AgriTech","SaaS","E-commerce","AI/ML","Logistics","Social Media","Gaming","IoT","Blockchain","HR Tech","LegalTech"];

export default function CompetitorAnalysisPage() {
  const [startup, setStartup] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!startup.trim()) { toast.error("Please describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await analyzeCompetitors({ startup, industry });
      if (res.success) { setResult(res.data); toast.success("Competitor analysis complete! 🔍"); }
      else toast.error(res.message || "Analysis failed");
    } catch { toast.error("Failed to analyze competitors"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🔍 Competitor Analysis</h1>
        <p className="page-subtitle">Deep competitive intelligence to identify gaps and build defensible moats</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Analyze Your Competition</h3>
          <div className="form-group">
            <label className="label-text">Your Startup</label>
            <textarea className="textarea-field" rows={4} placeholder="Describe your startup and what it does..." value={startup} onChange={e => setStartup(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label-text">Industry</label>
            <select className="input-field" value={industry} onChange={e => setIndustry(e.target.value)} style={{ cursor: "pointer" }}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "🔍 Analyze Competitors"}
          </button>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence>
            {!result && !loading && (
              <div className="glass-card" style={{ padding: 40, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Competitive Intelligence</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Enter your startup details to get a full competitive landscape analysis.</p>
              </div>
            )}
            {loading && (
              <div className="glass-card" style={{ padding: 40, textAlign: "center", minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>Scanning competitive landscape...</div>
              </div>
            )}
            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Score & Moat */}
                <div className="luxury-card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>COMPETITIVE MOAT</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, maxWidth: 400, lineHeight: 1.4 }}>{result.moat || "Building moat..."}</div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>{result.competitiveScore}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>Score</div>
                  </div>
                </div>

                {/* Direct Competitors */}
                {result.directCompetitors?.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <span>⚔️</span> Direct Competitors
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {result.directCompetitors.map((c, i) => (
                        <div key={i} style={{ background: "var(--glass-1)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "14px 16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                            {c.marketShare && <span className="badge badge-gold" style={{ fontSize: 10 }}>{c.marketShare}</span>}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {c.strength && <div style={{ fontSize: 12, color: "var(--text-muted)" }}><span style={{ color: "var(--emerald)" }}>✓</span> {c.strength}</div>}
                            {c.weakness && <div style={{ fontSize: 12, color: "var(--text-muted)" }}><span style={{ color: "var(--red)" }}>✗</span> {c.weakness}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advantages & Gaps */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {result.competitiveAdvantages?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "var(--emerald)" }}>🏆 Your Advantages</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {result.competitiveAdvantages.map((a, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--emerald)", flexShrink: 0 }}>✓</span> {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.marketGaps?.length > 0 && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "var(--gold)" }}>💡 Market Gaps</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {result.marketGaps.map((g, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--gold)", flexShrink: 0 }}>→</span> {g}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {result.differentiationStrategy && (
                  <div className="result-section">
                    <div className="result-section-label">Differentiation Strategy</div>
                    <div className="result-section-value">{result.differentiationStrategy}</div>
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
