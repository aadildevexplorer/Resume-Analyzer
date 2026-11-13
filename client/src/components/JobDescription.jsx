import { BriefcaseBusiness } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function JobDescription({ value, onChange }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
          <BriefcaseBusiness size={20} />
        </div>

        <div>
          <h2
            className={`font-medium ${
              isDark ? "text-stone-100" : "text-stone-900"
            }`}
          >
            Target position
          </h2>

          <p
            className={`mt-1 text-xs ${
              isDark ? "text-stone-400" : "text-stone-600"
            }`}
          >
            Match your resume to the role
          </p>
        </div>
      </div>

      <label
        htmlFor="job-description"
        className={`mb-2 block text-xs font-medium uppercase tracking-wider ${
          isDark ? "text-stone-400" : "text-stone-600"
        }`}
      >
        Job description
      </label>

      <textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job responsibilities, required skills and qualifications..."
        rows={7}
        maxLength={15000}
        className={`min-h-48 w-full resize-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-xl border p-4 text-sm leading-7 outline-none transition-colors placeholder:opacity-70 focus:ring-2 focus:ring-[#B18B43]/30 sm:min-h-56 ${
          isDark
            ? "border-white/10 bg-[#090A0C] text-stone-100 placeholder:text-stone-500 focus:border-[#D8BD83]/50"
            : "border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:border-[#B18B43]"
        }`}
      />
      <p
        className={`mt-2 text-right text-xs ${
          isDark ? "text-stone-500" : "text-stone-500"
        }`}
      >
        {value.length.toLocaleString()} / 15,000 characters
      </p>
    </section>
  );
}
