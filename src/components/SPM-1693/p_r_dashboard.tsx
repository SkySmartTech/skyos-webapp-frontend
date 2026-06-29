import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface DashboardData {
  team: string; buyer: string; style: string; gauge: string; smv: string; carder: string;
  whRh: string; perfEfi: string; lineEfi: string; hourlyTarget: string; todayTarget: string;
  hourlyBalance: string; todayBalance: string; uptoNowTarget: string; todayCheckQty: string;
  uptoNowBalance: string; totalDefectQty: string; dhu: string; topDefects: string[];
}

interface PRDashboardProps {
  dashboardData?: DashboardData | null;
  availableTeams?: string[];
  selectedTeam?: string | null;
  onTeamChange?: (team: string) => void;
}

function PRDashboard({ dashboardData, availableTeams = [], selectedTeam, onTeamChange }: PRDashboardProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const data: DashboardData = dashboardData ?? {
    team: '-', buyer: '-', style: '-', gauge: '-', smv: '-', carder: '-', whRh: '- | --',
    perfEfi: '0%', lineEfi: '0%', hourlyTarget: '0 / 0', todayTarget: '0 / 0',
    hourlyBalance: '0', todayBalance: '0', uptoNowTarget: '0 / 0', todayCheckQty: '0',
    uptoNowBalance: '0', totalDefectQty: '0', dhu: '0.0%', topDefects: ['-', '-', '-'],
  };

  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  const bg     = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card   = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const label  = dark ? 'text-gray-500'               : 'text-gray-500';
  const value  = dark ? 'text-gray-100'               : 'text-gray-700';
  const bigVal = dark ? 'text-white'                  : 'text-gray-700';
  const header = dark ? 'bg-gray-900 border-gray-800 text-gray-300' : 'bg-white border-gray-200 text-gray-700';
  const hourBg = dark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100';

  const smCard = `rounded-lg border p-2 flex flex-col justify-between transition-colors duration-300 ${card}`;
  const bigCard = `rounded-lg border p-2 flex flex-col justify-center items-center transition-colors duration-300 ${card}`;
  const teamSel = dark
    ? 'border-gray-700 bg-gray-800 text-gray-200 focus:ring-blue-500'
    : 'border-gray-300 bg-white text-gray-700 focus:ring-blue-400';

  return (
    <div className={`h-full p-2 font-sans flex flex-col gap-2 overflow-hidden transition-colors duration-300 ${bg}`}>

      {/* Title */}
      <div className={`shrink-0 grid grid-cols-3 items-center px-3 py-2.5 rounded-lg border transition-colors duration-300 ${card}`}>
        <div className="flex items-center gap-2">
          {availableTeams.length > 0 && (
            <>
              <label className={`text-[10px] font-semibold uppercase tracking-wide ${label}`}>Team</label>
              <select
                value={selectedTeam ?? ''}
                onChange={e => onTeamChange?.(e.target.value)}
                className={`appearance-none border rounded-lg py-1.5 px-3 text-sm font-semibold focus:outline-none focus:ring-1 cursor-pointer ${teamSel}`}
              >
                {availableTeams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </>
          )}
        </div>
        <h1 className={`text-xl font-extrabold tracking-widest uppercase text-center ${dark ? 'text-white' : 'text-gray-900'}`}>
          Production Tracking Dashboard
        </h1>
        <div className="flex justify-end">
          <span className={`text-2xl font-mono font-bold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{time}</span>
        </div>
      </div>

      {/* Header Info */}
      <div className={`shrink-0 flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors duration-300 ${header}`}>
        {[['TEAM', data.team], ['BUYER', data.buyer], ['STYLE', data.style],
          ['GAUGE', data.gauge], ['SMV', data.smv], ['CARDER', data.carder], ['WH / RH', data.whRh]
        ].map(([k, v]) => (
          <div key={k} className="flex items-center gap-1">
            <span className={`font-semibold ${label}`}>{k}:</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>

      {/* Main Grid — 4 cols × 4 rows, fills remaining height */}
      <div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-4 gap-2">

        {/* Perf EFI — row-span-2 */}
        <div className={`col-span-1 row-span-2 ${bigCard}`}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-1 ${label}`}>Performance EFI</p>
          <div className={`text-4xl md:text-5xl font-black ${bigVal}`}>{data.perfEfi}</div>
        </div>

        {/* Line EFI — row-span-2 */}
        <div className={`col-span-1 row-span-2 ${bigCard}`}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-1 ${label}`}>Line EFI</p>
          <div className={`text-4xl md:text-5xl font-black ${bigVal}`}>{data.lineEfi}</div>
        </div>

        {/* Hourly Target */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Hourly Target / Achieve</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.hourlyTarget}</div>
        </div>

        {/* Today Target */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Today Target / Achieve</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.todayTarget}</div>
        </div>

        {/* Hourly Balance */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Hourly Balance</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.hourlyBalance}</div>
        </div>

        {/* Today Balance */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Today Balance</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.todayBalance}</div>
        </div>

        {/* Upto Now Target */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Upto Now Target / Achieve</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.uptoNowTarget}</div>
        </div>

        {/* Today Check Qty */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Today Check Qty</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.todayCheckQty}</div>
        </div>

        {/* DHU — row-span-2 */}
        <div className={`col-span-1 row-span-2 ${bigCard}`}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-1 self-start ${label}`}>DHU</p>
          <div className={`text-4xl md:text-5xl font-black ${bigVal}`}>{data.dhu}</div>
        </div>

        {/* Top 3 Defects — row-span-2 */}
        <div className={`col-span-1 row-span-2 rounded-lg border p-2 flex flex-col transition-colors duration-300 ${card}`}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold mb-2 ${label}`}>Top 3 Defects</p>
          <ul className={`text-base font-bold space-y-1.5 pl-2 ${value}`}>
            <li>1. {data.topDefects[0]}</li>
            <li>2. {data.topDefects[1]}</li>
            <li>3. {data.topDefects[2]}</li>
          </ul>
        </div>

        {/* Upto Now Balance */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Upto Now Balance</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.uptoNowBalance}</div>
        </div>

        {/* Total Defect Qty */}
        <div className={smCard}>
          <p className={`text-[10px] tracking-widest uppercase font-semibold ${label}`}>Total Defect Qty</p>
          <div className={`text-xl font-bold text-center ${value}`}>{data.totalDefectQty}</div>
        </div>

      </div>

      {/* Hourly Status */}
      <div className={`shrink-0 rounded-lg border p-2 transition-colors duration-300 ${card}`}>
        <p className={`text-[10px] tracking-widest uppercase font-semibold mb-1.5 ${label}`}>Hourly Status (1 – 10)</p>
        <div className="grid grid-cols-10 gap-1.5">
          {[1,2,3,4,5,6,7,8,9,10].map(h => (
            <div key={h} className={`flex flex-col items-center justify-center py-1.5 border rounded-md transition-colors cursor-default ${hourBg}`}>
              <span className={`text-[9px] font-bold tracking-wider uppercase ${label}`}>Hour</span>
              <span className={`text-lg font-black ${value}`}>{h}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default PRDashboard;
