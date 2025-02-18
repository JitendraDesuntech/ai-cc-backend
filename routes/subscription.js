const express = require("express");
const router = express.Router();
const {
  addSubscription,
  updateSubscription,
  updateUsage,
  getSubscription,
} = require("../controllers/subscription");

router.post("/get-subscription", getSubscription);

router.post("/add-subscription", addSubscription);

router.post("/update-subscription", updateSubscription);

router.post("/update-usage", updateUsage);

module.exports = router;
