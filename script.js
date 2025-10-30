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
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("API response:", data);

    let botReply = "Sorry, I couldn’t understand that.";

    // ✅ Handle multiple response formats from Hugging Face
    if (Array.isArray(data) && data[0]?.generated_text) {
      botReply = data[0].generated_text;
    } else if (data.generated_text) {
      botReply = data.generated_text;
    } else if (data.error) {
      botReply = `Error: ${data.error}`;
    }

    // Replace "Thinking..." with the bot's actual reply
    const lastBotMsg = chatBox.querySelector(".bot-message:last-child");
    lastBotMsg.innerHTML = `<b>Bot:</b> ${botReply}`;
  } catch (error) {
    console.error("Fetch error:", error);
    const lastBotMsg = chatBox.querySelector(".bot-message:last-child");
    lastBotMsg.innerHTML =
      "<b>Bot:</b> ⚠️ Something went wrong. Please check your API key or try again later.";
  }
}
