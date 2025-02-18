const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    planCredits: {
      type: Number,
      default: 0,
    },
    creditsRemains: {
      type: Number,
      default: 0,
    },
    wordsGenerated: {
      type: Number,
      default: 0,
    },
    imagesGenerated: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    planExpiry: {
      type: Date,
      required: true,
    },
    wordUsagePerDay: [
      {
        date: {
          type: Date,
          required: true,
        },
        wordCount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
