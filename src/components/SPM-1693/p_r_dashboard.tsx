import { useTheme } from '../../context/ThemeContext';

export interface DashboardData {
  team: string; buyer: string; style: string; gauge: string; smv: string; carder: string;
  whRh: string; perfEfi: string; lineEfi: string; hourlyTarget: string; todayTarget: string;
  hourlyBalance: string; todayBalance: string; uptoNowTarget: string; todayCheckQty: string;
  uptoNowBalance: string; totalDefectQty: string; dhu: string; topDefects: string[];
}

interface PRDashboardProps { dashboardData?: DashboardData | null; }

function p_r_dashboard({ dashboardData }: PRDashboardProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const data: DashboardData = dashboardData ?? {
    team: '-', buyer: '-', style: '-', gauge: '-', smv: '-', carder: '-', whRh: '- | --',
    perfEfi: '0%', lineEfi: '0%', hourlyTarget: '0 / 0', todayTarget: '0 / 0',
    hourlyBalance: '0', todayBalance: '0', uptoNowTarget: '0 / 0', todayCheckQty: '0',
    uptoNowBalance: '0', totalDefectQty: '0', dhu: '0.0%', topDefects: ['-', '-', '-'],
  };

  const bg     = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card   = dark ? 'bg-gray-900 border-gray-800'    : 'bg-white border-gray-200';
  const label  = dark ? 'text-gray-500'                  : 'text-gray-500';
  const value  = dark ? 'text-gray-100'                  : 'text-gray-700';
  const bigVal = dark ? 'text-white'                     : 'text-gray-700';
  const header = dark ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700';
  const hourBg = dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100';

  return (
    <div className={`min-h-screen p-6 font-sans flex flex-col transition-colors duration-300 ${bg}`}>

      {/* Header Info */}
      <div className={`flex flex-wrap items-center justify-between px-6 py-3 rounded-xl shadow-sm mb-6 text-sm font-medium border transition-colors duration-300 ${header}`}>
        {[['TEAM', data.team], ['BUYER', data.buyer], ['STYLE', data.style],
          ['GAUGE', data.gauge], ['SMV', data.smv], ['CARDER', data.carder], ['WH / RH', data.whRh]
        ].map(([k, v]) => (
          <div key={k}>
            <span className={`mr-2 text-xs font-semibold ${label}`}>{k}:</span>
            <span>{v}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-4 gap-4 flex-1">

        {/* Perf EFI */}
        <div className={`col-span-1 row-span-2 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest mb-4 uppercase font-semibold ${label}`}>Performance EFI</h2>
          <div className={`text-7xl font-black ${bigVal}`}>{data.perfEfi}</div>
        </div>

        {/* Line EFI */}
        <div className={`col-span-1 row-span-2 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest mb-4 uppercase font-semibold ${label}`}>Line EFI</h2>
          <div className={`text-7xl font-black ${bigVal}`}>{data.lineEfi}</div>
        </div>

        {/* Hourly Target */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold ${label}`}>Hourly Target / Achieve</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.hourlyTarget}</div>
        </div>

        {/* Today Target */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold ${label}`}>Today Target / Achieve</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.todayTarget}</div>
        </div>

        {/* Hourly Balance */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold ${label}`}>Hourly Balance</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.hourlyBalance}</div>
        </div>

        {/* Today Balance */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold ${label}`}>Today Balance</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.todayBalance}</div>
        </div>

        {/* Upto Now Target */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold text-center ${label}`}>Upto Now Target / Achieve</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.uptoNowTarget}</div>
        </div>

        {/* Today Check Qty */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold text-center ${label}`}>Today Check Qty</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.todayCheckQty}</div>
        </div>

        {/* DHU */}
        <div className={`col-span-1 row-span-2 rounded-xl shadow-sm p-6 flex flex-col justify-center items-center border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest mb-4 self-start uppercase font-semibold ${label}`}>DHU</h2>
          <div className={`text-7xl font-black ${bigVal}`}>{data.dhu}</div>
        </div>

        {/* Top 3 Defects */}
        <div className={`col-span-1 row-span-2 rounded-xl shadow-sm p-6 flex flex-col items-center border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest mb-6 uppercase font-semibold ${label}`}>Top 3 Defects</h2>
          <ul className={`text-xl font-bold space-y-4 text-left w-full pl-4 ${value}`}>
            <li>1. {data.topDefects[0]}</li>
            <li>2. {data.topDefects[1]}</li>
            <li>3. {data.topDefects[2]}</li>
          </ul>
        </div>

        {/* Upto Now Balance */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold text-center ${label}`}>Upto Now Balance</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.uptoNowBalance}</div>
        </div>

        {/* Total Defect */}
        <div className={`col-span-1 rounded-xl shadow-sm p-6 flex flex-col justify-between border transition-colors duration-300 ${card}`}>
          <h2 className={`text-xs tracking-widest uppercase font-semibold text-center ${label}`}>Total Defect Qty</h2>
          <div className={`text-2xl font-bold text-center mt-4 ${value}`}>{data.totalDefectQty}</div>
        </div>

      </div>

      {/* Hourly Status */}
      <div className={`mt-4 rounded-xl shadow-sm p-6 border transition-colors duration-300 ${card}`}>
        <h2 className={`text-xs tracking-widest mb-4 uppercase font-semibold ${label}`}>Hourly Status (1 – 10)</h2>
        <div className="grid grid-cols-10 gap-3">
          {[1,2,3,4,5,6,7,8,9,10].map(h => (
            <div key={h} className={`flex flex-col items-center justify-center py-4 border rounded-lg transition-colors cursor-default ${hourBg}`}>
              <span className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${label}`}>Hour</span>
              <span className={`text-2xl font-black ${value}`}>{h}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default p_r_dashboard;
