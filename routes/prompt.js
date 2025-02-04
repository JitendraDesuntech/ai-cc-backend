const express = require("express");
const router = express.Router();
const { generate_keyword, generate_article } = require("../controllers/prompt");

router.post("/generate_keyword", generate_keyword);

router.post("/generate_article", generate_article);

module.exports = router;
