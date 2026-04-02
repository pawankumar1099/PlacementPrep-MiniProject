const { generateContent } = require('./geminiService');

const analyzeResume = async (resumeText, targetCompany = 'General') => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and resume reviewer with 15+ years of experience in campus recruitment for top tech companies.

Analyze the following resume for a student targeting ${targetCompany} placements.

RESUME TEXT:
"""
${resumeText}
"""

Provide a comprehensive ATS-style analysis. Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
  "atsScore": <number 0-100>,
  "strengths": [<list of 4-6 specific strengths found in the resume>],
  "weaknesses": [<list of 3-5 specific weaknesses or areas missing>],
  "missingKeywords": [<list of 5-10 important keywords missing for ${targetCompany} placement>],
  "suggestions": [<list of 5-7 actionable improvement suggestions>],
  "feedbackSummary": "<2-3 paragraph overall summary covering: current standing, key improvements needed, and final recommendation for ${targetCompany} placement readiness>"
}

Be specific, constructive, and actionable. Base the ATS score on: keyword density, formatting quality, quantified achievements, relevant skills, education details, project descriptions, and overall completeness.
`;

  return await generateContent(prompt, true);
};

module.exports = { analyzeResume };
