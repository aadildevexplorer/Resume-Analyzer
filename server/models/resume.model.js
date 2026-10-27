const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

   analysis: {
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },

  summary: {
    type: String,
    default: "",
  },

  skills: {
    type: [String],
    default: [],
  },

  missingSkills: {
    type: [String],
    default: [],
  },

  strengths: {
    type: [String],
    default: [],
  },

  suggestions: {
    type: [String],
    default: [],
  },
},

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", resumeSchema);
