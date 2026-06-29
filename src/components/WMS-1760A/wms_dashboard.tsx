import { useTheme } from "../../context/ThemeContext";
import type { WmsView } from "./wms_sidebar";
import WmsHome from "./wms_home";
import BreakdownReport from "./breakdown_report";
import PlannedMaintenanceReport from "./planned_maintenance_report";
import RedTagReport from "./red_tag_report";
import MtbfMttrReport from "./mtbf_mttr_report";

function Placeholder({ title }: { title: string }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div className={`flex flex-col items-center justify-center h-full gap-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${dark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
        <span className="text-2xl">🔧</span>
      </div>
      <div className="text-center">
        <p className={`text-base font-bold ${dark ? "text-white" : "text-gray-900"}`}>{title}</p>
        <p className="text-sm mt-1">This section is under development.</p>
      </div>
    </div>
  );
}

export default function WmsDashboard({ activeSection }: { activeSection: WmsView }) {
  if (activeSection === "dashboard")        return <WmsHome />;
  if (activeSection === "report-breakdown") return <BreakdownReport />;
  if (activeSection === "report-planned")   return <PlannedMaintenanceReport />;
  if (activeSection === "report-redtag")    return <RedTagReport />;
  if (activeSection === "report-mtbf")      return <MtbfMttrReport />;
  if (activeSection === "report-building")  return <Placeholder title="Building Maintenance Report" />;
  if (activeSection === "report-other")     return <Placeholder title="Other Report" />;
  return <WmsHome />;
}
