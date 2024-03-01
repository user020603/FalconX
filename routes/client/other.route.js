const express = require("express");
const route = express();

route.get("/", (req, res) => {
    res.send("OK");
})

module.exports = route;