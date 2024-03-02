const express = require("express");
const route = express();

const controller = require("../../controllers/client/user.controller");

route.get("/", controller.index);

route.get("/register", controller.register)

module.exports = route