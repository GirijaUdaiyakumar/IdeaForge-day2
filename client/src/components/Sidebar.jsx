import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDashboardLine, RiLightbulbLine, RiAddLine, RiFlashlightLine,
  RiMessage3Line, RiShieldCheckLine, RiSearchEyeLine, RiPresentationLine,
  RiBarChartBoxLine, RiUserLine, RiLogoutBoxLine, RiSettingsLine,
  RiLineChartLine, RiFileListLine, RiRadarLine, RiTrophyLine,
  RiBellLine, RiGridLine, RiMapLine, RiMoneyDollarCircleLine,
  RiBrush2Line, RiLayoutGridLine, RiCalculatorLine, RiBriefcaseLine,
} from "react-icons/ri";
import useAuth from "../hooks/useAuth";

const NAV = [
  {
    label: "Workspace",
    links: [
      { to: "/dashboard",  icon: RiDashboardLine, label: "Dashboard" },
      { to: "/ideas",      icon: RiLightbulbLine, label: "My Ideas" },
      { to: "/add-idea",   icon: RiAddLine,       label: "Add Idea" },
      { to: "/projects",   icon: RiLayoutGridLine,    label: "Projects Board" },
      { to: "/notifications", icon: RiBellLine,   label: "Notifications", dot: true },
    ],
  },
  {
    label: "AI Studio",
    links: [
      { to: "/generate",         icon: RiFlashlightLine,   label: "AI Generator",        tag: "HOT" },
      { to: "/ai-chat",          icon: RiMessage3Line,     label: "AI Mentor Chat" },
      { to: "/validate",         icon: RiShieldCheckLine,  label: "Market Validation" },
      { to: "/competitors",      icon: RiSearchEyeLine,    label: "Competitor Analysis" },
      { to: "/pitch",            icon: RiPresentationLine, label: "Pitch Deck AI",       tag: "NEW" },
      { to: "/business-plan",    icon: RiFileListLine,     label: "Business Planner" },
      { to: "/swot",             icon: RiGridLine,         label: "SWOT Analysis" },
      { to: "/radar",            icon: RiRadarLine,        label: "Startup Radar" },
      { to: "/revenue-forecast", icon: RiLineChartLine,    label: "Revenue Forecast" },
      { to: "/roadmap",          icon: RiMapLine,          label: "Startup Roadmap" },
      { to: "/branding",         icon: RiBrush2Line,       label: "AI Branding" },
    ],
  },
  {
    label: "Finance & Strategy",
    links: [
      { to: "/canvas",         icon: RiGridLine,              label: "Business Model Canvas" },
      { to: "/valuation",      icon: RiMoneyDollarCircleLine, label: "Startup Valuation" },
      { to: "/unit-economics", icon: RiCalculatorLine,        label: "Unit Economics" },
      { to: "/investor-crm",   icon: RiBriefcaseLine,         label: "Investor CRM" },
      { to: "/health",          icon: RiBarChartBoxLine,        label: "Startup Health" },
    ],
  },
  {
    label: "Insights",
    links: [
      { to: "/analytics",    icon: RiBarChartBoxLine, label: "Analytics" },
      { to: "/achievements", icon: RiTrophyLine,      label: "Achievements" },
    ],
  },
  {
    label: "Account",
    links: [
      { to: "/profile",  icon: RiUserLine,     label: "Profile" },
      { to: "/settings", icon: RiSettingsLine, label: "Settings" },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", inset: 0, zIndex: 40,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">⚡ IdeaForge AI</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <span className="badge badge-gold"   style={{ fontSize: 10 }}>{(user?.plan || "free").toUpperCase()}</span>
            <span className="badge badge-purple" style={{ fontSize: 10 }}>Lvl {user?.level || 1}</span>
            <span className="badge badge-emerald"style={{ fontSize: 10 }}>⭐ {user?.xp || 0} XP</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.links.map(({ to, icon: Icon, label, tag, dot }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/dashboard"}
                  className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                  onClick={onClose}
                >
                  <Icon className="sidebar-icon" />
                  <span style={{ flex: 1 }}>{label}</span>
                  {dot && (
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "var(--gold)", flexShrink: 0,
                    }} />
                  )}
                  {tag && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 6px",
                      borderRadius: "var(--radius-full)", flexShrink: 0,
                      background: tag === "HOT" ? "rgba(249,115,22,0.18)" : "rgba(245,158,11,0.15)",
                      color: tag === "HOT" ? "var(--orange)" : "var(--gold)",
                      border: `1px solid ${tag === "HOT" ? "rgba(249,115,22,0.3)" : "rgba(245,158,11,0.25)"}`,
                    }}>{tag}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: "var(--radius-sm)",
              marginBottom: 6, background: "var(--glass-2)",
              border: "1px solid var(--border-subtle)", textDecoration: "none",
              transition: "background var(--transition-fast)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--glass-3)"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--glass-2)"}
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--gold),var(--orange))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#000", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Founder"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email || ""}
              </div>
            </div>
          </NavLink>

          <button
            className="sidebar-link"
            onClick={() => { logout(); navigate("/"); }}
            style={{ width: "100%", color: "var(--red)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <RiLogoutBoxLine className="sidebar-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
