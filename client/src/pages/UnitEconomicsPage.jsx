import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const fmt = (n, prefix = "₹") => {
  if (!n || isNaN(n)) return "—";
  if (n >= 10000000) return `${prefix}${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `${prefix}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `${prefix}${(n / 1000).toFixed(1)}K`;
  return `${prefix}${Number(n).toFixed(0)}`;
};

const fmtPct = n => isNaN(n) || !isFinite(n) ? "—" : `${Number(n).toFixed(1)}%`;
const fmtX   = n => isNaN(n) || !isFinite(n) ? "—" : `${Number(n).toFixed(2)}x`;

export default function UnitEconomicsPage() {
  const [inputs, setInputs] = useState({
    mrr: "500000", customers: "100", churnRate: "5", avgRevenue: "5000",
    salesMktCost: "200000", supportCost: "50000", cogsPerUser: "500",
    devCost: "800000", opsCost: "300000", salaries: "600000",
    fundingRaised: "5000000",
  });
  const set = f => e => setInputs(p => ({ ...p, [f]: e.target.value }));

  const metrics = useMemo(() => {
    const mrr         = +inputs.mrr          || 0;
    const arr         = mrr * 12;
    const customers   = +inputs.customers    || 1;
    const churn       = (+inputs.churnRate   || 0) / 100;
    const avgRev      = +inputs.avgRevenue   || mrr / customers;
    const salesMkt    = +inputs.salesMktCost || 0;
    const support     = +inputs.supportCost  || 0;
    const cogs        = +inputs.cogsPerUser  || 0;
    const dev         = +inputs.devCost      || 0;
    const ops         = +inputs.opsCost      || 0;
    const salaries    = +inputs.salaries     || 0;
    const funding     = +inputs.fundingRaised|| 0;

    const cac         = customers > 0 ? (salesMkt + support) / customers : 0;
    const ltv         = churn > 0 ? avgRev / churn : avgRev * 24;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    const grossMargin = avgRev > 0 ? ((avgRev - cogs) / avgRev) * 100 : 0;
    const totalBurn   = dev + ops + salaries + salesMkt;
    const netBurn     = totalBurn - mrr;
    const runway      = netBurn > 0 && funding > 0 ? funding / netBurn : 0;
    const burnMultiple= mrr > 0 ? netBurn / mrr : 0;
    const roi         = salesMkt > 0 ? ((ltv - cac) / cac) * 100 : 0;
    const paybackMo   = avgRev > 0 ? cac / avgRev : 0;

    return { arr, mrr, cac, ltv, ltvCacRatio, grossMargin, totalBurn, netBurn, runway, burnMultiple, roi, paybackMo };
  }, [inputs]);

  const HEALTH = (v, good, warn) => v >= good ? "var(--emerald)" : v >= warn ? "var(--gold)" : "var(--red)";

  const KPI = ({ label, value, sub, color, tooltip }) => (
    <motion.div className="stat-card" whileHover={{ y: -3 }} style={{ cursor: "default" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: color || "var(--text-primary)", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>}
    </motion.div>
  );

  const burnData = [
    { name: "Dev", value: +inputs.devCost  || 0, fill: "#8b5cf6" },
    { name: "Ops", value: +inputs.opsCost  || 0, fill: "#3b82f6" },
    { name: "Team",value: +inputs.salaries || 0, fill: "#f59e0b" },
    { name: "Mktg",value: +inputs.salesMktCost || 0, fill: "#10b981" },
  ].filter(d => d.value > 0);

  const [activeInput, setActiveInput] = useState("revenue");

  const INPUT_GROUPS = {
    revenue: [
      { f: "mrr",        label: "MRR (₹)", ph: "500000" },
      { f: "customers",  label: "Active Customers", ph: "100" },
      { f: "avgRevenue", label: "Avg Revenue / Customer (₹)", ph: "5000" },
      { f: "churnRate",  label: "Monthly Churn Rate (%)", ph: "5" },
    ],
    costs: [
      { f: "cogsPerUser",  label: "COGS per User (₹)", ph: "500" },
      { f: "salesMktCost", label: "Sales & Marketing (₹/mo)", ph: "200000" },
      { f: "supportCost",  label: "Support Cost (₹/mo)", ph: "50000" },
    ],
    burn: [
      { f: "devCost",       label: "Engineering (₹/mo)", ph: "800000" },
      { f: "opsCost",       label: "Operations (₹/mo)", ph: "300000" },
      { f: "salaries",      label: "Salaries (₹/mo)", ph: "600000" },
      { f: "fundingRaised", label: "Funding Raised (₹)", ph: "5000000" },
    ],
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📐 Unit Economics</h1>
        <p className="page-subtitle">CAC, LTV, Gross Margin, Burn Rate, Runway — all in one place</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }} className="ai-page-grid">
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 6 }}>
            {[["revenue","Revenue"],["costs","Costs"],["burn","Burn"]].map(([k,l]) => (
              <button key={k} onClick={() => setActiveInput(k)}
                style={{ flex: 1, padding: "8px 0", borderRadius: "var(--radius-sm)", background: activeInput === k ? "rgba(245,158,11,0.15)" : "var(--glass-2)", border: `1px solid ${activeInput === k ? "rgba(245,158,11,0.3)" : "var(--border-subtle)"}`, cursor: "pointer", fontSize: 12, fontWeight: 600, color: activeInput === k ? "var(--gold)" : "var(--text-muted)", transition: "var(--transition-fast)" }}>
                {l}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 22 }}>
            {INPUT_GROUPS[activeInput].map(({ f, label, ph }) => (
              <div key={f} className="form-group">
                <label className="label-text">{label}</label>
                <input className="input-field" type="number" placeholder={ph} value={inputs[f]} onChange={set(f)} />
              </div>
            ))}
          </div>

          {/* Benchmark guide */}
          <div className="glass-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase" }}>Benchmarks</div>
            {[["LTV/CAC", "> 3x", "var(--emerald)"], ["Gross Margin", "> 60%", "var(--emerald)"], ["Churn", "< 5%/mo", "var(--emerald)"], ["Burn Multiple", "< 1.5x", "var(--emerald)"], ["Runway", "> 18mo", "var(--emerald)"]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "5px 0", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)" }}>{l}</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* KPI grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            <KPI label="ARR"          value={fmt(metrics.arr)}   sub="Annual Recurring Revenue" color="var(--gold)" />
            <KPI label="CAC"          value={fmt(metrics.cac)}   sub="Customer Acquisition Cost" color={HEALTH(100000/Math.max(metrics.cac,1), 0.5, 0.3)} />
            <KPI label="LTV"          value={fmt(metrics.ltv)}   sub="Lifetime Value" color="var(--emerald)" />
            <KPI label="LTV/CAC"      value={fmtX(metrics.ltvCacRatio)} sub={metrics.ltvCacRatio >= 3 ? "✅ Healthy" : "⚠️ Needs work"} color={HEALTH(metrics.ltvCacRatio, 3, 1.5)} />
            <KPI label="Gross Margin" value={fmtPct(metrics.grossMargin)} sub={metrics.grossMargin >= 60 ? "✅ Strong" : "⚠️ Low"} color={HEALTH(metrics.grossMargin, 60, 40)} />
            <KPI label="Payback"      value={metrics.paybackMo > 0 ? `${metrics.paybackMo.toFixed(1)}mo` : "—"} sub="CAC Payback Period" color={HEALTH(24/Math.max(metrics.paybackMo,1), 1, 0.5)} />
            <KPI label="Runway"       value={metrics.runway > 0 ? `${metrics.runway.toFixed(0)}mo` : "—"} sub={metrics.runway >= 18 ? "✅ Healthy" : "⚠️ Raise soon"} color={HEALTH(metrics.runway, 18, 12)} />
            <KPI label="Burn Multiple" value={fmtX(metrics.burnMultiple)} sub={metrics.burnMultiple <= 1.5 ? "✅ Efficient" : "⚠️ High burn"} color={metrics.burnMultiple <= 1.5 ? "var(--emerald)" : metrics.burnMultiple <= 3 ? "var(--gold)" : "var(--red)"} />
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Burn breakdown */}
            <div className="glass-card" style={{ padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Burn Breakdown</div>
              {burnData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={burnData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={4} dataKey="value">
                      {burnData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Pie>
                    <Tooltip formatter={v => [fmt(v), ""]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>Enter cost data</div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                {burnData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.fill }} />
                    {d.name}: {fmt(d.value)}
                  </div>
                ))}
              </div>
            </div>

            {/* LTV vs CAC */}
            <div className="glass-card" style={{ padding: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>LTV vs CAC</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={[{ name: "Economics", CAC: metrics.cac, LTV: metrics.ltv }]} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={v => [fmt(v), ""]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                  <Bar dataKey="CAC" fill="#ef4444" radius={[4,4,0,0]} />
                  <Bar dataKey="LTV" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary card */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📊 Summary Insight</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { label: "Monthly Burn", value: fmt(metrics.totalBurn), ok: metrics.mrr > metrics.totalBurn },
                { label: "Net Burn",     value: fmt(Math.max(0, metrics.netBurn)), ok: metrics.netBurn <= 0 },
                { label: "ROI on Mktg", value: fmtPct(metrics.roi), ok: metrics.roi >= 100 },
              ].map(({ label, value, ok }) => (
                <div key={label} style={{ background: "var(--glass-1)", borderRadius: "var(--radius-sm)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{value}</div>
                  </div>
                  <span style={{ fontSize: 18 }}>{ok ? "✅" : "⚠️"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
