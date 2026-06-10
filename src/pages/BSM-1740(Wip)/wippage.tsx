import { useTheme } from "../../context/ThemeContext";
import WipDashboardPage from "../../components/BSM-1740(WIP)/wip_dashboard";

export default function WipPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div
      className={`flex w-full h-full overflow-hidden transition-colors duration-300 ${
        dark ? "bg-gray-950" : "bg-slate-100"
      }`}
    >
      <WipDashboardPage />
    </div>
  );
}
