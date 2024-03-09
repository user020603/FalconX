const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;
      //   console.log("userIdA", userIdA);
      //   console.log("userIdB", userIdB);

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
        _id: userIdB
      }).select("acceptFriends");

      const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriendsB
      });
    });

    // Khi A huy gui yeu cau cho B
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      //   console.log(userIdA);
      //   console.log(userIdB);

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
    });

    // Khi B tu choi ket ban cua A
    socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      // Xoa id cua B trong acceptFriends cua A
      await User.updateOne(
        {
          _id: userIdA,
        },
        {
          $pull: { acceptFriends: userIdB },
        }
      );

      // Xoa id cua A trong requestFriends cua B
      await User.updateOne(
        {
          _id: userIdB,
        },
        {
          $pull: { requestFriends: userIdA },
        }
      );
    });

    // Khi B chấp nhận kết bạn của A
    socket.on("CLIENT_ACCEPT_FRIEND", async (userIdA) => {
      const userIdB = res.locals.user.id;
      // console.log("userIdA", userIdA);
      // console.log("userIdB", userIdB);

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

              room_chat_id: "",
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

              room_chat_id: "",
            },
          },

          $pull: { requestFriends: userIdB },
        }
      );
    });
  });
};
