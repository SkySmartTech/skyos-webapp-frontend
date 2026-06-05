import { useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  Info,
  LayoutDashboard,
  List,
  LogOut,
  User,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

type MenuKey =
  | "dashboard"
  | "downtime"
  | "charts"
  | "reports"
  | "profile"
  | "help"
  | "logout";

export default function AndonSidebar() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [activeItem, setActiveItem] = useState<MenuKey>("dashboard");
  const [openMenus, setOpenMenus] = useState({
    charts: true,
    reports: true,
  });

  const base = dark
    ? "bg-gradient-to-b from-[#07111f] to-[#0c1422] border-[#1e2a3a] text-slate-300"
    : "bg-white border-gray-200 text-gray-600";

  const active = dark
    ? "bg-orange-500/10 text-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.08)]"
    : "bg-orange-50 text-orange-600";

  const inactive = dark
    ? "hover:bg-white/5 hover:text-white"
    : "hover:bg-gray-100 hover:text-gray-900";

  const subItem = (isActive: boolean) =>
    isActive
      ? dark
        ? "text-orange-400"
        : "text-orange-600"
      : dark
        ? "text-slate-400 hover:text-white"
        : "text-gray-500 hover:text-gray-900";

  return (
    <aside
      className={`w-72 h-full border-r px-4 py-5 overflow-y-auto transition-colors duration-300 ${base}`}
    >
      <div className="space-y-3">
        <button
          onClick={() => setActiveItem("dashboard")}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeItem === "dashboard" ? active : inactive
          }`}
        >
          <span className="flex items-center gap-3 text-[17px] font-semibold">
            <LayoutDashboard size={21} />
            Home Dashboard
          </span>
          <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md">
            3
          </span>
        </button>

        <button
          onClick={() => setActiveItem("downtime")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
            activeItem === "downtime" ? active : inactive
          }`}
        >
          <Activity size={21} />
          Downtime Dashboard
        </button>

        <button
          onClick={() =>
            setOpenMenus((prev) => ({ ...prev, charts: !prev.charts }))
          }
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
            activeItem === "charts" ? active : inactive
          }`}
        >
          <span className="flex items-center gap-3">
            <BarChart3 size={21} />
            Charts
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openMenus.charts ? "rotate-180" : ""}`}
          />
        </button>

        {openMenus.charts && (
          <button
            onClick={() => setActiveItem("charts")}
            className={`w-full text-left pl-14 pr-4 py-2.5 rounded-lg text-[16px] font-medium transition-colors duration-200 ${subItem(activeItem === "charts")}`}
          >
            Factory Wise
          </button>
        )}

        <button
          onClick={() =>
            setOpenMenus((prev) => ({ ...prev, reports: !prev.reports }))
          }
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
            activeItem === "reports" ? active : inactive
          }`}
        >
          <span className="flex items-center gap-3">
            <List size={21} />
            Reports
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openMenus.reports ? "rotate-180" : ""}`}
          />
        </button>

        {openMenus.reports && (
          <button
            onClick={() => setActiveItem("reports")}
            className={`w-full text-left pl-14 pr-4 py-2.5 rounded-lg text-[16px] font-medium transition-colors duration-200 ${subItem(activeItem === "reports")}`}
          >
            Details
          </button>
        )}
      </div>

      <div
        className={`my-8 border-t ${dark ? "border-white/10" : "border-gray-200"}`}
      />

      <div className="space-y-3">
        <button
          onClick={() => setActiveItem("profile")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[17px] font-semibold transition-all duration-200 ${
            activeItem === "profile" ? active : inactive
          }`}
        >
          <User size={21} />
          User Profile
        </button>

        <button
          onClick={() => setActiveItem("help")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[17px] font-semibold transition-all duration-200 ${
            activeItem === "help" ? active : inactive
          }`}
        >
          <Info size={21} />
          Help
        </button>

        <button
          onClick={() => setActiveItem("logout")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[17px] font-semibold transition-all duration-200 ${
            activeItem === "logout" ? active : inactive
          }`}
        >
          <LogOut size={21} />
          Logout
        </button>
      </div>
    </aside>
  );
}
