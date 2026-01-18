import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const aiResponse = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Enhance the professional summary in 1–2 ATS-friendly sentences. Return ONLY text.",
        },
        { role: "user", content: userContent },
      ],
    });

    res.json({ enhancedContent: aiResponse.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const aiResponse = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Enhance job description in 1–2 ATS-friendly sentences. Return ONLY text.",
        },
        { role: "user", content: userContent },
      ],
    });

    res.json({ enhancedContent: aiResponse.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const aiResponse = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Extract resume data and return ONLY valid JSON. No markdown. No explanations.",
        },
        { role: "user", content: resumeText },
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(aiResponse.choices[0].message.content);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    res.status(201).json({ resume: newResume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
