import { BrainCircuit, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isDark
          ? "border-white/[0.08] bg-[#0B0C0E]/90"
          : "border-stone-200 bg-white/90"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D8BD83] text-[#141414] shadow-lg shadow-[#D8BD83]/10">
            <BrainCircuit size={22} />
          </div>

          <div>
            <p
              className={`text-lg font-semibold tracking-[0.14em] sm:tracking-[0.18em] ${
                isDark ? "text-[#F4F0E7]" : "text-stone-900"
              }`}
            >
              RESUME<span className="text-[#B18B43]">IQ</span>
            </p>

            <p className="text-[9px] tracking-[0.18em] text-stone-500 sm:tracking-[0.24em]">
              CAREER INTELLIGENCE
            </p>
          </div>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`hidden items-center gap-2 rounded-full border border-[#D8BD83]/20 px-3 py-2 sm:flex ${
              isDark ? "bg-[#D8BD83]/5" : "bg-[#D8BD83]/10"
            }`}
          >
            <Sparkles size={14} className="text-[#B18B43]" />
            <span
              className={`text-xs ${
                isDark ? "text-stone-300" : "text-stone-700"
              }`}
            >
              AI-powered analysis
            </span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border cursor-pointer transition duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D8BD83] ${
              isDark
                ? "border-white/10 bg-white/[0.04] text-[#D8BD83] hover:bg-white/10"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
