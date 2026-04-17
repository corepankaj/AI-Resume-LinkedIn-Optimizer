import Ai from "../config/ai.js";

// Resume Review
const resumeReview = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({ success: false, error: "Resume text required" });
        }

        const prompt = `
Analyze this resume and return ONLY valid JSON.

{
  "atsScore": 85,
  "summary": "short summary",
  "improvements": ["point1", "point2"],
  "keywordsMissing": ["keyword1", "keyword2"],
  "sections": {
    "skills": 80,
    "experience": 75,
    "education": 70,
    "format": 85
  },
  "improvedResume": "full improved resume text"
}

Resume:
${resumeText}
`;

        const response = await Ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        //SAFE extraction
        let text =
            response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            response?.text ||
            "";

        if (!text) {
            throw new Error("Empty response from AI");
        }

        // Clean JSON
        text = text.replace(/```json|```/g, "").trim();

        //EXTRA SAFETY (important)
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const cleanJson = text.substring(jsonStart, jsonEnd);

        let parsed;
        try {
            parsed = JSON.parse(cleanJson);
        } catch (err) {
            console.error("JSON Parse Error:", cleanJson);
            throw new Error("Invalid JSON from AI");
        }

        res.json({ success: true, data: parsed });

    } catch (error) {
        console.error("Resume Review Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


// LinkedIn Optimizer
const linkinOptimizer = async (req, res) => {
    try {
        const { profile } = req.body;

        if (!profile) {
            return res.status(400).json({ success: false, error: "Profile required" });
        }

        const prompt = `
Act as a LinkedIn expert.

Give:
- Powerful headline
- About section
- Skills
- Profile improvement tips

Profile:
${profile}
`;

        const response = await Ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        let text =
            response?.candidates?.[0]?.content?.parts?.[0]?.text ||
            response?.text ||
            "No response";

        res.json({ success: true, data: text });

    } catch (error) {
        console.error("LinkedIn Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

export { resumeReview, linkinOptimizer };