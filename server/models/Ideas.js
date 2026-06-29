const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    problem: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    solution: {
      type: String,
      default: "",
    },
    audience: {
      type: String,
      default: "",
    },
    revenue: {
      type: String,
      default: "",
    },
    techStack: {
      type: String,
      default: "",
    },
    growth: {
      type: String,
      default: "",
    },
    investment: {
      type: String,
      default: "",
    },
    score: {
      type: String,
      default: "",
    },
    marketSize: {
      type: String,
      default: "",
    },
    competitors: {
      type: String,
      default: "",
    },
    pitchLine: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "active", "validated", "launched", "archived"],
      default: "draft",
    },
    tags: {
      type: [String],
      default: [],
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Idea", ideaSchema);