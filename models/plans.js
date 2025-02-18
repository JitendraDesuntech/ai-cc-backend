const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Free", "Basic", "Standard", "Premium"],
      required: true,
    },
    credits: Number,
    wordsLimit: Number,
    imagesLimit: Number,
    templatesAccess: Number,
    premiumTemplates: Boolean,
    assistantAccess: Boolean,
    dataAnalystAccess: Boolean,
    articleGenerator: Boolean,
    contentRewriter: Boolean,
    smartEditor: Boolean,
    advancedSupport: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
