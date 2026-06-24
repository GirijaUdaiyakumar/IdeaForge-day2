const express = require("express");

const router = express.Router();

const {
  generateIdea
} = require("../controllers/aiController");

router.post(
  "/generate",
  generateIdea
);

module.exports = router;