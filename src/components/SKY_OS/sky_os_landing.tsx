import { useState, useEffect } from 'react';
import {
  Activity, Cpu, Factory, Zap, TrendingUp, Users, Shield, Clock,
  CheckCircle, AlertTriangle, XCircle, Globe, Server, BarChart3, ArrowUpRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

type StatusKey   = 'Active' | 'Live' | 'Optimal' | 'Monitoring' | 'Standby' | 'Offline';
type KpiColor    = 'blue' | 'purple' | 'green' | 'orange';
type ActivityType = 'success' | 'warning' | 'error' | 'info';

const STATUS_DARK = {
  Active:     { badge: 'bg-green-500/15 text-green-400 border-green-500/30',   dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Live:       { badge: 'bg-green-500/15 text-green-400 border-green-500/30',   dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Optimal:    { badge: 'bg-green-500/15 text-green-400 border-green-500/30',   dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Monitoring: { badge: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-orange-400' },
  Standby:    { badge: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-orange-400' },
  Offline:    { badge: 'bg-red-500/15 text-red-400 border-red-500/30',         dot: 'bg-red-500',    bar: 'from-red-600 to-red-400' },
};
const STATUS_LIGHT = {
  Active:     { badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400' },
  Live:       { badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400' },
  Optimal:    { badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400' },
  Monitoring: { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', bar: 'from-yellow-500 to-orange-400' },
  Standby:    { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', bar: 'from-yellow-500 to-orange-400' },
  Offline:    { badge: 'bg-red-50 text-red-600 border-red-200',         dot: 'bg-red-500',    bar: 'from-red-500 to-red-400' },
};

const KPI_DARK: Record<KpiColor, string> = {
  blue:   'bg-blue-600/10 border-blue-500/20 text-blue-400',
  purple: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
  green:  'bg-green-600/10 border-green-500/20 text-green-400',
  orange: 'bg-orange-600/10 border-orange-500/20 text-orange-400',
};
const KPI_LIGHT: Record<KpiColor, string> = {
  blue:   'bg-blue-50 border-blue-200 text-blue-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  green:  'bg-green-50 border-green-200 text-green-600',
  orange: 'bg-orange-50 border-orange-200 text-orange-600',
};

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === 'success') return <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />;
  if (type === 'error')   return <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />;
  return <Activity size={14} className="text-orange-500 shrink-0 mt-0.5" />;
}

const kpis = [
  { label: 'Active Systems',     value: '6',    unit: '/ 6',   icon: Server,     color: 'blue'   as KpiColor, trend: 'All Online' },
  { label: 'Production Lines',   value: '18',   unit: 'lines', icon: Factory,    color: 'purple' as KpiColor, trend: '+3 today'   },
  { label: 'Overall Efficiency', value: '87.4', unit: '%',     icon: TrendingUp, color: 'green'  as KpiColor, trend: '+5.2%'      },
  { label: 'System Uptime',      value: '99.8', unit: '%',     icon: Shield,     color: 'orange' as KpiColor, trend: 'Stable'     },
];

const systems = [
  { id: 1, name: 'DCSC1515A',           status: 'Active'     as StatusKey, load: 85, type: 'Industrial Control', Icon: Cpu,      events: 142 },
  { id: 2, name: 'WIP032A',             status: 'Monitoring' as StatusKey, load: 60, type: 'WIP Tracking',       Icon: Activity, events: 87  },
  { id: 3, name: 'Production Tracking', status: 'Live'       as StatusKey, load: 92, type: 'Line Analytics',     Icon: Factory,  events: 318 },
  { id: 4, name: 'Solar System',        status: 'Optimal'    as StatusKey, load: 45, type: 'Energy Management',  Icon: Zap,      events: 56  },
  { id: 5, name: 'Custom System 1',     status: 'Standby'    as StatusKey, load: 20, type: 'Auxiliary Module',   Icon: Globe,    events: 12  },
  { id: 6, name: 'Custom System 2',     status: 'Offline'    as StatusKey, load: 0,  type: 'Backup Controller',  Icon: Server,   events: 0   },
];

const activityFeed: { time: string; msg: string; type: ActivityType }[] = [
  { time: '14:32', msg: 'Production Tracking: Line 18 efficiency hit 94%',  type: 'success' },
  { time: '14:28', msg: 'DCSC1515A: Shift changeover completed',             type: 'info'    },
  { time: '14:15', msg: 'WIP032A: Rework alert on Team 07',                 type: 'warning' },
  { time: '13:58', msg: 'Solar System: Switching to grid backup power',      type: 'warning' },
  { time: '13:40', msg: 'Custom System 2: Connection lost',                 type: 'error'   },
  { time: '13:22', msg: 'Production Tracking: Day target achieved early',    type: 'success' },
  { time: '12:55', msg: 'DCSC1515A: Calibration cycle complete',            type: 'info'    },
];

const summary = [
  { label: 'Total Output',      value: '12,480 pcs', color: 'text-blue-500'   },
  { label: 'Quality Pass Rate', value: '96.3%',      color: 'text-green-500'  },
  { label: 'Defects Logged',    value: '47',         color: 'text-red-500'    },
  { label: 'Active Operators',  value: '184',        color: 'text-orange-500' },
];

function SkyOsLanding() {
  const [now, setNow] = useState(new Date());
  const { theme } = useTheme();
  const dark = theme === 'dark';

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const onlineCount = systems.filter(s => ['Active','Live','Optimal'].includes(s.status)).length;

  const bg      = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'    : 'bg-white border-gray-200';
  const heroCard = dark ? 'bg-gradient-to-br from-gray-900 via-[#0d1117] to-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const cardHover = dark ? 'hover:border-gray-600'        : 'hover:border-orange-300';
  const textPri = dark ? 'text-white'                     : 'text-gray-900';
  const textSec = dark ? 'text-gray-400'                  : 'text-gray-500';
  const textMut = dark ? 'text-gray-600'                  : 'text-gray-400';
  const iconBg  = dark ? 'bg-gray-800 border-gray-700'   : 'bg-gray-100 border-gray-200';
  const badge   = dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500';
  const divider = dark ? 'border-gray-800'                : 'border-gray-200';
  const rowHover = dark ? 'hover:bg-gray-800/40'          : 'hover:bg-gray-50';
  const clockBg = dark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-100 border-gray-200';

  const STATUS = dark ? STATUS_DARK : STATUS_LIGHT;
  const KPI    = dark ? KPI_DARK    : KPI_LIGHT;

  return (
    <div className={`font-sans p-8 transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <div className={`relative mb-10 rounded-2xl overflow-hidden border p-8 shadow-xl transition-colors duration-300 ${heroCard}`}>
        {dark && <>
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </>}

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-500/30" />
              <span className="text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">Sky Technology (Pvt) Ltd</span>
            </div>
            <h1 className={`text-5xl font-black tracking-tight leading-tight mb-2 ${textPri}`}>
              Sky<span className="text-orange-500">OS</span>
            </h1>
            <p className={`text-lg font-light ${textSec}`}>Smart Factory Operating System — Command Center</p>
            <p className={`text-sm mt-1 ${textMut}`}>Engineering Intelligent Industrial Futures</p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className={`flex items-center gap-3 border rounded-xl px-5 py-3 transition-colors ${clockBg}`}>
              <Clock size={16} className="text-orange-500" />
              <span className={`text-2xl font-mono font-bold tracking-widest ${textPri}`}>
                {now.toLocaleTimeString()}
              </span>
            </div>
            <p className={`text-xs ${textMut}`}>
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 text-xs text-green-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-xl border p-5 transition-colors duration-300 ${KPI[k.color]}`}>
            <div className="flex items-start justify-between mb-3">
              <k.icon size={20} />
              <span className="text-xs font-semibold flex items-center gap-1">
                <ArrowUpRight size={12} />{k.trend}
              </span>
            </div>
            <div className={`text-3xl font-black ${textPri}`}>
              {k.value}<span className={`text-sm font-normal ml-1 ${textSec}`}>{k.unit}</span>
            </div>
            <div className={`text-[11px] mt-1 uppercase tracking-widest font-semibold ${textSec}`}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── SYSTEMS + ACTIVITY ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Systems */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-base font-bold tracking-wide ${textPri}`}>Active Systems</h2>
            <span className={`text-xs border px-3 py-1 rounded-full ${badge}`}>
              {onlineCount} / {systems.length} Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map(sys => {
              const sc = STATUS[sys.status];
              return (
                <div key={sys.id} className={`group border rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm ${card} ${cardHover}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${iconBg}`}>
                        <sys.Icon size={17} className={textSec} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm leading-tight ${textPri}`}>{sys.name}</p>
                        <p className={`text-[11px] ${textMut}`}>{sys.type}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sys.status}
                    </span>
                  </div>

                  <div>
                    <div className={`flex justify-between text-xs mb-1.5 ${textSec}`}>
                      <span>System Load</span>
                      <span className={`font-semibold ${textPri}`}>{sys.load}%</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className={`h-full rounded-full bg-linear-to-r ${sc.bar} transition-all duration-700`} style={{ width: `${sys.load}%` }} />
                    </div>
                  </div>

                  <div className={`mt-3 pt-3 border-t flex items-center justify-between ${divider}`}>
                    <span className={`text-[11px] ${textMut}`}>Events today</span>
                    <span className={`text-xs font-bold ${textPri}`}>{sys.events.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-bold tracking-wide ${textPri}`}>Live Activity</h2>
            <span className="text-[10px] tracking-widest text-green-500 uppercase font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              ● Live
            </span>
          </div>

          <div className={`border rounded-xl overflow-hidden flex-1 transition-colors duration-300 ${card}`}>
            {activityFeed.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < activityFeed.length - 1 ? `border-b ${divider}` : ''} ${rowHover} transition-colors`}>
                <ActivityIcon type={item.type} />
                <div className="min-w-0">
                  <p className={`text-xs leading-relaxed ${textSec}`}>{item.msg}</p>
                  <p className={`text-[10px] mt-0.5 font-mono ${textMut}`}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className={`border rounded-xl p-4 transition-colors duration-300 ${card}`}>
            <p className={`text-[11px] uppercase tracking-widest mb-4 font-bold ${textMut}`}>Today's Summary</p>
            <div className="space-y-3">
              {summary.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className={`text-xs ${textSec}`}>{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className={`mt-8 pt-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs transition-colors duration-300 ${divider} ${textMut}`}>
        <span>SkyOS v2.0 — Sky Technology (Pvt) Ltd</span>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Normal</span>
          <span className="flex items-center gap-1"><Users size={11} /> 184 Operators Online</span>
          <span className="flex items-center gap-1"><BarChart3 size={11} /> Real-time Data</span>
        </div>
      </div>
    </div>
  );
}

export default SkyOsLanding;
