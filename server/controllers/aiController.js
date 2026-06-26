const { askGroq } = require("../services/groq");

const generateStartupIdea = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const result = await askGroq(prompt);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate startup idea. Please try again.",
    });
  }
};

module.exports = {
  generateStartupIdea,
};