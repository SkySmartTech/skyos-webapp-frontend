import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Topbar from './components/COMMON/Topbar';
import SkyOs from './pages/SKY_OS_PAGES/sky_os';
import ProductionTrackingPage from './pages/SPM-1693/production_tracking_page';
import SkyAuth, { useAuth } from './components/SKY_OS/sky_auth';
import SkyBackground from './components/SKY_OS/SkyBackground';
import SkySplash from './components/SKY_OS/sky_splash';
import SkyLogin from './components/SKY_OS/sky_login';

export type ActiveModule = 'home' | 'production' | 'dcsc' | 'wip' | 'custom';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [topbarVisible, setTopbarVisible] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  // ── Intro flow ──────────────────────────────────────────────────────────────
  // SkyBackground stays mounted the entire time so the cloud animation is
  // continuous through the splash → login transition.
  if (!isAuthenticated) {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#050505' }}>
        <SkyBackground />
        {!splashDone
          ? <SkySplash onComplete={() => setSplashDone(true)} />
          : <SkyLogin glass />
        }
      </div>
    );
  }

  // ── Main app ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100 dark:bg-gray-950 transition-colors duration-300">

      {topbarVisible ? (
        <div className="shrink-0 z-50 relative shadow-sm">
          <Topbar
            activeModule={activeModule}
            onDashboardClick={() => setActiveModule('home')}
            onProductionTrackingClick={() => setActiveModule('production')}
            onDcscClick={() => setActiveModule('dcsc')}
            onWipClick={() => setActiveModule('wip')}
            onCustomClick={() => setActiveModule('custom')}
            productionActive={activeModule === 'production'}
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar(prev => !prev)}
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

      <div className="flex flex-1 overflow-hidden">
        {activeModule === 'production' ? (
          <ProductionTrackingPage />
        ) : activeModule === 'dcsc' ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            DCSC1515A — Coming Soon
          </div>
        ) : activeModule === 'wip' ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            WIP — Coming Soon
          </div>
        ) : activeModule === 'custom' ? (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            Custom System — Coming Soon
          </div>
        ) : (
          <SkyOs />
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <SkyAuth>
      <AppContent />
    </SkyAuth>
  );
}
