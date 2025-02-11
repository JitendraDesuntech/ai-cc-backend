const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userLogs: [
      {
        templateName: {
          type: String,
          required: true,
        },
        userInputData: {
          type: mongoose.Schema.Types.Mixed, // Allows flexibility for different input types
          required: true,
        },
        language: {
          type: String,
          default: "English",
        },
        logDateTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserLog", userLogSchema);
