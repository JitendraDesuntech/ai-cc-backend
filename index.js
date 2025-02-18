const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// bring routes
const authRoutes = require("./routes/auth");
const plansRoutes = require("./routes/plans");
const promptRoutes = require("./routes/prompt");
const userHistoryRoutes = require("./routes/userhistory");
const subscriptionRoutes = require("./routes/subscription");

// const port = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: "*" }));
app.options("*", cors());

app.use(express.json());

// db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected !"))
  .catch((err) => console.log(err));

// routes middleware
app.use("/ai/auth", authRoutes);
app.use("/ai/plans", plansRoutes);
app.use("/ai/prompt", promptRoutes);
app.use("/ai/userhistory", userHistoryRoutes);
app.use("/ai/subscription", subscriptionRoutes);

//public data serve
// app.use("/api/images", express.static("public"));
// app.use("/api/articles", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("server is running");
});

//Invalid route handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 404);
  res.json({
    error: error.message,
  });
});

// Server start
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Export the serverless handler for vercel deployment
module.exports = (req, res) => {
  app(req, res);
};
