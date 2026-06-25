import { useState } from "react";
import generateIdea from "../services/aiService";

export default function GenerateIdeaPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a startup idea.");
      return;
    }

    try {
      setError("");
      setResult(null);
      setLoading(true);

      const data = await generateIdea(prompt);

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate startup idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-page">
      <h1>AI Startup Generator</h1>

      <p>
        Describe your startup idea and let AI generate a complete business
        plan.
      </p>

      <textarea
        rows="8"
        placeholder="Example: Build an AI platform for farmers..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="primary-btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Startup"}
      </button>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {result && (
        <div className="result-card">
          <h2>{result.title}</h2>

          <p>
            <strong>Problem:</strong> {result.problem}
          </p>

          <p>
            <strong>Solution:</strong> {result.solution}
          </p>

          <p>
            <strong>Target Audience:</strong> {result.audience}
          </p>

          <p>
            <strong>Revenue Model:</strong> {result.revenue}
          </p>

          <p>
            <strong>Tech Stack:</strong> {result.techStack}
          </p>

          <p>
            <strong>Growth Strategy:</strong> {result.growth}
          </p>

          <p>
            <strong>Investment Needed:</strong> {result.investment}
          </p>

          <p>
            <strong>AI Score:</strong> {result.score}
          </p>
        </div>
      )}
    </div>
  );
}