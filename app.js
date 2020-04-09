'use strict';

const serviceUDP = require('./service_udp');
const req = require('./http');
const senderData = require('./zip');

serviceUDP.bind(2505)