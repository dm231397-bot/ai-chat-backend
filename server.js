app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer YOUR_HF_KEY`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    const data = await response.json();

    console.log(data); // 👈 VERY IMPORTANT (to see error in logs)

    if (data.error) {
      return res.json({
        reply: "⏳ Model is loading... try again in 10 seconds"
      });
    }

    res.json({
      reply: data[0]?.generated_text || "No response"
    });

  } catch (err) {
    console.error(err);
    res.json({ reply: "❌ Backend error" });
  }
});
