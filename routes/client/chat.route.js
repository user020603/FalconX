const express = require("express");
const router = express();

const controller = require("../../controllers/client/chat.controller");

router.get("/:roomChatId", controller.index);

module.exports = router;
