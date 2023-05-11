const fs = require('fs');

let frames = [];
let currentFrame = [];
let isJpeg = false;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function convertToImage( byteArr ) {

/*
const binaryData = fs.readFileSync('fil4.dat', 'binary'); // read binary data from a file (or any other source)
const byteArr = Buffer.from(binaryData, 'binary'); // convert binary data to a byte array
*/

for (let i = 0; i < byteArr.length; i++) {
    // Check if the current byte is the start of a new JPEG frame
    if (byteArr[i] === 0xff && byteArr[i + 1] === 0xd8) {
        isJpeg = true;
        currentFrame = [];
    }

    // Check if the current byte is the end of the current JPEG frame
    if (byteArr[i] === 0xff && byteArr[i + 1] === 0xd9) {
        isJpeg = false;
        currentFrame.push(byteArr[i], byteArr[i + 1]);
        frames.push(Buffer.from(currentFrame));
        return(Buffer.from(currentFrame).toString('base64'));
        //socket.emit('image', Buffer.from(currentFrame).toString('base64'));
    }

    if (isJpeg) {
        currentFrame.push(byteArr[i]);
    }
}

}