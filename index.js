const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const database = require("./config/database");
database.connect();

const port = process.env.PORT;
const route = require("./routes/client/index.route");

// Setup view
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

route(app);

app.listen(port, () => {
  console.log("Connected Success!");
  console.log(`App listening on port ${port}`);
});

// check process run in port and kill them
// lsof -i : port
// kill -9 <PID>

// start mongodb
// sudo service mongod start
