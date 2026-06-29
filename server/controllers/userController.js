const User = require("../models/User");
const Idea = require("../models/Ideas");
const Chat = require("../models/Chat");
const Mission = require("../models/Mission");

const DAILY_MISSIONS_POOL = [
  { id: "generate_idea", title: "Generate an AI Idea", description: "Use the AI generator to create a startup idea", xpReward: 20 },
  { id: "save_idea", title: "Save a New Idea", description: "Create and save a startup idea to your workspace", xpReward: 15 },
  { id: "chat_ai", title: "Chat with AI Mentor", description: "Have a conversation with an AI persona", xpReward: 25 },
  { id: "validate_market", title: "Validate a Market", description: "Run a market validation analysis", xpReward: 30 },
  { id: "analyze_competitors", title: "Analyze Competitors", description: "Run a competitor analysis for a startup", xpReward: 30 },
  { id: "generate_pitch", title: "Generate Pitch Deck", description: "Create an investor pitch deck", xpReward: 35 },
  { id: "view_analytics", title: "Review Analytics", description: "Check your analytics dashboard", xpReward: 10 },
  { id: "update_profile", title: "Update Your Profile", description: "Add a bio to your founder profile", xpReward: 15 },
];

const BADGES = [
  { id: "first_idea", title: "Idea Spark", description: "Created your first startup idea", icon: "💡", condition: (stats) => stats.totalIdeas >= 1 },
  { id: "idea_machine", title: "Idea Machine", description: "Created 10 startup ideas", icon: "⚡", condition: (stats) => stats.totalIdeas >= 10 },
  { id: "ai_whisperer", title: "AI Whisperer", description: "Had 5 AI chat conversations", icon: "🤖", condition: (stats) => stats.totalChats >= 5 },
  { id: "validator", title: "Market Validator", description: "Validated your first market", icon: "🎯", condition: (stats) => stats.validated >= 1 },
  { id: "pitcher", title: "Pitch Master", description: "Generated your first pitch deck", icon: "🚀", condition: (stats) => stats.pitches >= 1 },
  { id: "founder", title: "Founding Member", description: "Joined IdeaForge AI", icon: "🏆", condition: () => true },
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 8000, 12000, 20000];

const getLevel = (xp) => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
};

// Award XP and check for level up / badges
const awardXP = async (req, res) => {
  try {
    const { action, amount } = req.body;
    if (!action || !amount) return res.status(400).json({ message: "action and amount required" });

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.xp = (user.xp || 0) + amount;
    user.level = getLevel(user.xp);

    // Check and award badges
    const totalIdeas = await Idea.countDocuments({ user: req.user });
    const totalChats = await Chat.countDocuments({ user: req.user });
    const stats = { totalIdeas, totalChats, validated: 0, pitches: 0 };

    const newBadges = [];
    for (const badge of BADGES) {
      if (!user.badges.includes(badge.id) && badge.condition(stats)) {
        user.badges.push(badge.id);
        newBadges.push(badge);
      }
    }

    await user.save();

    res.json({
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      newBadges,
      leveledUp: newBadges.length > 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get daily missions
const getDailyMissions = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    let missionDoc = await Mission.findOne({ user: req.user, date: today });

    if (!missionDoc) {
      // Generate 3 random missions for today
      const shuffled = [...DAILY_MISSIONS_POOL].sort(() => 0.5 - Math.random());
      const todaysMissions = shuffled.slice(0, 3).map((m) => ({ ...m, completed: false }));

      missionDoc = await Mission.create({
        user: req.user,
        date: today,
        missions: todaysMissions,
      });
    }

    res.json({ success: true, data: missionDoc.missions, date: today });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete a mission
const completeMission = async (req, res) => {
  try {
    const { missionId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const missionDoc = await Mission.findOne({ user: req.user, date: today });
    if (!missionDoc) return res.status(404).json({ message: "No missions for today" });

    const mission = missionDoc.missions.find((m) => m.id === missionId);
    if (!mission) return res.status(404).json({ message: "Mission not found" });
    if (mission.completed) return res.status(400).json({ message: "Mission already completed" });

    mission.completed = true;
    mission.completedAt = new Date();
    await missionDoc.save();

    // Award XP
    const user = await User.findById(req.user);
    user.xp = (user.xp || 0) + mission.xpReward;
    user.level = getLevel(user.xp);
    await user.save();

    res.json({
      success: true,
      xpAwarded: mission.xpReward,
      newXP: user.xp,
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get achievement badges
const getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("badges xp level");
    if (!user) return res.status(404).json({ message: "User not found" });

    const allBadges = BADGES.map((b) => ({
      ...b,
      earned: user.badges.includes(b.id),
    }));

    res.json({ success: true, data: allBadges, earned: user.badges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update streak
const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (lastActive) {
      const diffDays = Math.floor((today - lastActive) / oneDayMs);
      if (diffDays === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }

    user.lastActive = today;
    await user.save();

    res.json({ streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { awardXP, getDailyMissions, completeMission, getBadges, updateStreak };
