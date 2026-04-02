const express = require('express');
const router = express.Router();
const { getProblem, submitCode, getCodingHistory } = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/problem/:company', getProblem);
router.post('/submit', submitCode);
router.get('/history', getCodingHistory);

module.exports = router;
