const express = require("express");
const app = express();
const port = 2908;
const path = require("path");

// Setup view
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("client/pages/home/index");
})

app.get("/other", (req, res) => {
    res.sendFile(path.join(__dirname+'/views/client/pages/home/index.html'))
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// check process run in port and kill them
// lsof -i : port
// kill -9 <PID>

// start mongodb
// sudo service mongod start