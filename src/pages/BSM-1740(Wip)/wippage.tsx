import { useState } from "react";
import { Menu } from "lucide-react";
import WipSidebar, { type WipView } from "../../components/BSM-1740(WIP)/wip_sidebar";
import WipDashboard from "../../components/BSM-1740(WIP)/wip_dashboard";
import { useTheme } from "../../context/ThemeContext";

export default function WipPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeView, setActiveView] = useState<WipView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`flex w-full h-full min-h-0 overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-slate-100"}`}>

      <WipSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile FAB */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        <WipDashboard activeSection={activeView} />
      </main>
    </div>
  );
}
