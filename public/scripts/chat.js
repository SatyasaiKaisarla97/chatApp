document.addEventListener("DOMContentLoaded", function () {
  setInterval(() => {
    fetchUsers();
    fetchMessages();
  }, 1000);
  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", sendMessage);
});

async function fetchUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userList = document.querySelector(".user-list");
    userList.innerHTML = "";
    response.data.forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.username} has joined`;
      userList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

async function fetchMessages() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/users/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messagesList = response.data;
    const messagesDiv = document.querySelector(".message-list");
    messagesDiv.innerHTML = "";
    messagesList.forEach((message) => {
      const messageElement = document.createElement("li");
      messageElement.textContent = `${message.username}: ${message.message}`;
      messagesDiv.appendChild(messageElement);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }
}

async function sendMessage() {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const token = localStorage.getItem("token");
    await axios.post(
      "/users/chat",
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    messageInput.value = "";
    fetchMessages();
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}
