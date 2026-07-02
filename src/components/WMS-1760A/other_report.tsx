import { useTheme } from "../../context/ThemeContext";

export default function OtherReport() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div
      className={`flex items-center justify-center h-full ${dark ? "bg-[#020617]" : "bg-slate-100"}`}
    >
      <div
        className={`rounded-xl border p-8 ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-gray-200"}`}
      >
        <h2
          className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
        >
          Other Work Order Report
        </h2>
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          This page will display report and data summary for other work orders.
        </p>
      </div>
    </div>
  );
}
