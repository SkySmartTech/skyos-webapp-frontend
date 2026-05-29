import React, { useState } from 'react';
import type { DashboardData } from '../../components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_dashboard';
import PRDashboard from '../../components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_dashboard';
import PRSetting from '../../components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_setting';
import PRUpdate from '../../components/PRODUCTION_TRACKING_SYSTEM_COMPONENTS/p_r_update';
import Sidebar from '../../components/ui/layout/Sidebar';

function ProductionTrackingPage() {
  const [activeView, setActiveView] = useState<'dashboard' | 'settings' | 'update'>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showSidebar] = useState(true);

  const handleDataUpload = (data: DashboardData) => {
    setDashboardData(data);
    setActiveView('dashboard');
  };

  const handleDataUpdate = (counts: { successCount: number; reworkCount: number; defectCount: number }) => {
    setDashboardData(prev => {
      const base: DashboardData = prev ?? {
        team: "-", buyer: "-", style: "-", gauge: "-", smv: "-", carder: "-", whRh: "- | --",
        perfEfi: "0%", lineEfi: "0%", hourlyTarget: "0 / 0", todayTarget: "0 / 0",
        hourlyBalance: "0", todayBalance: "0", uptoNowTarget: "0 / 0", todayCheckQty: "0",
        uptoNowBalance: "0", totalDefectQty: "0", dhu: "0.0%", topDefects: ["-", "-", "-"]
      };
      const totalChecked = counts.successCount + counts.reworkCount + counts.defectCount;
      const dhu = totalChecked > 0
        ? ((counts.defectCount / totalChecked) * 100).toFixed(1) + '%'
        : "0.0%";
      return {
        ...base,
        todayCheckQty: String(totalChecked),
        totalDefectQty: String(counts.defectCount),
        dhu,
      };
    });
  };

  return (
    <div className="flex w-full h-full overflow-hidden bg-[#f0f2f5]">

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${
          showSidebar ? 'w-[280px]' : 'w-0'
        }`}
      >
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      <main className="flex-1 overflow-y-auto">
        {activeView === 'dashboard' ? (
          <PRDashboard dashboardData={dashboardData} />
        ) : activeView === 'settings' ? (
          <PRSetting onDataUpload={handleDataUpload} />
        ) : activeView === 'update' ? (
          <PRUpdate onDataUpdate={handleDataUpdate} />
        ) : null}
      </main>

    </div>
  );
}

export default ProductionTrackingPage;
