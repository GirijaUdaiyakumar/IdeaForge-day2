import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { RiAddLine, RiDeleteBin6Line, RiEditLine, RiCloseLine, RiCheckLine } from "react-icons/ri";

const STAGES = ["Prospecting","Outreach","Intro Call","Due Diligence","Term Sheet","Closed","Passed"];
const STAGE_COLORS = { "Prospecting":"var(--text-muted)","Outreach":"var(--blue)","Intro Call":"var(--purple)","Due Diligence":"var(--gold)","Term Sheet":"var(--orange)","Closed":"var(--emerald)","Passed":"var(--red)" };
const SAMPLE_INVESTORS = [
  { id: 1, name: "Sequoia Capital India", contact: "Rajan Anandan", email: "ra@sequoia.com", stage: "Intro Call", amount: "₹2Cr", notes: "Interested in B2B SaaS. Follow up after MIS.", lastContact: "2026-06-20" },
  { id: 2, name: "Nexus Venture Partners", contact: "Jishnu Bhattacharjee", email: "j@nexus.com", stage: "Outreach", amount: "₹1.5Cr", notes: "Sent cold email. Awaiting response.", lastContact: "2026-06-25" },
  { id: 3, name: "Blume Ventures", contact: "Karthik Reddy", email: "kr@blume.vc", stage: "Due Diligence", amount: "₹50L", notes: "Shared data room. Revenue verification pending.", lastContact: "2026-06-28" },
  { id: 4, name: "Accel India", contact: "Prayank Swaroop", email: "ps@accel.com", stage: "Passed", amount: "—", notes: "Passed — not the right stage for their fund.", lastContact: "2026-06-15" },
];

let nextId = 100;

export default function InvestorCRMPage() {
  const [investors, setInvestors] = useState(SAMPLE_INVESTORS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", email: "", stage: "Prospecting", amount: "", notes: "" });
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const openAdd = () => { setForm({ name:"", contact:"", email:"", stage:"Prospecting", amount:"", notes:"" }); setEditId(null); setShowForm(true); };
  const openEdit = inv => { setForm({ name: inv.name, contact: inv.contact, email: inv.email, stage: inv.stage, amount: inv.amount, notes: inv.notes }); setEditId(inv.id); setShowForm(true); };

  const saveInvestor = () => {
    if (!form.name.trim()) { toast.error("Investor name required"); return; }
    if (editId) {
      setInvestors(prev => prev.map(i => i.id === editId ? { ...i, ...form, lastContact: new Date().toISOString().split("T")[0] } : i));
      toast.success("Investor updated");
    } else {
      setInvestors(prev => [...prev, { id: ++nextId, ...form, lastContact: new Date().toISOString().split("T")[0] }]);
      toast.success("Investor added!");
    }
    setShowForm(false);
  };

  const deleteInvestor = id => { setInvestors(prev => prev.filter(i => i.id !== id)); toast.success("Removed"); };

  const pipelineValue = investors.filter(i => !["Passed"].includes(i.stage)).length;
  const stageCount = STAGES.reduce((acc, s) => { acc[s] = investors.filter(i => i.stage === s).length; return acc; }, {});

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">💼 Investor CRM</h1>
          <p className="page-subtitle">{investors.length} investors tracked · {pipelineValue} active in pipeline</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><RiAddLine /> Add Investor</button>
      </div>

      {/* Pipeline stages */}
      <div className="glass-card" style={{ padding: "16px 20px", marginBottom: 24, display: "flex", gap: 8, overflowX: "auto" }}>
        {STAGES.map(s => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 90, padding: "8px 12px", background: (stageCount[s] || 0) > 0 ? `${STAGE_COLORS[s]}12` : "transparent", borderRadius: "var(--radius-sm)", border: `1px solid ${(stageCount[s] || 0) > 0 ? `${STAGE_COLORS[s]}30` : "transparent"}` }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: STAGE_COLORS[s] }}>{stageCount[s] || 0}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                {["Investor","Contact","Stage","Target Amount","Last Contact","Notes","Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {investors.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--glass-1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{inv.name}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 13 }}>{inv.contact}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{inv.email}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: "var(--radius-full)", background: `${STAGE_COLORS[inv.stage]}15`, color: STAGE_COLORS[inv.stage], border: `1px solid ${STAGE_COLORS[inv.stage]}25`, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {inv.stage}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{inv.amount}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)" }}>{inv.lastContact}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-muted)", maxWidth: 200 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{inv.notes}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: "5px 8px" }} onClick={() => openEdit(inv)}><RiEditLine /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: "5px 8px" }} onClick={() => deleteInvestor(inv.id)}><RiDeleteBin6Line /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {investors.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
              No investors tracked yet. Add your first investor to start managing your fundraise.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(6px)", padding: 20 }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card" style={{ padding: 32, maxWidth: 520, width: "100%" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                {editId ? "Edit Investor" : "Add Investor"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {[["name","Investor Name","Sequoia Capital"],["contact","Contact Person","Rajan Anandan"],["email","Email","ra@sequoia.com"],["amount","Target Amount","₹2Cr"]].map(([f,l,ph]) => (
                  <div key={f} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label-text">{l}</label>
                    <input className="input-field" placeholder={ph} value={form[f]} onChange={set(f)} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="label-text">Stage</label>
                <select className="input-field" value={form.stage} onChange={set("stage")} style={{ cursor: "pointer" }}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label-text">Notes</label>
                <textarea className="textarea-field" rows={3} placeholder="Meeting notes, follow-up reminders..." value={form.notes} onChange={set("notes")} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}><RiCloseLine /> Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={saveInvestor}><RiCheckLine /> {editId ? "Update" : "Add Investor"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
