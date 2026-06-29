import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import { getBadges, getDailyMissions, completeMission } from "../services/userService";

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 8000, 12000, 20000];

const XP_BAR = ({ xp = 0, level = 1 }) => {
  const prev = LEVEL_THRESHOLDS[level - 1] || 0;
  const next = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const pct  = next > prev ? Math.min(((xp - prev) / (next - prev)) * 100, 100) : 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
        <span>Level {level}</span>
        <span>{Math.max(0, next - xp)} XP to Level {level + 1}</span>
      </div>
      <div style={{ height: 10, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--gold), var(--orange))",
            borderRadius: "var(--radius-full)",
          }}
        />
      </div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5, textAlign: "right" }}>
        {xp.toLocaleString()} XP total
      </div>
    </div>
  );
};

export default function AchievementsPage() {
  const { user, updateUser } = useAuth();
  const [badges, setBadges]   = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [badgesRes, missionsRes] = await Promise.all([getBadges(), getDailyMissions()]);
        setBadges(badgesRes.data || []);
        setMissions(missionsRes.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleComplete = async missionId => {
    setCompleting(missionId);
    try {
      const res = await completeMission(missionId);
      setMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true } : m));
      updateUser({ xp: res.newXP, level: res.level });
      toast.success(`Mission complete! +${res.xpAwarded} XP 🎉`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to complete mission");
    } finally {
      setCompleting(null);
    }
  };

  const earnedBadges   = badges.filter(b => b.earned);
  const lockedBadges   = badges.filter(b => !b.earned);
  const doneMissions   = missions.filter(m => m.completed).length;
  const totalMissionXP = missions.filter(m => !m.completed).reduce((s, m) => s + m.xpReward, 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">🏆 Achievements</h1>
        <p className="page-subtitle">Track your founder XP, daily missions, and achievement badges</p>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: "var(--radius-lg)" }} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* XP Hero Card */}
          <motion.div
            className="luxury-card"
            style={{ padding: 32 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  FOUNDER LEVEL
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 52, color: "var(--gold)", lineHeight: 1 }}>
                  Level {user?.level || 1}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>
                  {(user?.xp || 0).toLocaleString()} XP earned
                </div>
              </div>
              <div style={{ width: 1, height: 80, background: "var(--border-default)" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Badges Earned", value: earnedBadges.length, icon: "🏅" },
                  { label: "Missions Done", value: `${doneMissions}/${missions.length}`, icon: "🎯" },
                  { label: "Day Streak",    value: `${user?.streak || 0}d`, icon: "🔥" },
                  { label: "XP Available", value: totalMissionXP > 0 ? `+${totalMissionXP}` : "All done!", icon: "⭐" },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--glass-2)", borderRadius: "var(--radius-sm)", padding: "12px 14px" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <XP_BAR xp={user?.xp || 0} level={user?.level || 1} />
            </div>
          </motion.div>

          {/* Daily Missions + Badges */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Daily Missions */}
            <div className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>🎯 Daily Missions</h3>
                <span className="badge badge-emerald">{doneMissions}/{missions.length} complete</span>
              </div>
              {missions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-muted)", fontSize: 14 }}>
                  No missions available. Check back tomorrow!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {missions.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      style={{
                        background: m.completed ? "rgba(16,185,129,0.06)" : "var(--glass-1)",
                        border: `1px solid ${m.completed ? "rgba(16,185,129,0.18)" : "var(--border-subtle)"}`,
                        borderRadius: "var(--radius-md)", padding: "14px 16px",
                        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: m.completed ? "rgba(16,185,129,0.2)" : "var(--glass-2)",
                          border: `1px solid ${m.completed ? "rgba(16,185,129,0.3)" : "var(--border-default)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 13, color: m.completed ? "var(--emerald)" : "var(--text-muted)",
                        }}>
                          {m.completed ? "✓" : "○"}
                        </div>
                        <div>
                          <div style={{
                            fontSize: 13, fontWeight: 600,
                            color: m.completed ? "var(--text-muted)" : "var(--text-primary)",
                            textDecoration: m.completed ? "line-through" : "none",
                            marginBottom: 2,
                          }}>
                            {m.title}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{m.description}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gold)", marginBottom: 4 }}>
                          +{m.xpReward} XP
                        </div>
                        {!m.completed && (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 11, padding: "5px 12px" }}
                            onClick={() => handleComplete(m.id)}
                            disabled={completing === m.id}
                          >
                            {completing === m.id ? "..." : "Done"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 18 }}>
                🏅 Badges
              </h3>
              {earnedBadges.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--emerald)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                    Earned ({earnedBadges.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {earnedBadges.map(b => (
                      <motion.div
                        key={b.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        data-tooltip={b.description}
                        style={{
                          background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)",
                          borderRadius: "var(--radius-md)", padding: "10px 14px",
                          display: "flex", alignItems: "center", gap: 8, cursor: "default",
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{b.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)" }}>{b.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {lockedBadges.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                    Locked ({lockedBadges.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {lockedBadges.map(b => (
                      <div key={b.id} data-tooltip={b.description}
                        style={{
                          background: "var(--glass-1)", border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-md)", padding: "10px 14px",
                          display: "flex", alignItems: "center", gap: 8,
                          opacity: 0.4, cursor: "default",
                        }}
                      >
                        <span style={{ fontSize: 20, filter: "grayscale(1)" }}>{b.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>{b.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {badges.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Complete missions and use AI tools to earn badges.</p>
                </div>
              )}
            </div>
          </div>

          {/* Streak Tracker */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 18 }}>
              🔥 Founder Streak
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: 64, color: "var(--orange)", lineHeight: 1,
                }}>
                  {user?.streak || 0}
                </div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6 }}>Day streak</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
                  {(user?.streak || 0) > 0
                    ? `You're on a ${user.streak}-day building streak! Log in daily to keep it going.`
                    : "Start your streak by logging in and using IdeaForge every day."}
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        width: 36, height: 36, borderRadius: "var(--radius-sm)",
                        background: i < ((user?.streak || 0) % 7)
                          ? "linear-gradient(135deg, var(--orange), var(--gold))"
                          : "var(--glass-2)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14,
                      }}
                    >
                      {i < ((user?.streak || 0) % 7) ? "🔥" : ""}
                    </motion.div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Last 7 days</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
