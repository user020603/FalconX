const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userId,
    deleted: false,
    typeRoom: "group",
  });
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "List of rooms chat",
    listRoomChat: listRoomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList;

  for (const friend of friendsList) {
    const infoUser = await User.findOne({
      _id: friend.user_id,
    }).select("fullName avatar");

    friend.infoFriend = infoUser;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Create room chat",
    friendsList: friendsList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });

  usersId.forEach((userId) => {
    dataRoom.users.push({
      user_id: userId,
      role: "user",
    });
  });

  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};
