const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  roundType: {
    type: String,
    enum: ['technical', 'hr'],
    required: true,
  },
  messages: [messageSchema],
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  summary: {
    type: String,
    default: '',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('ChatLog', chatLogSchema);
