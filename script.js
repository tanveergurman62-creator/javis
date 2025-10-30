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
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
      }),
    });

    const data = await response.json();
    console.log(data);

    let botReply = "Sorry, I couldn’t understand that.";
    if (Array.isArray(data) && data[0]?.generated_text) {
      botReply = data[0].generated_text;
    } else if (data.generated_text) {
      botReply = data.generated_text;
    }

    const lastBotMsg = chatBox.querySelector(".bot-message:last-child");
    lastBotMsg.innerHTML = `<b>Bot:</b> ${botReply}`;
  } catch (error) {
    console.error(error);
    const lastBotMsg = chatBox.querySelector(".bot-message:last-child");
    lastBotMsg.innerHTML = `<b>Bot:</b> Oops! Something went wrong.`;
  }
}
