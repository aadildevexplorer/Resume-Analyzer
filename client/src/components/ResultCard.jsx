import { useTheme } from "../context/ThemeContext";

export default function ResultCard({ icon: Icon, title, children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <article
      className={`rounded-2xl border p-5 transition-colors duration-300 hover:border-[#B18B43]/40 sm:p-6 ${
        isDark
          ? "border-white/[0.08] bg-[#121416]"
          : "border-stone-200 bg-white shadow-sm shadow-stone-200/40"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            isDark
              ? "border-[#D8BD83]/15 bg-[#D8BD83]/[0.07] text-[#D8BD83]"
              : "border-[#B18B43]/20 bg-[#D8BD83]/15 text-[#98752C]"
          }`}
        >
          <Icon size={18} />
        </div>

        <h3
          className={`text-sm font-semibold tracking-wide ${
            isDark ? "text-stone-100" : "text-stone-900"
          }`}
        >
          {title}
        </h3>
      </div>

      {children}
    </article>
  );
}
