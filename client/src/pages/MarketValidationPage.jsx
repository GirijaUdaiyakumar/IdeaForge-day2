import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { validateMarket } from "../services/aiService";

export default function MarketValidationPage() {
  const [idea, setIdea] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!idea.trim()) { toast.error("Please describe your startup idea"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await validateMarket({ idea, targetMarket });
      if (res.success) { setResult(res.data); toast.success("Market analysis complete! 🎯"); }
      else toast.error(res.message || "Validation failed");
    } catch { toast.error("Failed to validate market"); }
    finally { setLoading(false); }
  };

  const DEMAND_COLOR = { High: "var(--emerald)", Medium: "var(--gold)", Low: "var(--red)" };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🎯 Market Validation</h1>
        <p className="page-subtitle">AI-powered market analysis to validate demand before you build</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Validate Your Market</h3>
          <div className="form-group">
            <label className="label-text">Startup Idea *</label>
            <textarea className="textarea-field" rows={5} placeholder="Describe your startup idea in detail..." value={idea} onChange={e => setIdea(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label-text">Target Market</label>
            <input className="input-field" placeholder="e.g. SMBs in India, Gen Z consumers, Rural farmers" value={targetMarket} onChange={e => setTargetMarket(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleValidate} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                Analyzing market...
              </span>
            ) : "🎯 Validate Market"}
          </button>
        </div>

        <div>
          <AnimatePresence>
            {!result && !loading && (
              <div className="glass-card" style={{ padding: 28, minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Market Analysis Ready</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Enter your startup idea to get comprehensive market validation.</p>
              </div>
            )}
            {loading && (
              <div className="glass-card" style={{ padding: 28, minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>Analyzing market demand...</div>
              </div>
            )}
            {result && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Demand Score */}
                <div className="luxury-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>MARKET DEMAND</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: DEMAND_COLOR[result.marketDemand] || "var(--gold)" }}>
                        {result.marketDemand}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>VALIDATION SCORE</div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>{result.validationScore}</div>
                    </div>
                  </div>
                  {result.recommendation && (
                    <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, color: "var(--emerald)" }}>
                      🏆 Recommendation: {result.recommendation}
                    </div>
                  )}
                </div>

                {/* Market Sizes */}
                {(result.tam || result.sam || result.som) && (
                  <div className="glass-card" style={{ padding: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>Market Sizing</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {[["TAM", result.tam, "var(--gold)"],["SAM", result.sam, "var(--emerald)"],["SOM", result.som, "var(--blue)"]].map(([label, val, color]) => val && (
                        <div key={label} style={{ textAlign: "center", padding: "12px 8px", background: "var(--glass-1)", borderRadius: "var(--radius-sm)" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6 }}>{label}</div>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other fields */}
                {[
                  ["Early Adopters", result.earlyAdopters],
                  ["Willingness to Pay", result.willingnessToPay],
                  ["Customer Pain Score", result.customerPainScore],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className="result-section">
                    <div className="result-section-label">{label}</div>
                    <div className="result-section-value">{value}</div>
                  </div>
                ))}

                {result.keyRisks?.length > 0 && (
                  <div className="result-section">
                    <div className="result-section-label">Key Risks</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {result.keyRisks.map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--red)", flexShrink: 0 }}>⚠</span> {r}
                        </div>
                      ))}
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

