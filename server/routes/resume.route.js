
const express = require("express");
const upload = require("../middleware/upload.middleware");

const {
  analyzeResumeController,
} = require("../controllers/resume.controller");

const router = express.Router();

router.post(
  "/analyze",
  upload.single("resume"),
  analyzeResumeController
);

module.exports = router;
