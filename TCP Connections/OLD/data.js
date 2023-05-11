var net = require('net');
var fs = require('fs'); 
// Configuration parameters
var HOST = 'localhost';
var PORT = 3000;
 
// Create Server instance 
var server = net.createServer(onClientConnected);  
 
server.listen(PORT, HOST, function() {  
  console.log('server listening on %j', server.address());
});
 
function onClientConnected(sock) {  
  var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
  console.log('new client connected: %s', remoteAddress);
 
  //Listen for data and save to file
  sock.on('data', function (data) {
    console.log('data from %s: %j', remoteAddress, data);
    fs.appendFile('data.txt', data, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  });

  sock.on('close',  function () {
    console.log('connection from %s closed', remoteAddress);
  });
  sock.on('error', function (err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  });
};