import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import type { DashboardData } from '../../components/SPM-1693/p_r_dashboard';
import PRDashboard from '../../components/SPM-1693/p_r_dashboard';
import PRSetting   from '../../components/SPM-1693/p_r_setting';
import PRUpdate    from '../../components/SPM-1693/p_r_update';
import Sidebar     from '../../components/COMMON/Sidebar';
import { useTheme } from '../../context/ThemeContext';

function ProductionTrackingPage({ initialView = 'dashboard' }: { initialView?: 'dashboard' | 'settings' | 'update' }) {
  const [activeView,   setActiveView]   = useState<'dashboard' | 'settings' | 'update'>(initialView);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  useEffect(() => { setActiveView(initialView); }, [initialView]);

  const handleDataUpload = (data: DashboardData) => {
    setDashboardData(data);
    setActiveView('dashboard');
  };

  const handleDataUpdate = (counts: { successCount: number; reworkCount: number; defectCount: number }) => {
    setDashboardData(prev => {
      const base: DashboardData = prev ?? {
        team: '-', buyer: '-', style: '-', gauge: '-', smv: '-', carder: '-', whRh: '- | --',
        perfEfi: '0%', lineEfi: '0%', hourlyTarget: '0 / 0', todayTarget: '0 / 0',
        hourlyBalance: '0', todayBalance: '0', uptoNowTarget: '0 / 0', todayCheckQty: '0',
        uptoNowBalance: '0', totalDefectQty: '0', dhu: '0.0%', topDefects: ['-', '-', '-'],
      };
      const total = counts.successCount + counts.reworkCount + counts.defectCount;
      const dhu = total > 0 ? ((counts.defectCount / total) * 100).toFixed(1) + '%' : '0.0%';
      return { ...base, todayCheckQty: String(total), totalDefectQty: String(counts.defectCount), dhu };
    });
  };

  return (
    <div className={`flex w-full h-full overflow-hidden transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-slate-100'}`}>

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        {activeView === 'dashboard' ? (
          <PRDashboard dashboardData={dashboardData} />
        ) : activeView === 'settings' ? (
          <PRSetting onDataUpload={handleDataUpload} />
        ) : (
          <PRUpdate onDataUpdate={handleDataUpdate} />
        )}
      </main>
    </div>
  );
}

export default ProductionTrackingPage;
