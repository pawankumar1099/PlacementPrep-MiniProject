const ChatLog = require('../models/ChatLog');
const { startTechnicalInterview, continueTechnicalInterview } = require('../services/technicalService');

// @desc   Start technical interview
// @route  POST /api/technical/start
const startInterview = async (req, res, next) => {
  try {
    const { company } = req.body;
    if (!company) return res.status(400).json({ success: false, message: 'Company is required' });

    const aiResponse = await startTechnicalInterview(company);

    // Create a new chat log
    const chatLog = await ChatLog.create({
      user: req.user._id,
      company,
      roundType: 'technical',
      messages: [{ role: 'assistant', content: aiResponse.message }],
      isCompleted: false,
    });

    res.json({
      success: true,
      data: {
        chatLogId: chatLog._id,
        message: aiResponse.message,
        questionNumber: aiResponse.questionNumber || 1,
        isCompleted: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Continue technical interview
// @route  POST /api/technical/chat
const chat = async (req, res, next) => {
  try {
    const { chatLogId, userMessage, questionNumber } = req.body;

    if (!chatLogId || !userMessage) {
      return res.status(400).json({ success: false, message: 'chatLogId and userMessage are required' });
    }

    const chatLog = await ChatLog.findById(chatLogId);
    if (!chatLog) return res.status(404).json({ success: false, message: 'Chat session not found' });
    if (chatLog.isCompleted) return res.status(400).json({ success: false, message: 'Interview already completed' });

    // Add user message to log
    chatLog.messages.push({ role: 'user', content: userMessage });

    const aiResponse = await continueTechnicalInterview(
      chatLog.company,
      chatLog.messages,
      userMessage,
      questionNumber || 2
    );

    // Add AI response
    chatLog.messages.push({ role: 'assistant', content: aiResponse.message });

    if (aiResponse.isCompleted) {
      chatLog.isCompleted = true;
      chatLog.score = aiResponse.score || 0;
      chatLog.summary = aiResponse.summary || '';
      chatLog.completedAt = new Date();
    }

    await chatLog.save();

    res.json({
      success: true,
      data: {
        message: aiResponse.message,
        isCompleted: aiResponse.isCompleted || false,
        score: aiResponse.score,
        summary: aiResponse.summary,
        questionNumber: aiResponse.questionNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get technical interview history
// @route  GET /api/technical/history
const getHistory = async (req, res, next) => {
  try {
    const logs = await ChatLog.find({ user: req.user._id, roundType: 'technical' })
      .sort({ startedAt: -1 })
      .limit(10)
      .select('-messages');

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { startInterview, chat, getHistory };
