const Progress = require('../models/Progress');

// @desc   Get all progress for user
// @route  GET /api/progress
const getAllProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc   Get progress for a specific company
// @route  GET /api/progress/:company
const getCompanyProgress = async (req, res, next) => {
  try {
    const company = decodeURIComponent(req.params.company);
    let progress = await Progress.findOne({ user: req.user._id, company });

    if (!progress) {
      // Create a fresh progress record
      progress = await Progress.create({
        user: req.user._id,
        company,
        rounds: [],
        status: 'not-started',
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc   Update or save round result
// @route  POST /api/progress/:company/round
const saveRoundResult = async (req, res, next) => {
  try {
    const company = decodeURIComponent(req.params.company);
    const { roundType, score, feedback, details } = req.body;

    let progress = await Progress.findOne({ user: req.user._id, company });

    if (!progress) {
      progress = new Progress({ user: req.user._id, company, rounds: [] });
    }

    // Check if round already exists
    const existingRoundIndex = progress.rounds.findIndex(r => r.roundType === roundType);

    const roundData = {
      roundType,
      score,
      status: 'completed',
      feedback,
      attemptedAt: new Date(),
      details: details || {},
    };

    if (existingRoundIndex >= 0) {
      progress.rounds[existingRoundIndex] = roundData;
    } else {
      progress.rounds.push(roundData);
    }

    await progress.save();
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete progress for a company (reset)
// @route  DELETE /api/progress/:company
const resetCompanyProgress = async (req, res, next) => {
  try {
    const company = decodeURIComponent(req.params.company);
    await Progress.findOneAndDelete({ user: req.user._id, company });
    res.json({ success: true, message: 'Progress reset successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProgress, getCompanyProgress, saveRoundResult, resetCompanyProgress };
