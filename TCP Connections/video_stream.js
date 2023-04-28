var net = require('net');
var fs = require('fs');
// Configuration parameters
var HOST = 'localhost';
var PORT = 3000;

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