import { motion } from "framer-motion";
import {
  RiEditLine, RiDeleteBin6Line,
  RiBookmarkLine, RiBookmarkFill,
} from "react-icons/ri";

const STATUS_BADGE = {
  draft:     "badge-purple",
  active:    "badge-emerald",
  validated: "badge-blue",
  launched:  "badge-gold",
  archived:  "badge-red",
};

export default function IdeaCard({ idea, onEdit, onDelete, onBookmark }) {
  const createdAt = idea.createdAt
    ? new Date(idea.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";

  return (
    <div
      className="idea-card"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div className="idea-card-title" style={{ marginBottom: 2 }}>{idea.title}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{idea.category}</div>
        </div>
        <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span className={`badge ${STATUS_BADGE[idea.status] || "badge-purple"}`} style={{ fontSize: 10 }}>
            {(idea.status || "draft")}
          </span>
          {idea.aiGenerated && (
            <span className="badge badge-gold" style={{ fontSize: 10 }}>AI</span>
          )}
        </div>
      </div>

      {/* Problem / Description */}
      {(idea.problem || idea.description) && (
        <p className="idea-card-desc">
          {idea.problem || idea.description}
        </p>
      )}

      {/* Score + Market Size */}
      {(idea.score || idea.pitchLine) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {idea.score && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>AI Score</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--gold)" }}>{idea.score}</span>
            </div>
          )}
          {idea.pitchLine && (
            <p style={{
              fontSize: 12, color: "var(--text-muted)", fontStyle: "italic",
              borderLeft: "2px solid rgba(245,158,11,0.4)", paddingLeft: 8,
              lineHeight: 1.5,
            }}>
              "{idea.pitchLine}"
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: "flex", gap: 6, alignItems: "center",
        marginTop: 4, paddingTop: 10,
        borderTop: "1px solid var(--border-subtle)",
      }}>
        {onBookmark && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="btn btn-ghost btn-sm"
            style={{ padding: "5px 8px" }}
            onClick={() => onBookmark(idea._id)}
            title={idea.isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {idea.isBookmarked
              ? <RiBookmarkFill style={{ color: "var(--gold)", fontSize: 15 }} />
              : <RiBookmarkLine style={{ fontSize: 15 }} />}
          </motion.button>
        )}
        {onEdit && (
          <button className="btn btn-ghost btn-sm" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onEdit(idea._id)}>
            <RiEditLine style={{ fontSize: 13 }} /> Edit
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger btn-sm" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onDelete(idea._id)}>
            <RiDeleteBin6Line style={{ fontSize: 13 }} /> Delete
          </button>
        )}
        {createdAt && (
          <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)" }}>
            {createdAt}
          </div>
        )}
      </div>
    </div>
  );
}
