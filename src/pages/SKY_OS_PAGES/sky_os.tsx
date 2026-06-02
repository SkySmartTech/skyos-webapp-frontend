import SkyOsLanding from '../../components/SKY_OS/sky_os_landing';
import SkyOsDashboardChart from '../../components/SKY_OS/sky_os_dashboard_chart';
import AiSuggestion from '../../components/SKY_OS/ai_suggestion';
import { useTheme } from '../../context/ThemeContext';

function SkyOs() {
  const { theme } = useTheme();
  return (
    <div className={`w-full h-full overflow-y-auto transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950' : 'bg-slate-100'}`}>
      <SkyOsLanding />
      <SkyOsDashboardChart />
      <AiSuggestion />
    </div>
  );
}

export default SkyOs;
