const net = require('net');
const fs = require('fs');

const server = net.createServer((socket) => {
  console.log('Client connected');

  let data = '';

  socket.on('data', (chunk) => {
    console.log(chunk);
    
    //Get this chunk data and sepparate JSON by ^ for the beginning and for the end
    data += chunk.toString();
    let json = data.split('^');
    console.log(json);
    //If the JSON is not complete, wait for the next chunk
    if(json.length < 2) {
      
      

    console.log(data);
  
  });

  socket.on('end', () => {
    console.log('Client disconnected');

   
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8020, () => {
  console.log('Server listening on port 8020');
});
