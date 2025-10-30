const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

btn.onclick = sendMessage;
input.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

async function sendMessage(){
  const text = input.value.trim();
  if (!text) return;
  chatBox.innerHTML += `<div class="message user"><b>You:</b> ${escapeHtml(text)}</div>`;
  input.value = "";

  // typing indicator
  const typing = document.createElement("div");
  typing.className = "message bot typing";
  typing.innerText = "AI is typing...";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // NOTE: This example calls a Hugging Face public model endpoint without an API key.
    // It may be rate limited, blocked by CORS, or return short replies.
    const resp = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: text })
    });
    const data = await resp.json();
    const reply = data[0]?.generated_text?.slice(text.length).trim() || "Sorry, I couldn't understand that.";
    chatBox.removeChild(typing);
    chatBox.innerHTML += `<div class="message bot"><b>AI:</b> ${escapeHtml(reply)}</div>`;
  } catch (err) {
    chatBox.removeChild(typing);
    chatBox.innerHTML += `<div class="message bot"><b>AI:</b> Error contacting AI service.</div>`;
    console.error(err);
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
}
