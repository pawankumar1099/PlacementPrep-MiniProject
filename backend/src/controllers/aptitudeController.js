const { generateAptitudeQuestions, evaluateAptitude } = require('../services/aptitudeService');

// @desc   Generate aptitude questions
// @route  GET /api/aptitude/questions/:company
const getQuestions = async (req, res, next) => {
  try {
    const company = decodeURIComponent(req.params.company);
    const result = await generateAptitudeQuestions(company, 15);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc   Submit aptitude answers and get score
// @route  POST /api/aptitude/submit
const submitAnswers = async (req, res, next) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ success: false, message: 'Questions and answers are required' });
    }

    const result = await evaluateAptitude(questions, answers);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuestions, submitAnswers };
