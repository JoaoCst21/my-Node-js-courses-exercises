const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, logFile) => {
  const dateTime = `${format(Date.now(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
  console.log(logItem);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs")))
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logItem,
    );
  } catch (e) {
    console.error(e);
  }
};

const logger = (
  { method, url, headers: { origin }, path: reqPath },
  response,
  next,
) => {
  logEvents(`${method}\t${origin}\t${url}`, "reqLog.txt");
  console.log(`${method} ${reqPath}`);
  next();
};

module.exports = { logEvents, logger };
