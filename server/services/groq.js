const OpenAI = require("openai");

const apiKey = process.env.GROQ_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

const MOCK_IDEA = {
  title: "AgriVision AI",
  problem:
    "Small-scale farmers lack real-time data on crop health, weather patterns, and market prices, leading to 30% annual losses.",
  solution:
    "AI-powered satellite and drone imaging platform that provides farmers with predictive yield analysis, pest detection, and optimal harvest timing.",
  audience: "Small to mid-scale farmers, agricultural cooperatives, agri-insurers",
  revenue: "SaaS subscription at $49/month per farm, plus enterprise licensing for cooperatives",
  techStack: "React Native, Python, TensorFlow, AWS SageMaker, Satellite APIs, MongoDB",
  growth:
    "Partner with agricultural extension services, NGOs, and government agricultural departments",
  investment: "$500K seed round for MVP development and pilot with 100 farms",
  score: "8.5/10",
  marketSize: "$22B global precision agriculture market, growing at 13% CAGR",
  competitors:
    "Trimble Agriculture, Climate Corporation (Bayer). Differentiate via mobile-first, affordable pricing for developing markets.",
  pitchLine: "Turning satellite data into profit for every farmer on the planet.",
};

const extractJSON = (text) => {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (_) {}

  // Extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {}
  }

  // Find JSON object in text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_) {}
  }

  return null;
};

const askGroq = async (prompt) => {
  if (!client) {
    console.warn("GROQ_API_KEY not configured — returning mock data");
    return MOCK_IDEA;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an AI startup expert. Return ONLY valid JSON with no extra text, no markdown, no explanation. Just the raw JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const raw = completion.choices[0].message.content;
    const parsed = extractJSON(raw);

    if (!parsed) {
      console.warn("Could not parse JSON from AI response:", raw.substring(0, 200));
      return MOCK_IDEA;
    }

    return parsed;
  } catch (error) {
    console.error("Groq API Error:", error.message);
    return MOCK_IDEA;
  }
};

const askGroqMessages = async (messages) => {
  if (!client) {
    return "I'm an AI startup mentor. I can help you build, validate, and grow your startup. What would you like to work on today?";
  }

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.8,
      max_tokens: 2048,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Chat Error:", error.message);
    return "I encountered an error processing your request. Please try again.";
  }
};

module.exports = {
  askGroq,
  askGroqMessages,
};
