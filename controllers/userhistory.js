const UserLog = require("../models/userhistory");

const getUserLogs = async (req, res) => {
  let { userId, startIndex, endIndex } = req.body;
  try {
    const userLog = await UserLog.findOne({ userId });
    if (!userLog) {
      return res.json({
        code: "failed",
        message: "No logs found for this user",
      });
    }
    const logs = userLog.userLogs.slice(
      startIndex,
      endIndex || startIndex + 20
    );
    return res.status(200).json({ code: "success", data: logs });
  } catch (error) {
    return res.json({ code: "failed", message: error.message });
  }
};

const addUserLog = async (req, res) => {
  const { userId, templateName, userInputData, language } = req.body;

  try {
    let userLog = await UserLog.findOne({ userId });

    if (!userLog) {
      userLog = new UserLog({ userId, userLogs: [] });
    }

    // Insert the latest log at the beginning of the array
    userLog.userLogs.unshift({ templateName, userInputData, language });

    await userLog.save();

    return res.status(200).json({
      code: "success",
      message: "Log added successfully",
      data: userLog.userLogs, // Return only userLogs instead of full document
    });
  } catch (error) {
    return res.status(500).json({ code: "failed", message: error.message });
  }
};

module.exports = { getUserLogs, addUserLog };
