document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("sendButton");

  sendButton.addEventListener("click", function () {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    sendMessage(message);
  });
});

async function sendMessage(message) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. User is not authenticated.");
      return;
    }
    const response = await axios.post(
      "user/chat",
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Message sent successfully:", response.data);
    document.getElementById("messageInput").value = "";
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}
