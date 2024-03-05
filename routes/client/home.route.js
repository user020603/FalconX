const express = require("express");
const router = express();
const controller = require("../../controllers/client/home.controller");
const authMiddleware = require("../../middlewares/client/authenToken.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");

router.get("/", userMiddleware.infoUser, controller.index);

module.exports = router