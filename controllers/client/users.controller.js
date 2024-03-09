const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO
  const userId = res.locals.user.id;

  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  const friendsListId = res.locals.user.friendsList.map(item => item.user_id);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendsListId } },
    ],
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/not-friend", {
    pageTitle: "List of users",
    users: users,
  });
};

// [GET] /user/request
module.exports.request = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const requestFriend = res.locals.user.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriend },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/request", {
    pageTitle: "Sent request",
    users: users,
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  // SocketIO
  usersSocket(res);
  // End SocketIO

  const acceptFriends = res.locals.user.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/accept", {
    pageTitle: "All request",
    users: users,
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendsListId = res.locals.user.friendsList.map(item => item.user_id);
  
  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id fullName avatar statusOnline");

  // console.log(users);

  res.render("client/pages/users/friends", {
    pageTitle: "List friends",
    users: users
  });
};
