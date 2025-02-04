const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  validateToken,
  forgotPassword,
  changePassword,
  // verifyUser,
  // resetOtp,
  // sendOtpEmail,
} = require("../controllers/auth");

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/verify-token", validateToken);

router.post("/forgot-password", forgotPassword);

router.post("/change-password", changePassword);

// router.post("/verify", verifyUser);

// router.post("/resend-otp", resetOtp);

// router.post("/send-otp-email", sendOtpEmail);

module.exports = router;
