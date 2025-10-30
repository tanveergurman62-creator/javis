const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Show user message
  chatBox.innerHTML += `<div class="user-message"><b>You:</b> ${userMessage}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Typing indicator
  chatBox.innerHTML += `<div class="bot-message typing">Bot is thinking...</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // your Hugging Face token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: userMessage }),
      }
    );

    const data = await response.json();
    console.log(data); // For debugging

    let botReply = "Sorry, I didn’t get that.";

    // Extract generated text
    if (Array.isArray(data) && data[0]?.generated_text) {
      botReply = data[0].generated_text;
    } else if (data.generated_text) {
      botReply = data.generated_text;
    }

    // Remove typing indicator and show response
    const typingDiv = document.querySelector(".typing");
    if (typingDiv) typingDiv.remove();

    chatBox.innerHTML += `<div class="bot-message"><b>Bot:</b> ${botReply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error(error);
    chatBox.innerHTML += `<div class="bot-message error"><b>Bot:</b> Error connecting to AI.</div>`;
  }
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
