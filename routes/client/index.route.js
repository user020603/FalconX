const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const userMiddleware = require("../../middlewares/client/user.middleware.js");
const authTokenMiddleware = require("../../middlewares/client/authenToken.middleware.js");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoutes);
    app.use("/user", userRoutes);
    app.use("/chat", authTokenMiddleware.authenToken, chatRoutes);
}