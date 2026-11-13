import { useRef } from "react";
import { FileText, UploadCloud, X, FileCheck2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ResumeUpload({ file, onChange }) {
  const inputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5 MB.");
      return;
    }

    onChange(selectedFile);
  };

  return (
    <section
      className={`rounded-2xl border p-5 transition-colors duration-300 sm:p-6 ${
        isDark
          ? "border-white/[0.09] bg-white/[0.025]"
          : "border-stone-200 bg-white shadow-sm shadow-stone-200/40"
      }`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isDark
              ? "bg-[#D8BD83]/10 text-[#D8BD83]"
              : "bg-[#D8BD83]/20 text-[#98752C]"
          }`}
        >
          <FileText size={20} />
        </div>

        <div>
          <h2
            className={`font-medium ${
              isDark ? "text-stone-100" : "text-stone-900"
            }`}
          >
            Your resume
          </h2>

          <p
            className={`mt-1 text-xs ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            PDF document · Up to 5 MB
          </p>
        </div>
      </div>

      {file ? (
        <div
          className={`flex items-center gap-3 rounded-xl cursor-pointer border p-4 ${
            isDark
              ? "border-[#D8BD83]/20 bg-[#D8BD83]/5"
              : "border-[#B18B43]/25 bg-[#D8BD83]/10"
          }`}
        >
          <FileCheck2
            className={`shrink-0 ${
              isDark ? "text-[#D8BD83]" : "text-[#98752C]"
            }`}
            size={25}
          />

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-sm font-medium ${
                isDark ? "text-stone-200" : "text-stone-900"
              }`}
            >
              {file.name}
            </p>

            <p
              className={`mt-1 text-xs ${
                isDark ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {(file.size / 1024).toFixed(0)} KB · PDF selected
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }}
            aria-label="Remove resume"
            className={`rounded-lg p-2 transition ${
              isDark
                ? "text-stone-400 hover:bg-white/10 hover:text-white"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex min-h-44 w-full flex-col items-center cursor-pointer justify-center rounded-xl border border-dashed px-4 py-7 text-center transition duration-200 ${
            isDark
              ? "border-stone-700 bg-black/20 hover:border-[#D8BD83]/60 hover:bg-[#D8BD83]/[0.04]"
              : "border-stone-300 bg-stone-50/70 hover:border-[#B18B43] hover:bg-[#D8BD83]/[0.08]"
          }`}
        >
          <div
            className={`mb-4 flex h-12 w-12 items-center cursor-pointer justify-center rounded-2xl border ${
              isDark
                ? "border-[#D8BD83]/20 bg-[#D8BD83]/10 text-[#D8BD83]"
                : "border-[#B18B43]/25 bg-[#D8BD83]/15 text-[#98752C]"
            }`}
          >
            <UploadCloud size={23} />
          </div>

          <p
            className={`text-sm font-medium ${
              isDark ? "text-stone-200" : "text-stone-900"
            }`}
          >
            Choose your resume
          </p>

          <p
            className={`mt-2 text-xs ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            Click to browse or drop your PDF here
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </section>
  );
}
