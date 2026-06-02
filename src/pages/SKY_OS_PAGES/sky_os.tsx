import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SkySidebar, { type SkyView } from '../../components/SKY_OS/sky_sidebar';
import SkyOsLanding from '../../components/SKY_OS/sky_os_landing';
import SkyOsDashboardChart from '../../components/SKY_OS/sky_os_dashboard_chart';
import AiSuggestion from '../../components/SKY_OS/ai_suggestion';

function SkyOs() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [activeView, setActiveView] = useState<SkyView>('dashboard');

  return (
    <div className="flex w-full h-full overflow-hidden">

      {/* Sidebar */}
      <SkySidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main content */}
      <div className={`flex-1 h-full overflow-y-auto transition-colors duration-300 ${
        dark ? 'bg-gray-950' : 'bg-slate-100'
      }`}>
        {activeView === 'dashboard' && <SkyOsLanding />}
        {activeView === 'analytics'  && <SkyOsDashboardChart />}
        {activeView === 'ai'         && <AiSuggestion />}
      </div>

    </div>
  );
}

export default SkyOs;
