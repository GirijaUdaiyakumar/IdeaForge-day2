import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse 80% 60% at 20% -10%, rgba(245,158,11,0.07) 0%, transparent 60%), var(--bg-base)",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center", maxWidth: 480 }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--gold), var(--orange))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
          }}
        >
          404
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Page Not Found
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 36 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/dashboard">
            <button className="btn btn-primary">Go to Dashboard</button>
          </Link>
          <Link to="/">
            <button className="btn btn-secondary">Landing Page</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
