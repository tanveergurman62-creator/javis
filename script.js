const sendButton = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(sender, text, className) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add(className);
  msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("You", text, "user-message");
  userInput.value = "";
  appendMessage("Bot", "Thinking...", "bot-message");

  try {
    // Call Hugging Face model (open-access)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
        }),
      }
    );

    const data = await response.json();
    const botMsg = data[0]?.generated_text
      ? data[0].generated_text
      : "Sorry, I couldn't understand that.";

    document.querySelector(".bot-message:last-child").innerHTML =
      `<b>Bot:</b> ${botMsg}`;
  } catch (error) {
    document.querySelector(".bot-message:last-child").innerHTML =
      `<b>Bot:</b> Oops! Something went wrong.`;
    console.error(error);
  }
}
