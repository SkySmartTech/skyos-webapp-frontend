import { useState } from "react";
import { Menu } from "lucide-react";
import WmsSidebar, { type WmsView } from "../../components/WMS-1760A/wms_sidebar";
import WmsDashboard from "../../components/WMS-1760A/wms_dashboard";
import { useTheme } from "../../context/ThemeContext";

export default function WmsPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeView, setActiveView] = useState<WmsView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`flex w-full h-full min-h-0 overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-slate-100"}`}>

      <WmsSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile FAB */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30 font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        <WmsDashboard activeSection={activeView} />
      </main>
    </div>
  );
}
