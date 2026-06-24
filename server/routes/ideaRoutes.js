const express = require("express");

const {
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
} = require("../controllers/ideaController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getIdeas);

router.post("/", protect, createIdea);

router.put("/:id", protect, updateIdea);

router.delete("/:id", protect, deleteIdea);

module.exports = router;