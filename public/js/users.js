// Gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");

      const userId = button.getAttribute("btn-add-friend");

      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// Hết Gửi yêu cầu kết bạn

// Huy gui yeu cau ket ban
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userId = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// End Huy gui yeu cau ket ban

// Tu choi ket ban
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// End Tu choi ket ban

// Chap nhan ket ban
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// End Chap nhan ket ban

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(
    `[badge-users-accept="${data.userId}"]`
  );
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userIdB}"]`
  );
  if (dataUsersAccept) {
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.infoUserA._id);

    newBoxUser.innerHTML = `
    <div class="box-user">
    <div class="inner-avatar">
      <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}" />
    </div>
    <div class="inner-info">
        <div class="inner-name">
          ${data.infoUserA.fullName}
        </div>
        <div class="inner-buttons">
          <button
            class="btn btn-sm btn-primary mr-1"
            btn-accept-friend="${data.infoUserA._id}"
          >
            Accept
          </button>
          <button
            class="btn btn-sm btn-secondary mr-1"
            btn-refuse-friend="${data.infoUserA._id}"
          >
            Remove
          </button>
          <button
            class="btn btn-sm btn-secondary mr-1"
            btn-deleted-friend=""
            disabled=""
          >
            Removed
          </button>
          <button
            class="btn btn-sm btn-primary mr-1"
            btn-accepted-friend=""
            disabled=""
          >
            Accepted
          </button>
        </div>
    </div>
  </div>
    `;
    dataUsersAccept.appendChild(newBoxUser);

    // Xoa loi moi ket ban cho div moi
    const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
    buttonRefuse.addEventListener("click", () => {
      buttonRefuse.closest(".box-user").classList.add("refuse");
      const userId = buttonRefuse.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });

    // Chap nhan loi moi ket ban cho div moi
    const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      buttonAccept.closest(".box-user").classList.add("accept");
      const userId = buttonAccept.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });

    // Khi A gui ket ban cho B, danh sach nguoi dung cua B xoa di A
    const dataUsersNotFriend = document.querySelector(
      `[data-users-not-friend="${data.userIdB}"]`
    );
    if (dataUsersNotFriend) {
      const boxUserDelete = dataUsersNotFriend.querySelector(
        `[user-id="${data.infoUserA._id}"]`
      );
      dataUsersNotFriend.removeChild(boxUserDelete);
    }
  }
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userIdB}"]`
  );
  if (dataUsersAccept) {
    const boxUserA = dataUsersAccept.querySelector(
      `[user-id="${data.userIdA}"]`
    );
    if (boxUserA) {
      dataUsersAccept.removeChild(boxUserA);
    }
  }
});
// End SERVER_RETURN_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_STATUS
socket.on("SERVER_RETURN_USER_STATUS", (data) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
    if (boxUser) {
      const boxStatus = boxUser.querySelector("[status]");
      boxStatus.setAttribute("status", data.status);
    }
  }
});
// End SERVER_RETURN_USER_STATUS

// Unfriend
const listBtnUnfriend = document.querySelectorAll("[btn-unfriend]");
if (listBtnUnfriend.length > 0) {
  listBtnUnfriend.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("btn-unfriend");
      swal("Unfriend?").then((value) => {
        if (value) {
          button.closest(".box-user").classList.add("unfriended");
          socket.emit("CLIENT_UNFRIEND", userId);
        } else return;
      });
    });
  });
}
// End Unfriend

// SERVER_RETURN_UNFRIEND
socket.on("SERVER_RETURN_UNFRIEND", (data) => {
  console.log("Hello from server return");
  const dataUsersFriend = document.querySelector(
    `[data-users-friend="${data.userIdA}"]`
  );
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(
      `[user-id="${data.userIdB}"]`
    );
    if (boxUser) {
      dataUsersFriend.removeChild(boxUser);
    }
  }
});
// End SERVER_RETURN_UNFRIEND
