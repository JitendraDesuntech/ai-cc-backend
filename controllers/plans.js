const Plan = require("../models/plans");

exports.addPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res
      .status(201)
      .json({ success: true, message: "Plan added successfully", data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { name, ...updateData } = req.body;
    const plan = await Plan.findOneAndUpdate({ name }, updateData, {
      new: true,
    });
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { name } = req.body;
    const plan = await Plan.findOneAndDelete({ name });
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
