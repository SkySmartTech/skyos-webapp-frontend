import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SkySidebar, { type SkyView } from '../../components/SKY_OS/sky_sidebar';
import SkyOsLanding       from '../../components/SKY_OS/sky_os_landing';
import SkyOsDashboardChart from '../../components/SKY_OS/sky_os_dashboard_chart';
import AiSuggestion       from '../../components/SKY_OS/ai_suggestion';
import SkyAccessSecurity  from '../../components/SKY_OS/sky_access_security';
import SkySettings        from '../../components/SKY_OS/sky_settings';
import type { ActiveModule } from '../../App';

const SELF_SCROLL: SkyView[] = ['security', 'settings'];

interface SkyOsProps {
  onNavigateModule: (module: ActiveModule, view?: string) => void;
}

function SkyOs({ onNavigateModule }: SkyOsProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [activeView,   setActiveView]   = useState<SkyView>('dashboard');
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const overflow = SELF_SCROLL.includes(activeView) ? 'overflow-hidden' : 'overflow-y-auto';

  return (
    <div className="flex w-full h-full overflow-hidden relative">

      <SkySidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onNavigateModule={onNavigateModule}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content */}
      <div className={`flex-1 h-full ${overflow} transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-slate-100'}`}>

        {/* Mobile hamburger — only shows on small screens */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg font-semibold text-sm transition-all ${
            dark
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30'
              : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30'
          }`}
        >
          <Menu size={17} /> Menu
        </button>

        {activeView === 'dashboard' && <SkyOsLanding />}
        {activeView === 'analytics'  && <SkyOsDashboardChart />}
        {activeView === 'ai'         && <AiSuggestion />}
        {activeView === 'security'   && <SkyAccessSecurity />}
        {activeView === 'settings'   && <SkySettings />}
      </div>
    </div>
  );
}

export default SkyOs;
