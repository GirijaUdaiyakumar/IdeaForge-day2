import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">

      <nav className="landing-navbar">

        <div className="brand">
          IdeaForge
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">How It Works</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-actions">
          <Link to="/login">
            <button className="outline-btn">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="primary-btn">
              Get Started
            </button>
          </Link>
        </div>

      </nav>

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            AI POWERED STARTUP CREATION
          </span>

          <h1>
            Build Your Next
            <span> Startup </span>
            With AI
          </h1>

          <p>
            Generate startup ideas, validate
            opportunities, discover revenue
            models and save everything inside
            one intelligent platform.
          </p>

          <div className="hero-buttons">

            <Link to="/signup">
              <button className="primary-btn">
                Start Building
              </button>
            </Link>

            <button className="outline-btn">
              Watch Demo
            </button>

          </div>

        </div>

        <div className="hero-preview">

          <div className="preview-card">

            <div className="preview-header">
              AI Startup Generator
            </div>

            <div className="preview-body">

              <p>
                Prompt:
              </p>

              <div className="fake-input">
                Generate an EdTech startup...
              </div>

              <button className="primary-btn">
                Generate
              </button>

              <div className="generated-card">

                <h3>
                  StudySphere
                </h3>

                <p>
                  AI powered learning platform
                  for college students.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section
        id="features"
        className="features-section"
      >

        <h2>
          Everything You Need
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>AI Startup Ideas</h3>
            <p>
              Generate innovative ideas instantly.
            </p>
          </div>

          <div className="feature-card">
            <h3>Market Analysis</h3>
            <p>
              Validate opportunities using AI.
            </p>
          </div>

          <div className="feature-card">
            <h3>Save Ideas</h3>
            <p>
              Build your startup portfolio.
            </p>
          </div>

          <div className="feature-card">
            <h3>Founder Dashboard</h3>
            <p>
              Manage ideas in one place.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
