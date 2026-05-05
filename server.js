import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// CHAT ROUTE
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilgpt2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    const text = await response.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({
        reply: "❌ HuggingFace returned HTML"
      });
    }

    if (data.error) {
      return res.json({
        reply: "⏳ Model loading... try again in 10 seconds"
      });
    }

    return res.json({
      reply: data[0]?.generated_text || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Backend error" });
  }
});

// START SERVER
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
