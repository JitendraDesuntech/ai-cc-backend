const Plan = require("../models/plans");
const subscription = require("../models/subscription");
const Subscription = require("../models/subscription");

exports.getSubscription = async (req, res) => {
  let { userId } = req.body;
  try {
    const userSubs = await Subscription.findOne({ userId });
    if (!userSubs) {
      return res.json({
        code: "failed",
        message: "No Subscription found for this user",
      });
    }
    return res.status(200).json({ code: "success", subscription: userSubs });
  } catch (error) {
    return res.json({ code: "failed", message: error.message });
  }
};

exports.addSubscription = async (req, res) => {
  try {
    const { userId, planName } = req.body;
    const plan = await Plan.findOne({ name: planName });
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    const subscription = new Subscription({
      userId,
      plan: plan._id,
      planName: plan.name,
      planCredits: plan.credits,
      creditsRemains: plan.credits,
      wordsGenerated: 0,
      imagesGenerated: 0,
      startDate,
      endDate,
      planExpiry: endDate,
      wordUsagePerDay: [{ date: startDate, wordCount: 0 }],
    });

    await subscription.save();
    res.status(201).json({
      success: true,
      message: "Subscription added successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { userId, newPlanName } = req.body;
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    const newPlan = await Plan.findOne({ name: newPlanName });
    if (!newPlan) {
      return res
        .status(404)
        .json({ success: false, message: "New plan not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    subscription.plan = newPlan._id;
    subscription.planName = newPlan.name;
    subscription.planCredits += newPlan.credits;
    subscription.creditsRemains += newPlan.credits;
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.planExpiry = endDate;

    await subscription.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Subscription updated successfully",
        data: subscription,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUsage = async (req, res) => {
  try {
    const { userId, wordcount, imagecount } = req.body;
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found" });
    }

    subscription.creditsRemains -= wordcount;
    subscription.wordsGenerated += wordcount;
    subscription.imagesGenerated += imagecount;

    const today = new Date().toISOString().split("T")[0];
    const existingEntry = subscription.wordUsagePerDay.find(
      (entry) => entry.date.toISOString().split("T")[0] === today
    );

    if (existingEntry) {
      existingEntry.wordCount += wordcount;
    } else {
      subscription.wordUsagePerDay.push({
        date: new Date(),
        wordCount: wordcount,
      });
    }

    await subscription.save();
    res.status(200).json({
      success: true,
      message: "Usage updated successfully",
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
