import { useState } from "react";
import { generateIdea } from "../services/aiService";

function GenerateIdeaPage() {

  const [prompt, setPrompt] =
  useState("");

  const [result, setResult] =
  useState("");

  const [loading, setLoading] =
  useState(false);

  const handleGenerate =
  async () => {

    if (!prompt) {
      alert("Enter a prompt");
      return;
    }

    try {

      setLoading(true);

      const data =
      await generateIdea(prompt);

      setResult(data.result);

    } catch {

      alert("Generation Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>AI Startup Generator</h1>

      <textarea
        rows="6"
        cols="60"
        placeholder="Describe your startup idea..."
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />

      <br /><br />

      <button
        onClick={handleGenerate}
      >
        {
          loading
          ? "Generating..."
          : "Generate Idea"
        }
      </button>

      <br /><br />

      <h2>AI Response</h2>

      <p>{result}</p>

    </div>
  );
}

export default GenerateIdeaPage;