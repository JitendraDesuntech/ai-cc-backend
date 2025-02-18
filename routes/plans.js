const express = require("express");
const router = express.Router();
const { addPlan, updatePlan, deletePlan } = require("../controllers/plans");

router.post("/add-plan", addPlan);

router.post("/update-plan", updatePlan);

router.post("/delete-plan", deletePlan);

module.exports = router;
