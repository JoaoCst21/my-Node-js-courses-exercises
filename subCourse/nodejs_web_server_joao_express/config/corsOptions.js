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

module.exports = corsOptions;
