import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { RiAddLine, RiDeleteBin6Line, RiDragMoveLine } from "react-icons/ri";

const COLUMN_CONFIG = [
  { id: "ideas",     label: "💡 Ideas",     color: "var(--purple)" },
  { id: "research",  label: "🔍 Research",  color: "var(--blue)" },
  { id: "building",  label: "🏗️ Building", color: "var(--gold)" },
  { id: "testing",   label: "🧪 Testing",   color: "var(--orange)" },
  { id: "launching", label: "🚀 Launching", color: "var(--emerald)" },
  { id: "done",      label: "✅ Done",      color: "var(--emerald)" },
];

const SAMPLE = {
  ideas:    [{ id: "1", title: "AI crop monitoring platform", tag: "AgriTech" },{ id: "2", title: "Mental health chatbot for Gen Z", tag: "HealthTech" }],
  research: [{ id: "3", title: "Competitor analysis — EduTech market", tag: "Research" }],
  building: [{ id: "4", title: "MVP landing page", tag: "Development" },{ id: "5", title: "API integration with Groq", tag: "Development" }],
  testing:  [{ id: "6", title: "Beta user onboarding flow", tag: "UX" }],
  launching:[],
  done:     [{ id: "7", title: "Market validation survey", tag: "Validation" }],
};

let nextId = 100;

export default function KanbanPage() {
  const [columns, setColumns] = useState(SAMPLE);
  const [addingTo, setAddingTo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState("");
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const addCard = (colId) => {
    if (!newTitle.trim()) { toast.error("Enter a task title"); return; }
    setColumns(prev => ({
      ...prev,
      [colId]: [...prev[colId], { id: String(++nextId), title: newTitle.trim(), tag: newTag.trim() || "General" }],
    }));
    setNewTitle(""); setNewTag(""); setAddingTo(null);
    toast.success("Card added!");
  };

  const deleteCard = (colId, cardId) => {
    setColumns(prev => ({ ...prev, [colId]: prev[colId].filter(c => c.id !== cardId) }));
  };

  const handleDragStart = (colId, card) => setDragging({ colId, card });
  const handleDragOver = (e, colId) => { e.preventDefault(); setDragOver(colId); };
  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!dragging || dragging.colId === targetColId) { setDragging(null); setDragOver(null); return; }
    setColumns(prev => ({
      ...prev,
      [dragging.colId]: prev[dragging.colId].filter(c => c.id !== dragging.card.id),
      [targetColId]: [...prev[targetColId], dragging.card],
    }));
    setDragging(null); setDragOver(null);
    toast.success("Card moved!");
  };

  const totalCards = Object.values(columns).reduce((s, col) => s + col.length, 0);
  const doneCards  = columns.done.length;

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">📋 Startup Projects</h1>
          <p className="page-subtitle">{totalCards} tasks · {doneCards} completed</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Drag cards between columns</span>
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 16, minHeight: 500 }}>
        {COLUMN_CONFIG.map(col => {
          const cards = columns[col.id] || [];
          const isOver = dragOver === col.id;
          return (
            <div key={col.id} style={{ flexShrink: 0, width: 260 }}
              onDragOver={e => handleDragOver(e, col.id)}
              onDrop={e => handleDrop(e, col.id)}>
              {/* Column header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "var(--glass-2)", border: `1px solid ${isOver ? col.color : "var(--border-default)"}`, borderRadius: "var(--radius-md)", transition: "border-color 0.2s" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{col.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: `${col.color}18`, color: col.color, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{cards.length}</span>
                  <button className="btn btn-ghost btn-sm" style={{ padding: "3px 6px" }} onClick={() => { setAddingTo(col.id); setNewTitle(""); setNewTag(""); }}><RiAddLine /></button>
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 80, padding: isOver ? 4 : 0, borderRadius: "var(--radius-md)", background: isOver ? `${col.color}08` : "transparent", transition: "background 0.2s" }}>
                <AnimatePresence>
                  {cards.map(card => (
                    <motion.div key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      draggable
                      onDragStart={() => handleDragStart(col.id, card)}
                      style={{ background: "var(--glass-2)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "12px 14px", cursor: "grab", position: "relative" }}
                      whileHover={{ borderColor: col.color, y: -2 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 6 }}>{card.title}</div>
                          <span style={{ fontSize: 10, padding: "2px 8px", background: `${col.color}15`, color: col.color, borderRadius: "var(--radius-full)", border: `1px solid ${col.color}25` }}>{card.tag}</span>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ padding: "2px 4px", opacity: 0.5, flexShrink: 0 }} onClick={() => deleteCard(col.id, card.id)}>
                          <RiDeleteBin6Line style={{ fontSize: 12 }} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add card inline */}
                <AnimatePresence>
                  {addingTo === col.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      style={{ background: "var(--glass-3)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: 12 }}>
                      <input className="input-field" style={{ marginBottom: 8, fontSize: 13 }} placeholder="Task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") addCard(col.id); if (e.key === "Escape") setAddingTo(null); }}
                        autoFocus />
                      <input className="input-field" style={{ marginBottom: 10, fontSize: 12 }} placeholder="Tag (optional)" value={newTag} onChange={e => setNewTag(e.target.value)} />
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => addCard(col.id)}>Add</button>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => setAddingTo(null)}>Cancel</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {addingTo !== col.id && cards.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 12 }}>Drop cards here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
