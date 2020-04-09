const http = require('http');
const zlib = require('zlib');
const fs = require('fs');

http.createServer((request, response) => {
  let acceptEncoding = request.headers['accept-encoding'];
  response.setHeader('Content-Encoding', ' gzip');
  if (!acceptEncoding) {
    acceptEncoding = '';
  }
  request.on('data', (chunk) => {
  zlib.gunzip(chunk, (error, res) => {
    if (error) throw error;
      console.log(res.toString());  
      response.writeHead(200);
      response.end(res.toString());
    })
  })
}).listen(8080);