import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import api from "../services/api";
import { RiRobot2Line, RiSaveLine, RiRefreshLine } from "react-icons/ri";

const BLOCKS = [
  { key: "keyPartners",        label: "Key Partners",         icon: "🤝", color: "#8b5cf6", span: 1 },
  { key: "keyActivities",      label: "Key Activities",       icon: "⚙️", color: "#3b82f6", span: 1 },
  { key: "valuePropositions",  label: "Value Propositions",   icon: "💎", color: "#f59e0b", span: 1, featured: true },
  { key: "customerRelationships",label:"Customer Relationships",icon:"❤️",color: "#ef4444", span: 1 },
  { key: "customerSegments",   label: "Customer Segments",    icon: "👥", color: "#10b981", span: 1 },
  { key: "keyResources",       label: "Key Resources",        icon: "🔑", color: "#06b6d4", span: 1 },
  { key: "channels",           label: "Channels",             icon: "📣", color: "#f97316", span: 1 },
  { key: "costStructure",      label: "Cost Structure",       icon: "💸", color: "#6b7280", span: 1 },
  { key: "revenueStreams",      label: "Revenue Streams",      icon: "💰", color: "#10b981", span: 1 },
];

const SAMPLE = {
  keyPartners: "• Cloud infrastructure (AWS)\n• Payment gateway (Razorpay)\n• Data providers",
  keyActivities: "• Platform development\n• AI model training\n• Customer support\n• Marketing",
  valuePropositions: "• Save 10+ hours/week on startup research\n• AI-powered market insights\n• Investor-ready outputs in minutes",
  customerRelationships: "• Self-serve onboarding\n• AI mentor chat 24/7\n• Email newsletter",
  customerSegments: "• Early-stage founders\n• Startup students\n• Accelerator cohorts\n• Side-project builders",
  keyResources: "• AI/ML models (Groq)\n• MongoDB database\n• Engineering team\n• Brand & community",
  channels: "• Website & SEO\n• Product Hunt launch\n• LinkedIn & Twitter\n• Referral program",
  costStructure: "• Engineering salaries (60%)\n• AI API costs (15%)\n• Marketing (15%)\n• Infrastructure (10%)",
  revenueStreams: "• Free plan (lead gen)\n• Pro ₹499/month\n• Business ₹1,999/month\n• Enterprise custom",
};

export default function CanvasPage() {
  const [canvas, setCanvas] = useState(SAMPLE);
  const [editing, setEditing] = useState(null);
  const [startup, setStartup] = useState("");
  const [generating, setGenerating] = useState(false);

  const set = key => e => setCanvas(p => ({ ...p, [key]: e.target.value }));

  const generateWithAI = async () => {
    if (!startup.trim()) { toast.error("Describe your startup first"); return; }
    setGenerating(true);
    try {
      const prompt = `Generate a complete Business Model Canvas for: "${startup}"
Return ONLY valid JSON with these exact keys:
{
  "keyPartners": "bullet points",
  "keyActivities": "bullet points",
  "valuePropositions": "bullet points",
  "customerRelationships": "bullet points",
  "customerSegments": "bullet points",
  "keyResources": "bullet points",
  "channels": "bullet points",
  "costStructure": "bullet points",
  "revenueStreams": "bullet points"
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) { setCanvas(res.data.data); toast.success("Business Model Canvas generated! 🎯"); }
      else toast.error("Generation failed");
    } catch { toast.error("Failed"); }
    finally { setGenerating(false); }
  };

  const handleSave = () => toast.success("Canvas saved to workspace! ✅");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 className="page-title">🗂️ Business Model Canvas</h1>
          <p className="page-subtitle">Visualize your entire business model in one interactive canvas</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleSave}><RiSaveLine /> Save</button>
        </div>
      </div>

      {/* AI Generate bar */}
      <div className="glass-card" style={{ padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
        <RiRobot2Line style={{ color: "var(--gold)", fontSize: 18, flexShrink: 0 }} />
        <input className="input-field" style={{ flex: 1 }} placeholder="Describe your startup and let AI fill the canvas..." value={startup} onChange={e => setStartup(e.target.value)}
          onKeyDown={e => e.key === "Enter" && generateWithAI()} />
        <button className="btn btn-primary btn-sm" onClick={generateWithAI} disabled={generating} style={{ flexShrink: 0 }}>
          {generating ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span className="spin" style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Generating...</span> : <><RiRobot2Line /> AI Fill Canvas</>}
        </button>
      </div>

      {/* Canvas grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 12 }}>
        {/* Row 1: KP | KA | VP | CR | CS */}
        {["keyPartners","keyActivities","valuePropositions","customerRelationships","customerSegments"].map(key => {
          const block = BLOCKS.find(b => b.key === key);
          return (
            <CanvasBlock key={key} block={block} value={canvas[key] || ""} editing={editing === key}
              onEdit={() => setEditing(key)} onBlur={() => setEditing(null)} onChange={set(key)} />
          );
        })}

        {/* Row 2: KR under KP | CH under CR | blank | blank | same as CS */}
        <div style={{ gridColumn: "2", gridRow: "2" }}>
          <CanvasBlock block={BLOCKS.find(b => b.key === "keyResources")} value={canvas.keyResources || ""}
            editing={editing === "keyResources"} onEdit={() => setEditing("keyResources")} onBlur={() => setEditing(null)} onChange={set("keyResources")} />
        </div>
        <div style={{ gridColumn: "4", gridRow: "2" }}>
          <CanvasBlock block={BLOCKS.find(b => b.key === "channels")} value={canvas.channels || ""}
            editing={editing === "channels"} onEdit={() => setEditing("channels")} onBlur={() => setEditing(null)} onChange={set("channels")} />
        </div>
      </div>

      {/* Cost + Revenue row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        {["costStructure","revenueStreams"].map(key => {
          const block = BLOCKS.find(b => b.key === key);
          return (
            <CanvasBlock key={key} block={block} value={canvas[key] || ""} editing={editing === key}
              onEdit={() => setEditing(key)} onBlur={() => setEditing(null)} onChange={set(key)} />
          );
        })}
      </div>
    </DashboardLayout>
  );
}

function CanvasBlock({ block, value, editing, onEdit, onBlur, onChange }) {
  if (!block) return null;
  return (
    <motion.div
      whileHover={{ borderColor: `${block.color}40` }}
      style={{ background: "var(--glass-2)", border: `1px solid ${editing ? block.color + "50" : "var(--border-default)"}`, borderRadius: "var(--radius-md)", padding: 14, minHeight: 140, cursor: "pointer", transition: "border-color 0.2s", position: "relative" }}
      onClick={onEdit}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>{block.icon}</span>
        <div style={{ fontSize: 11, fontWeight: 700, color: block.color, textTransform: "uppercase", letterSpacing: "0.07em" }}>{block.label}</div>
      </div>
      {editing ? (
        <textarea
          autoFocus
          className="textarea-field"
          style={{ width: "100%", minHeight: 90, fontSize: 12, padding: 8, background: "var(--glass-1)" }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {value || <span style={{ fontStyle: "italic", opacity: 0.5 }}>Click to edit...</span>}
        </div>
      )}
    </motion.div>
  );
}
