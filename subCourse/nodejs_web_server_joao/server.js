const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const EventEmitter = require("events");
const logEvents = require("./logEvents");

class MyEmitter extends EventEmitter {}

// initialize object
const myEmitter = new MyEmitter();
myEmitter.on("log", (msg, fileName) => {
  logEvents(msg, fileName);
});
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    // data in plain/raw text
    const isJson = contentType === "application/json";
    const textType = !contentType.includes("image") ? "utf-8" : "";
    const statusCode = filePath.includes("404.html") ? 404 : 200;

    const rawData = await fsPromises.readFile(filePath, textType);

    const data = isJson ? JSON.parse(rawData) : rawData;
    response.writeHead(statusCode, { "content-Type": contentType });

    response.end(isJson ? JSON.stringify(data) : data);
  } catch (err) {
    console.error(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((request, response) => {
  console.log(`request.url: ${request.url}`, `method: ${request.method}`);
  myEmitter.emit("log", `${request.url}\t${request.method}`, "reqLog.txt");
  console.log({ response });

  const extension = path.extname(request.url);

  // default
  let contentType = "text/html";

  // if different change default
  if (extension === ".css") contentType = "text/css";
  if (extension === ".js") contentType = "text/javascript";
  if (extension === ".json") contentType = "application/json";
  if (extension === ".jpg") contentType = "image/jpeg";
  if (extension === ".png") contentType = "image/png";
  if (extension === ".txt") contentType = "text/plain";

  let filePath = (() => {
    if (contentType === "text/html" && request.url === "/") {
      return path.join(__dirname, "views", "index.html");
    }

    if (contentType === "text/html" && request.url.slice(-1) === "/") {
      return path.join(__dirname, "views", request.url, "index.html");
    }

    if (contentType === "text/html") {
      return path.join(__dirname, "views", request.url);
    }
    // default
    return path.join(__dirname, request.url);
  })();

  // makes the .html extension not required
  if (!extension && request.url.slice(-1) !== "/") filePath += ".html";
  console.log({ filePath });

  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, response);
  } else {
    // 301
    switch (path.parse(filePath).base) {
      case "old-page.html":
        response.writeHead(301, { location: "/new-page.html" });
        response.end();
        break;
      case "www-page.html":
        response.writeHead(301, { location: "/" });
        response.end();
        break;
      default:
        // 404
        serveFile(
          path.join(__dirname, "views", "404.html"),
          "text/html",
          response,
        );
    }
  }

  // let pathFile;
  // if (request.url === "/" || request.url === "index.html") {
  //   response.statusCode = 200;
  //   response.setHeader("Content-Type", "text/html");
  //   pathFile = path.join(__dirname, "views", "index.html");
  //   fs.readFile(pathFile, "utf-8", (err, data) => {
  //     response.end(data);
  //   });
  // }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// // add listener before Log Event

// setTimeout(() => {
//   // Emit Event
//
// }, 2000);
