import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type Timeframe = 'daily' | 'monthly' | 'yearly';

// ── Multi-line efficiency data: all 6 systems across time ──────────────────
const efficiencyData: Record<Timeframe, Record<string, string | number>[]> = {
  daily: [
    { time:'08:00', Production:78, DCSC1515A:65, WIP032A:60, Solar:90, Custom1:40, Custom2:0  },
    { time:'09:00', Production:82, DCSC1515A:68, WIP032A:58, Solar:91, Custom1:42, Custom2:0  },
    { time:'10:00', Production:87, DCSC1515A:72, WIP032A:62, Solar:93, Custom1:45, Custom2:0  },
    { time:'11:00', Production:85, DCSC1515A:70, WIP032A:65, Solar:94, Custom1:44, Custom2:0  },
    { time:'12:00', Production:80, DCSC1515A:69, WIP032A:60, Solar:88, Custom1:40, Custom2:0  },
    { time:'13:00', Production:88, DCSC1515A:74, WIP032A:67, Solar:92, Custom1:46, Custom2:0  },
    { time:'14:00', Production:87, DCSC1515A:72, WIP032A:65, Solar:91, Custom1:45, Custom2:0  },
    { time:'15:00', Production:90, DCSC1515A:75, WIP032A:68, Solar:93, Custom1:47, Custom2:0  },
    { time:'16:00', Production:87, DCSC1515A:72, WIP032A:65, Solar:94, Custom1:45, Custom2:0  },
  ],
  monthly: [
    { time:'Week 1', Production:80, DCSC1515A:70, WIP032A:62, Solar:88, Custom1:38, Custom2:15 },
    { time:'Week 2', Production:83, DCSC1515A:72, WIP032A:64, Solar:90, Custom1:42, Custom2:18 },
    { time:'Week 3', Production:79, DCSC1515A:68, WIP032A:60, Solar:87, Custom1:35, Custom2:10 },
    { time:'Week 4', Production:87, DCSC1515A:75, WIP032A:67, Solar:92, Custom1:45, Custom2:20 },
  ],
  yearly: [
    { time:'Q1', Production:82, DCSC1515A:70, WIP032A:63, Solar:89, Custom1:40, Custom2:18 },
    { time:'Q2', Production:85, DCSC1515A:73, WIP032A:66, Solar:91, Custom1:43, Custom2:22 },
    { time:'Q3', Production:81, DCSC1515A:69, WIP032A:62, Solar:90, Custom1:38, Custom2:16 },
    { time:'Q4', Production:88, DCSC1515A:76, WIP032A:68, Solar:94, Custom1:46, Custom2:25 },
  ],
};

const systemLoadData: Record<Timeframe, { name: string; load: number }[]> = {
  daily:   [{name:'DCSC',load:85},{name:'WIP032A',load:60},{name:'Prod.Track',load:92},{name:'Solar',load:45},{name:'Custom 1',load:20},{name:'Custom 2',load:0}],
  monthly: [{name:'DCSC',load:78},{name:'WIP032A',load:65},{name:'Prod.Track',load:88},{name:'Solar',load:55},{name:'Custom 1',load:25},{name:'Custom 2',load:15}],
  yearly:  [{name:'DCSC',load:75},{name:'WIP032A',load:70},{name:'Prod.Track',load:85},{name:'Solar',load:60},{name:'Custom 1',load:30},{name:'Custom 2',load:20}],
};

const energyData: Record<Timeframe, { name: string; value: number }[]> = {
  daily:   [{name:'Solar',value:60},{name:'Grid',value:40}],
  monthly: [{name:'Solar',value:75},{name:'Grid',value:25}],
  yearly:  [{name:'Solar',value:68},{name:'Grid',value:32}],
};

// One colour per system — consistent across all charts
const SYS_LINES = [
  { key: 'Production', color: '#f97316', dash: ''      },
  { key: 'DCSC1515A',  color: '#3b82f6', dash: ''      },
  { key: 'WIP032A',    color: '#eab308', dash: ''      },
  { key: 'Solar',      color: '#22c55e', dash: ''      },
  { key: 'Custom1',    color: '#8b5cf6', dash: '4 4'   },
  { key: 'Custom2',    color: '#ef4444', dash: '4 4'   },
];

