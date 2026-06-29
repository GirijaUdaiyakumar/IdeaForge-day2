const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

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

// All AI routes require authentication
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
