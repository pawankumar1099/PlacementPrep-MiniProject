const mongoose = require('mongoose');

const testCaseResultSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
});

const codingSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  problem: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java'],
    required: true,
  },
  testCaseResults: [testCaseResultSchema],
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
    default: '',
  },
  passedTestCases: {
    type: Number,
    default: 0,
  },
  totalTestCases: {
    type: Number,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
