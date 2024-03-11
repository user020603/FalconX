// GET /rooms-chat/
module.exports.index = async (req, res) => {
    res.render("client/pages/rooms-chat/index", {
        pageTitle: "List of rooms chat"
    })
}