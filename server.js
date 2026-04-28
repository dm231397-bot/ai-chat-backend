import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("HuggingFace AI Backend is running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  const message = req.body.message;

  if (!message) return res.status(400).json({ reply: "No message provided" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await response.json();

    // extract generated text
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "AI could not respond";

    res.json({ reply });

  } catch (err) {
    console.log("HuggingFace ERROR:", err);
    res.status(500).json({ reply: "AI error (HuggingFace failed)" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("HF AI running on port " + PORT));
