const net = require('net');
const http = require('http');
const app = require('express')();
const cors = require('cors');
const exp = require('constants');
const axios = require('axios');
//import config from './config.json';
const config = require('../../utils/config');
const log = require('../../utils/log.js').log;
app.use(cors());
const httpServer = require('http').createServer(app);

var tcpLoaded = false;

//The io now becomes socket-io client
const io = require('socket.io-client');
const socket = io.connect(`http://${config.host}:${config.port}`, {reconnect: true});

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
    });

    // Handle TCP client disconnects
    socket.on('end', () => {
        console.log('CLI TCP - client disconnected');
    });

    module.exports = {
        handleCommand: handleCommand
    };
});



io.on('connection', (sock) => {

    console.log('Web client connected');

    sock.on('command', (command) => {
        console.log('CLI socket.io - Received command from web client: ' + command);

            if(tcpLoaded) {
                const handleCommand = require('./cli+socket.js').handleCommand
                handleCommand(command);
            } else {
                console.log('CLI socket.io - TCP server not loaded yet');
            }
    });

    // Handle web client disconnects
    sock.on('disconnect', () => {
        console.log('CLI socket.io - Web client disconnected');
    });

});

tcpServer.listen(8080, () => {
    console.log('TCP server listening on port 8080');
});


httpServer.listen(3041, () => {
    console.log('HTTP server listening on port 3041');
});


