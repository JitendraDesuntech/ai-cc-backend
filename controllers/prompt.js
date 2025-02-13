const { generateText, generateImage } = require("../utils/openai");

exports.generate_response = async (req, res) => {
  // logic
  let { instruction, prompt, language, creativity, tone } = req.body;
  const response = await generateText(
    `instruction : "${instruction}", prompt: "${prompt}", language: "${language}", creativity: "${creativity}", tone: "${tone}"`
  );
  if (response) {
    return res.json({
      code: "success",
      message: "response generate succesfully",
      status: 200,
      data: response,
    });
  } else {
    return res.json({
      error: err,
      message: "error",
      code: "failure",
    });
  }
};

exports.generate_article = async (req, res) => {
  // logic
  let { title, keywords, wordcount, language } = req.body;
  const response = await generateText(
    `generate an article for a blog not more than ${wordcount} words for a blog title "${title}" in ${language} language`
  );
  if (response) {
    return res.json({
      code: "success",
      message: "response generate succesfully",
      status: 200,
      article: response,
    });
  } else {
    return res.json({
      message: "failed to generate article",
      code: "failed",
    });
  }
};

exports.rewrite_content = async (req, res) => {
  // logic
  let { content, keywords, wordcount, language } = req.body;
  const response = await generateText(
    `rewrite this article in ${language} langauge, not more than ${wordcount} words "${content}"`
  );
  if (response) {
    return res.json({
      code: "success",
      message: "response generated succesfully",
      status: 200,
      content: response,
    });
  } else {
    return res.json({
      message: "failed to generate content",
      code: "failed",
    });
  }
};

exports.generate_image = async (req, res) => {
  // logic
  let { prompt, style, lighting, medium, mode } = req.body;
  const response = await generateImage(
    `${prompt} with ${style} style, having ${lighting} lighting effect, drawn or created with 
    ${medium} and the mode of image should be ${mode}, if you not able to understand, just extract 
    a meaningful prompt in the statement, ignore all the none and generate the image`
  );
  if (response) {
    return res.json({
      code: "success",
      message: "image generated succesfully",
      status: 200,
      url: response,
    });
  } else {
    return res.json({
      message: "Image generation failed",
      code: "failure",
    });
  }
};
