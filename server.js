const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  server = require("http").createServer(app),
  cors = require("cors"),
  morgan = require("morgan"),
  commonFunction = require("./globalFunctions/commonFunction"),
  config = require("./config/config");

app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(morgan("dev"));
app.use(cors());

app.get("/walletNotify", (req, res) => {
  if (req.query.tx) {
    commonFunction.getTxConfirmations(req.query.tx);
    return res.send({ responseCode: 200 });
  }
});

app.get("/blockNotify", (req, res) => {
  if (req.query.tx) {
    commonFunction.getTxConfirmations(req.query.tx);
    return res.send({ responseCode: 200 });
  }
});

server.listen(global.gConfig.node_port, () => {
  console.log(
    `${global.gConfig.app_name} listening At: ${global.gConfig.node_port}`
  );
});
