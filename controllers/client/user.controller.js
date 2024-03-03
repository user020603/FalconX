const md5 = require("md5");
const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");

// [GET] /
module.exports.index = async (req, res) => {
  res.send("OK");
};

// [GET] /register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Register",
  });
};

// [POST] /register
module.exports.registerPost = async (req, res) => {
  const existedEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existedEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  // res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
};

// [GET] /login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Login",
  });
};

// [POST] /login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  // Authentication
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status !== "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  // End Authentication

  // Authorization
  const data = user._id;
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10s',
  });
  const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET);
  await User.findOneAndUpdate(
    { email: req.body.email }, 
    { $push: { refreshTokens: refreshToken } }
  );
  res.cookie("tokenUser", user.tokenUser);
  res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.json({ accessToken, refreshToken });
  // End Authorization
  // res.redirect("/");
};

// [POST] /refreshToken
module.exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser
  })
  
  await User.findOneAndUpdate(
    { tokenUser: req.cookies.tokenUser }, 
    { $push: { refreshTokens: refreshToken } }
  );

  if (!refreshToken) return res.sendStatus(401);
  const refreshTokens = user.refreshTokens;
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: user._id}, 
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    res.json( {accessToken} );
  })
}
