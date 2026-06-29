import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar";
import MobileNav from "../MobileNav";
import VoiceAI from "../VoiceAI";
import useAuth from "../../hooks/useAuth";
import { RiMenuLine, RiCloseLine, RiBellLine, RiSearchLine } from "react-icons/ri";

const PAGE_TITLES = {
  "/dashboard":        "Dashboard",
  "/ideas":            "My Ideas",
  "/add-idea":         "Add Idea",
  "/projects":         "Projects Board",
  "/generate":         "AI Generator",
  "/generate-idea":    "AI Generator",
  "/ai-chat":          "AI Mentor Chat",
  "/validate":         "Market Validation",
  "/competitors":      "Competitor Analysis",
  "/pitch":            "Pitch Deck AI",
  "/business-plan":    "Business Planner",
  "/radar":            "Startup Radar",
  "/revenue-forecast": "Revenue Forecast",
  "/swot":             "SWOT Analysis",
  "/roadmap":          "Startup Roadmap",
  "/branding":         "AI Branding Studio",
  "/canvas":           "Business Model Canvas",
  "/valuation":        "Startup Valuation",
  "/unit-economics":   "Unit Economics",
  "/investor-crm":     "Investor CRM",
  "/health":           "Startup Health Check",
  "/analytics":        "Analytics",
  "/achievements":     "Achievements",
  "/notifications":    "Notifications",
  "/profile":          "Profile",
  "/settings":         "Settings",
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || "IdeaForge AI";
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const dispatchCmd = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { ctrlKey: true, key: "k", bubbles: true }));
  };

  return (
    <div className="aurora-bg" style={{ minHeight: "100vh" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        {/* ── Sticky Top Header ── */}
        <header style={{
          height: "var(--header-height)",
          background: "rgba(3,7,18,0.92)",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex", alignItems: "center",
          padding: "0 20px",
          backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 50,
          gap: 14,
        }}>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
            style={{
              background: "none", border: "none",
              color: "var(--text-secondary)", fontSize: 22,
              cursor: "pointer", display: "flex", alignItems: "center",
              padding: "4px 6px", borderRadius: 6, flexShrink: 0,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
          >
            {sidebarOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>

          {/* Page title */}
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: 15, color: "var(--text-primary)", flex: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {pageTitle}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Ctrl+K search button — hide on very small screens */}
            <button
              onClick={dispatchCmd}
              aria-label="Open command palette (Ctrl+K)"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--glass-2)", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)", padding: "5px 12px",
                color: "var(--text-muted)", cursor: "pointer",
                fontSize: 13, transition: "var(--transition-fast)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.color = "var(--text-muted)"; }}
              className="cmd-btn"
            >
              <RiSearchLine style={{ fontSize: 14 }} />
              <span className="cmd-hint" style={{ display: "flex", gap: 4 }}>
                <kbd style={{ background: "var(--glass-3)", border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "var(--font-mono)" }}>Ctrl</kbd>
                <kbd style={{ background: "var(--glass-3)", border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontFamily: "var(--font-mono)" }}>K</kbd>
              </span>
            </button>

            {/* Notifications */}
            <Link to="/notifications" style={{ position: "relative", display: "flex" }}>
              <button
                aria-label="Notifications"
                style={{
                  background: "var(--glass-2)", border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)", width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-secondary)", fontSize: 17, cursor: "pointer",
                  transition: "var(--transition-fast)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--glass-3)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--glass-2)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <RiBellLine />
              </button>
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 7, height: 7, borderRadius: "50%",
                background: "var(--gold)", border: "1.5px solid var(--bg-base)",
                animation: "badge-pulse 2.5s ease infinite",
              }} />
            </Link>

            {/* Avatar */}
            <Link to="/profile" aria-label="Go to profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--gold), var(--orange))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: "#000",
                  border: "2px solid rgba(245,158,11,0.3)",
                }}
              >
                {initials}
              </motion.div>
            </Link>
          </div>
        </header>

        {/* ── Page Content ── */}
        <motion.main
          key={location.pathname}
          className="page-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ paddingBottom: 80 }}
        >
          {children}
        </motion.main>

        {/* ── Mobile Bottom Nav ── */}
        <MobileNav />

        {/* ── Voice AI Assistant ── */}
        <VoiceAI />
      </div>
    </div>
  );
}
