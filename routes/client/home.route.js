const express = require("express");
const router = express();
const controller = require("../../controllers/client/home.controller");
const authMiddleware = require("../../middlewares/client/authenToken.middleware");

router.get("/", authMiddleware.authenToken, controller.index);

module.exports = router