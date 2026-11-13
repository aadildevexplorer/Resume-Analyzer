import {
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { Download } from "lucide-react";
import ResultCard from "./ResultCard";
import { useTheme } from "../context/ThemeContext";
import DownloadAnalysisPdf from "../download/pdf/DownloadAnalysisPdf";

function SkillTags({ skills, missing = false, isDark }) {
  if (!skills?.length) {
    return (
      <p
        className={isDark ? "text-sm text-stone-400" : "text-sm text-stone-500"}
      >
        No items returned.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className={`rounded-lg border px-3 py-1.5 text-xs ${
            missing
              ? isDark
                ? "border-amber-300/15 bg-amber-300/[0.06] text-amber-200"
                : "border-amber-300 bg-amber-50 text-amber-800"
              : isDark
                ? "border-[#D8BD83]/15 bg-[#D8BD83]/[0.06] text-[#E8D3A5]"
                : "border-[#B18B43]/25 bg-[#D8BD83]/15 text-[#72551E]"
          }`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function InsightList({ items, isDark }) {
  if (!items?.length) {
    return (
      <p
        className={isDark ? "text-sm text-stone-400" : "text-sm text-stone-500"}
      >
        No items returned.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={`flex items-start gap-3 text-sm leading-6 ${
            isDark ? "text-stone-300" : "text-stone-700"
          }`}
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B18B43]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ATSScoreCard({ score, isDark }) {
  const validScore =
    Number.isFinite(Number(score)) &&
    score !== null &&
    score !== undefined &&
    score !== "";

  const atsScore = validScore
    ? Math.max(0, Math.min(100, Math.round(Number(score))))
    : null;

  const scoreColor =
    atsScore === null
      ? "text-stone-400"
      : atsScore >= 80
        ? "text-emerald-500"
        : atsScore >= 60
          ? "text-amber-500"
          : "text-rose-500";

  const ringColor =
    atsScore === null
      ? "border-stone-400"
      : atsScore >= 80
        ? "border-emerald-500"
        : atsScore >= 60
          ? "border-amber-500"
          : "border-rose-500";

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 ${
        isDark ? "border-stone-700 bg-stone-900" : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[6px] ${ringColor}`}
        >
          <div className="text-center">
            <p className={`text-3xl font-bold ${scoreColor}`}>
              {atsScore === null ? "--" : atsScore}
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-stone-400" : "text-stone-500"
              }`}
            >
              / 100
            </p>
          </div>
        </div>

        <div>
          <div
            className={`mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B18B43]`}
          >
            <Target size={15} />
            ATS match score
          </div>

          <h3
            className={`text-xl font-semibold ${
              isDark ? "text-stone-100" : "text-stone-900"
            }`}
          >
            {atsScore === null
              ? "Score unavailable"
              : atsScore >= 80
                ? "Strong job match"
                : atsScore >= 60
                  ? "Moderate job match"
                  : "Needs improvement"}
          </h3>

          <p
            className={`mt-2 text-sm leading-6 ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            {atsScore === null
              ? "No ATS score was returned. Analyze your resume again."
              : "Estimated resume match based on the job description, skills, experience, and education."}
          </p>
        </div>
      </div>

      <p
        className={`mt-5 border-t pt-4 text-xs leading-5 ${
          isDark
            ? "border-stone-700 text-stone-500"
            : "border-stone-200 text-stone-500"
        }`}
      >
        This is an AI-estimated resume-to-job match score, not an official score
        from an ATS platform.
      </p>
    </div>
  );
}

export default function AnalysisResults({ analysis, jobTitle }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!analysis) {
    return null;
  }

  return (
    <section className="mt-12 scroll-mt-24 space-y-6" aria-live="polite">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#B18B43]">
            <Sparkles size={14} />
            AI assessment
          </div>

          <h2
            className={`text-2xl font-semibold tracking-tight sm:text-3xl ${
              isDark ? "text-stone-100" : "text-stone-900"
            }`}
          >
            Your career insights
          </h2>

          <p
            className={`mt-2 text-sm leading-6 ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            Review your strengths and identify areas to improve.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log("PDF button clicked");
            console.log("Download function:", DownloadAnalysisPdf);
            console.log("Analysis data:", analysis);

            DownloadAnalysisPdf(analysis, jobTitle);
          }}
          className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-[#B18B43] px-4 py-2.5 text-sm font-medium text-white"
        >
          <Download size={16} />
          Download PDF
        </button>
        <span
          className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs sm:flex ${
            isDark
              ? "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <CheckCircle2 size={14} />
          Analysis complete
        </span>
      </div>

      {/* ATS Score */}
      <ATSScoreCard score={analysis.atsScore} isDark={isDark} />

      {/* Executive Summary */}
      <ResultCard icon={Target} title="Executive summary">
        <p
          className={`text-sm leading-7 ${
            isDark ? "text-stone-300" : "text-stone-700"
          }`}
        >
          {analysis.summary}
        </p>
      </ResultCard>

      {/* Skills */}
      <div className="grid gap-4 md:grid-cols-2">
        <ResultCard icon={CheckCircle2} title="Skills identified">
          <SkillTags skills={analysis.skills} isDark={isDark} />
        </ResultCard>

        <ResultCard icon={CircleAlert} title="Skills to address">
          <SkillTags skills={analysis.missingSkills} missing isDark={isDark} />

          <p
            className={`mt-4 text-xs leading-5 ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            These skills were not evident in the supplied resume. This does not
            necessarily mean you lack them.
          </p>
        </ResultCard>
      </div>

      {/* Strengths */}
      <ResultCard icon={Target} title="Your strengths">
        <InsightList items={analysis.strengths} isDark={isDark} />
      </ResultCard>

      {/* Suggestions */}
      <ResultCard icon={Lightbulb} title="Recommended improvements">
        <InsightList items={analysis.suggestions} isDark={isDark} />
      </ResultCard>
    </section>
  );
}
