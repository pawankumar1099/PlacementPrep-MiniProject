const CodingSubmission = require('../models/CodingSubmission');
const { generateCodingProblem, evaluateCode } = require('../services/codingService');

// @desc   Get coding problem for company
// @route  GET /api/coding/problem/:company
const getProblem = async (req, res, next) => {
  try {
    const company = decodeURIComponent(req.params.company);
    const problem = await generateCodingProblem(company);
    res.json({ success: true, data: problem });
  } catch (error) {
    next(error);
  }
};

// @desc   Submit code solution
// @route  POST /api/coding/submit
const submitCode = async (req, res, next) => {
  try {
    const { code, language, problem, company } = req.body;

    if (!code || !language || !problem || !company) {
      return res.status(400).json({ success: false, message: 'Code, language, problem, and company are required' });
    }

    if (code.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please write a proper solution before submitting' });
    }

    const evaluation = await evaluateCode(code, language, problem, problem.testCases);

    // Save submission
    const submission = await CodingSubmission.create({
      user: req.user._id,
      company,
      problem: {
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty || 'Medium',
      },
      code,
      language,
      testCaseResults: evaluation.testCaseResults || [],
      score: evaluation.score,
      feedback: evaluation.feedback,
      passedTestCases: evaluation.passedTestCases,
      totalTestCases: evaluation.totalTestCases,
    });

    res.json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

// @desc   Get coding history for user
// @route  GET /api/coding/history
const getCodingHistory = async (req, res, next) => {
  try {
    const submissions = await CodingSubmission.find({ user: req.user._id })
      .sort({ submittedAt: -1 })
      .limit(20)
      .select('-code');

    res.json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblem, submitCode, getCodingHistory };
