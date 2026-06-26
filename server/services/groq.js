const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const askGroq = async (prompt) => {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an AI Startup Mentor.

Always return ONLY valid JSON.

{
"title":"",
"problem":"",
"solution":"",
"audience":"",
"revenue":"",
"techStack":"",
"growth":"",
"investment":"",
"score":""
}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return JSON.parse(response);
  } catch (error) {
    console.error(error);

    throw new Error("Groq API Error");
  }
};

module.exports = {
  askGroq,
};