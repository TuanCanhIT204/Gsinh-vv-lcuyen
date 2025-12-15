const Settings = require('../models/Settings');
const { calculateDaysBetween } = require('../utils/dateUtils');

// GET /api/settings
async function getSettings(req, res, next) {
  try {
    let settings = await Settings.findOne();

    // Nếu DB chưa có thì tạo default để test
    if (!settings) {
      settings = await Settings.create({
        yourName: 'Anh',
        crushName: 'Lcuyen',
        startDate: new Date(),
        realMessage:
          'Giáng Sinh đầu tiên của tụi mình…Anh không biết nên viết dài hay ngắn, chỉ biết nói thật lòng rằng:Anh rất trân trọng những ngày qua bên em.Dù tụi mình mới yêu nhau chưa lâu, nhưng em đã làm cho cuộc sống của anh ấm áp hơn mà không cần cố gắng gì cả.Chúc em một Giáng Sinh nhẹ nhàng, bình yên, và luôn mỉm cười thật nhiều.Và nếu em cho phép… anh mong mùa Giáng Sinh này chỉ là khởi đầu cho nhiều mùa nữa bên em.❤️💌'
      });
    }

    const daysTogether = calculateDaysBetween(settings.startDate);

    res.json({
      yourName: settings.yourName,
      crushName: settings.crushName,
      startDate: settings.startDate,
      daysTogether,
      trollMessages: settings.trollMessages,
      realMessage: settings.realMessage
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/settings
async function updateSettings(req, res, next) {
  try {
    const { yourName, crushName, startDate, trollMessages, realMessage } =
      req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (yourName !== undefined) settings.yourName = yourName;
    if (crushName !== undefined) settings.crushName = crushName;
    if (startDate !== undefined) settings.startDate = new Date(startDate);
    if (trollMessages !== undefined) settings.trollMessages = trollMessages;
    if (realMessage !== undefined) settings.realMessage = realMessage;

    await settings.save();

    res.json({ message: 'Settings updated', settings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSettings,
  updateSettings
};
