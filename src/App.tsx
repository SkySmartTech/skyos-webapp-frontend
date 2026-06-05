import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Topbar from './components/COMMON/Topbar';
import SkyOs from './pages/SKY_OS_PAGES/sky_os';
import ProductionTrackingPage from './pages/SPM-1693/production_tracking_page';
import UserProfile from './pages/PMS-1682(Solar)/userprofile';
import SolarPage from './pages/PMS-1682(Solar)/solarpage';
import MFMPage from './pages/PMS-1682(Solar)/dashboard-mfm';
import MFIPage from './pages/PMS-1682(Solar)/dashboard-mfi';
import DetailsReport from './pages/PMS-1682(Solar)/reports/details-report';
import DetailsReportIntimo from './pages/PMS-1682(Solar)/reports/details-report-intimo';
import ThermalConsumptionReport from './pages/PMS-1682(Solar)/reports/thermal-consuption';

export type ActiveModule = 'home' | 'production' | 'dcsc' | 'wip' | 'custom' | 'userprofile';

function AppContent() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [topbarVisible, setTopbarVisible] = useState(true);
  const navigate = useNavigate();

  const handleNavigation = (module: ActiveModule) => {
    setActiveModule(module);
    if (module === 'userprofile') {
      navigate('/userprofile');
    } else if (module === 'production') {
      navigate('/production');
    } else if (module === 'dcsc') {
      navigate('/dcsc');
    } else if (module === 'wip') {
      navigate('/wip');
    } else if (module === 'custom') {
      navigate('/custom');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 dark:bg-gray-950 transition-colors duration-300">

      {topbarVisible ? (
        <div className="shrink-0 z-50 relative shadow-sm">
          <Topbar
            activeModule={activeModule}
            onDashboardClick={() => handleNavigation('home')}
            onProductionTrackingClick={() => handleNavigation('production')}
            onDcscClick={() => handleNavigation('dcsc')}
            onWipClick={() => handleNavigation('wip')}
            onCustomClick={() => handleNavigation('custom')}
            productionActive={activeModule === 'production'}
            showSidebar={true}
            onToggleSidebar={() => {}}
            onCloseTopbar={() => setTopbarVisible(false)}
          />
        </div>
      ) : (
        <div className="shrink-0 z-50 bg-gray-900 border-b border-gray-800">
          <button
            onClick={() => setTopbarVisible(true)}
            className="flex items-center gap-2 px-5 py-1.5 text-gray-400 hover:text-white text-xs transition-colors hover:bg-gray-800 w-full"
          >
            <ChevronDown size={14} />
            Show navigation
          </button>
        </div>
      )}

      <div className="overflow-hidden">
        <Routes>
          <Route path="/" element={<SkyOs />} />
          <Route path="/production" element={<ProductionTrackingPage />} />
          <Route path="/dcsc" element={<div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">DCSC1515A — Coming Soon</div>} />
          <Route path="/wip" element={<div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">WIP — Coming Soon</div>} />
          <Route path="/custom" element={<div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">Custom System — Coming Soon</div>} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/solar/dashboard" element={<SolarPage />} />
          <Route path="/solar/mfm" element={<MFMPage />} />
          <Route path="/solar/mfi" element={<MFIPage />} />
          <Route path="/solar/reports/details" element={<DetailsReport />} />
          <Route path="/solar/reports/intimo" element={<DetailsReportIntimo />} />
          <Route path="/solar/reports/thermal" element={<ThermalConsumptionReport />} />
        </Routes>
      </div>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
