import { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Factory,
  Zap,
  TrendingUp,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Globe,
  Server,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

type StatusKey = 'Active' | 'Live' | 'Optimal' | 'Monitoring' | 'Standby' | 'Offline';
type KpiColor = 'blue' | 'purple' | 'green' | 'orange';
type ActivityType = 'success' | 'warning' | 'error' | 'info';

const STATUS_STYLE: Record<StatusKey, { badge: string; dot: string; bar: string }> = {
  Active:     { badge: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Live:       { badge: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Optimal:    { badge: 'bg-green-500/15 text-green-400 border-green-500/30',  dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400' },
  Monitoring: { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-orange-400' },
  Standby:    { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-orange-400' },
  Offline:    { badge: 'bg-red-500/15 text-red-400 border-red-500/30',        dot: 'bg-red-500',    bar: 'from-red-600 to-red-400' },
};

const KPI_COLOR: Record<KpiColor, string> = {
  blue:   'bg-gradient-to-br from-blue-600/20 to-blue-500/5 border-blue-500/20 text-blue-400',
  purple: 'bg-gradient-to-br from-purple-600/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  green:  'bg-gradient-to-br from-green-600/20 to-green-500/5 border-green-500/20 text-green-400',
  orange: 'bg-gradient-to-br from-orange-600/20 to-orange-500/5 border-orange-500/20 text-orange-400',
};

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === 'success') return <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />;
  if (type === 'error')   return <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />;
  return <Activity size={14} className="text-blue-400 shrink-0 mt-0.5" />;
}

const kpis = [
  { label: 'Active Systems',     value: '6',    unit: '/ 6',   icon: Server,    color: 'blue'   as KpiColor, trend: 'All Online' },
  { label: 'Production Lines',   value: '18',   unit: 'lines', icon: Factory,   color: 'purple' as KpiColor, trend: '+3 today'  },
  { label: 'Overall Efficiency', value: '87.4', unit: '%',     icon: TrendingUp, color: 'green' as KpiColor, trend: '+5.2%'     },
  { label: 'System Uptime',      value: '99.8', unit: '%',     icon: Shield,    color: 'orange' as KpiColor, trend: 'Stable'    },
];

const systems = [
  { id: 1, name: 'DCSC1515A',           status: 'Active'     as StatusKey, load: 85, type: 'Industrial Control',  Icon: Cpu,     events: 142 },
  { id: 2, name: 'WIP032A',             status: 'Monitoring' as StatusKey, load: 60, type: 'WIP Tracking',        Icon: Activity,events: 87  },
  { id: 3, name: 'Production Tracking', status: 'Live'       as StatusKey, load: 92, type: 'Line Analytics',      Icon: Factory, events: 318 },
  { id: 4, name: 'Solar System',        status: 'Optimal'    as StatusKey, load: 45, type: 'Energy Management',   Icon: Zap,     events: 56  },
  { id: 5, name: 'Custom System 1',     status: 'Standby'    as StatusKey, load: 20, type: 'Auxiliary Module',    Icon: Globe,   events: 12  },
  { id: 6, name: 'Custom System 2',     status: 'Offline'    as StatusKey, load: 0,  type: 'Backup Controller',   Icon: Server,  events: 0   },
];

const activityFeed: { time: string; msg: string; type: ActivityType }[] = [
  { time: '14:32', msg: 'Production Tracking: Line 18 efficiency hit 94%',    type: 'success' },
  { time: '14:28', msg: 'DCSC1515A: Shift changeover completed',               type: 'info'    },
  { time: '14:15', msg: 'WIP032A: Rework alert on Team 07',                   type: 'warning' },
  { time: '13:58', msg: 'Solar System: Switching to grid backup power',        type: 'warning' },
  { time: '13:40', msg: 'Custom System 2: Connection lost',                   type: 'error'   },
  { time: '13:22', msg: 'Production Tracking: Day target achieved early',      type: 'success' },
  { time: '12:55', msg: 'DCSC1515A: Calibration cycle complete',              type: 'info'    },
];

const summary = [
  { label: 'Total Output',       value: '12,480 pcs', color: 'text-blue-400'   },
  { label: 'Quality Pass Rate',  value: '96.3%',      color: 'text-green-400'  },
  { label: 'Defects Logged',     value: '47',         color: 'text-red-400'    },
  { label: 'Active Operators',   value: '184',        color: 'text-orange-400' },
];

function SkyOsLanding() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const onlineCount = systems.filter(s => ['Active', 'Live', 'Optimal'].includes(s.status)).length;

  return (
    <div className="bg-gray-950 text-gray-100 font-sans p-8">

      {/* ── HERO HEADER ─────────────────────────────────────── */}
      <div className="relative mb-10 rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 via-[#0d1117] to-gray-900 p-8 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-12 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-500/30" />
              <span className="text-xs font-bold tracking-[0.3em] text-orange-400 uppercase">
                Sky Technology (Pvt) Ltd
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white leading-tight mb-2">
              Sky<span className="text-orange-400">OS</span>
            </h1>
            <p className="text-gray-400 text-lg font-light">
              Smart Factory Operating System &mdash; Command Center
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Engineering Intelligent Industrial Futures
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-gray-800/60 border border-gray-700/80 rounded-xl px-5 py-3">
              <Clock size={16} className="text-orange-400" />
              <span className="text-2xl font-mono font-bold text-white tracking-widest">
                {now.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI METRICS ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className={`relative rounded-xl border p-5 ${KPI_COLOR[k.color]}`}>
            <div className="flex items-start justify-between mb-3">
              <k.icon size={20} />
              <span className="text-xs font-semibold flex items-center gap-1">
                <ArrowUpRight size={12} />
                {k.trend}
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {k.value}
              <span className="text-sm font-normal text-gray-400 ml-1">{k.unit}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-widest">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── SYSTEMS + ACTIVITY ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Systems Grid */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white tracking-wide">Active Systems</h2>
            <span className="text-xs text-gray-500 bg-gray-800/80 border border-gray-700 px-3 py-1 rounded-full">
              {onlineCount} / {systems.length} Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys) => {
              const sc = STATUS_STYLE[sys.status];
              return (
                <div
                  key={sys.id}
                  className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:border-gray-600 transition-colors">
                        <sys.Icon size={17} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm leading-tight">{sys.name}</p>
                        <p className="text-[11px] text-gray-500">{sys.type}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sc.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sys.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>System Load</span>
                      <span className="text-gray-300 font-semibold">{sys.load}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${sc.bar} transition-all duration-700`}
                        style={{ width: `${sys.load}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-[11px] text-gray-600">Events today</span>
                    <span className="text-xs font-bold text-gray-300">{sys.events.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide">Live Activity</h2>
            <span className="text-[10px] tracking-widest text-green-400 uppercase font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              ● Live
            </span>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex-1">
            {activityFeed.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 ${i < activityFeed.length - 1 ? 'border-b border-gray-800/60' : ''} hover:bg-gray-800/30 transition-colors`}
              >
                <ActivityIcon type={item.type} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-300 leading-relaxed">{item.msg}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-4 font-bold">
              Today's Summary
            </p>
            <div className="space-y-3">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <div className="mt-8 pt-5 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
        <span>SkyOS v2.0 &mdash; Sky Technology (Pvt) Ltd</span>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            System Normal
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} /> 184 Operators Online
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 size={11} /> Real-time Data
          </span>
        </div>
      </div>

    </div>
  );
}

export default SkyOsLanding;
