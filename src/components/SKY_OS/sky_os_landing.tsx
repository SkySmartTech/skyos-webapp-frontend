import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Cpu, Factory, Zap, TrendingUp, Users, Shield,
  CheckCircle, AlertTriangle, XCircle, Globe, Server, BarChart3, ArrowUpRight, RefreshCw,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import productionTrackingService, { type ProductionDashboardResponse } from '../../api/productionTrackingService';
import wipService, { type WipDashboardResponse } from '../../api/wipService';

type StatusKey    = 'Active' | 'Live' | 'Optimal' | 'Monitoring' | 'Standby' | 'Offline';
type KpiColor     = 'blue' | 'purple' | 'green' | 'teal';
type ActivityType = 'success' | 'warning' | 'error' | 'info';

const STATUS_DARK: Record<StatusKey, { badge: string; dot: string; bar: string }> = {
  Active:     { badge: 'bg-green-500/15 text-green-400 border-green-500/30',    dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400'  },
  Live:       { badge: 'bg-green-500/15 text-green-400 border-green-500/30',    dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400'  },
  Optimal:    { badge: 'bg-green-500/15 text-green-400 border-green-500/30',    dot: 'bg-green-400',  bar: 'from-green-500 to-emerald-400'  },
  Monitoring: { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-amber-400'   },
  Standby:    { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400', bar: 'from-yellow-500 to-amber-400'   },
  Offline:    { badge: 'bg-red-500/15 text-red-400 border-red-500/30',          dot: 'bg-red-500',    bar: 'from-red-600 to-red-400'        },
};
const STATUS_LIGHT: Record<StatusKey, { badge: string; dot: string; bar: string }> = {
  Active:     { badge: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400'  },
  Live:       { badge: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400'  },
  Optimal:    { badge: 'bg-green-50 text-green-700 border-green-200',    dot: 'bg-green-500',  bar: 'from-green-500 to-emerald-400'  },
  Monitoring: { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', bar: 'from-yellow-500 to-amber-400'   },
  Standby:    { badge: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', bar: 'from-yellow-500 to-amber-400'   },
  Offline:    { badge: 'bg-red-50 text-red-600 border-red-200',          dot: 'bg-red-500',    bar: 'from-red-500 to-red-400'        },
};

const KPI_DARK: Record<KpiColor, string> = {
  blue:   'bg-blue-600/10 border-blue-500/20 text-blue-400',
  purple: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
  green:  'bg-green-600/10 border-green-500/20 text-green-400',
  teal:   'bg-teal-600/10 border-teal-500/20 text-teal-400',
};
const KPI_LIGHT: Record<KpiColor, string> = {
  blue:   'bg-[#eff6ff] border-[#dbeafe] text-[#2563EB]',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  green:  'bg-[#f0fdf4] border-[#dcfce7] text-[#22C55E]',
  teal:   'bg-teal-50 border-teal-200 text-teal-600',
};

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === 'success') return <CheckCircle size={14} className="text-[#22C55E] shrink-0 mt-0.5" />;
  if (type === 'warning') return <AlertTriangle size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />;
  if (type === 'error')   return <XCircle size={14} className="text-[#EF4444] shrink-0 mt-0.5" />;
  return <Activity size={14} className="text-[#2563EB] shrink-0 mt-0.5" />;
}

// ── Data builders ────────────────────────────────────────────────────────────

function buildKpis(prod: ProductionDashboardResponse | null, wip: WipDashboardResponse | null) {
  const activeCount =
    (prod?.day_plan ? 1 : 0) +
    (wip && wip.statistics.active_lines > 0 ? 1 : 0) +
    3; // Andon + Energy + Work Order assumed active

  const activeLines = wip?.statistics.active_lines ?? 0;
  const totalLines  = wip?.statistics.total_lines  ?? 0;
  const perfRaw     = prod?.stats?.perf_efi ?? null;
  const lineEfi     = prod?.stats?.line_efi ?? null;

  return [
    {
      label: 'Active Systems',     value: String(activeCount),
      unit: '/ 8',   icon: Server,     color: 'blue'  as KpiColor,
      trend: 'Live status',
    },
    {
      label: 'Production Lines',   value: String(activeLines),
      unit: 'lines', icon: Factory,    color: 'blue'  as KpiColor,
      trend: `${totalLines} total`,
    },
    {
      label: 'Overall Efficiency', value: perfRaw ? perfRaw.replace('%', '') : '—',
      unit: perfRaw ? '%' : '',   icon: TrendingUp, color: 'teal'  as KpiColor,
      trend: lineEfi ? `Line ${lineEfi}` : prod ? 'No plan today' : '—',
    },
    {
      label: 'System Uptime',      value: '99.8',
      unit: '%',     icon: Shield,     color: 'green' as KpiColor,
      trend: 'Stable',
    },
  ];
}

function buildSystems(prod: ProductionDashboardResponse | null, wip: WipDashboardResponse | null) {
  // Production Tracking — real data
  let prodStatus: StatusKey = 'Standby';
  let prodLoad   = 0;
  let prodEvents = 0;
  if (prod?.day_plan && prod.stats) {
    prodStatus = 'Live';
    prodLoad   = Math.min(100, Math.max(0, Math.round(parseFloat(prod.stats.perf_efi) || 0)));
    prodEvents = prod.stats.today_check_qty;
  } else if (prod) {
    prodStatus = 'Standby';
  }

  // WIP System — real data
  let wipStatus: StatusKey = 'Standby';
  let wipLoad   = 0;
  let wipEvents = 0;
  if (wip) {
    const { active_lines, total_lines, today_entries } = wip.statistics;
    wipLoad   = total_lines > 0 ? Math.round((active_lines / total_lines) * 100) : 0;
    wipEvents = today_entries;
    const hasIssues = wip.lines.some(
      l => l.is_active && (l.balance > l.upper_limit || l.balance < l.lower_limit)
    );
    wipStatus = active_lines > 0 ? (hasIssues ? 'Monitoring' : 'Active') : 'Standby';
  }

  return [
    { id: 1, name: 'Smart Andon System',        status: 'Active'   as StatusKey, load: 85,      type: 'Industrial Control', Icon: Cpu,      events: 0          },
    { id: 2, name: 'Super Market System',        status: wipStatus,               load: wipLoad,  type: 'WIP Tracking',       Icon: Activity, events: wipEvents  },
    { id: 3, name: 'Production Tracking System', status: prodStatus,              load: prodLoad, type: 'Line Analytics',     Icon: Factory,  events: prodEvents },
    { id: 4, name: 'Energy Monitoring System',   status: 'Optimal'  as StatusKey, load: 45,      type: 'Energy Management',  Icon: Zap,      events: 0          },
    { id: 5, name: 'Work Order System',          status: 'Active'   as StatusKey, load: 73,      type: 'Maintenance Mgmt',   Icon: Server,   events: 0          },
    { id: 6, name: 'Custom System 1',            status: 'Offline'  as StatusKey, load: 0,       type: 'Auxiliary Module',   Icon: Globe,    events: 0          },
    { id: 7, name: 'Custom System 2',            status: 'Offline'  as StatusKey, load: 0,       type: 'Backup Controller',  Icon: Server,   events: 0          },
    { id: 8, name: 'Custom System 3',            status: 'Offline'  as StatusKey, load: 0,       type: 'Auxiliary Module',   Icon: Globe,    events: 0          },
  ];
}

function buildActivityFeed(
  prod: ProductionDashboardResponse | null,
  wip:  WipDashboardResponse | null,
): { time: string; msg: string; type: ActivityType }[] {
  const now     = new Date();
  const timeNow = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const feed: { time: string; msg: string; type: ActivityType }[] = [];

  if (prod?.stats) {
    const { stats, day_plan } = prod;
    const perf = parseFloat(stats.perf_efi) || 0;
    const team = day_plan?.team ?? 'Team';

    feed.push({
      time: timeNow,
      msg:  `Production ${team}: Hour ${stats.current_hour} — ${stats.hourly_achieve} / ${stats.hourly_target} pcs (balance: ${stats.hourly_balance})`,
      type: stats.hourly_balance === 0 ? 'success' : perf >= 80 ? 'info' : 'warning',
    });

    if (stats.today_achieve > 0) {
      feed.push({
        time: timeNow,
        msg:  `Today: ${stats.today_achieve.toLocaleString()} / ${stats.today_target.toLocaleString()} pcs — Perf ${stats.perf_efi} | Line Efi ${stats.line_efi}`,
        type: perf >= 85 ? 'success' : perf >= 70 ? 'info' : 'warning',
      });
    }

    if (stats.total_defect_qty > 0) {
      const topDefect = stats.top_defects.find(d => d !== '-');
      feed.push({
        time: timeNow,
        msg:  `Quality: ${stats.total_defect_qty} defects, DHU ${stats.dhu}${topDefect ? ` — top: ${topDefect}` : ''}`,
        type: parseFloat(stats.dhu) > 5 ? 'error' : 'warning',
      });
    }
  }

  if (wip) {
    const { today_in, today_out, active_lines } = wip.statistics;
    if (today_in > 0 || today_out > 0) {
      feed.push({
        time: timeNow,
        msg:  `WIP System: ${today_in.toLocaleString()} in, ${today_out.toLocaleString()} out — ${active_lines} lines active`,
        type: 'info',
      });
    }

    const overflow = wip.lines.filter(l => l.is_active && l.balance > l.upper_limit);
    if (overflow.length > 0) {
      feed.push({
        time: timeNow,
        msg:  `WIP Alert: ${overflow[0].name} above upper limit (${overflow[0].balance}/${overflow[0].upper_limit} units)`,
        type: 'warning',
      });
    }

    const starving = wip.lines.filter(l => l.is_active && l.balance < l.lower_limit);
    if (starving.length > 0) {
      feed.push({
        time: timeNow,
        msg:  `WIP Alert: ${starving[0].name} below lower limit — risk of production stoppage`,
        type: 'error',
      });
    }
  }

  if (feed.length === 0) {
    feed.push({ time: timeNow, msg: 'All systems operational. No active alerts.', type: 'success' });
  }

  return feed.slice(0, 7);
}

function buildSummary(prod: ProductionDashboardResponse | null) {
  if (!prod?.stats || !prod.day_plan) {
    return [
      { label: 'Total Output',      value: '—', color: 'text-[#2563EB]' },
      { label: 'Quality Pass Rate', value: '—', color: 'text-[#06B6D4]' },
      { label: 'Defects Logged',    value: '—', color: 'text-[#EF4444]' },
      { label: 'Active Operators',  value: '—', color: 'text-[#64748B]' },
    ];
  }
  const { stats, day_plan } = prod;
  const passRate = stats.today_check_qty > 0
    ? ((stats.today_check_qty - stats.total_defect_qty) / stats.today_check_qty * 100).toFixed(1) + '%'
    : '—';
  return [
    { label: 'Total Output',      value: `${stats.today_achieve.toLocaleString()} pcs`, color: 'text-[#2563EB]' },
    { label: 'Quality Pass Rate', value: passRate,                                        color: 'text-[#06B6D4]' },
    { label: 'Defects Logged',    value: String(stats.total_defect_qty),                  color: 'text-[#EF4444]' },
    { label: 'Active Operators',  value: String(day_plan.carder),                         color: 'text-[#64748B]' },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

function SkyOsLanding() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [prodData,   setProdData]   = useState<ProductionDashboardResponse | null>(null);
  const [wipData,    setWipData]    = useState<WipDashboardResponse | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [updatedAt,  setUpdatedAt]  = useState('');

  const fetchAll = useCallback(async () => {
    const [pr, wr] = await Promise.allSettled([
      productionTrackingService.getDashboard(),
      wipService.getDashboard(),
    ]);
    if (pr.status === 'fulfilled') setProdData(pr.value);
    if (wr.status === 'fulfilled') setWipData(wr.value);
    const n = new Date();
    setUpdatedAt(`${n.getHours().toString().padStart(2, '0')}:${n.getMinutes().toString().padStart(2, '0')}`);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 60_000);
    return () => clearInterval(id);
  }, [fetchAll]);

  // ── Theme tokens
  const bg        = dark ? 'bg-[#020617]'                  : 'bg-[#f8fafc]';
  const card      = dark ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-[#e2e8f0]';
  const cardHover = dark ? 'hover:border-[#334155]'        : 'hover:border-[#93c5fd]';
  const textPri   = dark ? 'text-[#f8fafc]'                : 'text-[#0f172a]';
  const textSec   = dark ? 'text-[#94a3b8]'                : 'text-[#64748b]';
  const textMut   = dark ? 'text-[#475569]'                : 'text-[#94a3b8]';
  const iconBg    = dark ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]';
  const divider   = dark ? 'border-[#1e293b]'              : 'border-[#e2e8f0]';
  const rowHover  = dark ? 'hover:bg-[#1e293b]/40'         : 'hover:bg-[#f8fafc]';

  const STATUS = dark ? STATUS_DARK : STATUS_LIGHT;
  const KPI    = dark ? KPI_DARK    : KPI_LIGHT;

  const kpis         = buildKpis(prodData, wipData);
  const systems      = buildSystems(prodData, wipData);
  const activityFeed = buildActivityFeed(prodData, wipData);
  const summary      = buildSummary(prodData);

  return (
    <div className={`font-sans flex flex-col h-full p-4 pb-4 md:p-8 transition-colors duration-300 ${bg}`}>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-2 md:mb-3">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-xl border p-5 transition-colors duration-300 ${KPI[k.color]}`}>
            <div className="flex items-start justify-between mb-3">
              <k.icon size={20} />
              <span className="text-xs font-semibold flex items-center gap-1">
                <ArrowUpRight size={12} />{k.trend}
              </span>
            </div>
            <div className={`text-3xl font-black ${textPri}`}>
              {loading
                ? <span className={`animate-pulse ${textMut}`}>—</span>
                : k.value}
              <span className={`text-sm font-normal ml-1 ${textSec}`}>{k.unit}</span>
            </div>
            <div className={`text-[11px] mt-1 uppercase tracking-widest font-semibold ${textSec}`}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── SYSTEMS + ACTIVITY ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Systems grid */}
        <div className="lg:col-span-2">
          <div className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map(sys => {
              const sc = STATUS[sys.status];
              return (
                <div
                  key={sys.id}
                  className={`group border rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm ${card} ${cardHover}`}
                >
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
                      <span className={`font-semibold ${textPri}`}>
                        {loading ? '—' : `${sys.load}%`}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-[#1e293b]' : 'bg-[#e2e8f0]'}`}>
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${sc.bar} transition-all duration-700`}
                        style={{ width: loading ? '0%' : `${sys.load}%` }}
                      />
                    </div>
                  </div>

                  <div className={`mt-3 pt-3 border-t flex items-center justify-between ${divider}`}>
                    <span className={`text-[11px] ${textMut}`}>Events today</span>
                    <span className={`text-xs font-bold ${textPri}`}>
                      {loading ? '—' : sys.events.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity + Summary */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Activity feed */}
          <div className={`border rounded-xl overflow-hidden flex-1 transition-colors duration-300 relative ${card}`}>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              {updatedAt && (
                <span className={`text-[10px] font-mono ${textMut}`}>{updatedAt}</span>
              )}
              <span className="text-[10px] tracking-widest text-[#22C55E] uppercase font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                ● Live
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <RefreshCw size={16} className={`animate-spin mb-2 ${textMut}`} />
                <p className={`text-xs ${textMut}`}>Loading activity...</p>
              </div>
            ) : (
              activityFeed.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-3 ${
                    i < activityFeed.length - 1 ? `border-b ${divider}` : ''
                  } ${rowHover} transition-colors`}
                >
                  <ActivityIcon type={item.type} />
                  <div className="min-w-0">
                    <p className={`text-xs leading-relaxed ${textSec}`}>{item.msg}</p>
                    <p className={`text-[10px] mt-0.5 font-mono ${textMut}`}>{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Today's Summary */}
          <div className={`border rounded-xl p-4 transition-colors duration-300 ${card}`}>
            <p className={`text-[11px] uppercase tracking-widest mb-4 font-bold ${textMut}`}>Today's Summary</p>
            <div className="space-y-3">
              {summary.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className={`text-xs ${textSec}`}>{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>
                    {loading ? <span className={`animate-pulse ${textMut}`}>—</span> : s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className={`mt-auto pt-5 border-t flex flex-wrap items-center justify-between gap-3 text-xs transition-colors duration-300 ${divider} ${textMut}`}>
        <span>SkyOS v2.0 — Sky Technology (Pvt) Ltd</span>
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> System Normal
          </span>
          {prodData?.day_plan && (
            <span className="flex items-center gap-1">
              <Users size={11} /> {prodData.day_plan.carder} Operators
            </span>
          )}
          <button
            onClick={fetchAll}
            className="flex items-center gap-1 hover:text-[#2563EB] transition-colors"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {updatedAt ? `Updated ${updatedAt}` : 'Refreshing...'}
          </button>
          <span className="hidden sm:flex items-center gap-1">
            <BarChart3 size={11} /> Real-time Data
          </span>
        </div>
      </div>
    </div>
  );
}

export default SkyOsLanding;
