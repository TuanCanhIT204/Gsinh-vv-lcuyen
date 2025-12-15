const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    yourName: {
      type: String,
      required: true
    },
    crushName: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    trollMessages: {
      type: [String],
      default: [
        'Ố ồ… hộp này hình như tuyết chiếm hết chỗ rồi, hết quà mất rồi 😝',
        'Anh test xem em có kiên nhẫn không thôi, mở hộp khác nha 🤭'
      ]
    },
    realMessage: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
