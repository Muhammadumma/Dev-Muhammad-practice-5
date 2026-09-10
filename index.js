const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Initialize Telegram Bot (replace with your token)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'your-bot-token';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', status: 'OK' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Telegram bot message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Message received!');
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ 
      message: 'File uploaded successfully', 
      filename: req.file.filename 
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// API endpoint example
app.get('/api/data', (req, res) => {
  res.json({ 
    data: 'Sample data',
    id: uuidv4()
  });
});

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

app.get('/ws', (req, res) => {
  res.send('WebSocket endpoint ready');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
