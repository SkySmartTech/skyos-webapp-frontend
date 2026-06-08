import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PieChart,
  Monitor,
  User,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [reportsOpen, setReportsOpen] = useState(true);
  const [energyOpen, setEnergyOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-[#343A40] text-white px-4 py-3">
        <h1 className="text-lg font-semibold">HVAC Dashboard</h1>

        <button onClick={() => setMobileOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          w-[310px] h-screen
          bg-[#343A40]
          text-white
          overflow-y-auto
          p-3
          transform transition-transform duration-300

          ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }

          lg:translate-x-0
          lg:static
        `}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-xl font-semibold">Menu</h2>

          <button onClick={() => setMobileOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="space-y-1">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/solar/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
          >
            <LayoutDashboard size={20} />
            <span className="text-[15px] font-medium">Dashboard</span>
          </button>

          {/* Dashboard MFM */}
          <button
            onClick={() => navigate("/solar/mfm")}
            className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
          >
            <LayoutDashboard size={20} />
            <span className="text-[15px] font-medium">
              Dashboard MFM
            </span>
          </button>

          {/* Dashboard MFI */}
          <button
            onClick={() => navigate("/solar/mfi")}
            className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
          >
            <LayoutDashboard size={20} />
            <span className="text-[15px] font-medium">
              Dashboard MFI
            </span>
          </button>

          {/* Reports */}
          <div>
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} />
                <span className="text-[15px] font-medium">
                  Reports
                </span>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  reportsOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {reportsOpen && (
              <div className="mt-2 ml-2 space-y-1">
                {[
                  { label: "Details Reports", path: "/solar/reports/details" },
                  { label: "Details Reports COP", path: "/solar/reports/cop" },
                  { label: "Details Reports Intimo", path: "/solar/reports/intimo" },
                  { label: "Thermal Consumption", path: "/solar/reports/thermal" },
                  { label: "Thermal Consumption & CEB", path: "/solar/reports/thermal-ce" },
                  { label: "Details Reports Energy", path: "/solar/reports/energy" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#D6D8DB] hover:bg-[#495057] rounded transition"
                  >
                    <PieChart size={18} />
                    <span className="text-[15px]">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CEB Energy */}
          <div>
            <button
              onClick={() => setEnergyOpen(!energyOpen)}
              className="w-full flex items-center justify-between px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
            >
              <div className="flex items-center gap-3">
                <Monitor size={20} />
                <span className="text-[15px] font-medium">
                  CEB Energy
                </span>
              </div>

              <ChevronDown
                size={18}
                className={`transition-transform ${
                  energyOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>

            {energyOpen && (
              <div className="mt-2 ml-2">
                <button
                 onClick={() => navigate("/solar/reports/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#D6D8DB] hover:bg-[#495057] rounded transition">
                  <LayoutDashboard size={18} />
                  <span className="text-[15px]">Dashboard</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            onClick={() => navigate("/userprofile")}
            className="w-full flex items-center gap-3 px-4 py-4 rounded hover:bg-[#495057] transition"
          >
            <User size={20} />
            <span className="text-[15px]">User Profile</span>
          </button>

          {/* Help */}
          <button className="w-full flex items-center justify-between px-4 py-4 rounded hover:bg-[#495057] transition">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} />
              <span className="text-[15px]">Help</span>
            </div>

            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </>
  );
}