const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/progress', require('./src/routes/progress'));
app.use('/api/resume', require('./src/routes/resume'));
app.use('/api/aptitude', require('./src/routes/aptitude'));
app.use('/api/coding', require('./src/routes/coding'));
app.use('/api/technical', require('./src/routes/technical'));
app.use('/api/hr', require('./src/routes/hr'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Placement Prep AI backend is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
