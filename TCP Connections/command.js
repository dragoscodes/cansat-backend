var net = require('net');
var fs = require('fs');
var express = require('express');
var cors = require('cors');
var http = require('http');

//Use a socket.io server as well to send data to the client using the port 3028

var HOST = 'localhost';
var PORT = 3030;//3042

// Create Server instance 
var tcp_server = net.createServer(onClientConnected);

tcp_server.listen(PORT, HOST, function () {
  console.log('tcp_server listening on %j', tcp_server.address());
});

function onClientConnected(sock) {
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('TCP connected: %s', remoteAddress);

  //something is wrong here

  sock.write(data, function (err) {
    if (err) throw err;
    console.log('Command sent');
  });


  //Listen for data and save to file
  sock.on('data', function (data) {
    console.log('data from %s: %j', remoteAddress, data);
    socket.emit('data', data);
  });

  sock.on('close', function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
} 
