const express = require('express');
const router = express.Router();
const { analyzeResumeHandler, getResumeHistory } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/analyze', analyzeResumeHandler);
router.get('/history', getResumeHistory);

module.exports = router;
