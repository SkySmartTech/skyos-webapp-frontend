import { useState } from 'react';
import PRDashboard, { type DashboardData } from './components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_dashboard';
import PRSetting from './components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_setting';
import Topbar from './components/ui/layout/Topbar';
import Sidebar from './components/ui/layout/Sidebar';
import { ChevronDown } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'settings'>('dashboard');
  const [productionActive, setProductionActive] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const handleProductionTrackingClick = () => {
    setProductionActive(true);
    setShowSidebar(true);
    setShowTopbar(false);
    setActiveView('dashboard');
  };

  const handleDataUpload = (data: DashboardData) => {
    setDashboardData(data);
    setActiveView('dashboard');
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#f0f2f5]">

      {/* Topbar — slides in/out vertically */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${showTopbar ? 'max-h-[200px]' : 'max-h-0'}`}>
        <Topbar
          onProductionTrackingClick={handleProductionTrackingClick}
          productionActive={productionActive}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(prev => !prev)}
          onCloseTopbar={() => setShowTopbar(false)}
        />
      </div>

      {/* Thin reveal strip — only visible when topbar is hidden */}
      {!showTopbar && (
        <button
          onClick={() => setShowTopbar(true)}
          className="w-full flex items-center justify-center gap-1 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-xs transition-all duration-200 border-b border-zinc-800 flex-shrink-0"
        >
          <ChevronDown size={14} />
          <span>Show navigation</span>
        </button>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar wrapper — width animates in/out */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
            productionActive && showSidebar ? 'w-[280px]' : 'w-0'
          }`}
        >
          {productionActive && (
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
          )}
        </div>

        <main className="flex-1 overflow-y-auto">
          {productionActive ? (
            activeView === 'dashboard' ? (
              <PRDashboard dashboardData={dashboardData} />
            ) : (
              <PRSetting onDataUpload={handleDataUpload} />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
              Select a module from the top navigation
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
