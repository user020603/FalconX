const homeRoutes = require("./home.route");
const otherRoutes = require("./other.route");

module.exports = (app) => {
    app.use("/", homeRoutes);
    app.use("/other", otherRoutes);
}