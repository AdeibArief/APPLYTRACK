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


export const bulkExtractJobs = async (req, res) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_BULK });
  try {
    const { pageText } = req.body;

    if (!pageText) {
      return res
        .status(404)
        .json({ success: false, message: "No page text provided" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a job application history parser. Extract all job applications from the given page text and return ONLY a JSON array with no extra text or markdown. Each item must follow this exact format: {"company": "company name", "role": "job title", "appliedAt": "exact date or relative time exactly as shown on the page e.g. '3 Oct 24', '2w ago', '11mo ago'}. Only include jobs that are clearly visible. If no jobs are found, return an empty array [].`
        },
        {
          role: "user",
          content: pageText.slice(0, 5000),
        },
      ],
    });

    const raw = response.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const jobs = JSON.parse(cleaned);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
