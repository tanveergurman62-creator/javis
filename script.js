const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const userText = userInput.value.trim();
  if (userText === "") return;

  appendMessage("You", userText, "user");
  userInput.value = "";

  setTimeout(() => {
    const botReply = getBotResponse(userText.toLowerCase());
    appendMessage("Bot", botReply, "bot");
  }, 500);
}

function appendMessage(sender, message, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", className);
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(input) {
  if (input.includes("hello") || input.includes("hi")) {
    return "Hello! How can I help you today?";
  } else if (input.includes("joke")) {
    return "Why did the computer show up at work late? It had a hard drive! 😄";
  } else if (input.includes("poem")) {
    return "Roses are red, violets are blue, I'm a chatbot, and I like talking to you! 🤖";
  } else if (input.includes("your name")) {
    return "I'm Tanveer's AI Chatbot!";
  } else if (input.includes("how are you")) {
    return "I'm just code, but I'm feeling great! How about you?";
  } else if (input.includes("bye")) {
    return "Goodbye! Have a great day! 👋";
  } else {
    return "Sorry, I didn’t get that.";
  }
}
