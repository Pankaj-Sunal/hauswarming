const express = require("express"),
  app = express(),
  cors = require("cors"),
  morgan = require("morgan"),
  config = require("./config/config"),
  dao = require("./dbConnections/mongodb")(app),
  busboy = require("connect-busboy"),
  busboyBodyParser = require("busboy-body-parser");

const port = process.env.PORT || global.gConfig.node_port;

app.use(busboy());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(busboyBodyParser());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1", require("./routes/userRoutes"));
require("./routes/userRoutes")(app);

app.listen(port, "0.0.0.0", err => {
  if (err) {
    console.log(err);
  }

  console.info(">>> 🌎 Open http://0.0.0.0:%s/ in your browser.", port);
});

module.exports = app;
