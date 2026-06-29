import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import FloatingParticles from "../components/FloatingParticles";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 👋");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "var(--bg-base)",
      position: "relative",
      overflow: "hidden",
    }}>
      <FloatingParticles count={30} color="rgba(245,158,11,0.2)" mouseConnect={false} />

      {/* Left panel — branding (hidden on mobile) */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 80px",
        background: "linear-gradient(135deg,rgba(245,158,11,0.06),rgba(139,92,246,0.04))",
        borderRight: "1px solid var(--border-subtle)",
        position: "relative", zIndex: 1,
      }} className="auth-left-panel">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,var(--gold),var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IdeaForge AI</span>
          </Link>

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, lineHeight: 1.1, marginBottom: 18 }}>
            Build the next<br /><span style={{ background: "linear-gradient(135deg,var(--gold),var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Billion-Dollar Startup</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 380, marginBottom: 40 }}>
            Your complete AI startup team. Generate ideas, validate markets, build pitches — all in one workspace.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["⚡ AI Startup Generator","🤖 7 Expert AI Mentors","📊 Business Model Canvas","💰 Investor CRM","🗺️ Startup Roadmap","💎 Startup Valuation"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: "100%", maxWidth: 480,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 32, position: "relative", zIndex: 1,
      }}>
        <motion.div
          style={{ width: "100%", maxWidth: 400 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ marginBottom: 32 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,var(--gold),var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⚡ IdeaForge AI</span>
            </Link>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>Sign in to your workspace</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label-text">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="label-text">Password</label>
              <input
                type={showPass ? "text" : "password"}
                className="input-field"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 14, top: 37, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 17, display: "flex", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
              >
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                  Signing in...
                </span>
              ) : "Sign In →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--gold)", fontWeight: 600 }}>
              Create one free
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div style={{ marginTop: 24, padding: "12px 16px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
            🔑 No account? <Link to="/signup" style={{ color: "var(--gold)" }}>Sign up free</Link> — no credit card required
          </div>
        </motion.div>
      </div>
    </div>
  );
}
