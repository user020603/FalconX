const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const userMiddleware = require("../../middlewares/client/user.middleware.js");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoutes);
    app.use("/user", userRoutes);
}