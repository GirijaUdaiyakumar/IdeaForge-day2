import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../services/authService";
import { RiEditLine, RiCheckLine, RiCloseLine, RiSettingsLine } from "react-icons/ri";

const PLAN_INFO = {
  free:       { label: "Free",       color: "var(--text-muted)" },
  starter:    { label: "Starter",    color: "var(--blue)" },
  pro:        { label: "Pro",        color: "var(--gold)" },
  business:   { label: "Business",   color: "var(--emerald)" },
  enterprise: { label: "Enterprise", color: "var(--magenta)" },
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(user?.name || "");
  const [bio, setBio]         = useState(user?.bio  || "");
  const [saving, setSaving]   = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const planInfo = PLAN_INFO[user?.plan] || PLAN_INFO.free;

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const updated = await updateProfile({ name: name.trim(), bio });
      updateUser(updated);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setBio(user?.bio  || "");
    setEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">👤 Founder Profile</h1>
        <p className="page-subtitle">Manage your profile and track your founder journey</p>
      </div>

      <div className="ai-page-grid" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24 }}>

        {/* Left column — Identity card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div
            className="glass-card"
            style={{ padding: 32, textAlign: "center" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Avatar */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold), var(--orange))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 800, color: "#000",
              margin: "0 auto 16px",
              border: "3px solid rgba(245,158,11,0.3)",
              boxShadow: "var(--shadow-gold)",
            }}>
              {initials}
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
              {user?.name || "Founder"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 16 }}>{user?.email}</p>

            {/* Plan badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px",
              background: `${planInfo.color}14`,
              border: `1px solid ${planInfo.color}28`,
              borderRadius: "var(--radius-full)",
              fontSize: 12, fontWeight: 700, color: planInfo.color,
              marginBottom: 16,
            }}>
              ⚡ {planInfo.label.toUpperCase()} PLAN
            </div>

            {user?.bio && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
                "{user.bio}"
              </p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(!editing)}
              >
                <RiEditLine /> Edit Profile
              </button>
              <Link to="/settings">
                <button className="btn btn-ghost btn-sm">
                  <RiSettingsLine />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Founder stats */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Founder Stats
            </div>
            {[
              { label: "Level",        value: `Level ${user?.level || 1}`, icon: "🎮" },
              { label: "Total XP",     value: `${(user?.xp || 0).toLocaleString()} XP`, icon: "⭐" },
              { label: "Day Streak",   value: `${user?.streak || 0} days`, icon: "🔥" },
              { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—", icon: "📅" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid var(--border-subtle)",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
                  {icon} {label}
                </span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Edit Form (conditional) */}
          <AnimatePresence>
            {editing && (
              <motion.div
                key="edit-form"
                className="glass-card"
                style={{ padding: 28 }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
                  Edit Profile
                </h3>
                <div className="form-group">
                  <label className="label-text">Full Name</label>
                  <input
                    className="input-field"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label className="label-text">Bio</label>
                  <textarea
                    className="textarea-field"
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="A short bio about yourself as a founder..."
                  />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={saving}>
                    <RiCloseLine /> Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : <><RiCheckLine /> Save Changes</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Account details */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
              Account Details
            </h3>
            {[
              { label: "Full Name",     value: user?.name || "—" },
              { label: "Email Address", value: user?.email || "—" },
              { label: "Role",          value: (user?.role || "user").charAt(0).toUpperCase() + (user?.role || "user").slice(1) },
              { label: "Plan",          value: planInfo.label },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid var(--border-subtle)",
              }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{label}</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Badges preview */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>🏅 Badges</h3>
              <Link to="/achievements" style={{ fontSize: 12, color: "var(--gold)" }}>View all →</Link>
            </div>
            {user?.badges?.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {user.badges.slice(0, 6).map(b => (
                  <div key={b} style={{
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: "var(--radius-full)", padding: "6px 12px",
                    fontSize: 13, fontWeight: 600, color: "var(--gold)",
                  }}>
                    🏅 {b.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  Complete missions and use AI tools to earn badges.
                </p>
                <Link to="/achievements">
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                    View Missions
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* XP Progress */}
          <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>⭐ XP Progress</h3>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>
                {(user?.xp || 0).toLocaleString()} XP
              </span>
            </div>
            {(() => {
              const THRESHOLDS = [0,100,250,500,1000,2000,3500,5000];
              const level = user?.level || 1;
              const xp = user?.xp || 0;
              const prev = THRESHOLDS[level - 1] || 0;
              const next = THRESHOLDS[level] || THRESHOLDS[THRESHOLDS.length - 1];
              const pct  = next > prev ? Math.min(((xp - prev) / (next - prev)) * 100, 100) : 100;
              return (
                <>
                  <div style={{ height: 8, background: "var(--glass-3)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: 8 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      style={{ height: "100%", background: "linear-gradient(90deg,var(--gold),var(--orange))", borderRadius: "var(--radius-full)" }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                    <span>Level {level}</span>
                    <span>{Math.max(0, next - xp)} XP to Level {level + 1}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
