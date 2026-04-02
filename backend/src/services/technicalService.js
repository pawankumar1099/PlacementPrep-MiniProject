const { generateContent } = require('./geminiService');

const startTechnicalInterview = async (company) => {
  const prompt = `
You are a senior technical interviewer at ${company} conducting a campus placement technical interview.

Start the interview with a warm welcome and ask the FIRST technical question. The question should be appropriate for a fresh graduate targeting ${company}.

Topics to cover across the interview: Data Structures, Algorithms, OOP Concepts, DBMS, Operating Systems, Networking basics, or ${company}-specific technologies.

Return ONLY valid JSON:
{
  "message": "<Your interviewer message with the first question>",
  "questionNumber": 1,
  "topic": "<topic of this question>"
}
`;

  return await generateContent(prompt, true);
};

const continueTechnicalInterview = async (company, messages, userAnswer, questionNumber) => {
  const conversationHistory = messages.map(m => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');

  const prompt = `
You are a senior technical interviewer at ${company} conducting a campus placement technical interview.

Conversation so far:
${conversationHistory}

Candidate's latest answer: "${userAnswer}"

This is question ${questionNumber} in the interview. You have asked ${questionNumber - 1} questions so far.

If fewer than 5 questions have been asked total:
- Evaluate the answer briefly (acknowledge correct/incorrect aspects)
- Ask the NEXT technical question on a different topic

If 5 or more questions have been asked:
- This is the FINAL evaluation. Provide a comprehensive assessment.

Return ONLY valid JSON:
{
  "message": "<your response as interviewer>",
  "isCompleted": <true if 5+ questions asked, false otherwise>,
  "questionNumber": ${questionNumber + 1},
  "score": <only if isCompleted: 0-100 based on overall performance>,
  "summary": "<only if isCompleted: detailed round summary with strengths, weaknesses, topics covered>"
}
`;

  return await generateContent(prompt, true);
};

module.exports = { startTechnicalInterview, continueTechnicalInterview };
