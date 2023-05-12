const net = require('net');
const fs = require('fs');
const request = require('request');
const config = require('./utils/config.js');
const log = require('./log.js').log;

const server = net.createServer((socket) => {
  log('Client connected');

  let data = '';

  function isValidJson(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  socket.on('data', (chunk) => {
    console.log(chunk.toString());
    //Get this chunk data and sepparate JSON by ^ for the beginning and for the end
    data += chunk.toString();
    let json = data.split('^');


    //If the JSON is not complete, wait for the next chunk
    if (json.length == 3) {
      //there we have the good json
      //How to check if json is valid
      if (!isValidJson(json[1])) {
        console.log('Invalid JSON');
        json = null;
        data = '';

        return;
      } else {
        log('json bun' + JSON.stringify(json[1]));
        //Post request to locahost/data
        request.post({
          url: 'http://localhost:4000/data',
          body: json[1],
          headers: {
            'Content-Type': 'application/json',
          }
        }, function (error, response, body) {
          console.log('Response: ' + response.statusCode);
        });
        json = null;
        data = '';
      }
    }



  });

  socket.on('end', () => {
    log('Client disconnected');


  });
});

server.on('error', (err) => {
  log('Server error:'+ err);
});

server.listen(config.tcp_data, () => {
  log('Server listening on port ' + config.tcp_data);
});
