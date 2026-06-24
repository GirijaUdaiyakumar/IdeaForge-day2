const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateIdea = async (req, res) => {
  try {

    const { prompt } = req.body;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert startup mentor. Generate innovative startup ideas."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.3-70b-versatile"
      });

    const result =
      completion.choices[0].message.content;

    res.json({
      success: true,
      result
    });

  } catch (error) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "AI Generation Failed"
  });


  }
};

module.exports = {
  generateIdea
};