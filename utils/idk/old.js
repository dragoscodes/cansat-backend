const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

ffmpeg.setFfmpegPath(ffmpegPath);

function createJPEGFromBuffer(buffer, outputFilename) {
  sharp(buffer)
    .toFile(outputFilename, (err, info) => {
      if (err) {
        console.log('An error occurred: ' + err.message);
      } else {
        console.log('Image created: ' + info.filename);
      }
    });
}

function createMP4FromJPEGs(jpegBuffers, outputFilename) {
  const fps = 24; // Frames per second
  const stream = ffmpeg();

  jpegBuffers.forEach((buffer, i) => {
    createJPEGFromBuffer(buffer, `./images/image${i}.jpg`)
    stream.addInput(`./images/image${i}.jpg`);
  });

  stream
    .inputFPS(fps)
    .outputOptions(['-c:v yuv420p'])
    .on('error', (err) => {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', () => {
      console.log('Finished processing');
    })
    .save(outputFilename);
}

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    credentials: false
  }
});
const fs = require('fs');

const binaryData = fs.readFileSync('fil4.dat', 'binary'); // read binary data from a file (or any other source)
const byteArr = Buffer.from(binaryData, 'binary'); // convert binary data to a byte array

let frames = [];
let currentFrame = [];
let isJpeg = false;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

io.on('connection', async (socket) => {
  console.log('a user connected');

  for (let i = 0; i < byteArr.length; i++) {
    // Check if the current byte is the start of a new JPEG frame
    if (byteArr[i] === 0xff && byteArr[i + 1] === 0xd8) {
        isJpeg = true;
        currentFrame = [];
    }

    // Check if the current byte is the end of the current JPEG frame
    if (byteArr[i] === 0xff && byteArr[i + 1] === 0xd9) {
        isJpeg = false;
        currentFrame.push(byteArr[i], byteArr[i + 1]);
        frames.push(Buffer.from(currentFrame));
        socket.emit('image', Buffer.from(currentFrame).toString('base64'));

    }

    if (isJpeg) {
        currentFrame.push(byteArr[i]);
    }

}

const jpegBuffers = frames; // Your array of JPEG buffer arrays
const outputFilename = './output.mp4';
createMP4FromJPEGs(jpegBuffers, outputFilename);
//END FFMPEG

  // Listen for events on the socket
  socket.on('data', (msg) => {
    console.log('message: ' + msg);

    // Emit events on the socket
    io.emit('chat message', msg);
  });

  socket.onAny((eventName, ...args) => {
    console.log(`Received event ${eventName} with arguments: ${args}`);
  });

  socket.on('status', (msg) => {
    console.log('message: ' + msg);

    // Emit events on the socket
    io.emit('chat message', msg);
  });

  // Listen for disconnect events on the socket
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/', (req, res) => {
    res.send('ok');
})

// Start the server
const port = 3030;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});