const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { askGroq } = require("../services/groq");

const {
  generateIdea,
  chatWithAI,
  analyzeCompetitors,
  validateMarket,
  generatePitch,
  generateBusinessPlan,
  getChatHistory,
  getChatById,
  deleteChat,
} = require("../controllers/aiController");

// Freeform JSON prompt — used by radar, forecast, SWOT etc.
// Does NOT add the startup-idea template wrapper
router.post("/freeform", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required." });
    }
    const result = await askGroq(prompt);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("AI freeform error:", err.message);
    return res.status(500).json({ success: false, message: "AI request failed." });
  }
});

// Structured AI routes
router.post("/generate", protect, generateIdea);
router.post("/chat", protect, chatWithAI);
router.post("/competitors", protect, analyzeCompetitors);
router.post("/validate", protect, validateMarket);
router.post("/pitch", protect, generatePitch);
router.post("/business-plan", protect, generateBusinessPlan);

// Chat history
router.get("/chats", protect, getChatHistory);
router.get("/chats/:id", protect, getChatById);
router.delete("/chats/:id", protect, deleteChat);

module.exports = router;
