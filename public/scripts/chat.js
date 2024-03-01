document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();
  fetchInitialMessages();
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
    console.log(response);
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

async function fetchInitialMessages() {
  try {
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    displayMessages(messages);
    const token = localStorage.getItem("token");
    const response = await axios.get("/users/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newMessages = response.data;
    messages.push(...newMessages);
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }
    localStorage.setItem("messages", JSON.stringify(messages));
    displayMessages(messages);
  } catch (error) {
    console.error("Failed to fetch initial messages:", error);
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
    fetchNewMessages();
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

async function fetchNewMessages() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/users/messages", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    const newMessages = response.data;
    messages.push(...newMessages);
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }
    localStorage.setItem("messages", JSON.stringify(messages));
    displayMessages(messages);
  } catch (error) {
    console.error("Failed to fetch new messages:", error);
  }
}

function displayMessages(messages) {
  const messagesDiv = document.querySelector(".message-list");
  messagesDiv.innerHTML = "";
  messages.forEach((message) => {
    const messageElement = document.createElement("li");
    messageElement.textContent = `${message.username}: ${message.message}`;
    messagesDiv.appendChild(messageElement);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
