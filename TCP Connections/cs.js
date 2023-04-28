const net = require('net');
const http = require('http');
const app = require('express')();
const cors = require('cors');
const exp = require('constants');
const axios = require('axios');
app.use(cors());
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});

// Create a TCP server that listens on port 8080
const tcpServer = net.createServer((socket) => {
    console.log('TCP client connected');
    const expressServer = require('express')();
    expressServer.use(cors());

    expressServer.get('/cli', (req, res) => {
        //Get params from request

        const data = req.query.command;
        console.log('Received command from web client: ' + data);
        socket.write(data, function (err) {
            if (err) throw err;
            console.log('Command sent');
        });

        res.send('Hello World!');
    });
    // Forward incoming data to the web client using Socket.io
    socket.on('data', (data) => {
        io.emit('response', data.toString());
    });

    // Handle TCP client disconnects
    socket.on('end', () => {
        console.log('TCP client disconnected');
    });
    expressServer.listen(3005, () => {
        console.log('Express server listening on port 3000');
    });
});

io.on('connection', (sock) => {

    console.log('Web client connected');

    sock.on('command', (command) => {
        console.log('Received command from web client: ' + command);
        //Using axios, Send command as a post request to localhost:3005
        axios.get('http://localhost:3005/cli?command='+command, )
            .then(function (response) {
                //console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    // Handle web client disconnects
    sock.on('disconnect', () => {
        console.log('Web client disconnected');
    });

});

tcpServer.listen(8080, () => {
    console.log('TCP server listening on port 8080');
});


httpServer.listen(3041, () => {
    console.log('HTTP server listening on port 3041');
});


