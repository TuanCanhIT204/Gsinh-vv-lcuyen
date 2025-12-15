const express = require('express');
const cors = require('cors');
const settingsRoutes = require('./routes/settingsRoutes');
const replyRoutes = require('./routes/replyRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ========================
// Middleware
// ========================
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*'
  })
);
app.use(express.json());

// ========================
// ✅ ROOT ROUTE (BẮT BUỘC CHO RENDER)
// ========================
app.get('/', (req, res) => {
  res.status(200).send('🎄 Christmas Gift Server is running!');
});

// ========================
// API ROUTES
// ========================
app.use('/api/settings', settingsRoutes);
app.use('/api/replies', replyRoutes);

// ========================
// Health check (giữ nguyên)
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

// ========================
// Error handler (luôn để cuối)
// ========================
app.use(errorHandler);

module.exports = app;
