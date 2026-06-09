import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  ChevronDown,
  Settings,
  Activity,
  Users,
  LogOut,
  User,
  List,
  Info,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";

type ProductionView = "dashboard" | "settings" | "update";
type SidebarMode = "production" | "andon";

type AndonMenuKey =
  | "dashboard"
  | "downtime"
  | "factoryWise"
  | "details"
  | "profile"
  | "help"
  | "logout";

interface SidebarProps {
  setActiveView?: (view: ProductionView) => void;
  activeView?: ProductionView;
  mode?: SidebarMode;
}

const Sidebar = ({
  setActiveView,
  activeView = "dashboard",
  mode = "production",
}: SidebarProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dark = theme === "dark";

  const [activeAndonItem, setActiveAndonItem] =
    useState<AndonMenuKey>("dashboard");
  const [openAndonMenus, setOpenAndonMenus] = useState({
    charts: true,
    reports: true,
  });

  const base = dark
    ? "bg-gray-900 border-gray-800 text-gray-400"
    : "bg-white border-gray-200 text-gray-600";

  const label = dark ? "text-gray-600" : "text-gray-400";

  const active = dark
    ? "bg-orange-500/10 text-orange-400"
    : "bg-orange-50 text-orange-600";

  const hover = dark
    ? "hover:bg-gray-800 hover:text-white"
    : "hover:bg-gray-100 hover:text-gray-900";

  const divider = dark ? "border-gray-800" : "border-gray-200";

  const andonBase = dark
    ? "bg-gradient-to-b from-[#07111f] to-[#0c1422] border-[#1e2a3a] text-slate-300"
    : "bg-white border-gray-200 text-gray-600";

  const andonActive = dark
    ? "bg-orange-500/10 text-orange-400 shadow-[0_0_0_1px_rgba(249,115,22,0.08)]"
    : "bg-orange-50 text-orange-600";

  const andonInactive = dark
    ? "hover:bg-white/5 hover:text-white"
    : "hover:bg-gray-100 hover:text-gray-900";

  const andonSubItem = (isActive: boolean) =>
    isActive
      ? dark
        ? "text-orange-400"
        : "text-orange-600"
      : dark
        ? "text-slate-400 hover:text-white"
        : "text-gray-500 hover:text-gray-900";

  useEffect(() => {
    if (location.pathname === "/andon/downtime-dashboard") {
      setActiveAndonItem("downtime");
      return;
    }

    if (location.pathname === "/andon/factory-wise") {
      setActiveAndonItem("factoryWise");
      return;
    }

    if (location.pathname === "/andon/home-dashboard") {
      setActiveAndonItem("dashboard");
      return;
    }

    if (location.pathname === "/andon/details") {
      setActiveAndonItem("details");
    }
  }, [location.pathname]);

  if (mode === "andon") {
    return (
      <aside
        className={`w-72 h-full border-r px-4 py-5 overflow-y-auto transition-colors duration-300 ${andonBase}`}
      >
        <div className="space-y-3">
          <button
            onClick={() => {
              setActiveAndonItem("dashboard");
              navigate("/andon/home-dashboard");
            }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeAndonItem === "dashboard" ? andonActive : andonInactive
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
            onClick={() => {
              setActiveAndonItem("downtime");
              navigate("/andon/downtime-dashboard");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
              activeAndonItem === "downtime" ? andonActive : andonInactive
            }`}
          >
            <Activity size={21} />
            Downtime Dashboard
          </button>

          <button
            onClick={() =>
              setOpenAndonMenus((prev) => ({ ...prev, charts: !prev.charts }))
            }
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
              activeAndonItem === "factoryWise" ? andonActive : andonInactive
            }`}
          >
            <span className="flex items-center gap-3">
              <BarChart3 size={21} />
              Charts
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${openAndonMenus.charts ? "rotate-180" : ""}`}
            />
          </button>

          {openAndonMenus.charts && (
            <button
              onClick={() => {
                setActiveAndonItem("factoryWise");
                navigate("/andon/factory-wise");
              }}
              className={`w-full text-left pl-14 pr-4 py-2.5 rounded-lg text-[16px] font-medium transition-colors duration-200 ${andonSubItem(
                activeAndonItem === "factoryWise",
              )}`}
            >
              Factory Wise
            </button>
          )}

          <button
            onClick={() =>
              setOpenAndonMenus((prev) => ({ ...prev, reports: !prev.reports }))
            }
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-[17px] font-semibold ${
              activeAndonItem === "details" ? andonActive : andonInactive
            }`}
          >
            <span className="flex items-center gap-3">
              <List size={21} />
              Reports
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${openAndonMenus.reports ? "rotate-180" : ""}`}
            />
          </button>

          {openAndonMenus.reports && (
            <button
              onClick={() => {
                setActiveAndonItem("details");
                navigate("/andon/details");
              }}
              className={`w-full text-left pl-14 pr-4 py-2.5 rounded-lg text-[16px] font-medium transition-colors duration-200 ${andonSubItem(
                activeAndonItem === "details",
              )}`}
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
            onClick={() => setActiveAndonItem("logout")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[17px] font-semibold transition-all duration-200 ${
              activeAndonItem === "logout" ? andonActive : andonInactive
            }`}
          >
            <LogOut size={21} />
            Logout
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div
      className={`w-70 h-full border-r px-6 py-6 overflow-y-auto transition-colors duration-300 ${base}`}
    >
      <div>
        <p
          className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}
        >
          Systems
        </p>

        <div
          onClick={() => setActiveView?.("dashboard")}
          className={`flex items-center justify-between mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === "dashboard" ? active : hover
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={19} />
            <span className="text-base font-medium">Dashboard</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
            3
          </div>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={19} />
            <span className="text-base font-medium">P2P Section</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={`border-t my-6 ${divider}`} />

      <div>
        <p
          className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}
        >
          Configuration
        </p>

        <div
          onClick={() => setActiveView?.("update")}
          className={`flex items-center gap-3 mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === "update" ? active : hover
          }`}
        >
          <Activity size={19} />
          <span className="text-base font-medium">Production Update</span>
        </div>

        <div
          onClick={() => setActiveView?.("settings")}
          className={`flex items-center gap-3 mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === "settings" ? active : hover
          }`}
        >
          <Settings size={19} />
          <span className="text-base font-medium">Plan Settings</span>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}
        >
          <div className="flex items-center gap-3">
            <Users size={19} />
            <span className="text-base font-medium">Company Setting</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className={`border-t my-6 ${divider}`} />

      <div>
        <p
          className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}
        >
          Account
        </p>
        <div className="space-y-1">
          <div
            className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}
          >
            <User size={19} />
            <span className="text-base font-medium">User Profile</span>
          </div>
          <div
            className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}
          >
            <LogOut size={19} />
            <span className="text-base font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
