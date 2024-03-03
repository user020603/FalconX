const jwt = require("jsonwebtoken");

module.exports.authenToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.sendStatus(401); // Unauthorized
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            console.log(data);
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            next();
        });
    } catch (e) {
        return res.redirect("/user/login");
    }
};