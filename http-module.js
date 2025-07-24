const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((request, response) => {
  let dosyaYolu = '';

  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hoş geldin!');
  } else if (request.url === '/hakkinda') {
    dosyaYolu = path.join(__dirname, 'public', 'hakkinda.html');
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Böyle bir sayfa yok!');
  }

  fs.readFile(dosyaYolu, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      return response.end("Sunucuda bir hata oluştu");
    }

    // response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(data)
  });
});

server.listen(5001, () => {
  console.log('Server running on port 5001');
});
