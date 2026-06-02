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
} from "lucide-react";

export default function Sidebar() {
  const [reportsOpen, setReportsOpen] = useState(true);
  const [energyOpen, setEnergyOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="w-[310px] h-screen bg-[#343A40] text-white overflow-y-auto p-3">
      <div className="space-y-1">
        {/* Dashboard */}
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition">
          <LayoutDashboard size={20} />
          <span className="text-[15px] font-medium">Dashboard</span>
        </button>

        {/* Dashboard MFM */}
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition">
          <LayoutDashboard size={20} />
          <span className="text-[15px] font-medium">Dashboard MFM</span>
        </button>

        {/* Dashboard MFI */}
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition">
          <LayoutDashboard size={20} />
          <span className="text-[15px] font-medium">Dashboard MFI</span>
        </button>

        {/* Reports */}
        <div>
          <button
            onClick={() => setReportsOpen(!reportsOpen)}
            className="w-full flex items-center justify-between px-4 py-4 rounded bg-[#495057] hover:bg-[#5c636a] transition"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} />
              <span className="text-[15px] font-medium">Reports</span>
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
                "Details Reports",
                "Details Reports COP",
                "Details Reports Intimo",
                "Thermal Consumption",
                "Thermal Consumption & CE",
                "Details Reports Energy",
              ].map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[#D6D8DB] hover:bg-[#495057] rounded transition"
                >
                  <PieChart size={18} />
                  <span className="text-[15px]">{item}</span>
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
              <span className="text-[15px] font-medium">CEB Energy</span>
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
              <button className="w-full flex items-center gap-3 px-4 py-3 text-[#D6D8DB] hover:bg-[#495057] rounded transition">
                <LayoutDashboard size={18} />
                <span className="text-[15px]">Dashboard</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <button onClick={() => navigate("/userprofile")} className="w-full flex items-center gap-3 px-4 py-4 rounded hover:bg-[#495057] transition">
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
  );
}