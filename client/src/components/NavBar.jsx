import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome,
  FiGrid,
  FiCpu,
  FiUser,
  FiSun,
  FiMoon
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function NavBar() {
  const location = useLocation();

  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("light-theme", !dark);
  }, [dark]);

  return (
    <motion.nav
      className="nav-bar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link className="nav-brand" to="/">
        <span className="logo-gradient">
          IdeaForge
        </span>
      </Link>

      <div className="nav-links">

        <Link
          className={location.pathname === "/" ? "active" : ""}
          to="/"
        >
          <FiHome />
          Home
        </Link>

        <Link
          className={location.pathname === "/dashboard" ? "active" : ""}
          to="/dashboard"
        >
          <FiGrid />
          Dashboard
        </Link>

        <Link
          className={location.pathname === "/generate-idea" ? "active" : ""}
          to="/generate-idea"
        >
          <FiCpu />
          AI Studio
        </Link>

        <Link
          className={location.pathname === "/profile" ? "active" : ""}
          to="/profile"
        >
          <FiUser />
          Profile
        </Link>

      </div>

      <div className="nav-right">

        <button
          className="theme-btn"
          onClick={() => setDark(!dark)}
        >
          {dark ? <FiSun /> : <FiMoon />}
        </button>

        <Link to="/login">
          <button className="login-btn">
            Login
          </button>
        </Link>

        <Link to="/signup">
          <button className="premium-btn">
            Get Started
          </button>
        </Link>

      </div>
    </motion.nav>
  );
}