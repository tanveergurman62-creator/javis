const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  inputField.value = "";
  appendMessage("bot", "Thinking...");

  try {
    const response = await fetch("https://api.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️ DON'T hardcode your key here in a public repo
        // Add it via environment variable or GitHub Secret instead
        "Authorization": `Bearer ${window.OPENROUTER_KEY || "YOUR_KEY_HERE"}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content || "Sorry, no reply.";
    replaceLastBotMessage(botReply);
  } catch (err) {
    replaceLastBotMessage("Error connecting to AI service.");
    console.error(err);
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "bot-msg";
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function replaceLastBotMessage(newText) {
  const botMsgs = chatBox.getElementsByClassName("bot-msg");
  const last = botMsgs[botMsgs.length - 1];
  if (last) last.textContent = newText;
}
