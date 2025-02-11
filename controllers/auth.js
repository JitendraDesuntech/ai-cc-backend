const jwt = require("jsonwebtoken");
const sha256 = require("sha256");
const sendEmail = require("../utils/emailService");
const User = require("../models/users");
const { getRandomString } = require("../utils/misc");
const Secure = require("../models/secure");

const createJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.signup = async (req, res) => {
  var { name, email, phone, pass, role } = req.body;
  pass = sha256(pass);
  var userData = {
    name,
    email,
    phone,
    pass,
    role,
  };

  var newUser = new User(userData);

  if (email) {
    email = email.trim().toLowerCase();
    userData = {
      ...userData,
      email,
    };
  }
  let userEmail = await User.findOne({ email: newUser.email });
  if (userEmail) {
    return res.json({
      status: 400,
      code: "Failure",
      message: "Email is already register",
    });
  } else {
    newUser
      .save()
      .then((user) => {
        user.toObject();
        delete user.pass;
        return res.json({
          status: 200,
          code: "success",
          message: "User saved succesfully",
          user,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: err,
          message: "Server Error",
          code: "failed",
        });
      });
  }
};

exports.signin = async (req, res) => {
  var { email, pass } = req.body;
  // console.log("email -> ", email);
  const userone = await User.findOne({ email });
  if (!userone) {
    return res.json({
      status: 404,
      message: "User not found",
      code: "failed",
    });
  } else if (userone.pass !== pass) {
    return res.json({
      status: 401,
      message: "Invalid Credentials",
      code: "failed",
    });
  } else {
    const user = userone.toObject(); // convert mongoose doc to object
    delete user.pass; // removing pass from user
    return res.json({
      status: 200,
      code: "success",
      message: "User authenticated successfully!",
      token: createJwtToken(userone),
      user: user,
    });
  }
};

exports.verifyUser = async (req, res) => {
  var { email, otp } = req.body;
  console.log("email otp : ", email, otp);
  // phone = phone;
  const userone = await Otp.findOne({ email });
  if (!userone) {
    return res.json({
      message: "user not found",
      code: "failed",
      status: 400,
    });
  } else if (userone && !userone.is_valid) {
    return res.json({
      message: "otp is expired",
      code: "failed",
      status: 400,
    });
  } else if (userone.is_valid && userone.otp == otp) {
    await User.findOneAndUpdate(
      { email: userone.email },
      { is_verified: true }
    );
    return res.json({
      message: "User verified",
      code: "success",
      status: 200,
    });
  } else {
    return res.json({
      message: "wrong/invalid otp",
      code: "failed",
      status: 400,
    });
  }
};

exports.signin_verify = (req, res) => {
  var { phone, otp } = req.body;
  try {
    phone = phone;
    User.findOne({ phone }).exec((err, users) => {
      if (!users) {
        res.json({
          message: "error",
          code: "user_not_found",
          status: 404,
        });
      } else {
        Otp.findOne({ phone }).exec((err, user) => {
          if (user && typeof user.phone !== undefined) {
            if (user.otp == otp) {
              let { _id, phone, name, email } = users;
              Otp.findOneAndRemove({ email: email }).exec();

              return res.json({
                token: createJwtToken(user),
                user: { _id, phone, name, email },
                status: 200,
                code: "user_verified",
              });
            } else {
              return res.json({
                message: "Invalid OTP",
                code: "invalid_otp",
                status: 406,
              });
            }
          } else {
            return res.json({
              message: "error",
              code: "invalid_otp",
              status: 404,
            });
          }
        });
      }
    });
  } catch (error) {
    res.json({
      status: 400,
      message: "Failure",
      error,
    });
  }
  // res.status(200).json(response);
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout success",
    code: "success",
  });
};

