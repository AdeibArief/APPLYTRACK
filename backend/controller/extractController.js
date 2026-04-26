import Groq from "groq-sdk";

export const extractJobInfo = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const { pageText, url } = req.body;

    if (!pageText) {
      return res
        .status(400)
        .json({ success: false, message: "No page text provided" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a job listing parser. Extract information from job listing text and return ONLY a JSON object with no extra text or markdown. Return exactly this format: {"company": "company name", "role": "job title", "source": "website name"}. If you cannot find a value, use an empty string.`,
        },
        {
          role: "user",
          content: `URL: ${url}\n\n${pageText.slice(0, 5000)}`,
        },
      ],
    });

    const raw = response.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const extracted = JSON.parse(cleaned);

    res.status(200).json({ success: true, data: extracted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
