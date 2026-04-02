const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundType: {
    type: String,
    enum: ['aptitude', 'coding', 'technical', 'hr'],
    required: true,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'in-progress'],
    default: 'pending',
  },
  feedback: {
    type: String,
    default: '',
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  rounds: [roundSchema],
  overallScore: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

progressSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.rounds.length > 0) {
    const completed = this.rounds.filter(r => r.status === 'completed');
    if (completed.length > 0) {
      this.overallScore = Math.round(completed.reduce((sum, r) => sum + r.score, 0) / completed.length);
    }
    if (completed.length === this.rounds.length && this.rounds.length >= 4) {
      this.status = 'completed';
    } else if (completed.length > 0) {
      this.status = 'in-progress';
    }
  }
  next();
});

module.exports = mongoose.model('Progress', progressSchema);
