const User = require("../../models/user.model")

// [GET] /
module.exports.index = async (req, res) => {
    res.send("OK");
}