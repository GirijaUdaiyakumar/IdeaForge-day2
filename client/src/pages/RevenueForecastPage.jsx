import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import api from "../services/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", fontSize: 13 }}>
        <div style={{ color: "#f9fafb", fontWeight: 600, marginBottom: 6 }}>{label}</div>
        {payload.map((p) => <div key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? `$${p.value.toLocaleString()}` : p.value}</div>)}
      </div>
    );
  }
  return null;
};

export default function RevenueForecastPage() {
  const [form, setForm] = useState({ startup: "", revenueModel: "subscription", initialPrice: "", initialUsers: "", growthRate: "20" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const buildChartData = (data) => {
    if (!data?.monthlyProjections) return [];
    return data.monthlyProjections.map((m, i) => ({
      month: `M${i + 1}`,
      Revenue: Math.round(m.revenue || 0),
      Users: Math.round(m.users || 0),
      Profit: Math.round(m.profit || 0),
    }));
  };

  const handleForecast = async () => {
    if (!form.startup.trim()) { toast.error("Please describe your startup"); return; }
    setLoading(true); setResult(null);
    try {
      const prompt = `Generate a 12-month revenue forecast for:
Startup: "${form.startup}"
Revenue Model: ${form.revenueModel}
Initial Price: $${form.initialPrice || "50"}/month
Initial Users: ${form.initialUsers || "10"}
Monthly Growth Rate: ${form.growthRate}%

Return ONLY valid JSON:
{
  "monthlyProjections": [
    {"month": 1, "users": 0, "revenue": 0, "expenses": 0, "profit": 0},
    ... (12 months total)
  ],
  "summary": {
    "totalYear1Revenue": 0,
    "averageMonthlyGrowth": "X%",
    "breakEvenMonth": "Month X",
    "endOfYearUsers": 0,
    "endOfYearMRR": 0,
    "annualRecurringRevenue": 0
  },
  "assumptions": ["assumption1", "assumption2"],
  "risks": ["risk1", "risk2"],
  "opportunities": ["opportunity1", "opportunity2"]
}`;
      const res = await api.post("/ai/freeform", { prompt });
      if (res.data.success) {
        setResult(res.data.data);
        setChartData(buildChartData(res.data.data));
        toast.success("Revenue forecast generated! 📈");
      } else toast.error("Forecast failed");
    } catch { toast.error("Failed to generate forecast"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📈 Revenue Forecast</h1>
        <p className="page-subtitle">AI-powered 12-month revenue projections for your startup</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>
        {/* Input */}
        <div className="glass-card" style={{ padding: 28, height: "fit-content" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Forecast Parameters</h3>
          <div className="form-group">
            <label className="label-text">Startup Description *</label>
            <textarea className="textarea-field" rows={3} placeholder="What does your startup do?" value={form.startup} onChange={set("startup")} />
          </div>
          <div className="form-group">
            <label className="label-text">Revenue Model</label>
            <select className="input-field" value={form.revenueModel} onChange={set("revenueModel")} style={{ cursor: "pointer" }}>
              {[["subscription","SaaS Subscription"],["marketplace","Marketplace (% fee)"],["ecommerce","E-commerce"],["enterprise","Enterprise Licensing"],["freemium","Freemium"],["ads","Advertising"]].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="label-text">Price ($/mo)</label>
              <input className="input-field" type="number" placeholder="49" value={form.initialPrice} onChange={set("initialPrice")} />
            </div>
            <div className="form-group">
              <label className="label-text">Initial Users</label>
              <input className="input-field" type="number" placeholder="10" value={form.initialUsers} onChange={set("initialUsers")} />
            </div>
          </div>
          <div className="form-group">
            <label className="label-text">Monthly Growth Rate (%)</label>
            <input className="input-field" type="number" placeholder="20" value={form.growthRate} onChange={set("growthRate")} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={handleForecast} disabled={loading}>
            {loading ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />Forecasting...</span> : "📈 Generate Forecast"}
          </button>
        </div>

        {/* Results */}
        <div>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <div key="empty" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📈</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Revenue Forecast</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 340 }}>Enter your startup parameters and get a 12-month revenue projection with charts.</p>
              </div>
            )}
            {loading && (
              <div key="loading" className="glass-card" style={{ padding: 48, textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <div style={{ width: 64, height: 64, border: "3px solid var(--border-default)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Building your financial model...</div>
              </div>
            )}
            {result && !loading && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Summary KPIs */}
                {result.summary && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                    {[
                      ["Year 1 Revenue", result.summary.totalYear1Revenue ? `$${Number(result.summary.totalYear1Revenue).toLocaleString()}` : result.summary.totalYear1Revenue],
                      ["End of Year MRR", result.summary.endOfYearMRR ? `$${Number(result.summary.endOfYearMRR).toLocaleString()}` : result.summary.endOfYearMRR],
                      ["Break-Even", result.summary.breakEvenMonth],
                      ["ARR", result.summary.annualRecurringRevenue ? `$${Number(result.summary.annualRecurringRevenue).toLocaleString()}` : result.summary.annualRecurringRevenue],
                      ["Year-End Users", result.summary.endOfYearUsers?.toLocaleString()],
                      ["Avg Monthly Growth", result.summary.averageMonthlyGrowth],
                    ].map(([l, v]) => v && (
                      <div key={l} className="stat-card" style={{ padding: "18px 20px" }}>
                        <div className="stat-label">{l}</div>
                        <div className="stat-value" style={{ color: "var(--gold)", fontSize: 22, marginTop: 6 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Revenue Chart */}
                {chartData.length > 0 && (
                  <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>12-Month Revenue Projection</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                        <Area type="monotone" dataKey="Revenue" stroke="#f59e0b" fill="url(#revenueGrad)" strokeWidth={2} />
                        <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Assumptions, Risks, Opportunities */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  {[
                    { key: "assumptions", label: "Assumptions", color: "var(--blue)", icon: "📐" },
                    { key: "risks", label: "Key Risks", color: "var(--red)", icon: "⚠️" },
                    { key: "opportunities", label: "Opportunities", color: "var(--emerald)", icon: "💡" },
                  ].map(({ key, label, color, icon }) => result[key]?.length > 0 && (
                    <div key={key} className="glass-card" style={{ padding: 18 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color, marginBottom: 12 }}>{icon} {label}</div>
                      {result[key].map((item, i) => <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 7, lineHeight: 1.5 }}>• {item}</div>)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
