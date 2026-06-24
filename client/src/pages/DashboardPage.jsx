import { useEffect, useState } from "react";
import { generateIdea } from "../services/aiService";
import api from "../services/api";
import DashboardLayout from "../components/layouts/DashboardLayout";

export default function DashboardPage() {

  const [ideas, setIdeas] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get("/ideas");
      setIdeas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGenerate = async () => {

    if (!prompt.trim()) {
      alert("Enter a prompt");
      return;
    }

    try {

      setLoading(true);

      const data =
      await generateIdea(prompt);

      setResult(data.result);

    } catch (err) {

      console.log(err);

      alert("Generation Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <DashboardLayout>

      <div className="dashboard-page">

        <div className="dashboard-hero">

          <div>
            <h1>
              Welcome Back 👋
            </h1>

            <p>
              Build, validate and launch
              your next startup using AI.
            </p>
          </div>

          <button className="primary-btn">
            Upgrade Plan
          </button>

        </div>

        <div className="stats-row">

          <div className="metric-card">
            <h3>Total Ideas</h3>
            <h2>{ideas.length}</h2>
          </div>

          <div className="metric-card">
            <h3>AI Requests</h3>
            <h2>{result ? 1 : 0}</h2>
          </div>

          <div className="metric-card">
            <h3>Startup Score</h3>
            <h2>92%</h2>
          </div>

          <div className="metric-card">
            <h3>Status</h3>
            <h2>Active</h2>
          </div>

        </div>

        <div className="dashboard-grid">

          <div className="generator-card">

            <h2>
              AI Startup Generator
            </h2>

            <p>
              Describe your startup idea
              and let AI refine it.
            </p>

            <textarea
              rows="8"
              placeholder="Example: Build an AI platform for students..."
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
            />

            <button
              className="primary-btn generate-btn"
              onClick={handleGenerate}
            >
              {
                loading
                ? "Generating..."
                : "Generate Startup"
              }
            </button>

          </div>

          <div className="result-card">

            <h2>
              Generated Result
            </h2>

            <div className="result-output">

              {
                result
                ? result
                : "Your AI generated startup idea will appear here."
              }

            </div>

          </div>

        </div>

        <div className="ideas-section">

          <div className="section-title">

            <h2>
              Recent Ideas
            </h2>

          </div>

          <div className="ideas-grid">

            {
              ideas.length > 0
              ? ideas.map((idea) => (

                <div
                  className="startup-card"
                  key={idea._id}
                >

                  <h3>
                    {idea.title}
                  </h3>

                  <p>
                    {idea.description}
                  </p>

                </div>

              ))
              : (
                <div className="empty-card">

                  No ideas available yet.

                </div>
              )
            }

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}