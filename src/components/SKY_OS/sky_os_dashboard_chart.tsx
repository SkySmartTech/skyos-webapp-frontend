import { useTheme } from '../../context/ThemeContext';
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  Factory, Activity, TrendingUp, AlertTriangle, Clock, Target,
  Layers, ArrowDownToLine, ArrowUpFromLine, CheckCircle, XCircle,
} from 'lucide-react';

// ── Static demo data ─────────────────────────────────────────────────────────

const HOURLY_TARGET = 95;

const HOURLY_DATA = [
  { time: '07:30', Hour: 1, Success: 85,  Rework: 8,  Defect: 4  },
  { time: '08:30', Hour: 2, Success: 92,  Rework: 5,  Defect: 3  },
  { time: '09:30', Hour: 3, Success: 78,  Rework: 10, Defect: 6  },
  { time: '10:30', Hour: 4, Success: 95,  Rework: 4,  Defect: 2  },
  { time: '11:30', Hour: 5, Success: 88,  Rework: 7,  Defect: 4  },
  { time: '12:30', Hour: 6, Success: 72,  Rework: 12, Defect: 8  },
  { time: '13:30', Hour: 7, Success: 90,  Rework: 6,  Defect: 3  },
];

const CUMULATIVE_DATA = HOURLY_DATA.reduce<{ time: string; Achieved: number; Target: number }[]>(
  (acc, row, i) => {
    const prev = acc[i - 1] ?? { Achieved: 0, Target: 0 };
    acc.push({ time: row.time, Achieved: prev.Achieved + row.Success, Target: (i + 1) * HOURLY_TARGET });
    return acc;
  },
  [],
);

const QUALITY_PIE = [
  { name: 'Pass',   value: 600, fill: '#22c55e' },
  { name: 'Rework', value: 52,  fill: '#eab308' },
  { name: 'Defect', value: 30,  fill: '#ef4444' },
];

const TOP_DEFECTS = ['Needle Break', 'Skip Stitch', 'Uneven Seam'];

const WIP_BALANCE = [
  { name: 'Line A', Balance: 120, Upper: 150, Lower: 50, fill: '#22c55e', styleName: 'ST-001' },
  { name: 'Line B', Balance: 180, Upper: 150, Lower: 50, fill: '#ef4444', styleName: 'ST-002' },
  { name: 'Line C', Balance:  85, Upper: 150, Lower: 50, fill: '#22c55e', styleName: 'ST-003' },
  { name: 'Line D', Balance:  30, Upper: 150, Lower: 50, fill: '#eab308', styleName: 'ST-004' },
  { name: 'Line E', Balance: 140, Upper: 150, Lower: 50, fill: '#22c55e', styleName: 'ST-001' },
  { name: 'Line F', Balance:  95, Upper: 150, Lower: 50, fill: '#22c55e', styleName: 'ST-002' },
  { name: 'Line G', Balance: 175, Upper: 150, Lower: 50, fill: '#ef4444', styleName: 'ST-003' },
  { name: 'Line H', Balance:  45, Upper: 150, Lower: 50, fill: '#eab308', styleName: 'ST-001' },
];

const WIP_FLOW = [
  { name: 'Line A', In: 200, Out: 180 },
  { name: 'Line B', In: 150, Out: 170 },
  { name: 'Line C', In: 180, Out: 165 },
  { name: 'Line D', In: 120, Out: 150 },
  { name: 'Line E', In: 210, Out: 200 },
  { name: 'Line F', In: 160, Out: 155 },
  { name: 'Line G', In: 190, Out: 175 },
  { name: 'Line H', In: 130, Out: 145 },
];

