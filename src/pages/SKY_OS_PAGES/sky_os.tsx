import SkyOsLanding from '../../components/SKY_OS_COMPONENTS/sky_os_landing';
import SkyOsDashboardChart from '../../components/SKY_OS_COMPONENTS/sky_os_dashboard_chart';

function SkyOs() {
  return (
    <div className="w-full h-full overflow-y-auto bg-gray-950">
      <SkyOsLanding />
      <SkyOsDashboardChart />
    </div>
  );
}

export default SkyOs;
