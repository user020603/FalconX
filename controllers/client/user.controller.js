const md5 = require("md5");
const User = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");

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
    req.flash("error", "Email existed!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  // res.cookie("tokenUser", user.tokenUser);
  req.flash("success", "Regist Success!");
  res.redirect("/user/login");
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
    req.flash("error", "Email is not exist!");
    res.redirect("back");
    return;
  }
  if (md5(password) !== user.password) {
    req.flash("error", "Wrong password!");
    res.redirect("back");
    return;
  }

  if (user.status !== "active") {
    req.flash("error", "Your account is locked!");
    res.redirect("back");
    return;
  }
  // End Authentication

  // Authorization
  const data = user._id;
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET);
  await User.findOneAndUpdate(
    { email: req.body.email },
    { $push: { refreshTokens: refreshToken } }
  );
  res.cookie("tokenUser", user.tokenUser);
  res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
  // res.json({ accessToken, refreshToken });
  req.flash("success", "Login Success!");

  await User.updateOne(
    {
      _id: user.id,
    },
    {
      statusOnline: "online",
    }
  );

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS", {
      userId: user.id,
      status: "online",
    });
  });

  res.redirect("/");
  // End Authorization
};

// [GET] /refreshToken
module.exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  });

  await User.findOneAndUpdate(
    { tokenUser: req.cookies.tokenUser },
    { $push: { refreshTokens: refreshToken } }
  );

  if (!refreshToken) return res.sendStatus(401);
  const refreshTokens = user.refreshTokens;
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  else console.log("Available in list");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) return res.sendStatus(403);
    const dataNew = user._id;
    const accessToken = jwt.sign({ dataNew }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.json({ accessToken });
  });
};

// Forgot Password
// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Take back password",
  });
};

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email is not exist!");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);
  // Task 1: Save info into database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const record = new ForgotPassword(objectForgotPassword);
  await record.save();

  // Task 2
  const subject = `OTP take back your password`;
  const gifUrl = `https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3o3YTkxNDN2azB0aWcxM3lqYnEydDhmMDVma3cwanNiMGczZWJxaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IgLIVXrBcID9cExa6r/giphy.gif`;
  const content = `Your OTP is <b>${otp}</b>. Please don't share for anybody :)<br><br><img src="${gifUrl}" alt="Your GIF">`;
  sendMailHelper.sendMail(email, subject, content);
  res.redirect(`/user/password/otp?email=${email}`);
};
// End Forgot Password

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Type OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const find = {
    email: email,
    otp: otp,
  };

  const result = await ForgotPassword.findOne(find);

  if (!result) {
    req.flash("error", "OTP is invalid!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Change Password",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  try {
    await User.updateOne(
      {
        tokenUser: tokenUser,
      },
      {
        password: md5(password),
      }
    );
    res.redirect("/user/login");
  } catch (e) {
    res.redirect("/user/login");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  const userId = res.locals.user.id;
  await User.updateOne(
    {
      _id: userId,
    },
    {
      statusOnline: "offline",
    }
  );

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS", {
      userId: userId,
      status: "offline",
    });
  });
  res.clearCookie("tokenUser");
  res.clearCookie("accessToken");
  res.redirect("/user/login");
};

// [GET] /detail/:id
module.exports.detail = async (req, res) => {
  try {
    const userId = req.params.id;
    const infoUser = await User.findOne({
      _id: userId,
    });

    // console.log(infoUser);

    const friendsList = infoUser.friendsList;
    const numberOfFriends = friendsList.length;
    for (const friend of friendsList) {
      const infoUser = await User.findOne({
        _id: friend.user_id,
      }).select("fullName");

      friend.fullName = infoUser.fullName;
      friend.user_id = infoUser.id;
    }

    res.render("client/pages/user/detail", {
      pageTitle: "Detail",
      infoFriend: infoUser,
      friendsList: friendsList,
      numberOfFriends: numberOfFriends
    });
  } catch (e) {
    res.redirect("/");
  }
};
