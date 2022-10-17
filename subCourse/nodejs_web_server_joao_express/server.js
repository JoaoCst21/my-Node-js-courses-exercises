const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whiteList = [
  "https://www.google.com",
  "https://127.0.0.1:5500",
  "https://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
      return;
    }
    callback(new Error("Not Alllowed by CORS"));
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// MIDLEWARE
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

// REGEX
app.get("^/$|/index(.html)?", (request, response) => {
  // response.sendFile("./views/index.html", { root: __dirname });
  response.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (request, response) => {
  response.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (request, response) => {
  // response.sendFile(path.join(__dirname, "views", "new-page.html"));
  response.redirect(301, "/new-page");
});

// Route Handlers
app.get(
  "/hello(.html)?",
  (request, response, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (request, response) => response.send("Hello World!"),
);

// Chaining Route Handlers
const one = (request, response, next) => {
  console.log("one");
  next();
};

const two = (request, response, next) => {
  console.log("two");
  next();
};

const three = (request, response) => {
  console.log("three");
  response.send("Finished");
};

app.get("/chain(.html)?", [one, two, three]);

// else pages send a 404 page
app.get("/*", (request, response) => {
  response.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server runnning on port: ${PORT}`));
