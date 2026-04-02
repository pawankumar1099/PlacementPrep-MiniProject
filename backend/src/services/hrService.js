const { generateContent } = require('./geminiService');

const startHRInterview = async (company, userName) => {
  const prompt = `
You are an experienced HR interviewer at ${company} conducting a campus placement HR interview for a candidate named ${userName}.

Start with a warm, professional greeting and ask the FIRST HR question. Focus on behavioral, situational, and cultural fit questions.

Return ONLY valid JSON:
{
  "message": "<Your HR interviewer greeting and first question>",
  "questionNumber": 1,
  "topic": "<e.g., Self Introduction, Strengths, Teamwork, etc.>"
}
`;

  return await generateContent(prompt, true);
};

const continueHRInterview = async (company, messages, userAnswer, questionNumber, userName) => {
  const conversationHistory = messages.map(m => `${m.role === 'assistant' ? 'HR Interviewer' : userName}: ${m.content}`).join('\n');

  const prompt = `
You are an experienced HR interviewer at ${company} conducting a campus placement HR interview.

Conversation so far:
${conversationHistory}

Candidate's latest answer: "${userAnswer}"

This is question ${questionNumber} in the HR round. ${questionNumber - 1} questions asked so far.

HR Topics to cover: Tell me about yourself, Strengths/Weaknesses, Why ${company}, Where do you see yourself in 5 years, Teamwork experience, Leadership, Conflict resolution, Salary expectations, Notice period/availability.

If fewer than 6 questions have been asked:
- Acknowledge the answer with brief feedback
- Ask the NEXT HR question on a new topic

If 6 or more questions have been asked:
- Provide final HR evaluation using STAR method assessment

Return ONLY valid JSON:
{
  "message": "<your response as HR interviewer>",
  "isCompleted": <true if 6+ questions done>,
  "questionNumber": ${questionNumber + 1},
  "score": <only if isCompleted: 0-100 based on: communication clarity 30%, confidence 20%, STAR method usage 25%, cultural fit 25%>,
  "summary": "<only if isCompleted: comprehensive HR round summary with communication skills assessment, STAR method feedback, cultural fit, and final recommendation>"
}
`;

  return await generateContent(prompt, true);
};

module.exports = { startHRInterview, continueHRInterview };
