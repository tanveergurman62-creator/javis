const API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

// ✅ Use your secret from GitHub Actions (or .env if local)
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Chat elements
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Function to add message to chat
function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = sender === "user" ? "user-message" : "bot-message";
  message.textContent = `${sender === "user" ? "You" : "Bot"}: ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message
sendBtn.addEventListener("click", async () => {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage("user", input);
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const botReply = data[0]?.generated_text || "Sorry, I couldn’t understand that.";
    addMessage("bot", botReply);

  } catch (error) {
    console.error(error);
    addMessage("bot", "⚠️ Error connecting to AI service. Check your API key or network.");
  }
});

// Default greeting
addMessage("bot", "Hello! How can I help you today?");
