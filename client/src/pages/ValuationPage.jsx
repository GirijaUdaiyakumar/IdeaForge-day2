import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmtCurrency = n => {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${n.toLocaleString()}`;
};

const MODELS = [
  { id: "arr",      label: "ARR Multiple",   desc: "Annual Recurring Revenue × multiplier" },
  { id: "dcf",      label: "DCF",            desc: "Discounted Cash Flow" },
  { id: "berkus",   label: "Berkus Method",  desc: "Pre-revenue startup scoring" },
  { id: "scorecard",label: "Scorecard",      desc: "Comparable startup scoring" },
];

export default function ValuationPage() {
  const [model, setModel] = useState("arr");
  const [inputs, setInputs] = useState({
    mrr: "", growth: "15", margin: "70", multiple: "8",
    idea: "2000000", team: "1500000", product: "1000000", market: "2500000", traction: "2000000",
    burnRate: "", runway: "18", fundingTarget: "",
  });
  const set = f => e => setInputs(p => ({ ...p, [f]: e.target.value }));

  const valuation = useMemo(() => {
    const mrr = Number(inputs.mrr) || 0;
    const arr = mrr * 12;
    const multiple = Number(inputs.multiple) || 8;
    const growth = Number(inputs.growth) / 100;
    const margin = Number(inputs.margin) / 100;

    if (model === "arr")      return arr * multiple;
    if (model === "berkus")   return Number(inputs.idea) + Number(inputs.team) + Number(inputs.product) + Number(inputs.market) + Number(inputs.traction);
    if (model === "dcf") {
      let total = 0;
      let rev = arr;
      for (let y = 1; y <= 5; y++) { rev *= (1 + growth); total += (rev * margin) / Math.pow(1.12, y); }
      return total * multiple * 0.5;
    }
    if (model === "scorecard") return 1500000 * (Number(inputs.team) / 1500000) * (Number(inputs.market) / 2500000) * (multiple / 5);
    return 0;
  }, [model, inputs]);

  // Projection data
  const projectionData = useMemo(() => {
    const mrr = Number(inputs.mrr) || 100000;
    const growth = Number(inputs.growth) / 100;
    return Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      MRR: Math.round(mrr * Math.pow(1 + growth / 12, i + 1)),
      Valuation: Math.round(mrr * Math.pow(1 + growth / 12, i + 1) * 12 * Number(inputs.multiple || 8)),
    }));
  }, [inputs.mrr, inputs.growth, inputs.multiple]);

  const SLIDER = ({ label, field, min, max, unit = "" }) => (
    <div className="form-group">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label className="label-text" style={{ marginBottom: 0 }}>{label}</label>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{inputs[field]}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={inputs[field] || min}
        onChange={set(field)}
        style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer" }} />
    </div>
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">💎 Startup Valuation</h1>
        <p className="page-subtitle">Interactive valuation calculator using multiple methodologies</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }} className="ai-page-grid">
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Model selector */}
          <div className="glass-card" style={{ padding: 22 }}>
            <label className="label-text">Valuation Method</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {MODELS.map(m => (
                <button key={m.id} onClick={() => setModel(m.id)}
                  style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: model === m.id ? "rgba(245,158,11,0.12)" : "var(--glass-1)", border: `1px solid ${model === m.id ? "rgba(245,158,11,0.3)" : "var(--border-subtle)"}`, cursor: "pointer", textAlign: "left", transition: "var(--transition-fast)" }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: model === m.id ? "var(--gold)" : "var(--text-primary)", marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="glass-card" style={{ padding: 22 }}>
            {model === "arr" && (<>
              <div className="form-group"><label className="label-text">Monthly Recurring Revenue (₹)</label><input className="input-field" type="number" placeholder="e.g. 500000" value={inputs.mrr} onChange={set("mrr")} /></div>
              <SLIDER label="Monthly Growth Rate" field="growth" min={1} max={100} unit="%" />
              <SLIDER label="Gross Margin" field="margin" min={20} max={95} unit="%" />
              <SLIDER label="ARR Multiple" field="multiple" min={2} max={30} />
            </>)}
            {model === "berkus" && (<>
              {[["Idea/Concept","idea"],["Team","team"],["Product/Prototype","product"],["Market/Sales","market"],["Traction","traction"]].map(([l,f]) => (
                <div key={f} className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label className="label-text" style={{ marginBottom: 0 }}>{l}</label>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)" }}>{fmtCurrency(Number(inputs[f]) || 0)}</span>
                  </div>
                  <input type="range" min={0} max={5000000} step={100000} value={inputs[f] || 0} onChange={set(f)}
                    style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer" }} />
                </div>
              ))}
            </>)}
            {(model === "dcf" || model === "scorecard") && (<>
              <div className="form-group"><label className="label-text">Monthly Recurring Revenue (₹)</label><input className="input-field" type="number" placeholder="e.g. 500000" value={inputs.mrr} onChange={set("mrr")} /></div>
              <SLIDER label="Annual Growth Rate" field="growth" min={10} max={300} unit="%" />
              <SLIDER label="Net Margin" field="margin" min={10} max={80} unit="%" />
              <SLIDER label="Exit Multiple" field="multiple" min={3} max={25} />
            </>)}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Valuation hero */}
          <motion.div className="luxury-card" style={{ padding: 32, textAlign: "center" }} key={valuation}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              ESTIMATED VALUATION
            </div>
            <motion.div
              key={Math.round(valuation)}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 52, color: "var(--gold)", lineHeight: 1, marginBottom: 8 }}
            >
              {fmtCurrency(Math.round(valuation))}
            </motion.div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
              {MODELS.find(m => m.id === model)?.label} Method
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20 }}>
              {[
                { label: "Conservative",  mult: 0.7  },
                { label: "Base",          mult: 1    },
                { label: "Optimistic",    mult: 1.4  },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: s.mult === 1 ? "var(--gold)" : "var(--text-secondary)" }}>
                    {fmtCurrency(Math.round(valuation * s.mult))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chart */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>
              12-Month Valuation Trajectory
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={projectionData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip formatter={(v, n) => [fmtCurrency(v), n]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                <Area type="monotone" dataKey="Valuation" stroke="#f59e0b" fill="url(#valGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key metrics */}
          {inputs.mrr && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {[
                { label: "ARR", value: fmtCurrency((Number(inputs.mrr)||0) * 12), icon: "📈" },
                { label: "MRR Multiple", value: `${inputs.multiple}x`, icon: "⚡" },
                { label: "Valuation/ARR", value: `${inputs.multiple}x`, icon: "💎" },
              ].map(m => (
                <div key={m.label} className="glass-card" style={{ padding: 18, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
