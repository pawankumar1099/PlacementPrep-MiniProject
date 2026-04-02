const express = require('express');
const router = express.Router();
const { getQuestions, submitAnswers } = require('../controllers/aptitudeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/questions/:company', getQuestions);
router.post('/submit', submitAnswers);

module.exports = router;
