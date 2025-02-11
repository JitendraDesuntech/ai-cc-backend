const UserLog = require("../models/userhistory");

const getUserLogs = async (userId, startIndex, endIndex) => {
  try {
    const userLog = await UserLog.findOne({ userId });
    if (!userLog) {
      return { success: false, message: "No logs found for this user" };
    }
    const logs = userLog.userLogs.slice(
      startIndex,
      endIndex || startIndex + 20
    );
    return { success: true, data: logs };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const addUserLog = async (req, res) => {
  let { userId, templateName, userInputData, language } = req.body;
  try {
    let userLog = await UserLog.findOne({ userId });

    if (!userLog) {
      userLog = new UserLog({ userId, userLogs: [] });
    }

    userLog.userLogs.push({ templateName, userInputData, language });
    await userLog.save();
    return res.status(200).json({
      code: "success",
      message: "Log added successfully",
      data: userLog,
    });
  } catch (error) {
    return res.json({ code: "failed", message: error.message });
  }
};

module.exports = { getUserLogs, addUserLog };
