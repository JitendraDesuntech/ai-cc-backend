const express = require("express");
const router = express.Router();
const {
  generate_response,
  generate_article,
  generate_image,
  rewrite_content,
} = require("../controllers/prompt");

router.post("/generate_response", generate_response);

router.post("/generate_article", generate_article);

router.post("/generate_image", generate_image);

router.post("/rewrite_content", rewrite_content);

module.exports = router;
