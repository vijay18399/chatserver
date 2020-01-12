var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var config = require("./config/config");
var cors = require("cors");
var app = express();
var port = process.env.PORT || 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  return res.send("chat server working in http://localhost:" + port);
});

var routes = require("./routes");
app.use("/api", routes);
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully!");
});

connection.on("error", err => {
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running. " + err
  );
  process.exit();
});

app.listen(port, function() {
  console.log("chat server working in http://localhost:" + port);
});
