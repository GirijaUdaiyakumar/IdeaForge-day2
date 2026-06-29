const { askGroq, askGroqMessages } = require("../services/groq");
const Idea = require("../models/Ideas");
const Chat = require("../models/Chat");

// Helper must be declared BEFORE chatWithAI to avoid const hoisting issues
const askGroqChat = (messages) => askGroqMessages(messages);

const PERSONA_PROMPTS = {
  mentor: `You are an experienced startup mentor who has helped 200+ founders build billion-dollar companies. 
You give practical, actionable advice with a warm but direct communication style. 
You draw from real-world startup experience. Always ask clarifying questions and provide structured guidance.`,

  investor: `You are a seasoned venture capital investor who has evaluated 10,000+ startups. 
You think in terms of market size, unit economics, defensibility, and team quality. 
You ask the hard questions investors ask. Give honest, investment-grade feedback.`,

  cto: `You are a world-class CTO who has built scalable systems at top tech companies. 
You advise on technical architecture, stack selection, MVP scope, scaling strategy, and engineering hiring.
You are pragmatic, systems-thinking, and love elegant technical solutions.`,

  marketing: `You are a growth marketing expert who has scaled multiple startups from 0 to millions of users. 
You specialize in GTM strategy, viral loops, content marketing, paid acquisition, and brand building. 
Give channel-specific, data-driven marketing advice.`,

  product: `You are a visionary product manager who has shipped products loved by millions. 
You think deeply about user psychology, product-market fit, feature prioritization, and roadmaps.
You use frameworks like Jobs-to-be-Done, OKRs, and North Star metrics.`,

  financial: `You are a startup CFO and financial advisor with deep expertise in startup finance. 
You advise on unit economics, burn rate, fundraising strategy, financial modeling, and revenue optimization.
Always be specific with numbers and financial frameworks.`,

  cofounder: `You are an AI co-founder who thinks like an execution-focused entrepreneur. 
You help break down big goals into weekly sprints, identify the critical path, remove blockers, and maintain momentum.
You are energetic, resourceful, and obsessed with building.`,
};

const generateIdea = async (req, res) => {
  try {
    const { prompt, save } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const enhancedPrompt = `Generate a comprehensive startup idea based on: "${prompt}"
    
Return ONLY a valid JSON object with these exact fields:
{
  "title": "Startup Name",
  "problem": "Specific problem being solved",
  "solution": "How your startup solves it",
  "audience": "Target customer segment",
  "revenue": "Revenue model and pricing strategy",
  "techStack": "Recommended technology stack",
  "growth": "Go-to-market and growth strategy",
  "investment": "Estimated initial investment needed",
  "score": "X/10",
  "marketSize": "Total addressable market size",
  "competitors": "Key competitors and differentiators",
  "pitchLine": "One-sentence investor pitch"
}`;

    const result = await askGroq(enhancedPrompt);

    // Optionally save to ideas collection
    if (save && req.user) {
      await Idea.create({
        user: req.user,
        title: result.title || "Untitled Startup",
        category: "AI Generated",
        problem: result.problem || "",
        description: result.solution || "",
        solution: result.solution || "",
        audience: result.audience || "",
        revenue: result.revenue || "",
        techStack: result.techStack || "",
        growth: result.growth || "",
        investment: result.investment || "",
        score: result.score || "",
        marketSize: result.marketSize || "",
        competitors: result.competitors || "",
        pitchLine: result.pitchLine || "",
        aiGenerated: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI generateIdea Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to generate startup idea.",
    });
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message, persona = "mentor", chatId, history = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.mentor;

    // Build conversation context
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const reply = await askGroqChat(messages);

    // Save or update chat in database
    let chat;
    if (chatId) {
      chat = await Chat.findOneAndUpdate(
        { _id: chatId, user: req.user },
        {
          $push: {
            messages: [
              { role: "user", content: message },
              { role: "assistant", content: reply },
            ],
          },
        },
        { new: true }
      );
    } else {
      // Create new chat with auto-generated title
      const titlePrompt = message.length > 60 ? message.substring(0, 60) + "..." : message;
      chat = await Chat.create({
        user: req.user,
        title: titlePrompt,
        persona,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: reply },
        ],
      });
    }

    return res.status(200).json({
      success: true,
      reply,
      chatId: chat?._id,
    });
  } catch (error) {
    console.error("AI chatWithAI Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI chat failed.",
    });
  }
};

