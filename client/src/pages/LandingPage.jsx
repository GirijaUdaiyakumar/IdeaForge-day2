import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* --- NAVBAR --- */}
      <nav className="landing-navbar">
        <div className="brand">IdeaForge</div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">How It Works</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-actions">
          <Link to="/login">
            <button className="outline-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="primary-btn">Get Started</button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AI POWERED STARTUP CREATION</span>

          <h1>
            Build Your Next <span className="gradient-text">AI Startup</span> Faster Than Ever
          </h1>
          <h3 className="hero-subtitle">
            From Idea → Validation → Revenue → Investment
          </h3>

          <p>
            Transform your startup vision into reality using the power of Artificial Intelligence.
            Generate startup ideas, validate market demand, analyze competitors, build revenue
            models, create investor pitches, save founder notes, and manage every innovation
            inside one premium workspace.
          </p>

          <div className="hero-tags">
            <span>AI Powered</span>
            <span>Business Model</span>
            <span>Roadmap</span>
            <span>Investor Pitch</span>
            <span>Competitor Analysis</span>
          </div>

          <div className="hero-buttons">
            <Link to="/signup">
              <button className="primary-btn">Start Building</button>
            </Link>
            <button className="outline-btn">Watch Demo</button>
          </div>

          <div className="hero-stats">
            <div>
              <h2>1200+</h2>
              <p>Ideas Generated</p>
            </div>
            <div>
              <h2>98%</h2>
              <p>AI Accuracy</p>
            </div>
            <div>
              <h2>350+</h2>
              <p>Founders</p>
            </div>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">AI Startup Generator</div>
            <div className="preview-body">
              <p>Prompt:</p>
              <div className="fake-input">Generate an AI Startup for Agriculture...</div>
              <button className="primary-btn">Generate</button>
              <div className="generated-card">
                <h3>AgriVision AI</h3>
                <p>AI powered crop monitoring and predictive yield platform for farmers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="features-section">
        <div className="section-title">
          <h2>Everything You Need To Build A Startup</h2>
          <p>One platform for founders, entrepreneurs and innovators.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Startup Generator</h3>
            <p>Generate innovative startup ideas using Artificial Intelligence.</p>
          </div>
          <div className="feature-card">
            <h3>Market Validation</h3>
            <p>Discover whether your startup idea has real market demand.</p>
          </div>
          <div className="feature-card">
            <h3>Business Model</h3>
            <p>Create customer segments, revenue models and value propositions.</p>
          </div>
          <div className="feature-card">
            <h3>Investor Pitch</h3>
            <p>Generate ready-to-present startup pitches in seconds.</p>
          </div>
          <div className="feature-card">
            <h3>Founder Notes</h3>
            <p>Save every idea, thought and research in one secure place.</p>
          </div>
          <div className="feature-card">
            <h3>AI Copilot</h3>
            <p>Ask questions, improve ideas and receive AI guidance instantly.</p>
          </div>
          <div className="feature-card">
            <h3>Startup Score</h3>
            <p>Get an AI-powered rating for your startup idea.</p>
          </div>
          <div className="feature-card">
            <h3>Competitor Analysis</h3>
            <p>Understand your competitors before launching.</p>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD PREVIEW --- */}
      <section id="dashboard" className="dashboard-preview">
        <div className="dashboard-left">
          <span className="hero-badge">Dashboard Preview</span>
          <h2>Your Entire Startup Journey In One Dashboard</h2>
          <p>
            Manage AI ideas, founder notes, business models, investor pitches, competitor
            analysis and roadmap generation.
          </p>
          <Link to="/dashboard">
            <button className="primary-btn">Open Dashboard</button>
          </Link>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-window">
            <div className="dashboard-topbar">IdeaForge Dashboard</div>
            <div className="dashboard-boxes">
              <div className="dash-box">
                <h3>18</h3>
                <p>Founder Notes</p>
              </div>
              <div className="dash-box">
                <h3>5</h3>
                <p>Today's Tasks</p>
              </div>
              <div className="dash-box">
                <h3>₹1.2M</h3>
                <p>Revenue Forecast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="pricing-section">
        <div className="section-title">
          <h2>Choose Your Plan</h2>
          <p>Start free and upgrade when you're ready.</p>
        </div>

        <div className="pricing-grid">
          <div className="price-card">
            <h3>Starter</h3>
            <h1>₹0</h1>
            <p>Forever Free</p>
            <ul>
              <li>✓ 10 AI Ideas / Day</li>
              <li>✓ Dashboard</li>
              <li>✓ Founder Notes</li>
              <li>✓ AI Chat</li>
            </ul>
            <button className="outline-btn">Get Started</button>
          </div>

          <div className="price-card featured">
            <span className="popular">Best Value</span>
            <h3>Pro</h3>
            <h1>₹499</h1>
            <p>Per Month</p>
            <ul>
              <li>✓ Unlimited AI Ideas</li>
              <li>✓ Startup Score</li>
              <li>✓ Competitor Analysis</li>
              <li>✓ Investor Pitch</li>
              <li>✓ Roadmap Generator</li>
              <li>✓ AI Copilot</li>
            </ul>
            <button className="primary-btn">Upgrade</button>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="reviews" className="testimonial-section">
        <div className="section-title">
          <h2>Trusted By Founders</h2>
          <p>
            Entrepreneurs and innovators are using IdeaForge to turn their ideas
            into successful startups.
          </p>
        </div>

        <div className="testimonial-grid">

          <div className="testimonial-card">

            <div className="testimonial-rating">
              ⭐⭐⭐⭐⭐
          </div>

          <h3>Arun Kumar</h3>

        <span className="testimonial-role">
          Startup Founder
        </span>

      <p>
        "IdeaForge completely changed how I validate startup ideas.
        The AI-generated business model and market analysis saved me
        countless hours of research."
      </p>

      </div>

      <div className="testimonial-card">

      <div className="testimonial-rating">
        ⭐⭐⭐⭐⭐
      </div>

      <h3>Priya S</h3>

      <span className="testimonial-role">
        Product Designer
      </span>

      <p>
        "The dashboard is beautifully designed and the AI Copilot gives
        practical suggestions for improving business ideas. It feels like
        having a startup mentor available 24/7."
      </p>

    </div>

    <div className="testimonial-card">

      <div className="testimonial-rating">
        ⭐⭐⭐⭐⭐
      </div>

      <h3>Naveen</h3>

      <span className="testimonial-role">
        Software Engineer
      </span>

      <p>
        "From idea generation to investor pitch creation, everything is
        available in one place. IdeaForge is an excellent platform for
        aspiring entrepreneurs."
      </p>

    </div>

  </div>

  </section>

      {/* --- FAQ SECTION --- */}
      <section className="faq-section">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-card">
          <h3>Is IdeaForge Free?</h3>
          <p>Yes. You can start using the free plan instantly.</p>
        </div>
        <div className="faq-card">
          <h3>Which AI Model Does It Use?</h3>
          <p>OpenAI API integration for startup generation.</p>
        </div>
        <div className="faq-card">
          <h3>Can I Save My Ideas?</h3>
          <p>Yes. Every generated idea is stored securely.</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <h2>IdeaForge</h2>
        <p>Build the future with Artificial Intelligence.</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#reviews">Reviews</a>
        </div>
        <p className="copyright">© 2026 IdeaForge. All Rights Reserved.</p>
      </footer>
    </div>
  );
}