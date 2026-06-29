import { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Onboarding from "../components/Onboarding";
import useAuth from "../hooks/useAuth";
import { getIdeas } from "../services/ideaService";
import { getDailyMissions, updateStreak } from "../services/userService";
import { toast } from "react-hot-toast";
import {
  RiLightbulbLine, RiFlashlightLine, RiAddLine, RiArrowRightLine,
  RiStarLine, RiMessage3Line, RiTrophyLine, RiFireLine,
  RiBarChartBoxLine, RiLineChartLine, RiCheckboxCircleLine,
} from "react-icons/ri";

/* ── Stat Card ── */
const StatCard = memo(({ label, value, icon: Icon, color, subtitle, delay = 0 }) => (
  <motion.div
    className="stat-card premium-hover"
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{
        width: 42, height: 42, borderRadius: "var(--radius-md)",
        background: `${color}18`, border: `1px solid ${color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, fontSize: 20,
      }}>
        <Icon />
      </div>
      {subtitle && (
        <span style={{ fontSize: 11, color: "var(--emerald)", fontWeight: 600 }}>{subtitle}</span>
      )}
    </div>
    <div className="stat-value" style={{ color, fontSize: 34 }}>{value}</div>
    <div className="stat-label" style={{ marginTop: 4 }}>{label}</div>
  </motion.div>
));

/* ── XP Progress Bar ── */
const XPProgress = memo(({ xp = 0, level = 1 }) => {
  const THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 8000, 12000, 20000];
  const prev = THRESHOLDS[level - 1] || 0;
  const next = THRESHOLDS[level] || THRESHOLDS[THRESHOLDS.length - 1];
  const pct = next > prev ? Math.min(((xp - prev) / (next - prev)) * 100, 100) : 100;
  const toNext = Math.max(0, next - xp);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
        <span>Level {level}</span>
        <span>{toNext > 0 ? `${toNext} XP to Level ${level + 1}` : "Max Level"}</span>
      </div>
      <div style={{ height: 8, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
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
});

/* ── AI Tool Grid Item ── */
const AITool = memo(({ icon, label, desc, to, color, badge }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ y: -3, borderColor: color }}
      style={{
        background: "var(--glass-2)", border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)", padding: "14px 14px",
        cursor: "pointer", transition: "border-color var(--transition-fast)",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {badge && (
          <span style={{
            fontSize: 9, fontWeight: 700,
            background: badge === "HOT" ? "rgba(249,115,22,0.2)" : "rgba(245,158,11,0.15)",
            color: badge === "HOT" ? "var(--orange)" : "var(--gold)",
            border: `1px solid ${badge === "HOT" ? "rgba(249,115,22,0.3)" : "rgba(245,158,11,0.25)"}`,
            padding: "2px 6px", borderRadius: "var(--radius-full)",
          }}>{badge}</span>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 3, color: "var(--text-primary)" }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{desc}</div>
    </motion.div>
  </Link>
));

const AI_TOOLS = [
  { icon: "⚡", label: "AI Generator",       desc: "Complete startup analysis",     to: "/generate",        color: "var(--gold)",    badge: "HOT" },
  { icon: "🤖", label: "AI Mentor Chat",      desc: "7 expert AI personas",          to: "/ai-chat",         color: "var(--emerald)" },
  { icon: "🎯", label: "Market Validation",   desc: "TAM/SAM/SOM analysis",          to: "/validate",        color: "var(--blue)" },
  { icon: "🔍", label: "Competitors",         desc: "Competitive intelligence",      to: "/competitors",     color: "var(--purple)" },
  { icon: "🚀", label: "Pitch Deck AI",       desc: "Investor-ready pitches",        to: "/pitch",           color: "var(--magenta)", badge: "NEW" },
  { icon: "📋", label: "Business Planner",    desc: "Full plan + financials",        to: "/business-plan",   color: "var(--cyan)" },
  { icon: "📡", label: "Startup Radar",       desc: "8-dimension score",             to: "/radar",           color: "var(--orange)" },
  { icon: "📈", label: "Revenue Forecast",    desc: "12-month projection",           to: "/revenue-forecast",color: "var(--red)" },
];

/* ── Readiness Bar ── */
const ReadinessBar = memo(({ label, value, color }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontWeight: 700, color }}>{value}%</span>
    </div>
    <div style={{ height: 5, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        style={{ height: "100%", background: color, borderRadius: "var(--radius-full)" }}
      />
    </div>
  </div>
));

/* ─────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [ideasRes, missionsRes] = await Promise.all([
          getIdeas({ limit: 5 }),
          getDailyMissions(),
        ]);
        setIdeas(ideasRes.data?.ideas || ideasRes.data || []);
        setMissions(missionsRes.data || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };

    // Update streak silently
    updateStreak()
      .then(res => { if (res?.streak !== undefined) updateUser({ streak: res.streak }); })
      .catch(() => {});

    init();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "Founder";
  const completedMissions = missions.filter(m => m.completed).length;

  // Readiness scores (derived from user activity — show static defaults until real analytics)
  const readinessData = [
    { label: "Idea Clarity",       value: Math.min(100, 40 + (ideas.length * 12)),     color: "var(--gold)" },
    { label: "Market Research",    value: Math.min(100, 20 + (user?.xp || 0) / 20),   color: "var(--blue)" },
    { label: "Business Model",     value: Math.min(100, 10 + (user?.level || 1) * 15),color: "var(--emerald)" },
    { label: "Pitch Readiness",    value: Math.min(100, (user?.xp || 0) / 25),        color: "var(--purple)" },
    { label: "Funding Readiness",  value: Math.min(100, (user?.xp || 0) / 40),        color: "var(--orange)" },
  ];

  const overallReadiness = Math.round(readinessData.reduce((s, r) => s + r.value, 0) / readinessData.length);

  return (
    <DashboardLayout>
      <Onboarding />
      {/* ── Welcome Banner ── */}
      <motion.div
        className="welcome-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ flex: 1 }}>
          <div className="welcome-title">
            {greeting()}, {firstName} 👋
          </div>
          <p className="welcome-subtitle">
            Your AI startup team is ready. What are we building today?
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <span className="badge badge-gold">⚡ {(user?.plan || "FREE").toUpperCase()}</span>
            <span className="badge badge-purple">🏆 Level {user?.level || 1}</span>
            <span className="badge badge-emerald">⭐ {(user?.xp || 0).toLocaleString()} XP</span>
            {(user?.streak || 0) > 1 && (
              <span className="badge" style={{ background: "rgba(249,115,22,0.15)", color: "var(--orange)", border: "1px solid rgba(249,115,22,0.25)" }}>
                🔥 {user.streak}-day streak
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
          <Link to="/generate">
            <button className="btn btn-primary"><RiFlashlightLine /> Generate Idea</button>
          </Link>
          <Link to="/add-idea">
            <button className="btn btn-secondary"><RiAddLine /> Add Idea</button>
          </Link>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <StatCard label="Total Ideas"  value={ideas.length}          icon={RiLightbulbLine} color="var(--gold)"    delay={0.05} />
        <StatCard label="Founder XP"   value={(user?.xp||0).toLocaleString()} icon={RiStarLine}     color="var(--purple)"  delay={0.1} subtitle="+15 today" />
        <StatCard label="Level"        value={`Lvl ${user?.level||1}`}       icon={RiTrophyLine}  color="var(--emerald)" delay={0.15} />
        <StatCard label="Day Streak"   value={`${user?.streak||0}d`}         icon={RiFireLine}    color="var(--orange)"  delay={0.2} />
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 20 }}>

        {/* Left: AI Tools + Ideas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* AI Workspace */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>🤖 AI Workspace</h2>
              <Link to="/generate" style={{ fontSize: 12, color: "var(--gold)", display: "flex", alignItems: "center", gap: 3 }}>
                All tools <RiArrowRightLine />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {AI_TOOLS.map(t => <AITool key={t.to} {...t} />)}
            </div>
          </div>

          {/* Recent Ideas */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>💡 Recent Ideas</h2>
              <Link to="/ideas" style={{ fontSize: 12, color: "var(--gold)", display: "flex", alignItems: "center", gap: 3 }}>
                View all <RiArrowRightLine />
              </Link>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: 58, borderRadius: "var(--radius-sm)" }} />
                ))}
              </div>
            ) : ideas.length === 0 ? (
              <div style={{ padding: "28px 0", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>💡</div>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
                  No ideas yet. Generate your first startup idea with AI.
                </p>
                <Link to="/generate">
                  <button className="btn btn-primary btn-sm"><RiFlashlightLine /> Generate Now</button>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ideas.map((idea, i) => (
                  <motion.div key={idea._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      background: "var(--glass-1)", border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-sm)", padding: "10px 14px",
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "var(--radius-sm)",
                      background: idea.aiGenerated ? "rgba(245,158,11,0.15)" : "rgba(139,92,246,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, flexShrink: 0,
                    }}>
                      {idea.aiGenerated ? "⚡" : "💡"}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {idea.title}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{idea.category}</div>
                    </div>
                    {idea.score && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>{idea.score}</span>
                    )}
                    <span className={`badge ${idea.aiGenerated ? "badge-gold" : "badge-purple"}`} style={{ fontSize: 9 }}>
                      {idea.aiGenerated ? "AI" : "Manual"}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Readiness + Missions + Streak */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Startup Readiness Radar */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>📡 Startup Readiness</h3>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22,
                color: overallReadiness >= 70 ? "var(--emerald)" : overallReadiness >= 40 ? "var(--gold)" : "var(--orange)",
              }}>
                {overallReadiness}%
              </div>
            </div>
            {readinessData.map(r => <ReadinessBar key={r.label} {...r} />)}
            <Link to="/radar">
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8, fontSize: 12 }}>
                Full Assessment → 
              </button>
            </Link>
          </div>

          {/* Daily Missions */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>🎯 Daily Missions</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="badge badge-emerald" style={{ fontSize: 10 }}>
                  {completedMissions}/{missions.length}
                </span>
                <Link to="/achievements" style={{ fontSize: 11, color: "var(--gold)" }}>
                  All →
                </Link>
              </div>
            </div>
            {missions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "16px 0", color: "var(--text-muted)", fontSize: 13 }}>
                Loading missions...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {missions.map(m => (
                  <div key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: m.completed ? "rgba(16,185,129,0.2)" : "var(--glass-2)",
                      border: `1px solid ${m.completed ? "rgba(16,185,129,0.3)" : "var(--border-subtle)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, flexShrink: 0,
                    }}>
                      {m.completed ? <RiCheckboxCircleLine style={{ color: "var(--emerald)" }} /> : ""}
                    </div>
                    <span style={{
                      fontSize: 12, flex: 1,
                      color: m.completed ? "var(--text-muted)" : "var(--text-secondary)",
                      textDecoration: m.completed ? "line-through" : "none",
                    }}>{m.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold)", flexShrink: 0 }}>
                      +{m.xpReward}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* XP Progress */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
              ⭐ XP Progress
            </h3>
            <XPProgress xp={user?.xp || 0} level={user?.level || 1} />
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>⚡ Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { icon: RiFlashlightLine, label: "Generate",    to: "/generate",      color: "var(--gold)" },
            { icon: RiMessage3Line,   label: "AI Chat",     to: "/ai-chat",       color: "var(--emerald)" },
            { icon: RiAddLine,        label: "Add Idea",    to: "/add-idea",      color: "var(--purple)" },
            { icon: RiBarChartBoxLine,label: "Analytics",   to: "/analytics",     color: "var(--blue)" },
            { icon: RiTrophyLine,     label: "Achievements",to: "/achievements",  color: "var(--orange)" },
          ].map(a => (
            <Link key={a.to} to={a.to}>
              <motion.div
                whileHover={{ y: -3 }}
                style={{
                  background: "var(--glass-2)", border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)", padding: "16px 10px",
                  cursor: "pointer", transition: "var(--transition-fast)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
                }}
              >
                <div style={{
                  width: 36, height: 36, background: `${a.color}18`,
                  borderRadius: "var(--radius-sm)", display: "flex",
                  alignItems: "center", justifyContent: "center", color: a.color, fontSize: 17,
                }}>
                  <a.icon />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.3 }}>
                  {a.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
