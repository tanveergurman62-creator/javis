// === Chatbot Script ===

// 🔑 Your Hugging Face API Key
const HUGGINGFACE_API_KEY = "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";

// === Get HTML elements ===
const input = document.getElementById("user-input");
const chatbox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");

// === Send message when button clicked or Enter pressed ===
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === Function to send message ===
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Show user message
  chatbox.innerHTML += `<div class="user"><b>You:</b> ${text}</div>`;
  input.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  // Typing indicator
  const typing = document.createElement("div");
  typing.className = "bot typing";
  typing.textContent = "Bot is thinking...";
  chatbox.appendChild(typing);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    // === Fetch AI response ===
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    });

    const data = await response.json();

    // === Remove typing indicator ===
    typing.remove();

    // === Get model reply ===
    let reply = "Sorry, I didn’t get that.";
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    }

    // === Display bot reply ===
    chatbox.innerHTML += `<div class="bot"><b>Bot:</b> ${reply}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

  } catch (error) {
    typing.remove();
    chatbox.innerHTML += `<div class="bot error"><b>Error:</b> ${error.message}</div>`;
  }
}
