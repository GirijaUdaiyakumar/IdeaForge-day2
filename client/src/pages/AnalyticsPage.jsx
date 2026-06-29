import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { getIdeaStats, getIdeas } from "../services/ideaService";
import useAuth from "../hooks/useAuth";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#8b5cf6", "#3b82f6", "#ef4444", "#06b6d4"];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13,
    }}>
      {label && <div style={{ color: "#f9fafb", fontWeight: 600, marginBottom: 4 }}>{label}</div>}
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || "#f59e0b" }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const StatBox = memo(({ label, value, icon, color }) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ cursor: "default" }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div className="stat-value" style={{ color, fontSize: 32 }}>{value}</div>
        <div className="stat-label" style={{ marginTop: 4 }}>{label}</div>
      </div>
      <span style={{ fontSize: 28 }}>{icon}</span>
    </div>
  </motion.div>
));

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ideasRes] = await Promise.all([
          getIdeaStats(),
          getIdeas({ limit: 100 }),
        ]);
        setStats(statsRes.data);
        setIdeas(ideasRes.data?.ideas || ideasRes.data || []);
      } catch {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build chart data from ideas
  const monthlyData = (() => {
    const months = {};
    ideas.forEach(idea => {
      const d = new Date(idea.createdAt);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, Ideas: count }));
  })();

  const statusData = (stats?.byStatus || []).map(s => ({
    name: s._id ? s._id.charAt(0).toUpperCase() + s._id.slice(1) : "Unknown",
    value: s.count,
  }));

  const categoryData = (stats?.byCategory || []).map(c => ({
    name: c._id || "Unknown",
    count: c.count,
  }));

  const aiVsManual = [
    { name: "AI Generated", value: stats?.aiIdeas || 0 },
    { name: "Manual", value: Math.max(0, (stats?.totalIdeas || 0) - (stats?.aiIdeas || 0)) },
  ].filter(d => d.value > 0);

  const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000];
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const xpProgress = LEVEL_THRESHOLDS[level] ? Math.min(((xp - (LEVEL_THRESHOLDS[level - 1] || 0)) / (LEVEL_THRESHOLDS[level] - (LEVEL_THRESHOLDS[level - 1] || 0))) * 100, 100) : 100;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1 className="page-title">📊 Analytics</h1>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: "var(--radius-lg)" }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          <div className="skeleton" style={{ height: 280, borderRadius: "var(--radius-lg)" }} />
          <div className="skeleton" style={{ height: 280, borderRadius: "var(--radius-lg)" }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">📊 Analytics</h1>
        <p className="page-subtitle">Track your founder journey and startup metrics</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatBox label="Total Ideas"    value={stats?.totalIdeas ?? 0}     icon="💡" color="var(--gold)" />
        <StatBox label="AI Generated"   value={stats?.aiIdeas ?? 0}        icon="⚡" color="var(--emerald)" />
        <StatBox label="Bookmarked"     value={stats?.bookmarked ?? 0}     icon="🔖" color="var(--purple)" />
        <StatBox label="Founder XP"     value={(xp).toLocaleString()}      icon="⭐" color="var(--blue)" />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Ideas over time */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>
            Ideas Created Over Time
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="ideasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Ideas" stroke="#f59e0b" strokeWidth={2} fill="url(#ideasGrad)" dot={{ fill: "#f59e0b", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 36 }}>📈</span>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Start creating ideas to see your growth chart</p>
            </div>
          )}
        </div>

        {/* AI vs Manual pie */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>
            AI vs Manual Ideas
          </div>
          {aiVsManual.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={aiVsManual} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {aiVsManual.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [val, name]} contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 36 }}>🥧</span>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No ideas yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20, marginBottom: 20 }}>
        {/* Ideas by status */}
        {statusData.length > 0 && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>
              Ideas by Status
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Ideas" fill="#8b5cf6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top categories */}
        {categoryData.length > 0 && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 18 }}>
              Top Categories
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 4, right: 4, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#d1d5db", fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Ideas" fill="#f59e0b" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* If no charts — empty state */}
        {statusData.length === 0 && categoryData.length === 0 && (
          <div className="glass-card" style={{ padding: 40, textAlign: "center", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📊</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No data yet</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Create ideas and use AI tools to populate your analytics dashboard.
            </p>
          </div>
        )}
      </div>

      {/* Founder Profile Stats */}
      <div className="glass-card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
          👤 Founder Profile
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
          {[
            { label: "Member Since",   value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" },
            { label: "Current Plan",   value: (user?.plan || "free").toUpperCase() },
            { label: "Founder Level",  value: `Level ${user?.level || 1}` },
            { label: "Total XP",       value: `${(user?.xp || 0).toLocaleString()} XP` },
            { label: "Day Streak",     value: `${user?.streak || 0} days` },
            { label: "Ideas Created",  value: stats?.totalIdeas ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "var(--glass-1)", border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)", padding: "14px 16px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>{value}</div>
            </div>
          ))}
        </div>
        {/* XP Progress */}
        <div style={{ maxWidth: 500 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
            <span>Level {level}</span>
            <span>{LEVEL_THRESHOLDS[level] ? `${Math.max(0, LEVEL_THRESHOLDS[level] - xp)} XP to Level ${level + 1}` : "Max Level"}</span>
          </div>
          <div style={{ height: 8, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ height: "100%", background: "linear-gradient(90deg, var(--gold), var(--orange))", borderRadius: "var(--radius-full)" }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
