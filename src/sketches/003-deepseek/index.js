async function sendPrompt(prompt) {
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model: 'deepseek-r1:8b'
      })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    console.log(data.reply);

    return data.reply;
  } catch (error) {
    console.error('Error:', error);
  }
}

const PROMPT = `Create a bold statement about the future of technology.`;

function render(node) {
  console.log('sending prompt...');

  const start = Date.now();

  sendPrompt(PROMPT).then(reply => {
    const end = Date.now();

    console.log(`response time in seconds: ${(end - start) / 1000}`);

    console.log('reply:', reply);

    // remove everything between <think> tags (including the tags and multiline content)
    const replyWithoutThink = reply.replace(/<think>[\s\S]*?<\/think>/g, '');

    const replyWithoutQuotes = replyWithoutThink.replace(/"/g, '');

    node.innerHTML = '';

    node.style.overflow = 'auto';

    const paragraph = document.createElement('p');

    paragraph.style.margin = '10px';
    paragraph.style.fontStyle = 'italic';
    paragraph.style.fontWeight = 'bold';

    paragraph.textContent = replyWithoutQuotes;

    node.appendChild(paragraph);
  });

  return () => {};
}

export default render;