const express = require("express");
const router = express();

router.get("/", (req, res) => {
    res.render("client/pages/home/index");
})

module.exports = router