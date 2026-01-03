const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Send message on button click or Enter key
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  appendMessage(message, 'You 😎', 'user');
  input.value = '';

  // Show typing indicator
  showTypingIndicator();

  try {
    const res = await fetch('https://tez-backend-zxzm.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // Remove typing indicator
    removeTypingIndicator();

    // Show Tez reply
    appendMessage('Tez 🗿', data.reply, 'ai');

  } catch (err) {
    removeTypingIndicator();
    appendMessage('Tez 🗿', 'Oops! Something went wrong.', 'ai');
    console.error(err);
  }
}

function appendMessage(sender, text, cls) {
  const msg = document.createElement('div');
  msg.classList.add('message', cls);
  msg.textContent = `${sender}: ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show typing indicator helpers
function showTypingIndicator() {
  removeTypingIndicator(); // avoid duplicates
  const typing = document.createElement('div');
  typing.id = 'typing-indicator';
  typing.classList.add('message', 'ai');
  typing.textContent = 'Tez 🗿: Typing...';
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

//  Auto-focus input when offcanvas opens
const offcanvasEl = document.getElementById('offcanvasWithBothOptions');

offcanvasEl.addEventListener('shown.bs.offcanvas', () => {
  input.focus();
});

const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', () => {
  chatBox.innerHTML = '';
  input.focus();
});


// Navigation Indicator Code
const indicator = document.querySelector('.nav-indicator');
const items = document.querySelectorAll('.nav-item');

function handleIndicator(el) {
    items.forEach(item => {
        item.classList.remove('is-active');
        item.removeAttribute('style');
    });

    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;
    indicator.style.backgroundColor = el.getAttribute('active-color');

    el.classList.add('is-active');
    el.style.color = el.getAttribute('active-color');
}


items.forEach((item, index) => {
    item.addEventListener('click', e => { handleIndicator(e.target); });
    item.classList.contains('is-active') && handleIndicator(item);
});

// Typed.js Initialization
var typed = new Typed('#element', {
    strings: ['FULL STACK DEVELOPER.', 'WEB DEVELOPER.', 'AI ENTHUSIAST.', 'TECH LOVER.'],
    loop: true,
    typeSpeed: 100,

  });
