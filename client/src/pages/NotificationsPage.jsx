import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { RiBellLine, RiCheckLine, RiDeleteBin6Line, RiFlashlightLine,
  RiTrophyLine, RiLightbulbLine, RiRobot2Line, RiStarLine } from "react-icons/ri";

const SAMPLE_NOTIFICATIONS = [
  { id: 1, type: "achievement", icon: RiTrophyLine, color: "var(--gold)", title: "Badge Unlocked: Idea Spark", desc: "You created your first startup idea. Keep building!", time: "2 min ago", unread: true },
  { id: 2, type: "ai", icon: RiRobot2Line, color: "var(--emerald)", title: "AI Analysis Complete", desc: "Your market validation for 'MediReach AI' is ready to view.", time: "1 hr ago", unread: true },
  { id: 3, type: "idea", icon: RiLightbulbLine, color: "var(--purple)", title: "Idea Saved Successfully", desc: "AgriVision AI has been added to your workspace. +15 XP earned!", time: "3 hr ago", unread: true },
  { id: 4, type: "xp", icon: RiStarLine, color: "var(--blue)", title: "Level Up! You reached Level 2", desc: "You earned 250 XP and unlocked new AI features.", time: "Yesterday", unread: false },
  { id: 5, type: "ai", icon: RiFlashlightLine, color: "var(--orange)", title: "Daily Missions Available", desc: "3 new missions are ready. Complete them to earn up to 80 XP today.", time: "Yesterday", unread: false },
  { id: 6, type: "achievement", icon: RiTrophyLine, color: "var(--gold)", title: "7-Day Streak!", desc: "You've used IdeaForge 7 days in a row. Bonus 50 XP awarded.", time: "2 days ago", unread: false },
  { id: 7, type: "ai", icon: RiRobot2Line, color: "var(--emerald)", title: "Competitor Analysis Ready", desc: "Your analysis for the EdTech market is complete.", time: "3 days ago", unread: false },
  { id: 8, type: "idea", icon: RiLightbulbLine, color: "var(--purple)", title: "Weekly Report", desc: "You created 5 ideas and ran 3 AI analyses this week.", time: "1 week ago", unread: false },
];

const TYPE_LABELS = { all: "All", unread: "Unread", achievement: "Achievements", ai: "AI", idea: "Ideas" };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter(n => {
    if (filter === "unread") return n.unread;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{ marginLeft: 12, background: "var(--gold)", color: "#000", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated on your startup journey</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
            <RiCheckLine /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={filter === key ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No notifications</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence>
            {filtered.map((n, i) => (
              <motion.div key={n.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}
                style={{
                  background: n.unread ? "rgba(245,158,11,0.05)" : "var(--glass-2)",
                  border: `1px solid ${n.unread ? "rgba(245,158,11,0.18)" : "var(--border-default)"}`,
                  borderRadius: "var(--radius-md)", padding: "16px 20px",
                  display: "flex", alignItems: "flex-start", gap: 14,
                  cursor: "pointer", transition: "var(--transition-fast)",
                }}
                onClick={() => markRead(n.id)}
              >
                {/* Icon */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${n.color}18`, border: `1px solid ${n.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <n.icon style={{ color: n.color, fontSize: 18 }} />
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: n.unread ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {n.title}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{n.desc}</div>
                </div>
                {/* Dot + delete */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {n.unread && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
                  )}
                  <button className="btn btn-ghost btn-sm"
                    style={{ padding: "4px 6px" }}
                    onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}>
                    <RiDeleteBin6Line style={{ fontSize: 14 }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
