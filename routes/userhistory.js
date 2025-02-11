const express = require("express");
const router = express.Router();
const { getUserLogs, addUserLog } = require("../controllers/userhistory");

router.get("/get-log-by-user", getUserLogs);

router.post("/record-log", addUserLog);

module.exports = router;
