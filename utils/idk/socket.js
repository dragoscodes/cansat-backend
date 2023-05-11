const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');
  
  app.get('/command-response' , (req, res) => {
    console.log('Command received: ' + req.query.command);
    socket.emit('command-response', req.query.command);
    res.send('Command sent');
    });

  // Handle incoming messages
  socket.on('message', (message) => {
    console.log('message received:', message);
    io.emit('message', message);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start server
const port = 3005;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
