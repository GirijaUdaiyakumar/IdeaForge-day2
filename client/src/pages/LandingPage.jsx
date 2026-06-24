import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing">

      <nav className="navbar">
        <div className="logo">
          IdeaForge
        </div>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="btn btn-secondary">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="btn btn-primary">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-left">

          <span className="badge">
            AI POWERED
          </span>

          <h1>
            Generate Startup Ideas
            <span> Instantly</span>
          </h1>

          <p>
            Turn thoughts into startup ideas
            with AI-powered clarity and build
            your next innovation faster than ever.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary">
              Get Started
            </button>

            <button className="btn btn-secondary">
              Learn More
            </button>
          </div>

        </div>

        <div className="hero-right">

          <div className="rocket-card">

            <div className="rocket">
              🚀
            </div>

            <h3>
              AI Idea Generator
            </h3>

            <p>
              Startup concept delivered in
              seconds with intelligent
              recommendations.
            </p>

          </div>

        </div>

      </section>

      <section className="stats">

        <div className="stat-card">
          <h2>500+</h2>
          <p>Ideas Generated</p>
        </div>

        <div className="stat-card">
          <h2>Top Rated</h2>
          <p>By Founders</p>
        </div>

        <div className="stat-card">
          <h2>AI Powered</h2>
          <p>Startup Creation</p>
        </div>

      </section>

    </div>
  );
}

export default LandingPage;