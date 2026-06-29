import { useState } from "react";
import { Menu } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import AndonSidebar, { type AndonView } from "../../components/DSCS1515A(Andon)/andon_sidebar";
import Andon from "../../components/DSCS1515A(Andon)/andon";

export default function AndonPage() {
  const [activeView, setActiveView] = useState<AndonView>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className={`flex w-full h-full min-h-0 overflow-hidden transition-colors duration-300 ${dark ? "bg-gray-950" : "bg-slate-100"}`}>
      <AndonSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-0 overflow-hidden relative">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3a456d] hover:bg-[#2e3b6a] text-[#d6de62] shadow-lg font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        <Andon activeView={activeView} />
      </main>
    </div>
  );
}
