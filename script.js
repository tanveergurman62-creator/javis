// ====== My Personal AI ======
// Make sure you replace YOUR_API_KEY below with your real OpenRouter key

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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"; // <-- Replace this if needed

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// When the user clicks Send
sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  // Display user's message
  addMessage("You", message);
  userInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error("API connection failed");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t understand that.";
    addMessage("AI", reply);
  } catch (error) {
    console.error(error);
    addMessage("AI", "⚠️ Error connecting to AI service.");
  }
});

// Function to display messages
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