// Derived stats
const TOTAL_SUCCESS = HOURLY_DATA.reduce((s, r) => s + r.Success, 0);
const TOTAL_REWORK  = HOURLY_DATA.reduce((s, r) => s + r.Rework,  0);
const TOTAL_DEFECT  = HOURLY_DATA.reduce((s, r) => s + r.Defect,  0);
const TOTAL_CHECKS  = TOTAL_SUCCESS + TOTAL_REWORK + TOTAL_DEFECT;
const PERF_EFI_NUM  = (TOTAL_SUCCESS / (HOURLY_DATA.length * HOURLY_TARGET)) * 100;
const PERF_EFI      = PERF_EFI_NUM.toFixed(1);
const DHU           = ((TOTAL_DEFECT / TOTAL_CHECKS) * 100).toFixed(2);
const TODAY_TARGET  = 950;
const UPTO_TARGET   = HOURLY_DATA.length * HOURLY_TARGET;
const WIP_STATS     = { active_lines: 8, total_lines: 10, today_in: 1340, today_out: 1175, today_entries: 48 };
const AVG_UPPER     = 150;
const AVG_LOWER     = 50;

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, iconCls, dark,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; iconCls: string; dark: boolean;
}) {
  const bg_   = dark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-100';
  const title = dark ? 'text-white'    : 'text-gray-900';
  const muted = dark ? 'text-gray-500' : 'text-gray-400';
  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${bg_}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconCls}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className={`text-[10px] uppercase tracking-widest font-bold ${muted}`}>{label}</p>
        <p className={`text-xl font-black leading-tight mt-0.5 ${title}`}>{value}</p>
        {sub && <p className={`text-[11px] mt-0.5 ${muted}`}>{sub}</p>}
      </div>
    </div>
  );
}

function SectionCard({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const bg_ = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  return (
    <div className={`border rounded-2xl p-4 md:p-6 mb-5 transition-colors duration-300 ${bg_}`}>
      {children}
    </div>
  );
}

function SectionHead({
  icon: Icon, title, sub, dark,
}: {
  icon: React.ElementType; title: string; sub: string; dark: boolean;
}) {
  const title_ = dark ? 'text-white'   : 'text-gray-900';
  const sub_   = dark ? 'text-gray-500' : 'text-gray-500';
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-orange-500" />
      </div>
      <div>
        <h2 className={`text-sm font-bold leading-tight ${title_}`}>{title}</h2>
        <p className={`text-xs ${sub_}`}>{sub}</p>
      </div>
    </div>
  );
}

