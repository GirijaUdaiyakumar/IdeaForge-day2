const express = require("express");
const {
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleBookmark,
  getStats,
} = require("../controllers/ideaController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getStats);
router.get("/", protect, getIdeas);
router.get("/:id", protect, getIdeaById);
router.post("/", protect, createIdea);
router.put("/:id", protect, updateIdea);
router.patch("/:id/bookmark", protect, toggleBookmark);
router.delete("/:id", protect, deleteIdea);

module.exports = router;
