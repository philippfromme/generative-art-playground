import ollama from "ollama";

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const {
    prompt,
    model = "deepseek-r1:1.5b"
  } = req.body;

  try {
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    console.log(response.message.content);

    res.json({ reply: response.message.content });
  } catch (error) {
    res.status(500).json({ error: 'Error interacting with Ollama' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});