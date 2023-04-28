const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const { Server } = require("socket.io");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      credentials: false
    }
  });

io.on('connection', async (socket) => {
  console.log('a user connected');
  // Listen for events on the socket
  socket.on('video-stream', (msg) => {
    //Handle video stream
  })

  socket.on('system-status', (msg) => {
    const { bat_current, bat_current_total, bat_voltage, signal_strength, using_lte, video_available, run_mode, target_longitude, target_latitude } = msg;
    //salvam undeva?
  });
  socket.on('data-sample', (msg) => {
    const { timestamp, longitude, latitude, altitude, orientation, temp_fc, temp_mb, temp_ambient, humidity, pressure, acceleration, angular_velocity, magnetic_field } = msg;
  })

  socket.onAny((eventName, ...args) => {
    console.log(`Received event ${eventName} with arguments: ${args}`);
  });

  // Listen for disconnect events on the socket
  socket.on('disconnect', () => {
    console.log('!! USER DISCONNECTED !!');
  });
  for(let i = 0; i < 100; i++) {
    socket.emit('data', i+165465451);
    await sleep(1000);
    }
});

app.get('/', (req, res) => {
    res.send('Server is up');
})

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Socket open on ${port}`);
});

