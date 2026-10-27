import jsPDF from "jspdf";

export default function DownloadAnalysisPdf(
  analysis,
  jobTitle = "Target Position",
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const W = 210;
  const H = 297;
  const M = 7;
  const HEADER = 22;
  const BODY_TOP = 28;
  const FOOTER = 6;
  const BODY_BOTTOM = H - FOOTER - 3;

  const C = {
    ink: [40, 46, 51],
    muted: [105, 113, 119],
    border: [225, 229, 232],
    white: [255, 255, 255],
    canvas: [248, 249, 249],
    green: [43, 166, 105],
    greenBg: [235, 248, 240],
    gold: [190, 151, 61],
    goldBg: [255, 249, 230],
    red: [190, 91, 85],
    redBg: [255, 241, 239],
    blue: [66, 130, 166],
    blueBg: [237, 246, 252],
  };

  // Validate ATS score.
  const scoreValue = Number(analysis.atsScore);

  const score =
    analysis.atsScore !== null &&
    analysis.atsScore !== undefined &&
    analysis.atsScore !== "" &&
    Number.isFinite(scoreValue) &&
    scoreValue >= 0 &&
    scoreValue <= 100
      ? Math.round(scoreValue)
      : null;

  const scoreColor =
    score === null
      ? C.muted
      : score >= 80
        ? C.green
        : score >= 60
          ? C.gold
          : C.red;

  const skills = Array.isArray(analysis.skills) ? analysis.skills : [];

  const missing = Array.isArray(analysis.missingSkills)
    ? analysis.missingSkills
    : [];

  const strengths = Array.isArray(analysis.strengths) ? analysis.strengths : [];

  const suggestions = Array.isArray(analysis.suggestions)
    ? analysis.suggestions
    : [];

  const summary =
    typeof analysis.summary === "string" && analysis.summary.trim()
      ? analysis.summary.trim()
      : "No executive summary available.";

  // Layout.
  const leftX = M;
  const leftW = 51;
  const gap = 4;
  const rightX = leftX + leftW + gap;
  const rightW = W - M - rightX;

  // Background.
  doc.setFillColor(...C.canvas);
  doc.rect(0, 0, W, H, "F");

  // Header.
  doc.setFillColor(...C.white);
  doc.rect(0, 0, W, HEADER, "F");

  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.25);
  doc.line(M, HEADER, W - M, HEADER);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.ink);
  doc.text("Analysis Report", M, 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text(`Job-Specific Analysis: ${jobTitle}`, M, 14);
  doc.setFillColor(...C.greenBg);
  doc.roundedRect(M + 30, 11, 21, 5, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(...C.green);
  doc.text("AI ANALYSIS", M + 40.5, 14.3, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...C.muted);

  doc.text(new Date().toLocaleDateString("en-GB"), W - M, 8, {
    align: "right",
  });

  let leftY = BODY_TOP;
  let rightY = BODY_TOP;

  // Reusable card.
  function card(x, y, w, h, bg = C.white, border = C.border) {
    doc.setFillColor(...bg);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.2);

    doc.roundedRect(x, y, w, h, 2, 2, "FD");
  }

  // Section heading.
  function heading(x, y, title, color = C.ink) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(...color);
    doc.text(title, x, y);
  }

  // Wrapped text with a maximum height.
  function paragraph(text, x, y, w, options = {}) {
    const fontSize = options.fontSize || 7;
    const lineHeight = options.lineHeight || 3.5;
    const color = options.color || C.ink;
    const maxHeight = options.maxHeight || 999;

    doc.setFont("helvetica", options.bold ? "bold" : "normal");

    doc.setFontSize(fontSize);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(String(text), w);

    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));

    const visibleLines = lines.slice(0, maxLines);

    if (lines.length > visibleLines.length && visibleLines.length > 0) {
      const last = visibleLines.length - 1;

      visibleLines[last] = visibleLines[last].replace(/\s+$/, "") + "...";
    }

    visibleLines.forEach((line, index) => {
      doc.text(line, x, y + index * lineHeight);
    });

    return y + visibleLines.length * lineHeight;
  }

  // Circular progress ring.
  // Uses only jsPDF's supported circle() and line() methods.
  function drawProgressRing(cx, cy, radius, percentage, color) {
    const ringWidth = 1.8;

    // Background ring.
    doc.setDrawColor(...C.border);
    doc.setLineWidth(ringWidth);
    doc.circle(cx, cy, radius, "S");

    if (percentage === null || percentage <= 0) {
      return;
    }

    // Draw the colored progress as connected line segments.
    // A full circle consists of 360 degrees.
    const totalSegments = 180;
    const segments = Math.round((percentage / 100) * totalSegments);

    doc.setDrawColor(...color);
    doc.setLineWidth(ringWidth);

    for (let i = 0; i < segments; i++) {
      const startAngle = (-90 + (i / totalSegments) * 360) * (Math.PI / 180);

      const endAngle =
        (-90 + ((i + 1) / totalSegments) * 360) * (Math.PI / 180);

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);

      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      doc.line(x1, y1, x2, y2);
    }
  }

  card(leftX, leftY, leftW, 45);

  const cx = leftX + leftW / 2;
  const cy = leftY + 15;
  const radius = 9;

  drawProgressRing(cx, cy, radius, score, scoreColor);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...scoreColor);

  doc.text(score === null ? "N/A" : `${score}%`, cx, cy + 1, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...C.muted);

  doc.text("ATS Score", cx, cy + 5.5, {
    align: "center",
  });

  // Resume analysis badge.
  doc.setFillColor(45, 106, 205);

  doc.roundedRect(leftX + 5, leftY + 29, leftW - 10, 7, 1.5, 1.5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(...C.white);

  doc.text("RESUME ANALYSIS", cx, leftY + 33.5, { align: "center" });

  leftY += 49;

  // ==========================================
  // LEFT SIDEBAR: SUMMARY
  // ==========================================

  const summaryH = 35;

  card(leftX, leftY, leftW, summaryH);

  heading(leftX + 4, leftY + 6, "Summary");

  const stats = [
    ["Skills identified:", skills.length],
    ["Skills to address:", missing.length],
    ["Strengths:", strengths.length],
    ["Recommendations:", suggestions.length],
  ];

  stats.forEach(([label, value], index) => {
    const sy = leftY + 12 + index * 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(...C.ink);
    doc.text(label, leftX + 4, sy);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.muted);

    doc.text(String(value), leftX + leftW - 4, sy, { align: "right" });
  });

  leftY += summaryH + 5;

  // ==========================================
  // LEFT SIDEBAR: ANALYSIS CATEGORIES
  // ==========================================

  heading(leftX, leftY, "Analysis Categories");
  leftY += 4;

  const keywordScore =
    skills.length + missing.length > 0
      ? Math.round((skills.length / (skills.length + missing.length)) * 100)
      : null;

  const categories = [
    {
      title: "Executive Summary",
      value: score,
      color: scoreColor,
      bg: C.white,
      description: "Overall resume match",
    },
    {
      title: "Keyword Analysis",
      value: keywordScore,
      color: C.gold,
      bg: C.goldBg,
      description: "Skills identified vs. missing",
    },
    {
      title: "Hard Skills",
      value: null,
      color: C.gold,
      bg: C.white,
      description: `${skills.length} identified`,
    },
    {
      title: "Soft Skills",
      value: null,
      color: C.green,
      bg: C.white,
      description: "See identified skills",
    },
    {
      title: "Overall Fit",
      value: null,
      color: C.green,
      bg: C.white,
      description: "See executive summary",
    },
  ];

  categories.forEach((item) => {
    const h = 22;

    card(leftX, leftY, leftW, h, item.bg);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.4);
    doc.setTextColor(...C.ink);

    doc.text(item.title, leftX + 3, leftY + 6);

    if (item.value !== null) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...item.color);

      doc.text(`${item.value}/100`, leftX + leftW - 3, leftY + 6, {
        align: "right",
      });

      // Progress bar background.
      doc.setFillColor(...C.border);

      doc.roundedRect(leftX + 3, leftY + 11, leftW - 6, 2, 1, 1, "F");

      // Progress bar fill.
      if (item.value > 0) {
        doc.setFillColor(...item.color);

        doc.roundedRect(
          leftX + 3,
          leftY + 11,
          ((leftW - 6) * item.value) / 100,
          2,
          1,
          1,
          "F",
        );
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor(...C.muted);

      doc.text(item.description, leftX + 3, leftY + 18);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.6);
      doc.setTextColor(...C.muted);

      doc.text(item.description, leftX + 3, leftY + 15);
    }

    leftY += h + 3;
  });

  // ==========================================
  // RIGHT: EXECUTIVE SUMMARY
  // ==========================================

  const summaryBoxH = 38;

  card(rightX, rightY, rightW, summaryBoxH);

  heading(rightX + 4, rightY + 6, "Executive Summary");

  paragraph(summary, rightX + 4, rightY + 12, rightW - 8, {
    fontSize: 7,
    lineHeight: 3.5,
    maxHeight: summaryBoxH - 15,
  });

  rightY += summaryBoxH + 4;

  // ==========================================
  // RIGHT: OVERALL ATS SCORE
  // ==========================================

  const overallH = 21;

  card(rightX, rightY, rightW, overallH);

  heading(rightX + 4, rightY + 7, "Overall ATS Score");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...scoreColor);

  doc.text(
    score === null ? "N/A" : `${score}%`,
    rightX + rightW - 15,
    rightY + 10,
    { align: "right" },
  );

  drawProgressRing(rightX + rightW - 7, rightY + 8, 4, score, scoreColor);

  rightY += overallH + 4;

  // ==========================================
  // RIGHT: OVERALL FIT
  // ==========================================

  const fitH = 37;

  card(rightX, rightY, rightW, fitH);

  heading(rightX + 4, rightY + 6, "Overall Fit");

  paragraph(summary, rightX + 4, rightY + 12, rightW - 8, {
    fontSize: 6.8,
    lineHeight: 3.4,
    maxHeight: fitH - 15,
  });

  rightY += fitH + 3;

  // ==========================================
  // RIGHT: KEY STRENGTHS
  // ==========================================

  const strengthH = Math.min(12 + Math.max(1, strengths.length) * 3.3, 32);

  card(rightX, rightY, rightW, strengthH, C.greenBg, [213, 237, 220]);

  heading(rightX + 4, rightY + 6, "Key Strengths", C.green);

  paragraph(
    strengths.length
      ? strengths.map((s) => `• ${s}`).join("\n")
      : "No strengths returned.",
    rightX + 4,
    rightY + 12,
    rightW - 8,
    {
      fontSize: 6.3,
      lineHeight: 3.2,
      maxHeight: strengthH - 14,
    },
  );

  rightY += strengthH + 3;

  // ==========================================
  // RIGHT: AREAS FOR IMPROVEMENT
  // ==========================================

  const improvementH = Math.min(14 + Math.max(1, missing.length) * 4, 40);

  card(rightX, rightY, rightW, improvementH, C.redBg, [245, 219, 216]);

  heading(rightX + 4, rightY + 6, "Primary Areas for Improvement", C.red);

  paragraph(
    missing.length
      ? missing.map((s) => `• ${s}`).join("\n")
      : "No missing skills identified.",
    rightX + 4,
    rightY + 12,
    rightW - 8,
    {
      fontSize: 6.2,
      lineHeight: 3.2,
      maxHeight: improvementH - 14,
    },
  );

  rightY += improvementH + 3;

  // ==========================================
  // RIGHT: RECOMMENDATIONS
  // ==========================================

  const remainingH = BODY_BOTTOM - rightY;

  if (remainingH > 12) {
    card(rightX, rightY, rightW, remainingH, C.blueBg, [216, 232, 243]);

    heading(rightX + 4, rightY + 6, "Actionable Recommendations", C.blue);

    paragraph(
      suggestions.length
        ? suggestions.map((s) => `• ${s}`).join("\n")
        : "No recommendations returned.",
      rightX + 4,
      rightY + 12,
      rightW - 8,
      {
        fontSize: 6.2,
        lineHeight: 3.1,
        maxHeight: remainingH - 14,
      },
    );
  }

  // ==========================================
  // FOOTER
  // ==========================================

  doc.setDrawColor(...C.border);

  doc.line(M, H - FOOTER, W - M, H - FOOTER);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...C.muted);

  doc.text(
    "AI-estimated resume-to-job match. Not an official ATS score.",
    M,
    H - 2,
  );

  // Download one-page PDF.
  doc.save("resume-analysis-report.pdf");
}
