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
  const badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
  if (dataUsersAccept) {
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");

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
            Chấp nhận
          </button>
          <button
            class="btn btn-sm btn-secondary mr-1"
            btn-refuse-friend="${data.infoUserA._id}"
          >
            Xóa
          </button>
          <button
            class="btn btn-sm btn-secondary mr-1"
            btn-deleted-friend=""
            disabled=""
          >
            Đã xóa
          </button>
          <button
            class="btn btn-sm btn-primary mr-1"
            btn-accepted-friend=""
            disabled=""
          >
            Đã chấp nhận
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
    })
  }
})
// End SERVER_RETURN_INFO_ACCEPT_FRIEND