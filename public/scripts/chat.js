document.addEventListener("DOMContentLoaded", function () {
  fetchGroups();
  const sendButton = document.getElementById("sendButton");
  const createGroupButton = document.getElementById("createGroupButton");
  sendButton.addEventListener("click", sendMessage);
  createGroupButton.addEventListener("click", createGroup);
});

let currentGroupId = null;

async function fetchGroups() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    const groupList = document.querySelector(".group-list");
    groupList.innerHTML = "";
    response.data.forEach((group) => {
      const groupItem = document.createElement("li");
      groupItem.textContent = group.name;
      groupItem.addEventListener("click", () => setCurrentGroupId(group.id));
      groupList.appendChild(groupItem);
    });
  } catch (error) {
    console.error("Failed to fetch groups:", error);
  }
}

function setCurrentGroupId(groupId) {
  currentGroupId = groupId;
  fetchNewMessages();
}

async function createGroup() {
  try {
    const groupNameInput = document.getElementById("groupNameInput");
    const groupName = groupNameInput.value;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "/groups/create",
      { name: groupName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    fetchGroups();
  } catch (error) {
    console.error("Failed to create group:", error);
  }
}

async function sendMessage() {
  try {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const token = localStorage.getItem("token");
    if (!currentGroupId) {
      console.error("No group selected.");
      return;
    }
    await axios.post(
      `/users/groups/${currentGroupId}/chat`,
      { message, groupId: currentGroupId },
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
    const response = await axios.get(
      `/users/groups/${currentGroupId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    displayMessages(response.data);
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
}