function PlanBadge({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  const title = dark ? 'text-gray-200' : 'text-gray-800';
  const muted = dark ? 'text-gray-500' : 'text-gray-400';
  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-[10px] uppercase tracking-widest font-bold ${muted}`}>{label}</span>
      <span className={`text-sm font-semibold ${title}`}>{value}</span>
    </div>
  );
}

function ProgressBar({ value, max, color, dark }: { value: number; max: number; color: string; dark: boolean }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

function SkyOsDashboardChart() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // Theme tokens
  const bg      = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const titleCl = dark ? 'text-white'                     : 'text-gray-900';
  const subCl   = dark ? 'text-gray-500'                  : 'text-gray-500';
  const mutedCl = dark ? 'text-gray-600'                  : 'text-gray-400';
  const divider = dark ? 'border-gray-800'                : 'border-gray-200';
  const stripBg = dark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100';
  const rowHov  = dark ? 'hover:bg-gray-800/40'           : 'hover:bg-gray-50';
  const grid    = dark ? '#1f2937' : '#f3f4f6';
  const axis    = dark ? '#6b7280' : '#9ca3af';
  const ttStyle: React.CSSProperties = {
    backgroundColor: dark ? '#111827' : '#ffffff',
    border:          `1px solid ${dark ? '#374151' : '#e5e7eb'}`,
    borderRadius:    8,
    color:           dark ? '#f9fafb' : '#111827',
    fontSize:        12,
    padding:         '6px 10px',
  };

  return (
    <div className={`font-sans px-3 pb-24 pt-3 md:px-6 md:pb-6 transition-colors duration-300 ${bg}`}>

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className={`text-lg font-black ${titleCl}`}>Analytics &amp; Reports</h1>
          <p className={`text-xs ${subCl}`}>Full production, quality, and WIP system metrics · Demo data</p>
        </div>
        <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
          Demo Mode
        </span>
      </div>

      {/* ══════════════════════════════════════════
          PRODUCTION ANALYTICS
      ══════════════════════════════════════════ */}
      <SectionCard dark={dark}>
        <SectionHead
          icon={Factory}
          title="Production Tracking — Team A"
          sub="Nike · Style ST-001 · Gauge 28 · 10h shift"
          dark={dark}
        />

        {/* Day Plan Strip */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-3 p-3 rounded-xl mb-5 border ${stripBg}`}>
          <PlanBadge label="Team"         value="Team A"        dark={dark} />
          <PlanBadge label="Buyer"        value="Nike"          dark={dark} />
          <PlanBadge label="Style"        value="ST-001"        dark={dark} />
          <PlanBadge label="Gauge"        value="28"            dark={dark} />
          <PlanBadge label="SMV"          value="12.5 min"      dark={dark} />
          <PlanBadge label="Carder"       value="48 ops"        dark={dark} />
          <PlanBadge label="Daily Target" value="950 pcs"       dark={dark} />
          <PlanBadge label="Per Hour"     value={`${HOURLY_TARGET} pcs`} dark={dark} />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatCard dark={dark} icon={TrendingUp} label="Performance Efficiency"
            iconCls={PERF_EFI_NUM >= 85 ? 'bg-green-500/10 text-green-500' : PERF_EFI_NUM >= 70 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}
            value={`${PERF_EFI}%`}
            sub="Line Efficiency: 91.2%"
          />
          <StatCard dark={dark} icon={Target} label="Today's Output"
            iconCls="bg-blue-500/10 text-blue-500"
            value={`${TOTAL_SUCCESS} pcs`}
            sub={`Target: ${TODAY_TARGET} | Gap: ${TODAY_TARGET - TOTAL_SUCCESS}`}
          />
          <StatCard dark={dark} icon={AlertTriangle} label="DHU (Defects/100)"
            iconCls={parseFloat(DHU) > 5 ? 'bg-red-500/10 text-red-500' : parseFloat(DHU) > 2 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}
            value={`${DHU}%`}
            sub={`${TOTAL_DEFECT} defects / ${TOTAL_CHECKS} checks`}
          />
          <StatCard dark={dark} icon={Clock} label="Current Hour"
            iconCls="bg-purple-500/10 text-purple-500"
            value={`Hour ${HOURLY_DATA.length} / 10`}
            sub={`Hourly: ${HOURLY_DATA[HOURLY_DATA.length - 1].Success} pcs (target: ${HOURLY_TARGET})`}
          />
        </div>

        {/* Progress bars */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 rounded-xl border ${stripBg}`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${mutedCl}`}>Up-to-Now Progress</p>
            <div className="flex justify-between text-xs mb-1">
              <span className={subCl}>Achieved vs Expected</span>
              <span className={`font-semibold ${titleCl}`}>{TOTAL_SUCCESS} / {UPTO_TARGET} pcs</span>
            </div>
            <ProgressBar
              value={TOTAL_SUCCESS} max={UPTO_TARGET}
              color={PERF_EFI_NUM >= 85 ? 'bg-linear-to-r from-green-500 to-emerald-400' : PERF_EFI_NUM >= 70 ? 'bg-linear-to-r from-yellow-400 to-amber-400' : 'bg-linear-to-r from-red-500 to-red-400'}
              dark={dark}
            />
            <p className={`text-[11px] mt-1 ${mutedCl}`}>Balance: {UPTO_TARGET - TOTAL_SUCCESS} pcs behind</p>
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${mutedCl}`}>Full Day Target</p>
            <div className="flex justify-between text-xs mb-1">
              <span className={subCl}>Total achieved today</span>
              <span className={`font-semibold ${titleCl}`}>{TOTAL_SUCCESS} / {TODAY_TARGET} pcs</span>
            </div>
            <ProgressBar value={TOTAL_SUCCESS} max={TODAY_TARGET} color="bg-linear-to-r from-blue-500 to-blue-400" dark={dark} />
            <p className={`text-[11px] mt-1 ${mutedCl}`}>Remaining: {TODAY_TARGET - TOTAL_SUCCESS} pcs</p>
          </div>
        </div>

        {/* ── Hourly Output Chart (stacked bar) ── */}
        <div className={`border-t pt-5 mb-5 ${divider}`}>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <h3 className={`text-sm font-bold ${titleCl}`}>Hourly Production Output</h3>
              <p className={`text-xs ${subCl}`}>QC results per shift hour — stacked by quality outcome</p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-green-500"><span className="w-3 h-2 rounded-sm bg-green-500 inline-block" /> Pass</span>
              <span className="flex items-center gap-1.5 text-yellow-400"><span className="w-3 h-2 rounded-sm bg-yellow-400 inline-block" /> Rework</span>
              <span className="flex items-center gap-1.5 text-red-400"><span className="w-3 h-2 rounded-sm bg-red-500 inline-block" /> Defect</span>
              <span className="flex items-center gap-1.5 text-orange-500"><span className="w-5 border-t-2 border-dashed border-orange-500 inline-block" /> Target ({HOURLY_TARGET})</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={HOURLY_DATA} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="time" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
              <Tooltip contentStyle={ttStyle} labelFormatter={l => `Hour: ${l}`} />
              <ReferenceLine y={HOURLY_TARGET} stroke="#f97316" strokeDasharray="5 5" strokeWidth={1.5} />
              <Bar dataKey="Success" stackId="a" fill="#22c55e" name="Pass" />
              <Bar dataKey="Rework"  stackId="a" fill="#eab308" name="Rework" />
              <Bar dataKey="Defect"  stackId="a" fill="#ef4444" name="Defect" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Cumulative Area Chart ── */}
        <div className={`border-t pt-5 mb-5 ${divider}`}>
          <div className="mb-3">
            <h3 className={`text-sm font-bold ${titleCl}`}>Cumulative Achievement vs Target</h3>
            <p className={`text-xs ${subCl}`}>Running total of successful pieces vs expected cumulative target</p>
          </div>
          <ResponsiveContainer width="100%" height={208}>
            <AreaChart data={CUMULATIVE_DATA} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="time" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={ttStyle} labelFormatter={l => `Time: ${l}`} />
              <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: axis }}>{v}</span>} />
              <Area type="monotone" dataKey="Target"   stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" fill="#f97316" fillOpacity={0.08} dot={false} name="Target" />
              <Area type="monotone" dataKey="Achieved" stroke="#3b82f6" strokeWidth={2.5}                                    fill="#3b82f6" fillOpacity={0.15} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Achieved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Quality Breakdown + Top Defects ── */}
        <div className={`border-t pt-5 grid grid-cols-1 md:grid-cols-2 gap-6 ${divider}`}>

          {/* Quality Donut */}
          <div>
            <h3 className={`text-sm font-bold mb-1 ${titleCl}`}>Quality Breakdown</h3>
            <p className={`text-xs mb-3 ${subCl}`}>{TOTAL_CHECKS} total QC checks today</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={QUALITY_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3}>
                  {QUALITY_PIE.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={ttStyle} formatter={(v, name) => [`${v} pcs`, name]} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: axis }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Defects + quality bars */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className={`text-sm font-bold mb-2 ${titleCl}`}>Top Defect Types</h3>
              <div className="space-y-2">
                {TOP_DEFECTS.map((defect, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${stripBg}`}>
                    <span className={`text-[11px] font-black w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      i === 0 ? 'bg-red-500/20 text-red-400' : i === 1 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{i + 1}</span>
                    <span className={`text-sm flex-1 font-medium ${titleCl}`}>{defect}</span>
                    <XCircle size={13} className={i === 0 ? 'text-red-400' : 'text-orange-400'} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className={`text-sm font-bold mb-3 ${titleCl}`}>Quality Summary</h3>
              <div className="space-y-3">
                {[
                  { label: 'Pass',   count: TOTAL_SUCCESS, pct: (TOTAL_SUCCESS / TOTAL_CHECKS * 100).toFixed(1), color: 'bg-green-500'  },
                  { label: 'Rework', count: TOTAL_REWORK,  pct: (TOTAL_REWORK  / TOTAL_CHECKS * 100).toFixed(1), color: 'bg-yellow-400' },
                  { label: 'Defect', count: TOTAL_DEFECT,  pct: DHU,                                              color: 'bg-red-500'    },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={subCl}>{row.label}</span>
                      <span className={`font-semibold ${titleCl}`}>{row.count} pcs ({row.pct}%)</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className={`h-full rounded-full ${row.color} transition-all duration-700`} style={{ width: `${Math.min(100, parseFloat(row.pct))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Hourly Detail Table ── */}
        <div className={`border-t pt-5 mt-5 ${divider}`}>
          <h3 className={`text-sm font-bold mb-3 ${titleCl}`}>Hourly Detail Report</h3>
          <div className={`overflow-x-auto rounded-xl border ${divider}`}>
            <table className="w-full text-xs">
              <thead>
                <tr className={`${dark ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-50 text-gray-400'} uppercase tracking-widest`}>
                  <th className="text-left font-bold py-2.5 px-4">Hour</th>
                  <th className="text-right font-bold py-2.5 px-3">Target</th>
                  <th className="text-right font-bold py-2.5 px-3 text-green-500">Pass</th>
                  <th className="text-right font-bold py-2.5 px-3 text-yellow-400">Rework</th>
                  <th className="text-right font-bold py-2.5 px-3 text-red-400">Defect</th>
                  <th className="text-right font-bold py-2.5 px-3">Total</th>
                  <th className="text-left font-bold py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {HOURLY_DATA.map((row, i) => {
                  const onTarget = row.Success >= HOURLY_TARGET;
                  const total    = row.Success + row.Rework + row.Defect;
                  const isCurrent = i === HOURLY_DATA.length - 1;
                  return (
                    <tr key={i} className={`border-t ${divider} transition-colors ${rowHov} ${isCurrent ? (dark ? 'bg-orange-500/5' : 'bg-orange-50') : ''}`}>
                      <td className={`py-2.5 px-4 font-mono font-semibold ${isCurrent ? 'text-orange-500' : titleCl}`}>
                        {row.time}{isCurrent ? ' ●' : ''}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono ${subCl}`}>{HOURLY_TARGET}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-green-500 font-semibold">{row.Success}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-yellow-400">{row.Rework}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-400">{row.Defect}</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${titleCl}`}>{total}</td>
                      <td className="py-2.5 px-4">
                        {onTarget
                          ? <span className="flex items-center gap-1 text-[10px] text-green-500 font-semibold"><CheckCircle size={10} /> On target</span>
                          : <span className="flex items-center gap-1 text-[10px] text-orange-400 font-semibold"><AlertTriangle size={10} /> Below target</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={`border-t-2 font-bold ${dark ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}>
                  <td className={`py-2.5 px-4 ${titleCl}`}>Total ({HOURLY_DATA.length}h)</td>
                  <td className={`py-2.5 px-3 text-right font-mono ${subCl}`}>{HOURLY_DATA.length * HOURLY_TARGET}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-green-500">{TOTAL_SUCCESS}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-yellow-400">{TOTAL_REWORK}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-400">{TOTAL_DEFECT}</td>
                  <td className={`py-2.5 px-3 text-right font-mono ${titleCl}`}>{TOTAL_CHECKS}</td>
                  <td className="py-2.5 px-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </SectionCard>

      {/* ══════════════════════════════════════════
          WIP ANALYTICS
      ══════════════════════════════════════════ */}
      <SectionCard dark={dark}>
        <SectionHead
          icon={Activity}
          title="WIP / Super Market System"
          sub={`${WIP_STATS.active_lines} of ${WIP_STATS.total_lines} lines active · ${WIP_STATS.today_entries} entries today`}
          dark={dark}
        />

        {/* WIP KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <StatCard dark={dark} icon={Activity}        label="Active Lines"   iconCls="bg-blue-500/10 text-blue-500"     value={`${WIP_STATS.active_lines} / ${WIP_STATS.total_lines}`} sub="Currently active" />
          <StatCard dark={dark} icon={ArrowDownToLine} label="Today WIP In"   iconCls="bg-green-500/10 text-green-500"   value={WIP_STATS.today_in.toLocaleString()}                    sub="Total units received" />
          <StatCard dark={dark} icon={ArrowUpFromLine} label="Today WIP Out"  iconCls="bg-orange-500/10 text-orange-500" value={WIP_STATS.today_out.toLocaleString()}                   sub="Total units dispatched" />
          <StatCard dark={dark} icon={Layers}          label="Log Entries"    iconCls="bg-purple-500/10 text-purple-500" value={WIP_STATS.today_entries.toLocaleString()}               sub="Data log entries today" />
        </div>

        {/* WIP charts */}
        <div className={`border-t pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5 ${divider}`}>

          {/* Horizontal bar — current balances */}
          <div>
            <h3 className={`text-sm font-bold mb-1 ${titleCl}`}>Current WIP Balances by Line</h3>
            <p className={`text-xs mb-1 ${subCl}`}>Units on-hand per line · red = overflow · yellow = starving</p>
            <div className="flex gap-4 text-[11px] mb-3">
              <span className="flex items-center gap-1.5 text-red-400"><span className="w-5 border-t-2 border-dashed border-red-400 inline-block" /> Upper ({AVG_UPPER})</span>
              <span className="flex items-center gap-1.5 text-yellow-400"><span className="w-5 border-t-2 border-dashed border-yellow-400 inline-block" /> Lower ({AVG_LOWER})</span>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(200, WIP_BALANCE.length * 36 + 40)}>
              <BarChart data={WIP_BALANCE} layout="vertical" margin={{ top: 4, right: 40, bottom: 0, left: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" width={54} tick={{ fill: axis, fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const d = payload[0].payload as typeof WIP_BALANCE[0];
                    return (
                      <div style={ttStyle}>
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>{d.name} · {d.styleName}</p>
                        <p>Balance: <strong>{d.Balance}</strong> units</p>
                        <p style={{ color: '#ef4444' }}>↑ Upper: {d.Upper}</p>
                        <p style={{ color: '#eab308' }}>↓ Lower: {d.Lower}</p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={AVG_UPPER} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine x={AVG_LOWER} stroke="#eab308" strokeDasharray="4 4" strokeWidth={1.5} />
                <Bar dataKey="Balance" maxBarSize={24} radius={[0, 4, 4, 0]}>
                  {WIP_BALANCE.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Grouped bar — today's in / out */}
          <div>
            <h3 className={`text-sm font-bold mb-1 ${titleCl}`}>Today's WIP Flow per Line</h3>
            <p className={`text-xs mb-3 ${subCl}`}>In vs Out movements for active lines</p>
            <ResponsiveContainer width="100%" height={Math.max(200, WIP_FLOW.length * 36 + 40)}>
              <BarChart data={WIP_FLOW} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: axis, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: axis, fontSize: 11 }} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={ttStyle} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: axis }}>{v}</span>} />
                <Bar dataKey="In"  fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={20} name="WIP In" />
                <Bar dataKey="Out" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={20} name="WIP Out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── WIP Lines Status Table ── */}
        <div className={`border-t pt-5 ${divider}`}>
          <h3 className={`text-sm font-bold mb-3 ${titleCl}`}>WIP Lines Status Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`${dark ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-50 text-gray-400'} uppercase tracking-widest`}>
                  <th className="text-left font-bold py-2.5 px-4">Line</th>
                  <th className="text-left font-bold py-2.5 px-3">Style</th>
                  <th className="text-right font-bold py-2.5 px-3">Balance</th>
                  <th className="text-right font-bold py-2.5 px-3 text-red-400">Upper</th>
                  <th className="text-right font-bold py-2.5 px-3 text-yellow-400">Lower</th>
                  <th className="text-right font-bold py-2.5 px-3 text-green-500">Today In</th>
                  <th className="text-right font-bold py-2.5 px-3 text-orange-400">Today Out</th>
                  <th className="text-center font-bold py-2.5 px-4">Fill %</th>
                  <th className="text-left font-bold py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {WIP_BALANCE.map((line, i) => {
                  const flow    = WIP_FLOW[i];
                  const isOver  = line.Balance > line.Upper;
                  const isStar  = line.Balance < line.Lower;
                  const fillPct = Math.min(100, Math.round((line.Balance / line.Upper) * 100));
                  return (
                    <tr key={line.name} className={`border-t ${divider} transition-colors ${rowHov}`}>
                      <td className={`py-2.5 px-4 font-semibold ${titleCl}`}>{line.name}</td>
                      <td className={`py-2.5 px-3 ${subCl}`}>{line.styleName}</td>
                      <td className={`py-2.5 px-3 text-right font-mono font-bold ${titleCl}`}>{line.Balance}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-400">{line.Upper}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-yellow-400">{line.Lower}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-green-500">{flow?.In ?? '—'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-orange-400">{flow?.Out ?? '—'}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`flex-1 h-1.5 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                              className={`h-full rounded-full ${isOver ? 'bg-red-500' : isStar ? 'bg-yellow-400' : 'bg-green-500'}`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                          <span className={`text-[10px] font-mono w-7 text-right ${subCl}`}>{fillPct}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`text-[11px] font-semibold ${isOver ? 'text-red-400' : isStar ? 'text-yellow-400' : 'text-green-400'}`}>
                          {isOver ? 'Overflow' : isStar ? 'Starving' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className={`border-t-2 font-bold ${dark ? 'border-gray-700 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}>
                  <td className={`py-2.5 px-4 ${titleCl}`}>Totals</td>
                  <td className="py-2.5 px-3" />
                  <td className={`py-2.5 px-3 text-right font-mono ${titleCl}`}>{WIP_BALANCE.reduce((s, l) => s + l.Balance, 0)}</td>
                  <td className="py-2.5 px-3" /><td className="py-2.5 px-3" />
                  <td className="py-2.5 px-3 text-right font-mono text-green-500">{WIP_STATS.today_in}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-orange-400">{WIP_STATS.today_out}</td>
                  <td className="py-2.5 px-4" />
                  <td className="py-2.5 px-4">
                    <span className={`text-[11px] ${subCl}`}>
                      {WIP_BALANCE.filter(l => l.Balance > l.Upper).length} overflow ·{' '}
                      {WIP_BALANCE.filter(l => l.Balance < l.Lower).length} starving ·{' '}
                      {WIP_BALANCE.filter(l => l.Balance >= l.Lower && l.Balance <= l.Upper).length} normal
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}

export default SkyOsDashboardChart;
