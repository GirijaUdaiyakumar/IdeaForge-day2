const express = require("express");

const router = express.Router();

const {
  generateStartupIdea,
} = require("../controllers/aiController");

router.post("/chat", generateStartupIdea);

module.exports = router;