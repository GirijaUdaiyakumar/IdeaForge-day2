const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    missions: [
      {
        id: String,
        title: String,
        description: String,
        xpReward: Number,
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

missionSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Mission", missionSchema);
