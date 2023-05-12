const net = require('net');
const axios = require('axios');
const config = require('./utils/config.js');
const log = require('./utils/log.js').log;

//Connect to the socket.io server
const io = require('socket.io-client');
const socketio = io.connect(`http://${config.host}:${config.socket_port}`, {reconnect: true});

var tcpLoaded = false;

socketio.on('command', (command) => {
    log('CLI socket.io - Received command from web client: ' + command);

        if(tcpLoaded) {
            const handleCommand = require('./command.js').handleCommand
            handleCommand(command);
            log('CLI socket.io - Command sent to drone');
        } else {
            log('CLI socket.io - TCP server not loaded yet');
        }
});



const tcpServer = net.createServer((socket) => {
    console.log('CLI TCP - client connected');
    tcpLoaded = true;
    function handleCommand(data) {
        log('CLI TCP - Received command from web client: ' + data)
        socket.write(data, function (err) {
            if (err) log(err);
            log('CLI TCP - Command sent');
        });
    }
    
    // Forward incoming data to the web client using Socket.io
    socket.on('data', (data) => {
        log('CLI TCP - Received data from drone and sending to server: ' + data);
        socketio.emit('response', data.toString());
    });

    // Handle TCP client disconnects
    socket.on('end', () => {
        log('CLI TCP - client disconnected');
    });
    module.exports = {
        handleCommand: handleCommand
    };
});

tcpServer.listen(config.tcp_cli, () => {
    log('CLI TCP server listening on port '+config.tcp_cli);
});


