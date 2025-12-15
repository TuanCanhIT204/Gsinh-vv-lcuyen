const Reply = require('../models/Reply');

// POST /api/replies
async function createReply(req, res, next) {
  try {
    const { message, fromName } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const reply = await Reply.create({
      message: message.trim(),
      fromName: fromName || ''
    });

    res.status(201).json({
      message: 'Reply saved',
      reply
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/replies
async function getReplies(req, res, next) {
  try {
    const replies = await Reply.find().sort({ createdAt: -1 });
    res.json(replies);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReply,
  getReplies
};
