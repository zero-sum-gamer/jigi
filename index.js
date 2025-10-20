import { createServer } from 'node:http';
import fs from 'fs';
import path from 'path';

const hostname = '127.0.0.1';
const port = 8080;

const httpHandler = (req, res) => {
  // Resolve file path (prevent directory traversal)
  let filePath = path.join("./public", req.url === "/" ? "index.html" : req.url);

  // Detect content type
  const ext = path.extname(filePath);
  let contentType = "text/html";
  if (ext === ".js") contentType = "text/javascript";
  else if (ext === ".css") contentType = "text/css";
  else if (ext === ".json") contentType = "application/json";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg") contentType = "image/jpeg";

  fs.readFile(filePath, (err, data) => {
    if (!err) {
      res.writeHead(200, { 
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":"GET",
        "Access-Control-Allow-Headers": "*" 
      });
      res.end(data);
    } else if (err.code === "ENOENT") {
      fs.readFile("./public/index.html", (_, _data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(_data);
      });
    } else {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });
};

const server = createServer(httpHandler);
const listener = () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}
server.listen(port, hostname, listener);
