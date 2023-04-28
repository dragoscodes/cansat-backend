//Create a log to file function that saves the data and timestamp to a file
function logToFile(data) {
    var d = new Date();
    var n = d.toISOString();
    var log = n + " - " + data;
    fs.appendFile('logs.txt', log, function (err) {
        if (err) throw err;
        console.log('Saved!');
    })
}
