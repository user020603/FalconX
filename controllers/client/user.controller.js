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
