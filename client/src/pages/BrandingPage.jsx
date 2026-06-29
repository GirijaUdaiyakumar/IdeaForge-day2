import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import api from "../services/api";
import { RiRefreshLine, RiFileCopyLine, RiCheckLine } from "react-icons/ri";

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--emerald)" : "var(--text-muted)", fontSize: 14 }}>
      {copied ? <RiCheckLine /> : <RiFileCopyLine />}
    </button>
  );
}

export default function BrandingPage() {
  const [desc, setDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!desc.trim()) { toast.error("Describe your startup idea"); return; }
    setLoading(true); setResult(null);
    try {
      const prompt = `Generate a complete brand identity for a startup:
Description: "${desc}"
Industry: ${industry || "Technology"}

Return ONLY valid JSON:
{
  "names": ["Name1","Name2","Name3","Name4","Name5"],
  "taglines": ["Tagline for Name1","Tagline for Name2","Tagline for Name3"],
  "mission": "One powerful mission statement",
  "vision": "Inspiring 5-year vision statement",
  "brandPersonality": ["trait1","trait2","trait3"],
  "targetAudience": "Primary target audience description",
  "colorPalette": [
    {"name":"Primary","hex":"#f59e0b","role":"Main brand color"},
    {"name":"Secondary","hex":"#111827","role":"Background"},
    {"name":"Accent","hex":"#10b981","role":"CTAs and highlights"},
    {"name":"Text","hex":"#f9fafb","role":"Body text"}
  ],
  "typography": {
    "display": "Font name for headlines",
    "body": "Font name for body text",
    "rationale": "Why these fonts work"
  },
  "domains": ["name1.com","name1.ai","name1.io","name2.com","name2.ai"],
  "logoStyle": "Description of recommended logo style",
  "brandVoice": "Description of brand voice and tone"
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setResult(res.data.data); toast.success("Brand identity generated! 🎨"); }
      else toast.error("Generation failed");
    } catch { toast.error("Failed to generate brand identity"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🎨 AI Branding Studio</h1>
        <p className="page-subtitle">Generate business names, taglines, mission, vision, colors and typography</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 24, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Startup Details</h3>
          <div className="form-group">
            <label className="label-text">What does your startup do? *</label>
            <textarea className="textarea-field" rows={5} placeholder="We help farmers monitor crop health using AI and satellite imagery..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label-text">Industry</label>
            <input className="input-field" placeholder="e.g. AgriTech, Fintech, HealthTech" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleGenerate} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Generating...</span> : "🎨 Generate Brand Identity"}
          </button>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎨</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>AI Branding Studio</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 360 }}>Generate a complete brand identity including names, taglines, mission, vision, colors, and fonts.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 48, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Crafting your brand...</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Names */}
                {result.names?.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏷️ Brand Names</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {result.names.map((name, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: i === 0 ? "rgba(245,158,11,0.1)" : "var(--glass-1)", border: `1px solid ${i === 0 ? "rgba(245,158,11,0.25)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-md)" }}>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: i === 0 ? "var(--gold)" : "var(--text-primary)" }}>{name}</div>
                            {result.taglines?.[i] && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{result.taglines[i]}</div>}
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {i === 0 && <span className="badge badge-gold" style={{ fontSize: 10 }}>TOP PICK</span>}
                            <CopyBtn text={name} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mission & Vision */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {result.mission && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>🎯 Mission</div>
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{result.mission}</p>
                    </div>
                  )}
                  {result.vision && (
                    <div className="glass-card" style={{ padding: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>🔭 Vision</div>
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{result.vision}</p>
                    </div>
                  )}
                </div>

                {/* Color Palette */}
                {result.colorPalette?.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🎨 Color Palette</div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {result.colorPalette.map((c, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
                          <div style={{ width: 64, height: 64, borderRadius: "var(--radius-md)", background: c.hex, border: "2px solid rgba(255,255,255,0.1)", boxShadow: `0 4px 20px ${c.hex}40` }} />
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700 }}>{c.hex}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.name}</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typography */}
                {result.typography && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🔤 Typography</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div style={{ background: "var(--glass-1)", borderRadius: "var(--radius-md)", padding: 14 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>DISPLAY / HEADINGS</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{result.typography.display}</div>
                      </div>
                      <div style={{ background: "var(--glass-1)", borderRadius: "var(--radius-md)", padding: 14 }}>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>BODY / CONTENT</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{result.typography.body}</div>
                      </div>
                    </div>
                    {result.typography.rationale && <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10, lineHeight: 1.6 }}>{result.typography.rationale}</p>}
                  </div>
                )}

                {/* Domain suggestions */}
                {result.domains?.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🌐 Domain Suggestions</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {result.domains.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "var(--glass-2)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-full)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                          {d}
                          <CopyBtn text={d} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand voice & personality */}
                {(result.brandVoice || result.brandPersonality?.length) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {result.brandPersonality?.length > 0 && (
                      <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--emerald)", textTransform: "uppercase", marginBottom: 10 }}>Personality Traits</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {result.brandPersonality.map((t, i) => <span key={i} className="badge badge-emerald" style={{ fontSize: 11 }}>{t}</span>)}
                        </div>
                      </div>
                    )}
                    {result.brandVoice && (
                      <div className="glass-card" style={{ padding: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", textTransform: "uppercase", marginBottom: 10 }}>Brand Voice</div>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{result.brandVoice}</p>
                      </div>
                    )}
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
