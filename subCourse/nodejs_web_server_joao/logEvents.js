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
    if (!fs.existsSync(path.join(__dirname, "logs")))
      await fsPromises.mkdir(path.join(__dirname, "logs"));

    await fsPromises.appendFile(path.join(__dirname, "logs", logFile), logItem);
  } catch (e) {
    console.error(e);
  }
};
module.exports = logEvents;
