// [GET] /profile
module.exports.index = async (req, res) => {
    const user = res.locals.user;
    
    res.render("client/pages/profile/index.pug", {
        pageTitle: "My Profile",
        user: user
    })
}