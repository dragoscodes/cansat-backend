//Create a function, that saves the packet to a mongodb database without mongoose

const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js');
const log = require('./log.js').log;

const uri = config.mongodb_uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        log('MongoDB connection error: ' + err);
    } else {
        log('MongoDB connected');
    }
}
);

function savePacket(packet) {
    client.db("packet").collection("packet").insertOne(packet, function (err, res) {
        if (err) throw err;
        log("Packet inserted");
    });
}

module.exports = {
    savePacket: savePacket
};
