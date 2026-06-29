import { useState } from "react";
import { Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

import SolarSidebar, { type SolarView } from "../../components/PMS-1682(Solar)/sidebar";
import HVACDashboard        from "../../components/PMS-1682(Solar)/dashboard";
import MFMDashboard         from "../../components/PMS-1682(Solar)/dashboard-mfm";
import MFIDashboard         from "../../components/PMS-1682(Solar)/dashboard-mfi";
import DetailsReport        from "../../components/PMS-1682(Solar)/reports/details-report";
import DetailsReportEnergy  from "../../components/PMS-1682(Solar)/reports/details-report-energy";
import DetailsReportIntimo  from "../../components/PMS-1682(Solar)/reports/details-report-intimo";
import ThermalConsumption   from "../../components/PMS-1682(Solar)/reports/thermal-consuption";
import ThermalConsumptionCEB from "../../components/PMS-1682(Solar)/reports/thermal-consumption-&-ceb";
import UserProfile          from "../../components/PMS-1682(Solar)/userprofile";

export default function SolarPage() {
  const [activeView,  setActiveView]  = useState<SolarView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={`flex w-full h-full overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-slate-100"}`}>

      <SolarSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile FAB */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        {activeView === "dashboard"   && <HVACDashboard />}
        {activeView === "mfm"         && <MFMDashboard />}
        {activeView === "mfi"         && <MFIDashboard />}
        {activeView === "details"     && <DetailsReport />}
        {activeView === "energy"      && <DetailsReportEnergy />}
        {activeView === "intimo"      && <DetailsReportIntimo />}
        {activeView === "thermal"     && <ThermalConsumption />}
        {activeView === "thermal-ceb" && <ThermalConsumptionCEB />}
        {activeView === "userprofile" && <UserProfile />}
      </main>
    </div>
  );
}
