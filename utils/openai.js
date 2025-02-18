require("dotenv").config();

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
});

const gemini = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function generateText(prompt) {
  try {
    const response = await gemini.chat.completions.create({
      model: "gemini-2.0-flash-exp", // Specify the model here
      messages: [
        { role: "user", content: prompt }, // User input
      ],
      max_tokens: 500, // Limits response length
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function generateImage(prompt) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-2", // Use 'dall-e-3' or 'dall-e-2'
      prompt,
      n: 1, // Number of images
      size: "512x512", // Image size
    });
    const imageUrl = response.data[0].url;
    return res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error.message);
  }
}

module.exports = { generateText, generateImage };
