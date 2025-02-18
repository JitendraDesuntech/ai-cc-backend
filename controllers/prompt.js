const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
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
  try {
    const { title, keywords, wordcount, language } = req.body;
    const prompt = `Generate a blog article with a maximum of ${wordcount} words for the title "${title}" in ${language} language.`;

    const article = await generateText(prompt);
    if (!article) {
      return res.status(500).json({ message: "Failed to generate article" });
    }
    res.status(200).json({
      code: "success",
      message: "Article generated successfully",
      article,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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

exports.data_analysis = async (req, res) => {
  try {
    const file = req.file;
    let extractedText = "";

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileExt = path.extname(file.originalname).toLowerCase();
    filePath = file.path; // Store file path for cleanup

    if (fileExt === ".pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (fileExt === ".docx") {
      const dataBuffer = fs.readFileSync(file.path);
      const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
      extractedText = value;
    } else if ([".xls", ".xlsx"].includes(fileExt)) {
      const workbook = XLSX.readFile(file.path);
      extractedText = XLSX.utils
        .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })
        .join("\n");
    } else if (fileExt === ".txt") {
      extractedText = fs.readFileSync(file.path, "utf8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Send to OpenAI for analysis
    const response = await generateText(
      `Analyze this data: ${extractedText.substring(0, 3000)}`
    );
    res.json({
      text: extractedText,
      analysis: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Ensure file deletion after processing (success or failure)
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
  }
};
