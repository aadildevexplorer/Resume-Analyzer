const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const analyzeResume = async (resumeText, jobDescription) => {
  const models = [
    "gemini-3.5-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
  ];

  const prompt = `
Analyze the resume against the provided job description.

Return ONLY valid JSON with these fields:
{
  "atsScore": 0,
  "summary": "string",
  "skills": ["string"],
  "missingSkills": ["string"],
  "strengths": ["string"],
  "suggestions": ["string"]
}

ATS SCORE RULES:
- Return an integer between 0 and 100.
- Evaluate how well the resume matches this job description.
- Required skills match: 40%.
- Relevant experience and projects: 25%.
- Relevant keywords: 15%.
- Education and eligibility: 10%.
- Resume clarity and structure: 10%.
- Do not invent skills, experience, or qualifications.
- This is an estimated resume-to-job-description match score,
  not an official score from an ATS platform.

FIELD RULES:
- summary: Summarize the candidate's suitability for the role.
- skills: List relevant skills found in the resume.
- missingSkills: List relevant job requirements not clearly
  demonstrated in the resume.
- strengths: List the candidate's relevant strengths.
- suggestions: Give actionable resume improvement suggestions.
- Return valid JSON only, without Markdown fences or extra text.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        const result = JSON.parse(response.text);

        // Validate ATS score.
        const score = Number(result.atsScore);

        if (Number.isFinite(score) && score >= 0 && score <= 100) {
          result.atsScore = Math.round(score);
        } else {
          throw new Error("Invalid ATS score returned by Gemini");
        }

        // Validate the expected response fields.
        const arrayFields = [
          "skills",
          "missingSkills",
          "strengths",
          "suggestions",
        ];

        for (const field of arrayFields) {
          if (!Array.isArray(result[field])) {
            throw new Error(
              `Invalid analysis response: ${field} must be an array`,
            );
          }
        }

        if (typeof result.summary !== "string") {
          throw new Error(
            "Invalid analysis response: summary must be a string",
          );
        }

        console.log(`Resume analysis successful: ${model}`);

        return result;
      } catch (error) {
        lastError = error;

        const status = error.status ?? error.code;
        const message = error.message ?? "";

        const isTemporaryError =
          status === 503 ||
          status === 429 ||
          status === 500 ||
          status === 504 ||
          message.includes("UNAVAILABLE") ||
          message.includes("high demand");

        console.error(
          `Model ${model}, attempt ${attempt + 1} failed:`,
          message,
        );

        // Retry only temporary errors.
        if (!isTemporaryError) {
          throw error;
        }

        if (attempt === 0) {
          await sleep(1500);
        }
      }
    }
  }

  throw lastError;
};

module.exports = { analyzeResume };
