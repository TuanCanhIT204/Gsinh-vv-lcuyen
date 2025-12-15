const express = require('express');
const router = express.Router();
const {
  createReply,
  getReplies
} = require('../controllers/replyController');

// Cô ấy gửi lời nhắn lại
router.post('/', createReply);

// Cậu xem danh sách lời nhắn
router.get('/', getReplies);

module.exports = router;
