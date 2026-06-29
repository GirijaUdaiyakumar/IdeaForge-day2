const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  awardXP,
  getDailyMissions,
  completeMission,
  getBadges,
  updateStreak,
} = require("../controllers/userController");

const router = express.Router();

router.post("/xp", protect, awardXP);
router.get("/missions", protect, getDailyMissions);
router.post("/missions/:missionId/complete", protect, completeMission);
router.get("/badges", protect, getBadges);
router.post("/streak", protect, updateStreak);

module.exports = router;
