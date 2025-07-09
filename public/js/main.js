const socket = io();

// Send message to server
function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (message !== "") {
    // Display user message immediately
    addMessage(message, "user");

    // Send message to backend
    socket.emit("message", message);
    input.value = "";
  }
}

// Function to append a message
function addMessage(text, type) {
  const messagesDiv = document.getElementById("messages");
  const messageElement = document.createElement("div");
  messageElement.className = type === "user" ? "message user" : "message bot";
  messageElement.textContent = text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Listen for bot message from server
socket.on("message", (data) => {
  addMessage(data, "bot");
});
