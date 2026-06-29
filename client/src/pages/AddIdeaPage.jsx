import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { createIdea, updateIdea, getIdeaById } from "../services/ideaService";
import { RiArrowLeftLine, RiSaveLine, RiFlashlightLine } from "react-icons/ri";

const CATEGORIES = [
  "Fintech","Healthtech","Edtech","AgriTech","ClimaTech","SaaS","AI/ML",
  "E-commerce","Social","Gaming","Logistics","IoT","Blockchain","HR Tech","LegalTech","General",
];

const STATUSES = [
  { value: "draft",     label: "Draft",     color: "var(--text-muted)" },
  { value: "active",    label: "Active",    color: "var(--emerald)" },
  { value: "validated", label: "Validated", color: "var(--blue)" },
  { value: "launched",  label: "Launched",  color: "var(--gold)" },
  { value: "archived",  label: "Archived",  color: "var(--red)" },
];

export default function AddIdeaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "", category: "", problem: "", description: "",
    solution: "", audience: "", revenue: "", status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchIdea = async () => {
      try {
        const res = await getIdeaById(id);
        const d = res.data;
        setForm({
          title:       d.title       || "",
          category:    d.category    || "",
          problem:     d.problem     || "",
          description: d.description || "",
          solution:    d.solution    || "",
          audience:    d.audience    || "",
          revenue:     d.revenue     || "",
          status:      d.status      || "draft",
        });
      } catch {
        toast.error("Failed to load idea");
        navigate("/ideas");
      } finally {
        setFetching(false);
      }
    };
    fetchIdea();
  }, [id, isEdit, navigate]);

  const set = field => e => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim())    { toast.error("Title is required"); return; }
    if (!form.category.trim()) { toast.error("Please select a category"); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await updateIdea(id, form);
        toast.success("Idea updated successfully!");
      } else {
        await createIdea(form);
        toast.success("Idea created! +10 XP 🎉");
      }
      navigate("/ideas");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save idea");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
          <div className="spin" style={{
            width: 44, height: 44,
            border: "3px solid var(--border-default)",
            borderTopColor: "var(--gold)", borderRadius: "50%",
          }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link to="/ideas">
          <button className="btn btn-ghost btn-sm">
            <RiArrowLeftLine /> Back
          </button>
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: 2 }}>
            {isEdit ? "✏️ Edit Idea" : "💡 Add New Idea"}
          </h1>
          <p className="page-subtitle">
            {isEdit ? "Update your startup idea details." : "Document a startup idea in detail."}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}
        className="ai-page-grid">
        {/* Main Form */}
        <motion.div
          className="glass-card"
          style={{ padding: 32 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Row: Title + Category */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">Startup Name *</label>
                <input
                  className="input-field"
                  placeholder="e.g. AgriVision AI"
                  value={form.title}
                  onChange={set("title")}
                  autoFocus
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">Category *</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={set("category")}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label-text">Problem Statement</label>
              <textarea
                className="textarea-field"
                rows={3}
                placeholder="What specific problem does this startup solve? Who suffers from it?"
                value={form.problem}
                onChange={set("problem")}
              />
            </div>

            <div className="form-group">
              <label className="label-text">Solution</label>
              <textarea
                className="textarea-field"
                rows={3}
                placeholder="How does your startup solve the problem uniquely?"
                value={form.solution}
                onChange={set("solution")}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">Target Audience</label>
                <input
                  className="input-field"
                  placeholder="Who are your ideal customers?"
                  value={form.audience}
                  onChange={set("audience")}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-text">Revenue Model</label>
                <input
                  className="input-field"
                  placeholder="e.g. SaaS ₹499/month, Marketplace 5%"
                  value={form.revenue}
                  onChange={set("revenue")}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label-text">Additional Notes</label>
              <textarea
                className="textarea-field"
                rows={3}
                placeholder="Market insights, technical notes, competitor observations..."
                value={form.description}
                onChange={set("description")}
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/ideas")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1, justifyContent: "center" }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="spin" style={{
                      width: 16, height: 16,
                      border: "2px solid rgba(0,0,0,0.3)",
                      borderTopColor: "#000", borderRadius: "50%",
                      display: "inline-block",
                    }} />
                    Saving...
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <RiSaveLine />
                    {isEdit ? "Save Changes" : "Create Idea"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Sidebar: Status + Tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Status */}
          <div className="glass-card" style={{ padding: 22 }}>
            <label className="label-text" style={{ display: "block", marginBottom: 14 }}>
              Status
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: s.value }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: "var(--radius-sm)",
                    background: form.status === s.value ? `${s.color}14` : "var(--glass-1)",
                    border: `1px solid ${form.status === s.value ? `${s.color}30` : "var(--border-subtle)"}`,
                    cursor: "pointer", transition: "var(--transition-fast)",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: s.color, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: form.status === s.value ? 600 : 400,
                    color: form.status === s.value ? s.color : "var(--text-secondary)",
                  }}>
                    {s.label}
                  </span>
                  {form.status === s.value && (
                    <span style={{ marginLeft: "auto", color: s.color, fontSize: 12 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Generator CTA */}
          <div style={{
            background: "linear-gradient(135deg,rgba(245,158,11,0.1),rgba(249,115,22,0.05))",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "var(--radius-lg)", padding: 20,
          }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>⚡</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              Let AI do it for you
            </div>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 14 }}>
              Skip the manual form. Use AI to generate a complete startup analysis instantly.
            </p>
            <Link to="/generate">
              <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                <RiFlashlightLine /> Generate with AI
              </button>
            </Link>
          </div>

          {/* Tips */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
              💡 Tips
            </div>
            {[
              "Be specific about the problem — vague problems get vague solutions.",
              "Name a real target audience (not 'everyone').",
              "Define your revenue model early — it shapes everything.",
            ].map((tip, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, marginBottom: 10,
                fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6,
              }}>
                <span style={{ color: "var(--gold)", flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
