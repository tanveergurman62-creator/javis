// === Tanveer's AI Chatbot Script ===

// Get HTML elements
const form = document.querySelector("form");
const input = document.querySelector("input");
const chatBox = document.querySelector("#chat-box");

// Chatbot title greeting
addMessage("Bot", "Hello! How can I help you today?");

// Add message bubbles to the chat
function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender.toLowerCase());
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userInput = input.value.trim();
  if (!userInput) return;

  addMessage("You", userInput);
  input.value = "";

  try {
    // === Make API call to Hugging Face ===
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // API key comes from GitHub Secret (set securely)
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: userInput,
          parameters: { max_new_tokens: 150 },
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch response");

    const data = await response.json();
    const botReply = data[0]?.generated_text || "Sorry, I couldn’t understand that.";
    addMessage("Bot", botReply);

  } catch (error) {
    console.error(error);
    addMessage("Bot", "Error: Unable to connect to AI service.");
  }
});
