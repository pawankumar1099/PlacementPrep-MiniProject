const express = require('express');
const router = express.Router();
const { startInterview, chat, getHistory } = require('../controllers/technicalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/start', startInterview);
router.post('/chat', chat);
router.get('/history', getHistory);

module.exports = router;
