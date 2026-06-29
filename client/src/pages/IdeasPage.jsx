import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import IdeaCard from "../components/IdeaCard";
import { getIdeas, deleteIdea, toggleBookmark } from "../services/ideaService";
import {
  RiAddLine, RiSearchLine, RiFlashlightLine, RiFilterLine,
  RiGridLine, RiListCheck, RiBookmarkLine,
} from "react-icons/ri";

const STATUSES = ["draft","active","validated","launched","archived"];

export default function IdeasPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim())  params.search = search.trim();
      if (filterStatus)   params.status = filterStatus;
      const res = await getIdeas(params);
      setIdeas(res.data?.ideas || res.data || []);
    } catch {
      toast.error("Failed to load ideas");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchIdeas, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchIdeas]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteIdea(deleteId);
      setIdeas(prev => prev.filter(i => i._id !== deleteId));
      toast.success("Idea deleted");
    } catch {
      toast.error("Failed to delete idea");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleBookmark = async id => {
    try {
      const res = await toggleBookmark(id);
      setIdeas(prev => prev.map(i => i._id === id ? res.data : i));
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const bookmarkedCount = ideas.filter(i => i.isBookmarked).length;
  const aiCount = ideas.filter(i => i.aiGenerated).length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
        <div>
          <h1 className="page-title">💡 My Ideas</h1>
          <p className="page-subtitle">
            {ideas.length} idea{ideas.length !== 1 ? "s" : ""}
            {aiCount > 0 && ` · ${aiCount} AI generated`}
            {bookmarkedCount > 0 && ` · ${bookmarkedCount} bookmarked`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/generate">
            <button className="btn btn-secondary">
              <RiFlashlightLine /> Generate with AI
            </button>
          </Link>
          <Link to="/add-idea">
            <button className="btn btn-primary">
              <RiAddLine /> Add Idea
            </button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 160 }}>
          <RiSearchLine style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16, pointerEvents: "none" }} />
          <input
            className="input-field"
            style={{ paddingLeft: 38, marginBottom: 0 }}
            placeholder="Search ideas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RiFilterLine style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <select
            className="input-field"
            style={{ width: "auto", cursor: "pointer", paddingTop: 10, paddingBottom: 10 }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* View mode toggle */}
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          {[
            { mode: "grid", icon: RiGridLine },
            { mode: "list", icon: RiListCheck },
          ].map(({ mode, icon: Icon }) => (
            <button key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 34, height: 34, borderRadius: "var(--radius-sm)",
                background: viewMode === mode ? "rgba(245,158,11,0.15)" : "var(--glass-2)",
                border: `1px solid ${viewMode === mode ? "rgba(245,158,11,0.3)" : "var(--border-default)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: viewMode === mode ? "var(--gold)" : "var(--text-muted)",
                cursor: "pointer", transition: "var(--transition-fast)",
                fontSize: 16,
              }}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Content */}
      {loading ? (
        <div style={{
          display: viewMode === "grid" ? "grid" : "flex",
          gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill,minmax(300px,1fr))" : undefined,
          flexDirection: "column",
          gap: 16,
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: viewMode === "grid" ? 200 : 72, borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>
            {search || filterStatus ? "🔍" : "💡"}
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
            {search || filterStatus ? "No ideas match your filters" : "No ideas yet"}
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>
            {search || filterStatus
              ? "Try clearing your filters or use a different search term."
              : "Start by generating an AI startup idea or adding one manually."}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {(search || filterStatus) ? (
              <button className="btn btn-secondary" onClick={() => { setSearch(""); setFilterStatus(""); }}>
                Clear Filters
              </button>
            ) : (
              <>
                <Link to="/generate">
                  <button className="btn btn-primary"><RiFlashlightLine /> Generate with AI</button>
                </Link>
                <Link to="/add-idea">
                  <button className="btn btn-secondary"><RiAddLine /> Add Manually</button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          <AnimatePresence>
            {ideas.map((idea, i) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <IdeaCard
                  idea={idea}
                  onEdit={id => navigate(`/add-idea/${id}`)}
                  onDelete={id => setDeleteId(id)}
                  onBookmark={handleBookmark}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {ideas.map((idea, i) => (
              <motion.div key={idea._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  background: "var(--glass-2)", border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)", padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: 14,
                  transition: "border-color var(--transition-fast)",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-default)"}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: "var(--radius-sm)",
                  background: idea.aiGenerated ? "rgba(245,158,11,0.15)" : "rgba(139,92,246,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  {idea.aiGenerated ? "⚡" : "💡"}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{idea.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {idea.category}
                    {idea.score && <span style={{ marginLeft: 12, color: "var(--gold)", fontWeight: 600 }}>Score: {idea.score}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  <span className={`badge badge-${
                    { draft:"purple", active:"emerald", validated:"blue", launched:"gold", archived:"red" }[idea.status] || "purple"
                  }`} style={{ fontSize: 10 }}>
                    {idea.status || "draft"}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleBookmark(idea._id)}>
                    <RiBookmarkLine style={{ color: idea.isBookmarked ? "var(--gold)" : undefined }} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/add-idea/${idea._id}`)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(idea._id)}>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1000, backdropFilter: "blur(6px)", padding: 20,
            }}
            onClick={() => !deleting && setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{ padding: 36, maxWidth: 400, width: "100%", textAlign: "center" }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, marginBottom: 10 }}>
                Delete this idea?
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
                This action cannot be undone. The idea will be permanently removed from your workspace.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
