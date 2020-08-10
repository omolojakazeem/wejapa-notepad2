let http = require("http");
let fs = require("fs");
const repl = require("repl");
const { parse } = require("querystring");
const path = require("path");
const basePath = __dirname;

let assets = path.join(basePath, "assets");

const hostname = "127.0.0.1";
const port = process.env.PORT || 8000;

let thisSite = http.createServer(function (req, res) {
  // Home Page
  if (req.url == "/") {
    if (req.method == "GET") {
      fs.readFile("assets/html/index.html", function (err, data) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 - Internal Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          const directoryPath = path.join(__dirname, "notes");
          //passsing directoryPath and callback function
          fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
              return console.log("Unable to scan directory: " + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
              data += file;
              // Do whatever you want to do with the file
              console.log(file);
              res.write(`<ul>
              <li>${file}</li> </ul>`);
            });
            res.end();
          });
        }
      });
    }
  } else if (req.url == "/add") {
    if (req.method == "GET") {
      fs.readFile("assets/html/add.html", function (err, data) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 - Internal Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
      });
    } else if (req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
        body = parse(body);
        category = body.category;
        noteTitle = body.title;
        content = body.text;
      });
      req.on("end", () => {
        if (fs.existsSync(`notes/${category}`)) {
          fs.writeFile(`notes/${category}/${noteTitle}.txt`, content, function (
            err
          ) {
            if (err) throw err;
            res.end(`File ${noteTitle} Created Successfully`);
          });
        } else {
          fs.mkdir(`notes/${category}`, { recursive: true }, function (err) {
            if (err) {
              res.end(error);
            } else {
              fs.writeFile(
                `notes/${category}/${noteTitle}.txt`,
                content,
                function (err) {
                  if (err) throw err;
                  res.end(
                    `New directory ${category} successfully created and file ${noteTitle} added sucessfully `
                  );
                }
              );
            }
          });
        }
      });
    }
  }
});
thisSite.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
