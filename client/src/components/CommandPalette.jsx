import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiSearchLine, RiArrowRightUpLine, RiFlashlightLine, RiLightbulbLine,
  RiMessage3Line, RiBarChartBoxLine, RiUserLine, RiSettingsLine,
  RiTrophyLine, RiBellLine, RiShieldCheckLine, RiSearchEyeLine,
  RiPresentationLine, RiFileListLine, RiRadarLine, RiLineChartLine,
  RiGridLine, RiAddLine } from "react-icons/ri";

const COMMANDS = [
  { id: "dashboard",     label: "Dashboard",              icon: RiBarChartBoxLine, to: "/dashboard",       section: "Pages",   keys: ["dashboard"] },
  { id: "ideas",         label: "My Ideas",               icon: RiLightbulbLine,  to: "/ideas",           section: "Pages",   keys: ["ideas","startup"] },
  { id: "add-idea",      label: "Add New Idea",           icon: RiAddLine,        to: "/add-idea",        section: "Pages",   keys: ["add","idea","new"] },
  { id: "generate",      label: "AI Generator",           icon: RiFlashlightLine, to: "/generate",        section: "AI Tools",keys: ["generate","ai","startup"] },
  { id: "ai-chat",       label: "AI Mentor Chat",         icon: RiMessage3Line,   to: "/ai-chat",         section: "AI Tools",keys: ["chat","mentor","ai"] },
  { id: "validate",      label: "Market Validation",      icon: RiShieldCheckLine,to: "/validate",        section: "AI Tools",keys: ["market","validate"] },
  { id: "competitors",   label: "Competitor Analysis",    icon: RiSearchEyeLine,  to: "/competitors",     section: "AI Tools",keys: ["competitor","analysis"] },
  { id: "pitch",         label: "Pitch Deck AI",          icon: RiPresentationLine,to: "/pitch",          section: "AI Tools",keys: ["pitch","deck","investor"] },
  { id: "business-plan", label: "Business Planner",       icon: RiFileListLine,   to: "/business-plan",   section: "AI Tools",keys: ["business","plan"] },
  { id: "radar",         label: "Startup Radar",          icon: RiRadarLine,      to: "/radar",           section: "AI Tools",keys: ["radar","score","readiness"] },
  { id: "revenue",       label: "Revenue Forecast",       icon: RiLineChartLine,  to: "/revenue-forecast",section: "AI Tools",keys: ["revenue","forecast","financial"] },
  { id: "swot",          label: "SWOT Analysis",          icon: RiGridLine,       to: "/swot",            section: "AI Tools",keys: ["swot","strengths"] },
  { id: "roadmap",       label: "Startup Roadmap",        icon: RiRadarLine,      to: "/roadmap",         section: "AI Tools",keys: ["roadmap","plan","timeline"] },
  { id: "branding",      label: "AI Branding Studio",     icon: RiRadarLine,      to: "/branding",        section: "AI Tools",keys: ["branding","name","logo","color"] },
  { id: "canvas",        label: "Business Model Canvas",  icon: RiRadarLine,      to: "/canvas",          section: "Finance & Strategy",keys: ["canvas","business","model"] },
  { id: "valuation",     label: "Startup Valuation",      icon: RiRadarLine,      to: "/valuation",       section: "Finance & Strategy",keys: ["valuation","worth","value","cap"] },
  { id: "unit-econ",     label: "Unit Economics",         icon: RiRadarLine,      to: "/unit-economics",  section: "Finance & Strategy",keys: ["unit","economics","cac","ltv","burn"] },
  { id: "investor-crm",  label: "Investor CRM",           icon: RiRadarLine,      to: "/investor-crm",    section: "Finance & Strategy",keys: ["investor","crm","funding","raise"] },
  { id: "health",        label: "Startup Health Check",   icon: RiBarChartBoxLine,to: "/health",          section: "Finance & Strategy",keys: ["health","check","diagnostics","score"] },
  { id: "projects",      label: "Projects Board",         icon: RiBarChartBoxLine,to: "/projects",        section: "Pages",   keys: ["projects","kanban","tasks","board"] },
  { id: "canvas",        label: "Business Model Canvas",  icon: RiGridLine,       to: "/canvas",          section: "AI Tools",keys: ["canvas","business","model"] },
  { id: "valuation",     label: "Startup Valuation",      icon: RiLineChartLine,  to: "/valuation",       section: "AI Tools",keys: ["valuation","worth","value"] },
  { id: "analytics",     label: "Analytics",              icon: RiBarChartBoxLine,to: "/analytics",       section: "Insights",keys: ["analytics","stats"] },
  { id: "achievements",  label: "Achievements",           icon: RiTrophyLine,     to: "/achievements",    section: "Insights",keys: ["achievements","badges","xp"] },
  { id: "notifications", label: "Notifications",          icon: RiBellLine,       to: "/notifications",   section: "Insights",keys: ["notifications","alerts"] },
  { id: "profile",       label: "Profile",                icon: RiUserLine,       to: "/profile",         section: "Account", keys: ["profile","account"] },
  { id: "settings",      label: "Settings",               icon: RiSettingsLine,   to: "/settings",        section: "Account", keys: ["settings","preferences"] },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef  = useRef(null);
  const listRef   = useRef(null);

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.keys.some(k => k.includes(query.toLowerCase()))
      )
    : COMMANDS;

  const execute = useCallback((cmd) => {
    navigate(cmd.to);
    onClose();
    setQuery("");
    setSelected(0);
  }, [navigate, onClose]);

  useEffect(() => {
    if (open) {
      setQuery(""); setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.children[selected];
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const handle = e => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter")     { if (filtered[selected]) execute(filtered[selected]); }
      if (e.key === "Escape")    { onClose(); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, filtered, selected, execute, onClose]);

  // Group by section
  const sections = {};
  filtered.forEach(cmd => {
    if (!sections[cmd.section]) sections[cmd.section] = [];
    sections[cmd.section].push(cmd);
  });
  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(3,7,18,0.75)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "14vh", padding: "14vh 16px 0",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "100%", maxWidth: 640,
              background: "rgba(10,15,30,0.98)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1)",
              overflow: "hidden",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <RiSearchLine style={{ color: "var(--gold)", fontSize: 18, flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search pages, AI tools, commands..."
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "var(--text-primary)", fontSize: 15,
                  fontFamily: "var(--font-body)",
                }}
              />
              <div style={{
                display: "flex", gap: 4, alignItems: "center",
                background: "var(--glass-2)", border: "1px solid var(--border-subtle)",
                borderRadius: 6, padding: "3px 8px", fontSize: 11,
                color: "var(--text-muted)", fontFamily: "var(--font-mono)", flexShrink: 0,
              }}>
                ESC
              </div>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                  No results for "{query}"
                </div>
              ) : (
                Object.entries(sections).map(([section, cmds]) => (
                  <div key={section}>
                    <div style={{
                      fontSize: 10, fontWeight: 700, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.09em",
                      padding: "8px 18px 4px",
                    }}>
                      {section}
                    </div>
                    {cmds.map(cmd => {
                      const idx = globalIdx++;
                      const isSelected = idx === selected;
                      return (
                        <div
                          key={cmd.id}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(idx)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "9px 18px", cursor: "pointer",
                            background: isSelected ? "rgba(245,158,11,0.1)" : "transparent",
                            borderLeft: `3px solid ${isSelected ? "var(--gold)" : "transparent"}`,
                            transition: "background 0.1s, border-color 0.1s",
                          }}
                        >
                          <div style={{
                            width: 30, height: 30, borderRadius: "var(--radius-sm)",
                            background: isSelected ? "rgba(245,158,11,0.15)" : "var(--glass-2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: isSelected ? "var(--gold)" : "var(--text-muted)",
                            fontSize: 15, flexShrink: 0,
                          }}>
                            <cmd.icon />
                          </div>
                          <span style={{
                            fontSize: 14, flex: 1,
                            color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                            fontWeight: isSelected ? 600 : 400,
                          }}>
                            {cmd.label}
                          </span>
                          {isSelected && (
                            <RiArrowRightUpLine style={{ color: "var(--gold)", fontSize: 14 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              padding: "10px 18px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex", gap: 18, alignItems: "center",
            }}>
              {[["↑↓","Navigate"], ["↵","Open"], ["Esc","Close"]].map(([key, label]) => (
                <div key={key} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "var(--text-muted)" }}>
                  <kbd style={{ background: "var(--glass-2)", border: "1px solid var(--border-subtle)", borderRadius: 4, padding: "2px 6px", fontFamily: "var(--font-mono)", fontSize: 11 }}>{key}</kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
