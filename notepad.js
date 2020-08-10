let http = require("http");
var fs = require("fs");
const repl = require("repl");
const { parse } = require("querystring");

const hostname = "127.0.0.1";
const port = process.env.PORT || 8000;

let thisSite = http.createServer(function (req, res) {
  // Home Page
  if (req.url == "/") {
    if (req.method == "GET") {
      fs.readFile("./html/index.html", function (err, data) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 - Internal Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    }
  }
});
thisSite.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
