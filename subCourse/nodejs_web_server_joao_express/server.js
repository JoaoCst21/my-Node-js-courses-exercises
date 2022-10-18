const express = require("express");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");

const app = express();
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// MIDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Server Statict files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// else pages send a 404 page
app.all("/*", (request, response) => {
  response.status(404);
  if (request.accepts("html")) {
    response.sendFile(path.join(__dirname, "views", "404.html"));
  }
  if (request.accepts("json")) {
    response.json({ error: "404 not found" });
  } else response.type("txt").send("404 not found");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server runnning on port: ${PORT}`));

/*

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


*/
