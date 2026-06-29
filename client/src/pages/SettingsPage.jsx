import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../components/layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import { updateProfile } from "../services/authService";
import api from "../services/api";

const PLAN_FEATURES = {
  free: ["10 AI Generations/day", "10 Idea slots", "Basic AI Chat"],
  starter: ["50 AI Generations/day", "Unlimited Ideas", "All AI Tools", "Priority Support"],
  pro: ["Unlimited Generation", "All AI Tools", "Team Workspace", "Analytics", "Export PDF"],
  business: ["Everything in Pro", "API Access", "White-label Reports", "Dedicated Manager"],
};

// Notifications sub-component to safely use state per toggle
function NotificationToggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 0", borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{desc}</div>
      </div>
      <button
        onClick={() => setOn(!on)}
        aria-label={on ? `Disable ${label}` : `Enable ${label}`}
        style={{
          width: 48, height: 26, borderRadius: "var(--radius-full)",
          background: on ? "linear-gradient(135deg, var(--gold), var(--orange))" : "var(--glass-3)",
          border: "none", cursor: "pointer", position: "relative",
          transition: "var(--transition-base)", flexShrink: 0,
        }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: on ? 25 : 3,
          transition: "var(--transition-base)",
        }} />
      </button>
    </div>
  );
}

const NOTIFICATION_ITEMS = [
  { label: "AI Generation Complete", desc: "Get notified when your AI generation finishes", defaultOn: true },
  { label: "Weekly Founder Report", desc: "Receive a weekly summary of your startup progress", defaultOn: true },
  { label: "New Feature Announcements", desc: "Stay updated on new IdeaForge features", defaultOn: false },
  { label: "Tip of the Day", desc: "Daily startup tips from our AI mentors", defaultOn: true },
  { label: "Achievement Unlocked", desc: "Notifications when you earn XP or badges", defaultOn: true },
];

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const SECTIONS = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "account", label: "Account & Plan", icon: "⚡" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy & Security", icon: "🔒" },
    { id: "data", label: "Data & Export", icon: "📦" },
  ];

  const handleProfileSave = async () => {
    if (!profileForm.name.trim()) { toast.error("Name cannot be empty"); return; }
    setSavingProfile(true);
    try {
      const updated = await updateProfile({ name: profileForm.name.trim(), bio: profileForm.bio });
      updateUser(updated);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill all password fields"); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match"); return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters"); return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">⚙️ Settings</h1>
        <p className="page-subtitle">Manage your account, preferences, and security</p>
      </div>

      <div className="settings-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Settings Nav */}
        <div className="glass-card" style={{ padding: 12, height: "fit-content" }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                width: "100%",
                background: activeSection === s.id ? "rgba(245,158,11,0.12)" : "transparent",
                border: `1px solid ${activeSection === s.id ? "rgba(245,158,11,0.25)" : "transparent"}`,
                borderRadius: "var(--radius-sm)", padding: "11px 14px", textAlign: "left",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                fontSize: 14, fontWeight: activeSection === s.id ? 600 : 400,
                color: activeSection === s.id ? "var(--gold)" : "var(--text-muted)",
                transition: "var(--transition-fast)", marginBottom: 2,
              }}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PROFILE */}
          {activeSection === "profile" && (
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
                Profile Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label-text">Full Name</label>
                  <input
                    className="input-field"
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label-text">Email Address</label>
                  <input
                    className="input-field"
                    value={user?.email || ""}
                    disabled
                    style={{ opacity: 0.5, cursor: "not-allowed" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="label-text">Bio</label>
                <textarea
                  className="textarea-field"
                  rows={3}
                  value={profileForm.bio}
                  onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell the world about your founder journey..."
                />
              </div>
              <button className="btn btn-primary" onClick={handleProfileSave} disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}

          {/* ACCOUNT */}
          {activeSection === "account" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                  Current Plan
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>
                        {(user?.plan || "free").toUpperCase()}
                      </span>
                      <span className="badge badge-gold">ACTIVE</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {(PLAN_FEATURES[user?.plan] || PLAN_FEATURES.free).map(f => (
                        <div key={f} style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
                          <span style={{ color: "var(--emerald)" }}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => toast.success("Upgrade flow coming soon!")}>
                    Upgrade Plan
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                  Change Password
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 440 }}>
                  {[
                    ["currentPassword", "Current Password"],
                    ["newPassword", "New Password"],
                    ["confirmPassword", "Confirm New Password"],
                  ].map(([f, l]) => (
                    <div key={f} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="label-text">{l}</label>
                      <input
                        type="password"
                        className="input-field"
                        value={passwordForm[f]}
                        onChange={e => setPasswordForm(p => ({ ...p, [f]: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  <button className="btn btn-secondary" onClick={handlePasswordChange} disabled={savingPassword}>
                    {savingPassword ? "Updating..." : "Change Password"}
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 32, border: "1px solid rgba(239,68,68,0.2)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--red)", marginBottom: 12 }}>
                  Danger Zone
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
                  These actions are permanent and cannot be undone.
                </p>
                <button className="btn btn-danger" onClick={logout}>
                  Sign Out of All Devices
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                Notification Preferences
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
                Control which notifications you receive from IdeaForge.
              </p>
              {NOTIFICATION_ITEMS.map(n => (
                <NotificationToggle key={n.label} {...n} />
              ))}
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === "privacy" && (
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
                Privacy & Security
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Profile Visibility", value: "Private — only you can see your profile" },
                  { label: "Idea Visibility", value: "Private — all ideas are private by default" },
                  { label: "Data Encryption", value: "All data encrypted at rest and in transit (AES-256)" },
                  { label: "Session Timeout", value: "7 days (JWT expiry)" },
                  { label: "Two-Factor Auth", value: "Not configured (coming soon)" },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 0", borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: "60%", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DATA */}
          {activeSection === "data" && (
            <div className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                Data Management
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
                Export or download your IdeaForge data at any time.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Export All Ideas (JSON)", icon: "📄", msg: "JSON export coming in Pro plan!" },
                  { label: "Export Pitch Decks (PDF)", icon: "🚀", msg: "PDF export coming in Pro plan!" },
                  { label: "Export Business Plans (PDF)", icon: "📋", msg: "PDF export coming in Pro plan!" },
                  { label: "Download Chat History", icon: "💬", msg: "Chat export coming soon!" },
                ].map(({ label, icon, msg }) => (
                  <button
                    key={label}
                    onClick={() => toast.success(msg)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 20px", background: "var(--glass-1)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)", cursor: "pointer",
                      transition: "var(--transition-fast)", textAlign: "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--glass-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--glass-1)"}
                  >
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 16, color: "var(--text-muted)" }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
