const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extends: false }));

const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Flash
app.use(cookieParser("02062003"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

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

// [POST] /refreshToken
app.post("/refreshToken", (req, res) => {
  res.json(req.body);
})

app.listen(port, () => {
  console.log("Connected Success!");
  console.log(`App listening on port ${port}`);
});

// check process run in port and kill them
// lsof -i : port
// kill -9 <PID>

// start mongodb
// sudo service mongod start