exports.resetOtp = async (req, res) => {
  var { phone } = req.body;
  phone = phone;
  let otp = Math.floor(1000 + Math.random() * 9000);

  var createdAt = Date.now();
  await Otp.deleteMany({ phone }).exec();
  let newOtp = new Otp({ phone, otp, createdAt, is_valid: true });
  newOtp.save(async (err, result) => {
    if (!err || result) {
      await sendSms("User", otp, phone);
      res.json({
        message: "otp sent to phone number",
        status: 200,
      });
    } else {
      return res.json({
        error: err,
        message: "server_error",
        code: "failed",
        status: 500,
      });
    }
  });
};

exports.validateToken = (req, res, next) => {
  const { token } = req.body;
  // next()
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = decoded;
    return res.status(200).json({
      code: "success",
      message: "Authorized User",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      code: "failed",
    });
  }
};

exports.sendOtpEmail = async (req, res) => {
  console.log("yes called the forget password : ", req.body);
  const { email } = req.body;
  await User.findOne({ email }).then(async (userone) => {
    if (userone) {
      console.log("user found");

      await Otp.deleteMany({ email });
      let otp = Math.floor(100000 + Math.random() * 900000);

      // if (email == "admin@gmail.com") otp = 1234;

      // await TempUser.deleteMany({ email }).exec();

      const org = "myqubator";
      const resipient = [{ address: email, displayName: "" }];

      const mailOptions = {
        from: org,
        to: resipient,
        subject: `${org} Verification Otp`,
        html: `<div>
                <p>Dear <span style="font-weight:bold;">${email}</span>, your ${org} Verification OTP is : 
                <span style="font-weight:bold;">${otp}</span>.</p>
                <p><span style="font-weight:bold;">Note : </span>Please, Do not share your otp with anyone.</p>
                <p>Thank You,</p>
            </div>`,
      };

      try {
        await sendDynamicEmail(mailOptions);
      } catch (error) {
        console.log("Error sending mail : ", error);
      }

      var createdAt = Date.now();
      let newOtp = new Otp({ email, otp, createdAt });
      newOtp.save().then((success) => {
        if (success) {
          return res.json({
            code: "success",
            message: "otp saved for user",
            status: 200,
          });
        } else {
          return res.json({
            status: 500,
            message: "Internal Server Error",
            code: "failed",
          });
        }
      });
    } else {
      return res.json({
        status: 400,
        message: "User not found",
        code: "failed",
      });
    }
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      status: 404,
      code: "failed",
      message: "user not found",
    });
  } else {
    const secure = getRandomString();
    await Secure.deleteMany({ email });
    let newSecure = new Secure({ email, secure });
    const success = await newSecure.save();
    if (success) {
      try {
        await sendEmail(
          email,
          "Password change Request",
          `<div>
            <p>Hello <b>${email}</b>, you have requested to change the password</p>
            <p>if the request is not initiated by you, ignore this mail</p>
            <p>Otherwise, please go to the <a href='${process.env.SITE_URL}/verifypass?hash=${secure}&email=${email}' target='_blank'>Reset link</a> and change your password</p>
          </div>`
        );
        res.status(200).json({ message: "Email sent successfully!" });
      } catch (error) {
        res.status(500).json({ message: "Email sending failed", error });
      }
    }
  }
};

exports.resetPassword = async (req, res) => {
  const { email, pass, hash } = req.body;
  let newPass = sha256(pass);
  let user = await User.findOne({ email });
  let code = await Secure.findOne({ email });
  // console.log("user ----> ", user);
  if (user && code.secure === hash) {
    await User.findOneAndUpdate({ email: email }, { pass: newPass });
    return res.status(200).json({
      code: "success",
      message: "Password Reset successfully!",
    });
  } else {
    return res.json({
      status: 404,
      message: "User not found",
      code: "failed",
    });
  }
};

exports.changePassword = async (req, res) => {
  let { email, oldpass, newpass } = req.body;
  oldpass = sha256(oldpass);
  newpass = sha256(newpass);
  let user = await User.findOne({ email });
  if (user && user.pass === oldpass) {
    await User.findOneAndUpdate({ email: email }, { pass: newpass });
    return res.status(200).json({
      code: "success",
      message: "Password Changed successfully!",
    });
  } else {
    return res.json({
      status: 404,
      message: "User not found",
      code: "failed",
    });
  }
};
