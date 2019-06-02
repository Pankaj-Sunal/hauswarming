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
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(busboyBodyParser({ limit: "10mb" }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/furniture", require("./routes/furnitureRoutes"));

app.listen(port, "0.0.0.0", err => {
  if (err) {
    console.log(err);
  }

  console.info(">>> 🌎 Open http://0.0.0.0:%s/ in your browser.", port);
});

module.exports = app;
