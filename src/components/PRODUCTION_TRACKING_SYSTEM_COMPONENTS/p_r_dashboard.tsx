import React from 'react';

// Define the shape of your Excel data
export interface DashboardData {
  team: string;
  buyer: string;
  style: string;
  gauge: string;
  smv: string;
  carder: string;
  whRh: string;
  perfEfi: string;
  lineEfi: string;
  hourlyTarget: string;
  todayTarget: string;
  hourlyBalance: string;
  todayBalance: string;
  uptoNowTarget: string;
  todayCheckQty: string;
  uptoNowBalance: string;
  totalDefectQty: string;
  dhu: string;
  topDefects: string[];
}

interface PRDashboardProps {
  dashboardData?: DashboardData | null;
}

function p_r_dashboard({ dashboardData }: PRDashboardProps) {
  // Fallback to empty/default data if none is uploaded yet
  const data: DashboardData = dashboardData || {
    team: "-", buyer: "-", style: "-", gauge: "-", smv: "-", carder: "-", whRh: "- | --",
    perfEfi: "0%", lineEfi: "0%", hourlyTarget: "0 / 0", todayTarget: "0 / 0",
    hourlyBalance: "0", todayBalance: "0", uptoNowTarget: "0 / 0", todayCheckQty: "0",
    uptoNowBalance: "0", totalDefectQty: "0", dhu: "0.0%", topDefects: ["-", "-", "-"]
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans">
      {/* Top Header Info */}
      <div className="flex flex-wrap items-center justify-between bg-white px-6 py-3 rounded shadow-sm mb-6 text-sm font-medium text-gray-700 border border-gray-100">
        <div><span className="text-gray-500 mr-2 text-xs">TEAM:</span> {data.team}</div>
        <div><span className="text-gray-500 mr-2 text-xs">BUYER:</span> {data.buyer}</div>
        <div><span className="text-gray-500 mr-2 text-xs">STYLE:</span> {data.style}</div>
        <div><span className="text-gray-500 mr-2 text-xs">GAUGE:</span> {data.gauge}</div>
        <div><span className="text-gray-500 mr-2 text-xs">SMV:</span> {data.smv}</div>
        <div><span className="text-gray-500 mr-2 text-xs">CARDER:</span> {data.carder}</div>
        <div><span className="text-gray-500 mr-2 text-xs">WH / RH:</span> {data.whRh}</div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-4">
        
        {/* Row 1 & 2 - Left Large Cards */}
        <div className="col-span-1 row-span-2 bg-white rounded shadow-sm p-6 flex flex-col justify-center items-center border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide mb-4 uppercase">Performance EFI</h2>
          <div className="text-7xl font-bold text-[#4a5568]">{data.perfEfi}</div>
        </div>

        <div className="col-span-1 row-span-2 bg-white rounded shadow-sm p-6 flex flex-col justify-center items-center border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide mb-4 uppercase">Line EFI</h2>
          <div className="text-7xl font-bold text-[#4a5568]">{data.lineEfi}</div>
        </div>

        {/* Row 1 - Right Small Cards */}
        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide uppercase">Hourly Target/Achieve</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.hourlyTarget}</div>
        </div>

        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide uppercase">Today Target/Achieve</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.todayTarget}</div>
        </div>

        {/* Row 2 - Right Small Cards */}
        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide uppercase">Hourly Balance</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.hourlyBalance}</div>
        </div>

        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide uppercase">Today Balance</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.todayBalance}</div>
        </div>

        {/* Row 3 - Small Cards & DHU Large Card */}
        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide text-center uppercase">Upto Now Target/Achieve</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.uptoNowTarget}</div>
        </div>

        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide text-center uppercase">Today Check Qty</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.todayCheckQty}</div>
        </div>

        <div className="col-span-1 row-span-2 bg-white rounded shadow-sm p-6 flex flex-col justify-center items-center border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide mb-4 self-start uppercase">DHU</h2>
          <div className="text-7xl font-bold text-[#4a5568]">{data.dhu}</div>
        </div>

        <div className="col-span-1 row-span-2 bg-white rounded shadow-sm p-6 flex flex-col items-center border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide mb-6 uppercase">Top 3 Defects</h2>
          <ul className="text-2xl font-semibold text-gray-700 space-y-4 text-left w-full pl-8">
            <li>1. {data.topDefects[0]}</li>
            <li>2. {data.topDefects[1]}</li>
            <li>3. {data.topDefects[2]}</li>
          </ul>
        </div>

        {/* Row 4 - Bottom Left Small Cards */}
        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide text-center uppercase">Upto Now Balance</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.uptoNowBalance}</div>
        </div>

        <div className="col-span-1 bg-white rounded shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <h2 className="text-gray-500 text-sm tracking-wide text-center uppercase">Total Defect Qty</h2>
          <div className="text-2xl font-semibold text-center text-gray-700 mt-4">{data.totalDefectQty}</div>
        </div>

      </div> {/* <-- This safely closes the Grid container */}
    </div> /* <-- This safely closes the Main Wrapper */
  );
}

export default p_r_dashboard;