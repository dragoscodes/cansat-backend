// This server file will create the socket.io server, just for it to be held here, will log just log the data.
const app = require('express')();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const io = require('socket.io');
const config = require('./utils/config.js');
var bodyParser = require('body-parser');
app.use(express.json({ limit: '10mb' }))
app.use(cors());
const api = require('express')();
api.use(cors());
api.use(express.json({ limit: '10mb' }))
const { MongoClient, ServerApiVersion } = require('mongodb');
const apiServer = require('http').createServer(api);
const SocketServer = require('http').createServer(app);


function log(data) {
    var d = new Date();
    var n = d.toISOString();
    var logx = n + " - " + data + "\n";
    fs.appendFile('logs.txt', logx, function (err) {
        if (err) throw err;
    })
}

const socket = io(SocketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});

socket.on('connection', (socket) => {
    log('Client connected');

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

});

function emitX(path, data) {
    socket.emit(path, data);
}


api.get('/cli', (req, res) => {
    log('API - command recieved and sending to socket - ' + req.query.command);
    emitX('command', req.query.command + '\n');
    res.send('Command recieved!');
});

api.post('/video', (req, res) => {
    log('API - Video recieved and sending to socket');
    emitX('video', req.body);
    res.send('Video recieved!');
})

api.post('/data', (req, res) => {
    //Get body of request
    log('API - Data recieved and sending to socket ' + JSON.stringify(req.body));
    emitX('data', req.body);
    res.send("Data recieved")

})

// Handle web client disconnects
socket.on('disconnect', () => {
    log('socket.io - client disconnected');
});

SocketServer.listen(config.socket_port, () => {
    console.log('Socket server listening on port ' + config.socket_port);
    log("Socket server listening on port " + config.socket_port);
});

apiServer.listen(4000, () => {
    console.log('API HTTP server listening on port 4000');
    log('API HTTP server listening on port 4000');
});

