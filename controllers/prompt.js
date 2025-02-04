const { generateText } = require("../utils/openai");

exports.generate_keyword = async (req, res) => {
  // logic
  let { title } = req.body;
  const response = await generateText(
    `generate keywords not more than 4 words for a blog title "${title}", also generate score for each keyword based on their close match with the title`
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
  let { title, keywords, wordcount } = req.body;
  const response = await generateText(
    `generate html code for a blog not more than ${wordcount} words for a blog title "${title}", also generate meta tags in for ${title}, ${keywords} and description in head tag`
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
