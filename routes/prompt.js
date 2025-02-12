const express = require("express");
const router = express.Router();
const {
  generate_keyword,
  generate_article,
  generate_image,
  rewrite_content,
} = require("../controllers/prompt");

router.post("/generate_keyword", generate_keyword);

router.post("/generate_article", generate_article);

router.post("/generate_image", generate_image);

router.post("/rewrite_content", rewrite_content);

module.exports = router;
