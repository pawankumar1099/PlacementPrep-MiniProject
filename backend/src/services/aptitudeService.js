const { generateContent } = require('./geminiService');

const generateAptitudeQuestions = async (company, count = 15) => {
  const prompt = `
You are an aptitude test designer for ${company} campus placements.

Generate ${count} multiple choice questions covering: quantitative aptitude (4 questions), logical reasoning (4 questions), verbal ability (4 questions), and data interpretation (3 questions).

The difficulty should match ${company}'s actual placement test level.

Return ONLY valid JSON (no markdown, no extra text):
{
  "questions": [
    {
      "id": <number>,
      "category": "<Quantitative|Logical Reasoning|Verbal Ability|Data Interpretation>",
      "question": "<question text>",
      "options": ["A) <option>", "B) <option>", "C) <option>", "D) <option>"],
      "correctAnswer": "<A|B|C|D>",
      "explanation": "<brief explanation of the answer>"
    }
  ]
}

Make questions realistic, varied in difficulty, and representative of actual ${company} placement tests.
`;

  return await generateContent(prompt, true);
};

const evaluateAptitude = async (questions, answers) => {
  let correct = 0;
  const results = questions.map((q, i) => {
    const userAnswer = answers[i] || '';
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const score = Math.round((correct / questions.length) * 100);

  return {
    score,
    correct,
    total: questions.length,
    results,
    feedback: score >= 80
      ? 'Excellent performance! You are well-prepared for the aptitude round.'
      : score >= 60
      ? 'Good attempt. Focus on your weak areas to improve further.'
      : 'Needs improvement. Practice more questions in each category.',
  };
};

module.exports = { generateAptitudeQuestions, evaluateAptitude };
