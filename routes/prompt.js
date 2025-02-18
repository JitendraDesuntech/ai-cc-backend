const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  generate_response,
  generate_article,
  generate_image,
  rewrite_content,
  data_analysis,
} = require("../controllers/prompt");

router.post("/generate_response", generate_response);

router.post("/generate_article", generate_article);

router.post("/generate_image", generate_image);

router.post("/rewrite_content", rewrite_content);

router.post("/data_analysis", upload.single("file"), data_analysis);

module.exports = router;
