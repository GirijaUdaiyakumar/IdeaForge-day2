import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { generateBusinessPlan } from "../services/aiService";

const INDUSTRIES = ["Fintech","Healthtech","Edtech","AgriTech","ClimaTech","SaaS","AI/ML","E-commerce","Logistics","Social","HR Tech","LegalTech","IoT","Blockchain"];

export default function BusinessPlanPage() {
  const [form, setForm] = useState({ startup: "", industry: "", targetMarket: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.startup.trim()) { toast.error("Please describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const res = await generateBusinessPlan(form);
      if (res.success) { setResult(res.data); toast.success("Business plan generated! 📋"); }
      else toast.error(res.message || "Generation failed");
    } catch { toast.error("Failed to generate business plan"); }
    finally { setLoading(false); }
  };

  const SECTIONS = [
    { key: "executiveSummary", label: "📋 Executive Summary", color: "var(--gold)" },
    { key: "companyDescription", label: "🏢 Company Description" },
    { key: "productsServices", label: "📦 Products & Services" },
    { key: "marketAnalysis", label: "📊 Market Analysis" },
    { key: "marketingStrategy", label: "📣 Marketing Strategy" },
    { key: "operationalPlan", label: "⚙️ Operational Plan" },
    { key: "managementTeam", label: "👥 Management Team" },
    { key: "fundingRequirements", label: "💰 Funding Requirements" },
    { key: "exitStrategy", label: "🚪 Exit Strategy" },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📋 AI Business Planner</h1>
        <p className="page-subtitle">Generate a complete, investor-grade business plan with AI</p>
      </div>
      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24 }}>
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Startup Details</h3>
          <div className="form-group">
            <label className="label-text">Startup Description *</label>
            <textarea className="textarea-field" rows={4} placeholder="Describe your startup idea in detail..." value={form.startup} onChange={set("startup")} />
          </div>
          <div className="form-group">
            <label className="label-text">Industry</label>
            <select className="input-field" value={form.industry} onChange={set("industry")} style={{ cursor: "pointer" }}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="label-text">Target Market</label>
            <input className="input-field" placeholder="e.g. B2B SMBs, Gen Z consumers" value={form.targetMarket} onChange={set("targetMarket")} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleGenerate} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Generating...</span> : "📋 Generate Business Plan"}
          </button>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Ready to Plan</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 340 }}>Get a full business plan with executive summary, financial projections, marketing strategy, and exit plan.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Building your business plan...</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14 }}>Analyzing market, financials, and strategy</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Financial Projections highlight */}
                {result.financialProjections && (
                  <div className="luxury-card" style={{ padding: 24, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>📈 Financial Projections</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {[["Year 1 Revenue", result.financialProjections.year1Revenue],["Year 2 Revenue", result.financialProjections.year2Revenue],["Year 3 Revenue", result.financialProjections.year3Revenue],["Break Even", result.financialProjections.breakEven]].map(([l, v]) => v && (
                        <div key={l} style={{ textAlign: "center", background: "var(--glass-1)", borderRadius: "var(--radius-sm)", padding: "12px 8px" }}>
                          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>{l}</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--gold)" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Milestones */}
                {result.milestones?.length > 0 && (
                  <div className="glass-card" style={{ padding: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>🏁 Key Milestones</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {result.milestones.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 24, height: 24, background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>{i+1}</div>
                          <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {SECTIONS.map(({ key, label, color }) => result[key] && (
                  <div key={key} className="glass-card" style={{ padding: "18px 22px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: color || "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{label}</div>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>{result[key]}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