const BAR_COLORS = ['#3b82f6','#eab308','#f97316','#22c55e','#8b5cf6','#ef4444'];

function SkyOsDashboardChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg      = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const titleCl = dark ? 'text-white'                  : 'text-gray-900';
  const subCl   = dark ? 'text-gray-500'               : 'text-gray-500';
  const grid    = dark ? '#1f2937'                     : '#f3f4f6';
  const axis    = dark ? '#6b7280'                     : '#9ca3af';
  const ttBg    = dark ? '#111827'                     : '#ffffff';
  const ttBor   = dark ? '#374151'                     : '#e5e7eb';
  const ttColor = dark ? '#f9fafb'                     : '#111827';
  const tabBg   = dark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200';

  const tooltipStyle = {
    backgroundColor: ttBg,
    border: `1px solid ${ttBor}`,
    borderRadius: 8,
    color: ttColor,
    fontSize: 12,
    padding: '6px 10px',
  };

  const btnClass = (f: Timeframe) => {
    const base = 'px-4 py-1.5 rounded-lg font-semibold transition-all duration-200 text-xs ';
    return timeframe === f
      ? base + 'bg-orange-500 text-white shadow'
      : base + (dark
          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900');
  };

  return (
    <div className={`px-6 pb-6 pt-2 font-sans transition-colors duration-300 ${bg}`}>

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-base font-bold ${titleCl}`}>Analytics Engine</h2>
          <p className={`text-xs ${subCl}`}>System efficiency &amp; diagnostics</p>
        </div>
        <div className={`flex gap-1 p-1 rounded-lg border transition-colors ${tabBg}`}>
          {(['daily','monthly','yearly'] as Timeframe[]).map(f => (
            <button key={f} onClick={() => setTimeframe(f)} className={btnClass(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── MULTI-LINE EFFICIENCY CHART (full width) ── */}
        <div className={`lg:col-span-3 border rounded-xl p-4 transition-colors duration-300 ${card}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-sm font-bold ${titleCl}`}>System Efficiency Over Time (%)</h3>
              <p className={`text-xs ${subCl}`}>All 6 systems — real-time efficiency tracking</p>
            </div>
            {/* Colour legend pills */}
            <div className="hidden md:flex flex-wrap gap-2">
              {SYS_LINES.map(s => (
                <span key={s.key} className="flex items-center gap-1 text-[11px] font-medium" style={{ color: s.color }}>
                  <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: s.color }} />
                  {s.key}
                </span>
              ))}
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData[timeframe]} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="time" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" width={36} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v != null ? `${v}%` : '-']} />
                {SYS_LINES.map(s => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    strokeWidth={2}
                    strokeDasharray={s.dash}
                    dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── BAR CHART — system load (2/3 width) ── */}
        <div className={`lg:col-span-2 border rounded-xl p-4 transition-colors duration-300 ${card}`}>
          <h3 className={`text-sm font-bold mb-3 ${titleCl}`}>Average System Load (%)</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systemLoadData[timeframe]} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v != null ? `${v}%` : '-', 'Load']} />
                <Bar dataKey="load" radius={[4,4,0,0]} maxBarSize={48}>
                  {systemLoadData[timeframe].map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── PIE CHART — power source (1/3 width) ── */}
        <div className={`lg:col-span-1 border rounded-xl p-4 transition-colors duration-300 ${card}`}>
          <h3 className={`text-sm font-bold mb-3 ${titleCl}`}>Power Source</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyData[timeframe]}
                  dataKey="value"
                  cx="50%" cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                >
                  {energyData[timeframe].map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#f97316' : (dark ? '#374151' : '#d1d5db')} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v != null ? `${v}%` : '-']} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 11, color: axis }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SkyOsDashboardChart;
