import { useTheme } from "../../context/ThemeContext";

export default function Andon() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "bg-gray-950" : "bg-slate-100";
  const card = dark
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const label = dark ? "text-gray-500" : "text-gray-500";
  const value = dark ? "text-white" : "text-gray-700";

  return (
    <div
      className={`min-h-full w-full p-6 transition-colors duration-300 ${bg}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className={`rounded-xl shadow-sm p-6 border transition-colors duration-300 ${card}`}
        >
          <div
            className={`text-xs font-semibold uppercase tracking-widest mb-4 ${label}`}
          >
            Performance EFI
          </div>
          <div className={`text-6xl font-black ${value}`}>0%</div>
        </div>

        <div
          className={`rounded-xl shadow-sm p-6 border transition-colors duration-300 ${card}`}
        >
          <div
            className={`text-xs font-semibold uppercase tracking-widest mb-4 ${label}`}
          >
            Line EFI
          </div>
          <div className={`text-6xl font-black ${value}`}>0%</div>
        </div>

        <div
          className={`rounded-xl shadow-sm p-6 border transition-colors duration-300 ${card}`}
        >
          <div
            className={`text-xs font-semibold uppercase tracking-widest mb-4 ${label}`}
          >
            Hourly Target / Achieve
          </div>
          <div className={`text-3xl font-bold ${value}`}>0 / 0</div>
        </div>
      </div>
    </div>
  );
}
