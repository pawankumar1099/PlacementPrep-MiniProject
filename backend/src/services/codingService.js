const { generateContent } = require('./geminiService');

const generateCodingProblem = async (company) => {
  const prompt = `
You are a coding interview problem designer for ${company} campus placements.

Generate ONE realistic coding problem that ${company} might ask in their campus placement coding round.

Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "<problem title>",
  "description": "<detailed problem description with examples>",
  "difficulty": "<Easy|Medium|Hard>",
  "examples": [
    { "input": "<input>", "output": "<output>", "explanation": "<explanation>" }
  ],
  "constraints": ["<constraint 1>", "<constraint 2>"],
  "testCases": [
    { "input": "<test input>", "expectedOutput": "<expected output>" },
    { "input": "<test input>", "expectedOutput": "<expected output>" },
    { "input": "<test input>", "expectedOutput": "<expected output>" },
    { "input": "<test input>", "expectedOutput": "<expected output>" },
    { "input": "<test input>", "expectedOutput": "<expected output>" }
  ],
  "starterCode": {
    "javascript": "// Write your solution here\\nfunction solution(input) {\\n  \\n}",
    "python": "# Write your solution here\\ndef solution(input):\\n    pass",
    "java": "// Write your solution here\\npublic class Solution {\\n    public static void main(String[] args) {\\n        \\n    }\\n}"
  }
}
`;

  return await generateContent(prompt, true);
};

const evaluateCode = async (code, language, problem, testCases) => {
  const prompt = `
You are a code evaluator for campus placement coding rounds.

PROBLEM: ${problem.title}
DESCRIPTION: ${problem.description}

SUBMITTED CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

TEST CASES TO EVALUATE:
${testCases.map((tc, i) => `Test ${i + 1}: Input: ${tc.input} | Expected: ${tc.expectedOutput}`).join('\n')}

Evaluate this code carefully. For each test case, determine if the code logic would produce the correct output.
Analyze: correctness, time complexity, space complexity, code quality, edge case handling.

Return ONLY valid JSON (no markdown, no extra text):
{
  "testCaseResults": [
    {
      "input": "<input>",
      "expectedOutput": "<expected>",
      "actualOutput": "<what the code would produce>",
      "passed": <true|false>
    }
  ],
  "passedTestCases": <number>,
  "totalTestCases": <number>,
  "score": <0-100>,
  "feedback": "<detailed feedback covering: correctness, algorithm approach, time/space complexity, code quality, specific improvements>"
}
`;

  return await generateContent(prompt, true);
};

module.exports = { generateCodingProblem, evaluateCode };
