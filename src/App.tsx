import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Topbar from './components/ui/layout/Topbar';
import ProductionTrackingPage from './pages/PRODUCTION_TRACKING_SYSTEM_PAGES/production_tracking_page';

type ActiveModule = 'home' | 'production' | 'dcsc' | 'wip' | 'custom';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [topbarVisible, setTopbarVisible] = useState(true);

  const handleModuleClick = (module: ActiveModule) => {
    setActiveModule(module);
    setTopbarVisible(false);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f0f2f5]">

      {/* Topbar — collapsible */}
      {topbarVisible ? (
        <div className="shrink-0 z-50 relative shadow-sm">
          <Topbar
            onProductionTrackingClick={() => handleModuleClick('production')}
            onDcscClick={() => handleModuleClick('dcsc')}
            onWipClick={() => handleModuleClick('wip')}
            onCustomClick={() => handleModuleClick('custom')}
            productionActive={activeModule === 'production'}
            showSidebar={true}
            onToggleSidebar={() => {}}
            onCloseTopbar={() => setTopbarVisible(false)}
          />
        </div>
      ) : (
        /* Thin strip to reveal the topbar again */
        <div className="shrink-0 z-50 bg-[#0f0f0f] border-b border-zinc-800">
          <button
            onClick={() => setTopbarVisible(true)}
            className="flex items-center gap-2 px-5 py-1.5 text-zinc-400 hover:text-white text-xs transition-colors hover:bg-zinc-800 w-full"
          >
            <ChevronDown size={14} />
            Show navigation
          </button>
        </div>
      )}

      {/* Main App Canvas */}
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
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
            Select a module from the top navigation
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
