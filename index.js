const { createServer } = require('node:http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 8080;

const httpHandler = (req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err == null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    } else {
      res.statusCode = 500;
      console.log(err);
      res.end('Internal Server Error');
    }
  });
};

const server = createServer(httpHandler);
const listener = () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}
server.listen(port, hostname, listener);
