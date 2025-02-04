const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// ⚡ Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider (e.g., Outlook, SMTP, Mailgun, SendGrid)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password (if using Gmail, generate App Password)
  },
});

// 📩 Send Email Function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to, // Receiver email
      subject, // Email subject
      html, // HTML content (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
