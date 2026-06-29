import { useState, useEffect, useCallback } from 'react';
import { Menu } from 'lucide-react';
import type { DashboardData } from '../../components/SPM-1693/p_r_dashboard';
import PRDashboard from '../../components/SPM-1693/p_r_dashboard';
import PRSetting   from '../../components/SPM-1693/p_r_setting';
import PRUpdate    from '../../components/SPM-1693/p_r_update';
import Sidebar     from '../../components/COMMON/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import productionTrackingService, { type ProductionDashboardResponse } from '../../api/productionTrackingService';

// Realtime-ish refresh — no websocket layer on the backend yet, so the
// dashboard / active day-plan id are kept fresh via short polling.
const POLL_INTERVAL_MS = 5000;

function mapToDashboardData(resp: ProductionDashboardResponse): DashboardData | null {
  if (!resp.day_plan || !resp.stats) return null;
  const { day_plan: plan, stats } = resp;
  return {
    team: plan.team || '-',
    buyer: plan.buyer || '-',
    style: plan.style || '-',
    gauge: plan.gauge || '-',
    smv: plan.smv || '-',
    carder: String(plan.carder ?? '-'),
    whRh: `${plan.display_wh || '-'} | --`,
    perfEfi: stats.perf_efi,
    lineEfi: stats.line_efi,
    hourlyTarget: `${stats.hourly_target} / ${stats.hourly_achieve}`,
    todayTarget: `${stats.today_target} / ${stats.today_achieve}`,
    hourlyBalance: String(stats.hourly_balance),
    todayBalance: String(stats.today_balance),
    uptoNowTarget: `${stats.upto_now_target} / ${stats.upto_now_achieve}`,
    todayCheckQty: String(stats.today_check_qty),
    uptoNowBalance: String(stats.upto_now_balance),
    totalDefectQty: String(stats.total_defect_qty),
    dhu: stats.dhu,
    topDefects: stats.top_defects,
  };
}

function ProductionTrackingPage({ initialView = 'dashboard' }: { initialView?: 'dashboard' | 'settings' | 'update' }) {
  const [activeView,   setActiveView]   = useState<'dashboard' | 'settings' | 'update'>(initialView);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dashboardResp, setDashboardResp] = useState<ProductionDashboardResponse | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActiveView(initialView); }, [initialView]);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await productionTrackingService.getDashboard(selectedTeam ?? undefined);
      setDashboardResp(data);
      // First load — default the selector to whichever team the backend picked.
      setSelectedTeam(prev => prev ?? data.day_plan?.team ?? null);
    } catch {
      // keep showing the last known data — PRDashboard renders defaults if null
    }
  }, [selectedTeam]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
    const id = setInterval(fetchDashboard, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchDashboard]);

  const dashboardData = dashboardResp ? mapToDashboardData(dashboardResp) : null;
  const availableTeams = dashboardResp?.available_teams ?? [];

  return (
    <div className={`flex w-full h-full min-h-0 overflow-hidden transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-slate-100'}`}>

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-h-0 overflow-y-auto relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-5 left-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 font-semibold text-sm transition-all"
        >
          <Menu size={17} /> Menu
        </button>

        {activeView === 'dashboard' ? (
          <PRDashboard
            dashboardData={dashboardData}
            availableTeams={availableTeams}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
          />
        ) : activeView === 'settings' ? (
          <PRSetting onUploaded={() => { fetchDashboard(); setActiveView('dashboard'); }} />
        ) : (
          <PRUpdate onChecked={fetchDashboard} />
        )}
      </main>
    </div>
  );
}

export default ProductionTrackingPage;
