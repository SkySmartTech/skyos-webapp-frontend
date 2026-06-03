import Sidebar from "../../components/PMS-1682(Solar)/sidebar";
import HVACDashboard from "./dashboard";

export default function SolarPage() {
  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 overflow-auto">
        <HVACDashboard />
      </div>
    </div>
  );
}
