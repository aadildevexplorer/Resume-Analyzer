import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription";
import AnalysisResults from "../components/AnalysisResults";
import { analyzeResume } from "../api/resumeApi";
import { useTheme } from "../context/ThemeContext";

// const getSavedJobDescription = () => {
//   try {
//     return localStorage.getItem("resumeiq-job-description") || "";
//   } catch {
//     return "";
//   }
// };

// const getSavedAnalysis = () => {
//   try {
//     return JSON.parse(localStorage.getItem("resumeiq-analysis") || "null");
//   } catch (error) {
//     console.error("Could not load saved analysis:", error);
//     return null;
//   }
// };

export default function Home() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  // const [jobDescription, setJobDescription] = useState(getSavedJobDescription);
  // const [analysis, setAnalysis] = useState(getSavedAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const extractJobTitle = (description = "") => {
    const match = description.match(/^\s*#?\s*Job\s*Title\s*:\s*(.+)$/im);

    return match?.[1]?.trim() || "Target Position";
  };

  // Save job description whenever it changes.
  // useEffect(() => {
  //   try {
  //     localStorage.setItem("resumeiq-job-description", jobDescription);
  //   } catch (err) {
  //     console.error("Could not save job description:", err);
  //   }
  // }, [jobDescription]);

  // // Save analysis results whenever they change.
  // useEffect(() => {
  //   try {
  //     if (analysis) {
  //       localStorage.setItem("resumeiq-analysis", JSON.stringify(analysis));
  //     } else {
  //       localStorage.removeItem("resumeiq-analysis");
  //     }
  //   } catch (err) {
  //     console.error("Could not save analysis:", err);
  //   }
  // }, [analysis]);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!resume) {
      setError("Please upload your resume PDF first.");
      return;
    }
    setAnalysis(null);

    if (!jobDescription.trim()) {
      setError("Please enter the target job description.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await analyzeResume(resume, jobDescription);

      if (!result?.analysis) {
        throw new Error("Invalid analysis response received.");
      }

      setAnalysis(result.analysis);

      setTimeout(() => {
        document.getElementById("analysis-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Analysis failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const surface = isDark
    ? "border-white/[0.09] bg-[#111315]/90"
    : "border-stone-200 bg-white/90";

  const headingColor = isDark ? "text-[#F4F0E7]" : "text-stone-900";

  const descriptionColor = isDark ? "text-stone-400" : "text-stone-600";

  const mutedColor = isDark ? "text-stone-500" : "text-stone-500";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[#0B0C0E] text-stone-100 selection:bg-[#D8BD83]/30"
          : "bg-[#F7F6F2] text-stone-900 selection:bg-[#D8BD83]/40"
      }`}
    >
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -top-56 left-1/2 h-[450px] w-[700px] -translate-x-1/2 rounded-full blur-[130px] ${
            isDark ? "bg-[#D8BD83]/[0.06]" : "bg-[#D8BD83]/[0.14]"
          }`}
        />

        <div
          className={`absolute top-[650px] -left-48 h-80 w-80 rounded-full blur-[100px] ${
            isDark ? "bg-indigo-500/[0.04]" : "bg-indigo-300/[0.12]"
          }`}
        />
      </div>

      <div className="relative">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 lg:px-8">
          {/* Hero section */}
          <section className="mx-auto max-w-3xl text-center">
            <div
              className={`mb-6 inline-flex items-center gap-2 rounded-full border border-[#D8BD83]/30 px-4 py-2 ${
                isDark ? "bg-[#D8BD83]/[0.06]" : "bg-[#D8BD83]/[0.12]"
              }`}
            >
              <Sparkles size={14} className="text-[#B18B43]" />

              <span
                className={`text-[10px] font-medium tracking-[0.14em] sm:text-xs sm:tracking-[0.18em] ${
                  isDark ? "text-[#E4D0A4]" : "text-[#806323]"
                }`}
              >
                INTELLIGENT CAREER ANALYSIS
              </span>
            </div>

            <h1
              className={`text-4xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl md:text-6xl ${headingColor}`}
            >
              Your experience.
              <br />
              <span className="font-serif italic text-[#B18B43]">
                Your next opportunity.
              </span>
            </h1>

            <p
              className={`mx-auto mt-6 max-w-xl text-sm leading-7 sm:text-base ${descriptionColor}`}
            >
              Discover how your resume aligns with your target role. Identify
              missing skills and get actionable recommendations powered by AI.
            </p>

            <div
              className={`mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs ${descriptionColor}`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#B18B43]" />
                Resume-based insights
              </span>

              <span className="flex items-center gap-2">
                <BrainCircuit size={15} className="text-[#B18B43]" />
                AI-powered analysis
              </span>
            </div>
          </section>

          {/* Resume analysis form */}
          <form onSubmit={handleAnalyze} className="mx-auto mt-12 max-w-3xl">
            <div
              className={`rounded-3xl border p-4 shadow-2xl transition-colors duration-300 sm:p-7 md:p-8 ${
                isDark
                  ? `${surface} shadow-black/20`
                  : `${surface} shadow-stone-300/30`
              }`}
            >
              <div className="mb-7 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#B18B43]">
                    Get started
                  </p>

                  <h2 className={`mt-2 text-xl font-medium ${headingColor}`}>
                    Analyze your resume
                  </h2>

                  <p className={`mt-2 text-sm ${descriptionColor}`}>
                    Upload your resume and paste the target job description.
                  </p>
                </div>

                <div
                  className={`hidden h-12 w-12 items-center justify-center rounded-2xl border sm:flex ${
                    isDark
                      ? "border-white/[0.08] bg-white/[0.03]"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <BrainCircuit size={23} className="text-[#B18B43]" />
                </div>
              </div>

              <div className="space-y-5">
                <ResumeUpload file={resume} onChange={setResume} />

                <JobDescription
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
                    isDark
                      ? "border-red-400/20 bg-red-400/[0.06] text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <CircleAlert size={19} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex cursor-pointer min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#D8BD83] px-5 py-4 text-sm font-semibold text-[#171510] transition duration-200 hover:bg-[#E7D09A] focus:outline-none focus:ring-2 focus:ring-[#B18B43]/60 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  "--tw-ring-offset-color": isDark ? "#111315" : "#FFFFFF",
                }}
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Analyzing your resume...
                  </>
                ) : (
                  <>
                    Analyze my resume
                    <ArrowRight size={19} />
                  </>
                )}
              </button>

              <p className={`mt-4 text-center text-xs leading-5 ${mutedColor}`}>
                Analysis may take a little time. Keep this page open while your
                request is processing.
              </p>
            </div>
          </form>

          {/* Analysis results */}
          <div
            id="analysis-results"
            className="mx-auto mt-8 max-w-3xl scroll-mt-24"
          >
            {analysis && (
              <AnalysisResults
                analysis={analysis}
                jobTitle={
                  jobDescription
                    .match(
                      /(?:Job Title|Target Role|Position)\s*:\s*([^\n]+)/i,
                    )?.[1]
                    ?.trim() || "Target Position"
                }
              />
            )}{" "}
          </div>

          {/* Footer */}
          <footer
            className={`mt-16 border-t pt-6 text-center ${
              isDark ? "border-white/[0.07]" : "border-stone-200"
            }`}
          >
            <p className={`text-xs ${mutedColor}`}>
              RESUMEIQ · AI-assisted career insights
            </p>

            <p className={`mt-2 text-xs ${mutedColor}`}>
              AI recommendations may be imperfect. Verify important findings.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
