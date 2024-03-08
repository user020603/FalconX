const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;
      console.log("userIdA", userIdA);
      console.log("userIdB", userIdB);

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
    });

    // Khi A huy gui yeu cau cho B
    socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
      const userIdA = res.locals.user.id;

      console.log(userIdA);
      console.log(userIdB);

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
  });
};
