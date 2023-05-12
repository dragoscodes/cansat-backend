var net = require('net');
var fs = require('fs');
const config = require('./utils/config.js');
const log = require('./utils/log.js').log;
const request = require('request');

let frames = [];
let currentFrame = [];
let isJpeg = false;

// Create Server instance 
var server = net.createServer(onClientConnected);

server.listen(config.tcp_video, config.host, function () {
  log('Video TCP Server listening on'+ server.address());
});

function onClientConnected(sock) {
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  log('New client connected: '+ remoteAddress);

  //Listen for data and save to file
  sock.on('data', function (data) {

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
            console.log('Response: ' + response.statusCode + body);
         });

      }
    }

  });

  sock.on('close', function () {
    log('connection closed from '+ remoteAddress);
  });
  sock.on('error', function (err) {
    log('Connection  error: '+ remoteAddress+ ' ' +  err.message);
  });
};