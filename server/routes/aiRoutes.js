const express = require("express");

const router = express.Router();

const { generateIdea } = require("../controllers/aiController");

router.post("/chat", generateIdea);

module.exports = router;