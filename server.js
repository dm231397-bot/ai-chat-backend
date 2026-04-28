import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI setup (SAFE: uses Render env variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check route
app.get("/", (req, res) => {
  res.send("AI Backend is running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant like ChatGPT."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices?.[0]?.message?.content;

    res.json({ reply });

  } catch (err) {
    console.log("OPENAI ERROR:", err);

    res.status(500).json({
      reply: "AI error: check API key or server logs"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
