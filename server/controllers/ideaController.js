const Idea = require("../models/Ideas");
const User = require("../models/User");

const getIdeas = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = { user: req.user };

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { problem: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Idea.countDocuments(query);
    const ideas = await Idea.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ ideas, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user });
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIdea = async (req, res) => {
  try {
    const {
      title, category, description, problem, solution, audience,
      revenue, techStack, growth, investment, score, marketSize,
      competitors, pitchLine, status, tags, aiGenerated,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    const idea = await Idea.create({
      user: req.user,
      title, category,
      description: description || "",
      problem: problem || "",
      solution: solution || "",
      audience: audience || "",
      revenue: revenue || "",
      techStack: techStack || "",
      growth: growth || "",
      investment: investment || "",
      score: score || "",
      marketSize: marketSize || "",
      competitors: competitors || "",
      pitchLine: pitchLine || "",
      status: status || "draft",
      tags: tags || [],
      aiGenerated: aiGenerated || false,
    });

    // Award XP for creating ideas
    await User.findByIdAndUpdate(req.user, { $inc: { xp: 10 } });

    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIdea = async (req, res) => {
  try {
    const updates = req.body;
    // Prevent user field from being changed
    delete updates.user;

    const idea = await Idea.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updates,
      { new: true, runValidators: true }
    );

    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json({ message: "Idea deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const idea = await Idea.findOne({ _id: req.params.id, user: req.user });
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    idea.isBookmarked = !idea.isBookmarked;
    await idea.save();
    res.json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user;
    const mongoose = require("mongoose");
    const objectId = new mongoose.Types.ObjectId(userId);

    const totalIdeas = await Idea.countDocuments({ user: userId });
    const aiIdeas = await Idea.countDocuments({ user: userId, aiGenerated: true });
    const bookmarked = await Idea.countDocuments({ user: userId, isBookmarked: true });
    const byStatus = await Idea.aggregate([
      { $match: { user: objectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byCategory = await Idea.aggregate([
      { $match: { user: objectId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalIdeas,
      aiIdeas,
      bookmarked,
      byStatus,
      byCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleBookmark,
  getStats,
};