const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const generateContent = async (prompt, jsonMode = false) => {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  if (jsonMode) {
    // Strip markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Failed to parse AI response as JSON: ${text.substring(0, 200)}`);
    }
  }

  return text;
};

module.exports = { generateContent };
