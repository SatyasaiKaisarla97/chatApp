document.addEventListener("DOMContentLoaded", function () {
  fetchGroups();
  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", sendMessage);
});

async function fetchGroups() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const groupList = document.querySelector(".group-list");
    groupList.innerHTML = "";
    response.data.forEach((group) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${group.name}`;
      listItem.dataset.groupId = group.id; // Store group ID as a dataset attribute
      listItem.addEventListener("click", () => fetchGroupMessages(group.id));
      groupList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Failed to fetch groups:", error);
  }
}

async function fetchInitialMessages(groupId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/users/groups/${groupId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = response.data;
    displayMessages(messages);
  } catch (error) {
    console.error("Failed to fetch initial messages:", error);
  }
}

async function sendMessage(groupId) {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const token = localStorage.getItem("token");
    await axios.post(
      `/users/groups/${groupId}/messages`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    messageInput.value = "";
    fetchGroupMessages(groupId);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

async function fetchGroupMessages(groupId) {
  try {
    await fetchInitialMessages(groupId);
  } catch (error) {
    console.error("Failed to fetch group messages:", error);
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
