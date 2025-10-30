const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const imageBtn = document.getElementById('image-btn');

const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerText = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

function addMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerText = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send chat message to backend
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage('user', `🧑‍💻 ${text}`);
  userInput.value = '';

  const res = await fetch('http://localhost:8080/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  addMessage('bot', `🤖 ${data.reply}`);
}

// Generate AI image
async function generateImage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage('user', `🧑‍💻 Generate image: ${text}`);
  userInput.value = '';

  const res = await fetch('http://localhost:8080/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: text })
  });

  const data = await res.json();
  const img = document.createElement('img');
  img.src = data.url;
  img.alt = "Generated Image";
  img.style.width = '100%';
  img.style.borderRadius = '10px';
  chatWindow.appendChild(img);
}

sendBtn.addEventListener('click', sendMessage);
imageBtn.addEventListener('click', generateImage);
