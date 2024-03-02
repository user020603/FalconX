const homeRoutes = require("./home.route");
const userRoutes = require("./user.route");

module.exports = (app) => {
    app.use("/", homeRoutes);
    app.use("/user", userRoutes);
}