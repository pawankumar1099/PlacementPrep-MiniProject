const ResumeResult = require('../models/ResumeResult');
const { analyzeResume } = require('../services/resumeService');

// @desc   Analyze resume
// @route  POST /api/resume/analyze
const analyzeResumeHandler = async (req, res, next) => {
  try {
    const { resumeText, targetCompany } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Please provide valid resume text (at least 50 characters)' });
    }

    const analysis = await analyzeResume(resumeText, targetCompany || 'General');

    // Save result to DB
    const result = await ResumeResult.create({
      user: req.user._id,
      resumeText,
      targetCompany: targetCompany || 'General',
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      feedbackSummary: analysis.feedbackSummary,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc   Get resume analysis history
// @route  GET /api/resume/history
const getResumeHistory = async (req, res, next) => {
  try {
    const results = await ResumeResult.find({ user: req.user._id })
      .sort({ analyzedAt: -1 })
      .limit(10)
      .select('-resumeText');

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeResumeHandler, getResumeHistory };
