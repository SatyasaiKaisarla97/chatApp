document.addEventListener("DOMContentLoaded", function () {
  fetchGroups();
  const sendButton = document.getElementById("sendButton");
  const showCreateGroupButton = document.getElementById(
    "showCreateGroupButton"
  );
  const createGroupSection = document.getElementById("createGroupSection");
  const createGroupButton = document.getElementById("createGroupButton");
  const searchUsersSection = document.getElementById("searchUsersSection");
  const inviteUserButton = document.getElementById("inviteUserButton");

  sendButton.addEventListener("click", sendMessage);
  createGroupButton.addEventListener("click", createGroup);

  showCreateGroupButton.addEventListener("click", function () {
    createGroupSection.style.display = "block";
    searchUsersSection.style.display = "none"; // Hide search bar for inviting users
  });

  // Function to show search bar when a group is clicked
  function showSearchBar() {
    searchUsersSection.style.display = "block";
    createGroupSection.style.display = "none"; // Hide create group section
  }

  // Event delegation to handle click on group items
  document
    .querySelector(".group-list")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "LI") {
        const groupId = event.target.dataset.groupId;
        setCurrentGroupId(groupId);
        showSearchBar(); // Show search bar for inviting users
        fetchGroupUsers(groupId); // Fetch and display users for the selected group
      }
    });

  // Event listener for inviting users
  inviteUserButton.addEventListener("click", inviteUser);
});

let currentGroupId = null;

// Function to fetch groups
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
      groupItem.dataset.groupId = group.id; // Set data attribute for group ID
      groupList.appendChild(groupItem);
    });
  } catch (error) {
    console.error("Failed to fetch groups:", error);
  }
}

// Function to set the current group ID
function setCurrentGroupId(groupId) {
  currentGroupId = groupId;
  fetchNewMessages();
}

// Function to create a new group
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
    // Hide the create group section after creating the group
    const createGroupSection = document.getElementById("createGroupSection");
    createGroupSection.style.display = "none";
    groupNameInput.value = ""; // Clear the input field
  } catch (error) {
    console.error("Failed to create group:", error);
  }
}

// Function to invite users
async function inviteUser() {
  try {
    const inviteUserInput = document.getElementById("searchUserInput");
    const username = inviteUserInput.value;
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `/users/groups/${currentGroupId}/invite`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    inviteUserInput.value = ""; // Clear the input field after inviting
  } catch (error) {
    console.error("Failed to invite user:", error);
  }
}

// Function to fetch and display users for a group
async function fetchGroupUsers(groupId) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/users/groups/${groupId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userList = document.querySelector(".user-list");
    userList.innerHTML = "";
    response.data.forEach((user) => {
      const userElement = document.createElement("li");
      userElement.textContent = `${user.username} ${
        user.isAdmin ? "(Admin)" : ""
      }`;
      userList.appendChild(userElement);
    });
  } catch (error) {
    console.error("Failed to fetch group users:", error);
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
