const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fcfsRoute = require('./routes/fcfs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin:  'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ✅ Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected via WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use((req, res, next) => {
  req.io = io; 
  next();
});

//ROutes
app.use('/api/fcfs', fcfsRoute);

const srtnRoute = require('./routes/srtn');
app.use('/api/srtn', srtnRoute);

const sjfRoute=require('./routes/sjf')
app.use('/api/sjf',sjfRoute);

const priorityRoute = require('./routes/PriorityScheduling');
app.use('/api/PriorityScheduling', priorityRoute);

// Start the server
server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

 app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
