const express = require("express");
const router = express.Router();
const userValidate = require("../../validates/client/user.validate");
const auth = require("../../middlewares/client/authenToken.middleware");

const controller = require("../../controllers/client/user.controller");

router.get("/register", controller.register);

router.post("/register", userValidate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.post("/refreshToken", auth.authenToken, controller.refreshToken);

module.exports = router;