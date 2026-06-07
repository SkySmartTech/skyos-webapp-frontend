import Andon from "../../components/DSCS1515A(Andon)/andon";
import Sidebar from "../../components/COMMON/Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function AndonPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div
      className={`flex w-full h-full overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-slate-100"}`}
    >
      <div className="shrink-0 h-full">
        <Sidebar mode="andon" />
      </div>

      <main className="flex-1 h-full overflow-y-auto">
        <Andon />
      </main>
    </div>
  );
}
