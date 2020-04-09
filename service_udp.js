'use strict';

const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const logger = require('./logger.js')('./logs/udp.log')()('app')('udp');
const info = logger('info');
const error = logger('error');
const currentData = require('./currentData.js');

//for unix time 
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); } 
//=============

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    error(err.stack)
    server.close();
});

server.on('message', (msg, rinfo) => {
     if (msg.toString('hex', 23, 24) === '08') {
        // get last data in packet
        const reqlen = '0005'
        const reqPocketID = msg.toString('hex', 2, 4);
        const reqPocketType = msg.toString('hex', 4, 5);
        const reqAVLId = msg.toString('hex', 5, 6);
        const reqNumberOfAcceptedData = msg.toString('hex', 24, 25);
        const AVLResponse = reqlen + reqPocketID + reqPocketType + reqAVLId + reqNumberOfAcceptedData;
        const buffResponse = Buffer.from(AVLResponse , 'hex');
        const gpsData = {
            "timestamp" : new Date(parseInt(msg.toString('hex', 25, 33), 16)).getUnixTime(),
            "lng" : parseInt(msg.toString('hex', 34, 38), 16),
            "lat" :  parseInt(msg.toString('hex', 38, 42), 16)
            };
        server.send(buffResponse, rinfo.port, rinfo.address, err => {
            if (err) {
                // server.close();
                error(err)
            }; 
        });
        currentData.setData(gpsData);
        // info(`${Buffer.byteLength(msg)} bytes ${JSON.stringify(gpsData)}`)
    }
});

module.exports = server;