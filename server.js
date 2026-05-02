app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: "Answer this: " + userMessage
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

    // If model still loading
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
