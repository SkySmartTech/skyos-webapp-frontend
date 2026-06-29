import { useState, useEffect } from 'react';

import Topbar from './components/COMMON/Topbar';
import Profile from './components/COMMON/Profile';
import SkyOs from './pages/SKY_OS_PAGES/sky_os';
import ProductionTrackingPage from './pages/SPM-1693/production_tracking_page';

import SkyAuth, { useAuth } from './components/SKY_OS/sky_auth';
import SkySplash from './components/SKY_OS/sky_splash';
import SkyLogin from './components/SKY_OS/sky_login';
import SolarPage from './pages/PMS-1682(Solar)/solarpage';
import AndonPage from './pages/DSCS1515A(Anadon)/andonpage';
import WipPage from './pages/BSM-1740(Wip)/wippage';
import WmsPage from './pages/WMS-1760A/wmspage';

export type ActiveModule = 'home' | 'production' | 'dcsc' | 'wip' | 'solar' | 'wms';
export type ProductionView = 'dashboard' | 'settings' | 'update';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  const [splashDone, setSplashDone] = useState(false);
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [productionView, setProductionView] = useState<ProductionView>('dashboard');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleModuleNavigate = (module: ActiveModule, view?: string) => {
    if (
      module === 'production' &&
      (view === 'dashboard' || view === 'settings' || view === 'update')
    ) {
      setProductionView(view);
    }
    setActiveModule(module);
    setShowProfile(false);
  };

  const handleWmsClick = () => { setActiveModule('wms'); setShowProfile(false); };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center">
        {!splashDone || isLoading ? (
          <SkySplash onComplete={() => setSplashDone(true)} />
        ) : (
          <SkyLogin />
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full w-full bg-slate-100 dark:bg-gray-950 transition-colors duration-300"
    >
      {/* Topbar — hidden in fullscreen */}
      {!isFullscreen && <div className="shrink-0 z-50 relative">
        <Topbar
          activeModule={activeModule}
          onDashboardClick={() => { setActiveModule('home'); setShowProfile(false); }}
          onProductionTrackingClick={() => { setActiveModule('production'); setShowProfile(false); }}
          onDcscClick={() => { setActiveModule('dcsc'); setShowProfile(false); }}
          onWipClick={() => { setActiveModule('wip'); setShowProfile(false); }}
          onCustomClick={() => { setActiveModule('solar'); setShowProfile(false); }}
          onWmsClick={handleWmsClick}
          productionActive={activeModule === 'production'}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(prev => !prev)}
          onProfileClick={() => setShowProfile(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>}

      {/* Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {showProfile ? (
          <Profile onBack={() => setShowProfile(false)} />
        ) : activeModule === 'production' ? (
          <ProductionTrackingPage initialView={productionView} />
        ) : activeModule === 'dcsc' ? (
          <AndonPage />
        ) : activeModule === 'wip' ? (
          <WipPage />
        ) : activeModule === 'solar' ? (
          <SolarPage />
        ) : activeModule === 'wms' ? (
          <WmsPage />
        ) : (
          <SkyOs onNavigateModule={handleModuleNavigate} />
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
