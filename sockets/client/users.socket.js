const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;
      // Them id cua A vao accept friend cua B
      const existUserAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA,
      });

      if (!existUserAInB) {
        await User.updateOne(
          {
            _id: userIdB,
          },
          {
            $push: { acceptFriends: userIdA },
          }
        );
      }

      // Them id cua B vao requestFriends cua A
      const existUserBinA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB,
      });

      if (!existUserBinA) {
        await User.updateOne(
          {
            _id: userIdA,
          },
          {
            $push: { requestFriends: userIdB },
          }
        );
      }

      // Lấy độ dài acceptFriends của B để trả về cho B
      const infoUserB = await User.findOne({
        _id: userIdB,
      }).select("acceptFriends");

      const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriendsB,
      });

      // Lay thong tin cua A de tra ve cho B
      const infoUserA = await User.findOne({
        _id: userIdA,
      }).select("id fullName avatar");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userIdB: userIdB,
        infoUserA: infoUserA,
      });
    });

    // Khi A huy gui yeu cau cho B
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      // Xoa id cua A trong acceptFriends cua B
      await User.updateOne(
        {
          _id: userIdB,
        },
        {
          $pull: { acceptFriends: userIdA },
        }
      );

      // Xoa id cua B trong requestFriend cua A
      await User.updateOne(
        {
          _id: userIdA,
        },
        {
          $pull: { requestFriends: userIdB },
        }
      );

      // Lay do dai acceptFriend cua B de tra ve cho B
      const infoUserB = await User.findOne({
        _id: userIdB,
      }).select("acceptFriends");

      const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriendsB,
      });

      socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
        userIdB: userIdB,
        userIdA: userIdA,
      });
    });

    // Unfriend
    socket.on("CLIENT_UNFRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      const infoUserB = await User.findOne({
        _id: userIdB,
      }).select("friendsList");

      const infoUserA = res.locals.user;

      const friendA = infoUserA.friendsList.find(
        (friend) => friend.user_id.toString() === userIdB
      );
      const friendB = infoUserB.friendsList.find(
        (friend) => friend.user_id.toString() === userIdA
      );

      if (friendA && friendB && friendA.room_chat_id === friendB.room_chat_id) {
        await User.updateOne(
          {
            _id: userIdA,
          },
          {
            $pull: {
              friendsList: {
                user_id: userIdB,
                room_chat_id: friendA.room_chat_id,
              },
            },
          }
        );

        await User.updateOne(
          {
            _id: userIdB,
          },
          {
            $pull: {
              friendsList: {
                user_id: userIdA,
                room_chat_id: friendB.room_chat_id,
              },
            },
          }
        );
      }
      // End Unfriend

      socket.broadcast.emit("SERVER_RETURN_UNFRIEND", {
        userIdA: userIdA,
        userIdB: userIdB,
      });
    });

    // Khi B chấp nhận kết bạn của A
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdA) => {
      const userIdB = res.locals.user.id;

      // Tao phong chat moi
      const roomChat = new RoomChat({
        typeRoom: "friend",
        users: [
          {
            user_id: userIdA,
            role: "superAdmin",
          },
          {
            user_id: userIdB,
            role: "superAdmin",
          },
        ],
      });

      await roomChat.save();

      // Thêm {user_id, room_chat_id} của A vào friendsList của B
      // Xóa id của A trong acceptFriends của B
      await User.updateOne(
        {
          _id: userIdB,
        },
        {
          $push: {
            friendsList: {
              user_id: userIdA,
              room_chat_id: roomChat.id,
            },
          },

          $pull: { acceptFriends: userIdA },
        }
      );

      // Thêm {user_id, room_chat_id} của B vào friendsList của A
      // Xóa id của B trong requestFriends của A

      await User.updateOne(
        {
          _id: userIdA,
        },
        {
          $push: {
            friendsList: {
              user_id: userIdB,
              room_chat_id: roomChat.id,
            },
          },

          $pull: { requestFriends: userIdB },
        }
      );
    });
  });
};
