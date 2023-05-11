var net = require('net');
var fs = require('fs');
const config = require('../utils/config.js');

// Configuration parameters
var HOST = config.host;
var PORT = config.tcp_video;

let frames = [];
let currentFrame = [];
let isJpeg = false;

// Create Server instance 
var server = net.createServer(onClientConnected);

server.listen(PORT, HOST, function () {
  console.log('server listening on %j', server.address());
});

function onClientConnected(sock) {
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);

  //Listen for data and save to file
  sock.on('data', function (data) {
    console.log('data from %s: %j', remoteAddress, data);

    const byteArr = Buffer.from(data, 'binary'); // convert binary data to a byte array

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
        frames.push(Buffer.from(currentFrame)); // add the current frame to the frames array
      }

      if (isJpeg) {
        currentFrame.push(byteArr[i]);
         request.post({
           url: 'http://localhost:4000/video',
           body: Buffer.from(currentFrame),
           headers: {
             'Content-Type': 'image/jpeg'
         }
         }, function (error, response, body) {
           console.log('Response: ' + response.statusCode);
         });

      }
    }



  });

  sock.on('close', function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};