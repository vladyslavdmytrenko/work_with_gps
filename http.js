const https = require('https');
const logger = require('./logger.js')('./logs/http.log')()('app')('http');
const info = logger('info');
const errorlog = logger('error');
const zipData = require('./zip');
const currentData = require('./currentData');
// correct this name func
const onceCalled = () => { 
  zipData.emitter.removeListener('update', onceCalled);
  sendData.sendHttp();
}

//for unix time 
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); } 
//=============

const sendData = {
  options: {
    hostname:'partners.easyway.info',
    path:'/gps/?city=kharkiv&provider=pesochyn&outside=1',
    method:'POST',
    headers:{'Content-Type':'application/*','Content-Encoding':'gzip'},},
 
  
  createConnection: function () {
    return https.request(this.options, function(res) {
      // info('request STATUS: ' + res.statusCode);
      // info('request HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        // info('request BODY: ' + chunk);
      });
    });
  },
  sendHttp: function () {
    let checkTime = this.checkTime();
    if (checkTime) {
      console.log('send data call')
      let data = zipData.getZipData();
      this.options.headers["Content-Length"] = data.length;
      let req = this.createConnection();
      req.on('error', function(error) {
        process.stdout.write('\033c');
        console.error('problem with request: ' + error);
        console.error(data, currentData.getData(),  data.length);
        errorlog('problem with request: ' + error);
      }); 
      req.write(data, (error) => {
        if  (error) { 
          errorlog(error);
        }
          //info('write data succesfull');
        req.end();
      });
    }
    setTimeout(this.sendHttp.bind(this), 20000)
  },
  checkTime: function () {
    //process.stdout.write('\033c');
    let currTime = new Date().getUnixTime();
    let dataTime = JSON.parse(currentData.getData()).timestamp
    console.log("TIME current " + currTime,"TIME gps " + dataTime)
    if (currTime - dataTime <  180) {
      return true
    } else {
      console.log('old gps data')
      return false
    }
  }
}
zipData.emitter.addListener('update', onceCalled);
module.exports = sendData;