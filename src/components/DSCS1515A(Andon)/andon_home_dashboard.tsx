import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type DepartmentKey = 'Technical' | 'Cutting' | 'MMT' | 'QA/MQA';

type DepartmentCard = {
  name: DepartmentKey;
  totalHours: number;
  color: string;
};

const departmentCards: DepartmentCard[] = [
  { name: 'Technical', totalHours: 22.47, color: '#ef4444' },
  { name: 'Cutting', totalHours: 86.57, color: '#16a34a' },
  { name: 'MMT', totalHours: 64.03, color: '#facc15' },
  { name: 'QA/MQA', totalHours: 53.9, color: '#1d4ed8' },
];

const dailyDowntime = [
  { day: '06-02', Technical: 20, Cutting: 75, MMT: 95, 'QA/MQA': 22 },
  { day: '06-03', Technical: 360, Cutting: 760, MMT: 750, 'QA/MQA': 320 },
  { day: '06-04', Technical: 410, Cutting: 1450, MMT: 1000, 'QA/MQA': 1220 },
  { day: '06-05', Technical: 350, Cutting: 2000, MMT: 1400, 'QA/MQA': 950 },
  { day: '06-06', Technical: 340, Cutting: 1060, MMT: 800, 'QA/MQA': 760 },
];

const totalDowntime = departmentCards.reduce((sum, item) => sum + item.totalHours, 0);

function formatValue(value: number) {
  return value.toFixed(2);
}

export default function AndonHomeDashboard() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg = dark ? 'bg-gray-950' : 'bg-slate-100';
  const pageText = dark ? 'text-white' : 'text-gray-900';
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const chartBg = dark ? 'bg-gray-900/60' : 'bg-white';
  const grid = dark ? '#374151' : '#e5e7eb';
  const axis = dark ? '#9ca3af' : '#6b7280';
  const tooltipBg = dark ? '#111827' : '#ffffff';
  const tooltipBorder = dark ? '#374151' : '#d1d5db';
  const tooltipText = dark ? '#f9fafb' : '#111827';

  const pieData = departmentCards.map(item => ({ name: item.name, value: item.totalHours, fill: item.color }));

  const chartTooltipStyle = {
    backgroundColor: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: 10,
    color: tooltipText,
    fontSize: 12,
    padding: '8px 10px',
  };

  return (
    <div className={`min-h-full w-full overflow-y-auto p-4 md:p-6 transition-colors duration-300 ${bg}`}>
      <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm ${card}`}>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${muted}`}>Andon Home Dashboard</p>
          <h1 className={`text-2xl font-black tracking-tight ${pageText}`}>Downtime Overview</h1>
        </div>
        <div className={`rounded-xl border px-4 py-2 text-sm font-semibold ${dark ? 'border-gray-800 bg-gray-950 text-gray-200' : 'border-gray-200 bg-slate-50 text-gray-700'}`}>
          Total downtime: {formatValue(totalDowntime)} hours
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1.1fr_1.35fr] gap-4">
        <section className={`overflow-hidden rounded-xl border shadow-sm ${card}`}>
          <div className="bg-cyan-600 px-5 py-4 text-white">
            <div className="text-4xl font-black tracking-tight">TOTAL :{formatValue(totalDowntime)}</div>
          </div>
          <div className="bg-cyan-700 px-5 py-3 text-center text-sm font-semibold text-white">
            Up to Now Downtime (Hours)
          </div>

          <div className="bg-emerald-600 px-5 py-5 text-white">
            <div className="space-y-3">
              {departmentCards.map(item => (
                <div key={item.name} className="flex items-center justify-between gap-4 text-lg font-medium">
                  <span>{item.name}</span>
                  <span className="font-semibold tabular-nums">{formatValue(item.totalHours)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white">
            Up to now Department Downtime (Hours)
          </div>
        </section>

        <section className={`overflow-hidden rounded-xl border shadow-sm ${card}`}>
          <div className="bg-rose-600 px-5 py-4 text-white">
            <h2 className="text-xl font-semibold">Department Wise Total Downtime</h2>
          </div>
          <div className="p-4">
            <div className="h-77.5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="54%"
                    innerRadius={60}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {pieData.map(entry => (
                      <Cell key={entry.name} fill={entry.fill} stroke={dark ? '#111827' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value) => {
                      const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                      return [`${numericValue.toFixed(2)} hours`, 'Downtime'] as [string, string];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={40}
                    formatter={(value) => <span style={{ color: axis, fontSize: 12, fontWeight: 600 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className={`overflow-hidden rounded-xl border shadow-sm ${card}`}>
          <div className="bg-emerald-600 px-5 py-4 text-white">
            <h2 className="text-xl font-semibold">Daily Total Downtime (Minutes)</h2>
          </div>
          <div className="p-4">
            <div className="h-77.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyDowntime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="day" tick={{ fill: axis, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: axis, fontSize: 12 }} tickLine={false} axisLine={false} width={42} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Bar dataKey="Technical" fill="#ef4444" />
                  <Bar dataKey="Cutting" fill="#16a34a" />
                  <Bar dataKey="MMT" fill="#facc15" />
                  <Bar dataKey="QA/MQA" fill="#1d4ed8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {departmentCards.map(item => (
          <section key={item.name} className={`overflow-hidden rounded-xl border shadow-sm ${card}`}>
            <div className="bg-emerald-600 px-5 py-4 text-white">
              <h2 className="text-lg font-semibold">Daily Downtime : {item.name}</h2>
            </div>
            <div className="p-4">
              <div className={`h-60 rounded-lg border p-2 ${chartBg} ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyDowntime.map(entry => ({ day: entry.day, value: entry[item.name] }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                    <XAxis dataKey="day" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(value) => {
                        const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                        return `${numericValue} min`;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Downtime (Min)"
                      stroke={item.color}
                      strokeWidth={3}
                      dot={{ r: 3, fill: item.color, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
