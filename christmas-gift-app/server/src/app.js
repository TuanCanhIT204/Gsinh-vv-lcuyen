const express = require('express');
const cors = require('cors');
const settingsRoutes = require('./routes/settingsRoutes');
const replyRoutes = require('./routes/replyRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*'
  })
);
app.use(express.json());

// routes chính
app.use('/api/settings', settingsRoutes);
app.use('/api/replies', replyRoutes);

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// middleware xử lý lỗi (đặt cuối)
app.use(errorHandler);

module.exports = app;
