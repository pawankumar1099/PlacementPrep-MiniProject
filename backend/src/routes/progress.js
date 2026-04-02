const express = require('express');
const router = express.Router();
const { getAllProgress, getCompanyProgress, saveRoundResult, resetCompanyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getAllProgress);
router.get('/:company', getCompanyProgress);
router.post('/:company/round', saveRoundResult);
router.delete('/:company', resetCompanyProgress);

module.exports = router;
