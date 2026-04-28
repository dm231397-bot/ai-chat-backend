app.post("/chat", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices?.[0]?.message?.content;

    res.json({ reply });

  } catch (err) {
    console.log("AI ERROR:", err);

    res.status(500).json({
      reply: "AI error: check backend logs"
    });
  }
});
