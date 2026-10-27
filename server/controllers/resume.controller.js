const pdfParse = require("pdf-parse");
const Resume = require("../models/resume.model");
const { analyzeResume } = require("../services/llm.service");

const extractPdfText = async (buffer) => {
  // pdf-parse v1
  if (typeof pdfParse === "function") {
    const result = await pdfParse(buffer);
    return result.text;
  }

  // pdf-parse v2
  if (pdfParse.PDFParse) {
    const parser = new pdfParse.PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported pdf-parse API version");
};

const analyzeResumeController = async (req, res) => {
  let resume;

  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    // Extract text from uploaded PDF
    const resumeText = await extractPdfText(req.file.buffer);

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No readable text found in PDF",
      });
    }

    // Save initial record
    resume = await Resume.create({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim(),
      status: "pending",
    });

    // Generate AI analysis
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Save analysis
    resume.analysis = analysis;
    resume.status = "completed";

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Resume analysis error:", error.message);

    if (resume) {
      try {
        resume.status = "failed";
        await resume.save();
      } catch (dbError) {
        console.error("Database update failed:", dbError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
    });
  }
};

module.exports = { analyzeResumeController };