const analyzeCompetitors = async (req, res) => {
  try {
    const { startup, industry } = req.body;

    if (!startup) {
      return res.status(400).json({ success: false, message: "Startup description required." });
    }

    const prompt = `Analyze competitors for this startup: "${startup}" in the ${industry || "tech"} industry.

Return ONLY valid JSON:
{
  "directCompetitors": [
    {"name": "", "strength": "", "weakness": "", "marketShare": ""}
  ],
  "indirectCompetitors": [
    {"name": "", "description": ""}
  ],
  "competitiveAdvantages": ["advantage1", "advantage2"],
  "marketGaps": ["gap1", "gap2"],
  "differentiationStrategy": "",
  "moat": "",
  "competitiveScore": "X/10"
}`;

    const result = await askGroq(prompt);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("analyzeCompetitors Error:", error);
    return res.status(500).json({ success: false, message: "Competitor analysis failed." });
  }
};

const validateMarket = async (req, res) => {
  try {
    const { idea, targetMarket } = req.body;

    if (!idea) {
      return res.status(400).json({ success: false, message: "Idea description required." });
    }

    const prompt = `Perform market validation for: "${idea}" targeting "${targetMarket || "general consumers"}".

Return ONLY valid JSON:
{
  "marketDemand": "High/Medium/Low",
  "tam": "Total Addressable Market size",
  "sam": "Serviceable Addressable Market",
  "som": "Serviceable Obtainable Market",
  "customerPainScore": "X/10",
  "willingnessToPay": "Estimated price point",
  "validationMethods": ["method1", "method2"],
  "keyRisks": ["risk1", "risk2"],
  "earlyAdopters": "Description of early adopters",
  "validationScore": "X/10",
  "recommendation": "Go/No-Go/Pivot recommendation"
}`;

    const result = await askGroq(prompt);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("validateMarket Error:", error);
    return res.status(500).json({ success: false, message: "Market validation failed." });
  }
};

const generatePitch = async (req, res) => {
  try {
    const { startup, problem, solution, market, traction } = req.body;

    if (!startup) {
      return res.status(400).json({ success: false, message: "Startup info required." });
    }

    const prompt = `Create a compelling investor pitch deck for:
Startup: ${startup}
Problem: ${problem || ""}
Solution: ${solution || ""}
Market: ${market || ""}
Traction: ${traction || "Early stage"}

Return ONLY valid JSON:
{
  "headline": "Compelling one-liner",
  "problemSlide": "Problem description for investors",
  "solutionSlide": "Solution explanation",
  "marketSlide": "Market opportunity details",
  "businessModelSlide": "How you make money",
  "tractionSlide": "Current traction and metrics",
  "teamSlide": "Team description",
  "financialsSlide": "Financial projections summary",
  "askSlide": "What you're asking investors for",
  "closingLine": "Memorable closing statement",
  "valuationRange": "Suggested valuation range"
}`;

    const result = await askGroq(prompt);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("generatePitch Error:", error);
    return res.status(500).json({ success: false, message: "Pitch generation failed." });
  }
};

const generateBusinessPlan = async (req, res) => {
  try {
    const { startup, industry, targetMarket } = req.body;

    if (!startup) {
      return res.status(400).json({ success: false, message: "Startup info required." });
    }

    const prompt = `Create a comprehensive business plan for: "${startup}" in the ${industry || "technology"} industry targeting ${targetMarket || "B2B and B2C"}.

Return ONLY valid JSON:
{
  "executiveSummary": "Executive summary",
  "companyDescription": "Company description",
  "productsServices": "Products and services",
  "marketAnalysis": "Market analysis",
  "marketingStrategy": "Marketing strategy",
  "operationalPlan": "Operations plan",
  "managementTeam": "Team structure needed",
  "financialProjections": {
    "year1Revenue": "",
    "year2Revenue": "",
    "year3Revenue": "",
    "breakEven": ""
  },
  "fundingRequirements": "Funding needed and use of funds",
  "milestones": ["milestone1", "milestone2", "milestone3"],
  "exitStrategy": "Exit strategy options"
}`;

    const result = await askGroq(prompt);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("generateBusinessPlan Error:", error);
    return res.status(500).json({ success: false, message: "Business plan generation failed." });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user })
      .select("title persona isPinned folder createdAt updatedAt")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: chats });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch chats." });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user });
    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });
    return res.status(200).json({ success: true, data: chat });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch chat." });
  }
};

const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({ _id: req.params.id, user: req.user });
    return res.status(200).json({ success: true, message: "Chat deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete chat." });
  }
};

// Helper: chat completion (multi-turn) — defined at TOP of file to avoid hoisting issues

module.exports = {
  generateIdea,
  chatWithAI,
  analyzeCompetitors,
  validateMarket,
  generatePitch,
  generateBusinessPlan,
  getChatHistory,
  getChatById,
  deleteChat,
};