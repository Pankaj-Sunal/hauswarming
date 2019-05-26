const mongoose = require("mongoose"),
  config = require("../config/config.js"),
  db_name = `${global.gConfig.database}`,
  host = "localhost:27017",
  DB_URL = `mongodb://${host}/${db_name}`,
  session = require("express-session"),
  cookieParser = require("cookie-parser"),
  MongoStore = require("connect-mongo")(session);
global.Promise = mongoose.Promise;

mongoose.connect(DB_URL, { useNewUrlParser: true });
/************************************ Events of mongoose connection. ******************************************************/
// CONNECTION EVENTS
// When successfully connected

mongoose.connection.on("connected", () => {
  console.log("success", "Mongoose default connection open to " + DB_URL);
});
// If the connection throws an error
mongoose.connection.on("error", err => {
  console.log("error", "Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  console.log("warning", "Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "warning",
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});

module.exports = app => {
  app.use(
    session({
      secret: "*********",
      saveUninitialized: true,
      resave: true,
      cookie: { maxAge: 20000 }, //session Expiration Time
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
  );
};
