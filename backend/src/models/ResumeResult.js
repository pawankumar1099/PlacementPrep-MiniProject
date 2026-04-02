const mongoose = require('mongoose');

const resumeResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  targetCompany: {
    type: String,
    default: 'General',
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingKeywords: [{ type: String }],
  suggestions: [{ type: String }],
  feedbackSummary: {
    type: String,
    default: '',
  },
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ResumeResult', resumeResultSchema);
