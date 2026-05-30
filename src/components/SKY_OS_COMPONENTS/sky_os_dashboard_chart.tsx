import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type Timeframe = 'daily' | 'monthly' | 'yearly';

const productionData: Record<Timeframe, { time: string; output: number; target: number }[]> = {
  daily:   [{ time:'08:00',output:120,target:150},{time:'10:00',output:180,target:150},{time:'12:00',output:210,target:200},{time:'14:00',output:190,target:200},{time:'16:00',output:250,target:250}],
  monthly: [{ time:'Week 1',output:4200,target:4000},{time:'Week 2',output:4500,target:4000},{time:'Week 3',output:3900,target:4000},{time:'Week 4',output:4800,target:4500}],
  yearly:  [{ time:'Q1',output:52000,target:50000},{time:'Q2',output:54000,target:50000},{time:'Q3',output:51000,target:55000},{time:'Q4',output:61000,target:60000}],
};

const systemLoadData: Record<Timeframe, { name: string; load: number }[]> = {
  daily:   [{name:'DSCS1515A',load:85},{name:'WIP032A',load:60},{name:'Prod. Track',load:92},{name:'Solar',load:45},{name:'Custom 1',load:20},{name:'Custom 2',load:10}],
  monthly: [{name:'DSCS1515A',load:78},{name:'WIP032A',load:65},{name:'Prod. Track',load:88},{name:'Solar',load:55},{name:'Custom 1',load:25},{name:'Custom 2',load:15}],
  yearly:  [{name:'DSCS1515A',load:75},{name:'WIP032A',load:70},{name:'Prod. Track',load:85},{name:'Solar',load:60},{name:'Custom 1',load:30},{name:'Custom 2',load:20}],
};

const energyData: Record<Timeframe, { name: string; value: number }[]> = {
  daily:   [{name:'Solar Power',value:60},{name:'Grid Power',value:40}],
  monthly: [{name:'Solar Power',value:75},{name:'Grid Power',value:25}],
  yearly:  [{name:'Solar Power',value:68},{name:'Grid Power',value:32}],
};

const COLORS = ['#f97316','#3b82f6','#10b981','#f59e0b','#8b5cf6','#64748b'];

function SkyOsDashboardChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg       = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card     = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const titleCl  = dark ? 'text-white'                  : 'text-gray-900';
  const subCl    = dark ? 'text-gray-400'               : 'text-gray-500';
  const grid     = dark ? '#374151'                      : '#e5e7eb';
  const axisClr  = dark ? '#9ca3af'                      : '#6b7280';
  const tooltipBg = dark ? '#1f2937' : '#ffffff';
  const tooltipBorder = dark ? '#374151' : '#e5e7eb';
  const tabBg    = dark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200';

  const btnClass = (f: Timeframe) => {
    const base = 'px-5 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ';
    return timeframe === f
      ? base + 'bg-orange-500 text-white shadow'
      : base + (dark
          ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          : 'bg-white text-gray-500 hover:bg-gray-200 hover:text-gray-900 border border-gray-200');
  };

  return (
    <div className={`p-8 font-sans transition-colors duration-300 ${bg}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${titleCl}`}>Analytics Engine</h1>
          <p className={subCl}>Interactive Data Visualization &amp; System Diagnostics</p>
        </div>
        <div className={`flex gap-2 p-2 rounded-xl border transition-colors ${tabBg}`}>
          {(['daily','monthly','yearly'] as Timeframe[]).map(f => (
            <button key={f} onClick={() => setTimeframe(f)} className={btnClass(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className={`border rounded-xl p-6 lg:col-span-2 transition-colors duration-300 ${card}`}>
          <h2 className={`text-lg font-bold mb-6 ${titleCl}`}>Production Output vs Target</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productionData[timeframe]}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="time" tick={{ fill: axisClr, fontSize: 12 }} />
                <YAxis tick={{ fill: axisClr, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: dark ? '#fff' : '#111' }} />
                <Legend />
                <Line type="monotone" dataKey="output" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316' }} />
                <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className={`border rounded-xl p-6 transition-colors duration-300 ${card}`}>
          <h2 className={`text-lg font-bold mb-6 ${titleCl}`}>Average System Load (%)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={systemLoadData[timeframe]}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                <XAxis dataKey="name" tick={{ fill: axisClr, fontSize: 11 }} />
                <YAxis tick={{ fill: axisClr, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: dark ? '#fff' : '#111' }} />
                <Bar dataKey="load" radius={[4,4,0,0]}>
                  {systemLoadData[timeframe].map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className={`border rounded-xl p-6 transition-colors duration-300 ${card}`}>
          <h2 className={`text-lg font-bold mb-6 ${titleCl}`}>Power Source Distribution</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={energyData[timeframe]} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={110}>
                  {energyData[timeframe].map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#f97316' : (dark ? '#374151' : '#d1d5db')} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, color: dark ? '#fff' : '#111' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SkyOsDashboardChart;
