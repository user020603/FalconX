const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route.js");
const profileRoutes = require("./profile.route.js");
const roomsChatRoutes = require("./rooms-chat.route.js");
const userMiddleware = require("../../middlewares/client/user.middleware.js");
const authTokenMiddleware = require("../../middlewares/client/authenToken.middleware.js");

module.exports = (app) => {
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoutes);
    app.use("/user", userRoutes);
    app.use("/chat", authTokenMiddleware.authenToken, chatRoutes);
    app.use("/users", authTokenMiddleware.authenToken, usersRoutes);
    app.use("/my-profile", authTokenMiddleware.authenToken, profileRoutes);
    app.use("/rooms-chat", authTokenMiddleware.authenToken, roomsChatRoutes);
}