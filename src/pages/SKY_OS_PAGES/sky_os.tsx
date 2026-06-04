import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SkySidebar, { type SkyView } from '../../components/SKY_OS/sky_sidebar';
import SkyOsLanding      from '../../components/SKY_OS/sky_os_landing';
import SkyOsDashboardChart from '../../components/SKY_OS/sky_os_dashboard_chart';
import AiSuggestion      from '../../components/SKY_OS/ai_suggestion';
import SkyAccessSecurity from '../../components/SKY_OS/sky_access_security';
import SkySettings       from '../../components/SKY_OS/sky_settings';

// Views that manage their own scroll — use overflow-hidden on the container
const SELF_SCROLL: SkyView[] = ['security', 'settings'];

function SkyOs() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [activeView, setActiveView] = useState<SkyView>('dashboard');

  const overflow = SELF_SCROLL.includes(activeView) ? 'overflow-hidden' : 'overflow-y-auto';

  return (
    <div className="flex w-full h-full overflow-hidden">

      <SkySidebar activeView={activeView} setActiveView={setActiveView} />

      <div className={`flex-1 h-full ${overflow} transition-colors duration-300 ${
        dark ? 'bg-gray-950' : 'bg-slate-100'
      }`}>
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
