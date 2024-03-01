const express = require("express");
const app = express();
const port = 2908;

const route = require("./routes/client/index.route");

// Setup view
app.set("views", "./views");
app.set("view engine", "pug");

route(app);

app.listen(port, () => {
    console.log("Connected Success!");
    console.log(`App listening on port ${port}`);
})

// check process run in port and kill them
// lsof -i : port
// kill -9 <PID>

// start mongodb
// sudo service mongod start