import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { RiEyeLine, RiEyeOffLine, RiCheckLine } from "react-icons/ri";
import FloatingParticles from "../components/FloatingParticles";

const PERKS = [
  "10 AI startup ideas per day — free forever",
  "Full dashboard & workspace",
  "AI Mentor Chat with 7 expert personas",
  "Market validation & competitor analysis",
  "No credit card required",
];

export default function SignupPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const { signup } = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Welcome to IdeaForge AI! 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg-base)", position: "relative", overflow: "hidden",
    }}>
      <FloatingParticles count={30} color="rgba(139,92,246,0.2)" mouseConnect={false} />

      {/* Right panel — social proof (hidden on mobile) */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "60px 80px",
        background: "linear-gradient(135deg,rgba(139,92,246,0.06),rgba(245,158,11,0.03))",
        borderRight: "1px solid var(--border-subtle)",
        position: "relative", zIndex: 1,
      }} className="auth-left-panel">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,var(--gold),var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⚡ IdeaForge AI</span>
          </Link>

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Join 2,800+ founders<br />building with AI
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, maxWidth: 360, marginBottom: 36 }}>
            Everything you need to validate, plan, and pitch your startup idea — completely free to start.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
            {PERKS.map(p => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RiCheckLine style={{ color: "var(--emerald)", fontSize: 12 }} />
                </div>
                {p}
              </div>
            ))}
          </div>

          {/* Testimonial snippet */}
          <div style={{ background: "var(--glass-2)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "18px 20px", maxWidth: 380 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 12 }}>
              "IdeaForge helped me validate my fintech idea and land our seed round in 6 weeks."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#000" }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Arjun Mehta</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Founder, FinFlow AI</div>
              </div>
              <div style={{ marginLeft: "auto", color: "var(--gold)", fontSize: 12 }}>⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form panel */}
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
          <div className="auth-mobile-logo" style={{ marginBottom: 32 }}>
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,var(--gold),var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>⚡ IdeaForge AI</span>
            </Link>
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
            Free forever · No credit card · 2-minute setup
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label-text">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="label-text">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="label-text">Password</label>
              <input
                type={showPass ? "text" : "password"}
                className="input-field"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
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

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginBottom: 16, marginTop: -8 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 3,
                    background: password.length > i * 3 + 2
                      ? i === 0 ? "var(--red)" : i === 1 ? "var(--gold)" : "var(--emerald)"
                      : "var(--glass-3)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="spin" style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", display: "inline-block" }} />
                  Creating account...
                </span>
              ) : "Create Free Account →"}
            </motion.button>
          </form>

          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--gold)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
