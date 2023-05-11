const fs = require('fs');
//Create a log to file function that saves the data and timestamp to a filee
function log(data) {
    var d = new Date();
    var n = d.toISOString();
    var log = n + " - " + data + "\n";
    fs.appendFile('logs.txt', log, function (err) {
        if (err) throw err;
        console.log('Saved!');
    })
}

//Export log as default
module.exports = {
    log: log
};
