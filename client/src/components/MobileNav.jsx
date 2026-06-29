import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiDashboardLine, RiLightbulbLine, RiFlashlightLine,
  RiMessage3Line, RiUserLine,
} from "react-icons/ri";

const ITEMS = [
  { to: "/dashboard", icon: RiDashboardLine, label: "Home" },
  { to: "/ideas",     icon: RiLightbulbLine, label: "Ideas" },
  { to: "/generate",  icon: RiFlashlightLine, label: "Generate", fab: true },
  { to: "/ai-chat",   icon: RiMessage3Line,  label: "Chat" },
  { to: "/profile",   icon: RiUserLine,      label: "Profile" },
];

export default function MobileNav() {
  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        height: 64,
        background: "rgba(3,7,18,0.95)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 200,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {ITEMS.map(({ to, icon: Icon, label, fab }) => (
        <NavLink key={to} to={to} end={to === "/dashboard"}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, textDecoration: "none" }}>
          {({ isActive }) =>
            fab ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--gold), var(--orange))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.4)",
                  marginBottom: 4,
                }}
              >
                <Icon style={{ fontSize: 22, color: "#000" }} />
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ scale: 0.85 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
              >
                <div style={{
                  width: 36, height: 28, borderRadius: "var(--radius-full)",
                  background: isActive ? "rgba(245,158,11,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}>
                  <Icon style={{ fontSize: 20, color: isActive ? "var(--gold)" : "var(--text-muted)" }} />
                </div>
                <span style={{ fontSize: 10, color: isActive ? "var(--gold)" : "var(--text-muted)", fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </motion.div>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}
