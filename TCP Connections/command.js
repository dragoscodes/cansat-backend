const net = require('net');
const axios = require('axios');
const config = require('../utils/config.js');

//Connect to the socket.io server
const io = require('socket.io-client');
const socket = io.connect(`http://${config.host}:${config.socket_port}`, {reconnect: true});

var tcpLoaded = false;

socket.on('command', (command) => {
    console.log('CLI socket.io - Received command from web client: ' + command);

        if(tcpLoaded) {
            const handleCommand = require('./command.js').handleCommand
            handleCommand(command);
        } else {
            console.log('CLI socket.io - TCP server not loaded yet');
        }
});



const tcpServer = net.createServer((socket) => {
    console.log('CLI TCP - client connected');
    tcpLoaded = true;
    function handleCommand(data) {
        console.log('CLI TCP - Received command from web client: ' + data)
        socket.write(data, function (err) {
            if (err) throw err;
            console.log('CLI TCP - Command sent');
        });
    }
    
    // Forward incoming data to the web client using Socket.io
    socket.on('data', (data) => {
        io.emit('response', data.toString());
      console.log(data);
    });

    // Handle TCP client disconnects
    socket.on('end', () => {
        console.log('CLI TCP - client disconnected');
    });
    module.exports = {
        handleCommand: handleCommand
    };
});

tcpServer.listen(8080, () => {
    console.log('TCP server listening on port 8080');
});


