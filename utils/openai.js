require("dotenv").config();

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function generateText(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash-exp", // Specify the model here
      messages: [
        { role: "user", content: prompt }, // User input
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { generateText };
