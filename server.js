// This server file will create the socket.io server, just for it to be held here, will log just log the data.
const app = require('express')();
const cors = require('cors');
const io = require('socket.io');
const config = require('./utils/config.js');
const log = require('./utils/log.js').log;
app.use(cors());
const api = require('express')();
api.use(cors());

const apiServer = require('http').createServer(api);

const SocketServer = require('http').createServer(app);

const Socket = io(SocketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin']
    }
});

//TCP socket will have all the connections and will call ClientSocket.emit('response', data.toString()); to send the data to the client.
var i =0;

Socket.on('connection', (socket) => {

    console.log('Web client connected');
    socket.onAny((event, ...args) => {
        console.log(event, args);
        });

    socket.on('command', (command) => {
        console.log('CLI socket.io - Received command from web client: ' + command);
    });
    api.get('/cli', (req, res) => {
        console.log('API - command recieved and sending to socket' + req.query.command);
        socket.emit('command', req.query.command);
        res.send('Command recieved!');
        });

    api.post('/video', (req,res)=> {
        console.log('API - Video recieved and sending to socket' + req.body);
        socket.emit('video', req.body);
        res.send('Video recieved!');
    })

    api.post('/data', (req,res)=> {
        console.log('API - Data recieved and sending to socket' + req.body);
        socket.emit('data', req.body);
        res.send('Data recieved!');
    })
    
    //ASTA E DOAR DE TEST POTI SA O SCOTi
    setInterval(() => {
        socket.emit('response', 'test'+i+'\n');
        i++;
    }, 1000);

    // Handle web client disconnects
    socket.on('disconnect', () => {
        console.log('CLI socket.io - Web client disconnected');
    });

});

SocketServer.listen(config.socket_port, () => {
    console.log('Socket server listening on port '+config.socket_port);
});

apiServer.listen(4000, () => {
    console.log('API HTTP server listening on port 4000');
  });
  