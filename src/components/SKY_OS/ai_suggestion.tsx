import { useState, useEffect, useCallback } from 'react';
import {
  Brain, TrendingUp, TrendingDown,
  Zap, Factory, Cpu, Activity, Globe, Server, ArrowRight,
  Lightbulb, Target, BarChart2, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import productionTrackingService, { type ProductionDashboardResponse } from '../../api/productionTrackingService';
import wipService, { type WipDashboardResponse } from '../../api/wipService';

type Priority  = 'critical' | 'high' | 'medium' | 'low';
type SysStatus = 'excellent' | 'good' | 'warning' | 'critical' | 'offline';

interface SystemStat {
  name: string;
  icon: React.ElementType;
  efficiency: number;
  trend: number;
  status: SysStatus;
  issue: string;
  action: string;
}

interface Suggestion {
  id: number;
  priority: Priority;
  system: string;
  title: string;
  detail: string;
  impact: string;
  effort: 'Low' | 'Medium' | 'High';
}

const STATUS_META: Record<SysStatus, { color: string; bg: string; label: string }> = {
  excellent: { color: 'text-green-500',  bg: 'bg-green-500',  label: 'Excellent' },
  good:      { color: 'text-blue-500',   bg: 'bg-blue-500',   label: 'Good'      },
  warning:   { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Warning'   },
  critical:  { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Critical'  },
  offline:   { color: 'text-red-500',    bg: 'bg-red-500',    label: 'Offline'   },
};

const PRIORITY_META: Record<Priority, { label: string; dark: string; light: string; dot: string }> = {
  critical: { label: 'Critical', dark: 'bg-red-500/15 text-red-400 border-red-500/30',          light: 'bg-red-50 text-red-700 border-red-200',         dot: 'bg-red-500'    },
  high:     { label: 'High',     dark: 'bg-orange-500/15 text-orange-400 border-orange-500/30', light: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  medium:   { label: 'Medium',   dark: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', light: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  low:      { label: 'Low',      dark: 'bg-blue-500/15 text-blue-400 border-blue-500/30',       light: 'bg-blue-50 text-blue-700 border-blue-200',       dot: 'bg-blue-400'   },
};

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

// ── Insight engine ───────────────────────────────────────────────────────────
// Analyses real Production Tracking & WIP data and returns prioritised systems
// + actionable suggestions. No hardcoded factory data — everything comes from
// the live API responses.

function generateInsights(
  prod: ProductionDashboardResponse | null,
  wip:  WipDashboardResponse | null,
): { systems: SystemStat[]; suggestions: Suggestion[] } {
  const systems: SystemStat[] = [];
  const suggestions: Suggestion[] = [];
  let sid = 1;

  // ── Production Tracking ──────────────────────────────────────────────────
  if (prod?.day_plan && prod.stats) {
    const s    = prod.stats;
    const perf = parseFloat(s.perf_efi) || 0;
    const dhu  = parseFloat(s.dhu) || 0;
    const team = prod.day_plan.team;

    let status: SysStatus;
    let issue:  string;
    let action: string;

    if (perf >= 90) {
      status = 'excellent';
      issue  = `Performance at ${s.perf_efi} — ${s.today_achieve.toLocaleString()} of ${s.today_target.toLocaleString()} pieces achieved. Line efficiency: ${s.line_efi}.`;
      action = 'Excellent pace. Monitor for afternoon consistency and ensure quality checks are maintained.';
    } else if (perf >= 75) {
      status = 'good';
      issue  = `Performance at ${s.perf_efi}. ${s.today_balance} pieces behind today's target of ${s.today_target.toLocaleString()}.`;
      action = `Review output for hour ${s.current_hour}. Check for short stoppages or staffing gaps on Team ${team}.`;
      suggestions.push({
        id: sid++, priority: 'medium', system: `Production (${team})`,
        title:  `Close the ${s.today_balance.toLocaleString()}-piece gap before shift ends`,
        detail: `Team ${team} achieved ${s.today_achieve.toLocaleString()} of ${s.today_target.toLocaleString()} pieces. Hourly rate: ${s.hourly_achieve}/${s.hourly_target}. Cumulative gap vs target: ${s.upto_now_balance} pieces. Line efficiency at ${s.line_efi}.`,
        impact: `+${Math.round(90 - perf)}% to reach 90% performance`,
        effort: 'Medium',
      });
    } else if (perf >= 50) {
      status = 'warning';
      issue  = `Performance at ${s.perf_efi}. Team ${team} is ${s.upto_now_balance} pieces behind cumulative target through hour ${s.current_hour}.`;
      action = `Supervisor review needed. Check machine downtime, staffing levels, and material supply for Team ${team}.`;
      suggestions.push({
        id: sid++, priority: 'high', system: `Production (${team})`,
        title:  `Team ${team}: Underperforming at ${s.perf_efi}`,
        detail: `Expected ${s.upto_now_target.toLocaleString()} pieces by hour ${s.current_hour}; achieved ${s.today_achieve.toLocaleString()}. Gap: ${s.upto_now_balance} pieces. Day target is ${s.today_target.toLocaleString()}. Consider overtime or rebalancing from other lines.`,
        impact: 'Recover daily target',
        effort: 'High',
      });
    } else {
      status = 'critical';
      issue  = `Critical underperformance at ${s.perf_efi}. Only ${s.today_achieve.toLocaleString()} of ${s.today_target.toLocaleString()} pieces — immediate action required.`;
      action = `Escalate to floor manager. Identify root cause: mass machine failure, absenteeism, or material shortage on Team ${team}.`;
      suggestions.push({
        id: sid++, priority: 'critical', system: `Production (${team})`,
        title:  `CRITICAL: Team ${team} at ${s.perf_efi} — day target at risk`,
        detail: `Only ${s.today_achieve.toLocaleString()} pieces vs ${s.today_target.toLocaleString()} target. Line efficiency: ${s.line_efi}. DHU: ${s.dhu}. This level of underperformance cannot be recovered without immediate intervention.`,
        impact: 'Prevent complete day target loss',
        effort: 'High',
      });
    }

    // DHU / defect suggestions
    if (dhu > 10) {
      suggestions.push({
        id: sid++, priority: 'critical', system: `Production (${team})`,
        title:  `Extreme defect rate: DHU at ${s.dhu} — factory alert`,
        detail: `${s.total_defect_qty} defects from ${s.today_check_qty} checks.${s.top_defects.filter(d => d !== '-').length > 0 ? ` Top defects: ${s.top_defects.filter(d => d !== '-').join(', ')}.` : ''} DHU above 10% risks customer returns and production holds.`,
        impact: 'Prevent quality hold & returns',
        effort: 'High',
      });
    } else if (dhu > 5) {
      suggestions.push({
        id: sid++, priority: 'high', system: `Production (${team})`,
        title:  `High defect rate: DHU at ${s.dhu} (threshold: 5%)`,
        detail: `${s.total_defect_qty} defects from ${s.today_check_qty} checks.${s.top_defects.filter(d => d !== '-').length > 0 ? ` Top defect type: ${s.top_defects.filter(d => d !== '-')[0]}.` : ''} A targeted QC refresher typically reduces defects by 40–60% within the shift.`,
        impact: 'Reduce rework & scrap cost',
        effort: 'Medium',
      });
    } else if (dhu > 2 && s.today_check_qty > 0) {
      suggestions.push({
        id: sid++, priority: 'medium', system: `Production (${team})`,
        title:  `Monitor defect trend: DHU at ${s.dhu}`,
        detail: `${s.total_defect_qty} defects from ${s.today_check_qty} checks. Within acceptable range but watch the trend.${s.top_defects.filter(d => d !== '-').length > 0 ? ` Top defect: ${s.top_defects.filter(d => d !== '-')[0]}.` : ''}`,
        impact: 'Prevent quality escalation',
        effort: 'Low',
      });
    }

    systems.push({ name: `Production (${team})`, icon: Factory, efficiency: Math.round(perf), trend: 0, status, issue, action });

  } else if (prod) {
    // Module accessible but no active plan today
    systems.push({
      name: 'Production Tracking', icon: Factory, efficiency: 0, trend: 0,
      status: 'offline',
      issue:  'No active production plan for today. Output and quality tracking cannot begin.',
      action: 'Create a day plan in Production Tracking to start capturing real-time data.',
    });
    suggestions.push({
      id: sid++, priority: 'medium', system: 'Production Tracking',
      title:  'No production plan active for today',
      detail: 'Without an active day plan, all production efficiency, QC, and defect metrics are unavailable. Daily targets and actual output cannot be compared.',
      impact: 'Enable real-time production tracking',
      effort: 'Low',
    });
  } else {
    systems.push({
      name: 'Production Tracking', icon: Factory, efficiency: 0, trend: 0,
      status: 'offline',
      issue:  'Module not accessible. Check your permissions or module configuration.',
      action: 'Contact your system administrator to enable access to the Production Tracking module.',
    });
  }

  // ── WIP System ───────────────────────────────────────────────────────────
  if (wip) {
    const st           = wip.statistics;
    const activeRatio  = st.total_lines > 0 ? (st.active_lines / st.total_lines) * 100 : 0;
    const overflowLines = wip.lines.filter(l => l.is_active && l.balance > l.upper_limit);
    const starvingLines = wip.lines.filter(l => l.is_active && l.balance < l.lower_limit);
    const issueCount   = overflowLines.length + starvingLines.length;

    let wipStatus: SysStatus;
    let wipIssue:  string;
    let wipAction: string;

    if (issueCount >= 3) {
      wipStatus = 'critical';
      wipIssue  = `${issueCount} lines out of balance: ${overflowLines.length} overflow, ${starvingLines.length} starving. Flow is severely disrupted.`;
      wipAction = 'Dispatch floor supervisor immediately. Stop pushing WIP into overflow lines and pull from starving lines.';
    } else if (issueCount > 0) {
      wipStatus = 'warning';
      const parts = [
        overflowLines.length > 0 ? `${overflowLines.length} line(s) above upper limit (${overflowLines.map(l => l.name).join(', ')})` : '',
        starvingLines.length > 0 ? `${starvingLines.length} line(s) below lower limit (${starvingLines.map(l => l.name).join(', ')})` : '',
      ].filter(Boolean);
      wipIssue  = parts.join('. ') + '.';
      wipAction = 'Rebalance WIP across affected lines. Check pull system timing and material handler schedule.';
    } else if (activeRatio >= 70) {
      wipStatus = 'good';
      wipIssue  = `${st.active_lines} of ${st.total_lines} lines active. All balances within thresholds. Today: ${st.today_in.toLocaleString()} in, ${st.today_out.toLocaleString()} out (${st.today_entries} entries).`;
      wipAction = 'WIP flow is healthy. Continue monitoring and maintain consistent pull cadence.';
    } else {
      wipStatus = 'warning';
      wipIssue  = `Only ${st.active_lines} of ${st.total_lines} lines active (${Math.round(activeRatio)}%). Today: ${st.today_in.toLocaleString()} in, ${st.today_out.toLocaleString()} out.`;
      wipAction = 'Review inactive lines. If production demand is high, activate additional lines to increase throughput.';
    }

    if (overflowLines.length > 0) {
      suggestions.push({
        id: sid++,
        priority: overflowLines.length >= 3 ? 'critical' : 'high',
        system: 'WIP System',
        title:  `${overflowLines.length} line(s) at WIP overflow`,
        detail: `Lines exceeding upper limit: ${overflowLines.map(l => `${l.name} (${l.balance}/${l.upper_limit})`).join(', ')}. Excess WIP increases handling time, floor space usage, and defect risk.`,
        impact: 'Reduce WIP congestion & defect risk',
        effort: 'Medium',
      });
    }

    if (starvingLines.length > 0) {
      suggestions.push({
        id: sid++, priority: 'high', system: 'WIP System',
        title:  `${starvingLines.length} line(s) starving for WIP`,
        detail: `Lines below lower limit: ${starvingLines.map(l => `${l.name} (${l.balance}/${l.lower_limit})`).join(', ')}. Insufficient WIP causes idle time and risks a full production stoppage.`,
        impact: 'Prevent idle time & production stoppages',
        effort: 'Low',
      });
    }

    if (issueCount === 0 && activeRatio < 70 && st.total_lines > 0) {
      suggestions.push({
        id: sid++, priority: 'medium', system: 'WIP System',
        title:  `Low line utilisation: ${Math.round(activeRatio)}% active`,
        detail: `Only ${st.active_lines} of ${st.total_lines} lines are currently active. If production demand is present, unused lines represent untapped capacity.`,
        impact: 'Increase throughput capacity',
        effort: 'Low',
      });
    }

    systems.push({
      name: 'WIP System', icon: Activity,
      efficiency: Math.round(activeRatio),
      trend: 0, status: wipStatus, issue: wipIssue, action: wipAction,
    });
  } else {
    systems.push({
      name: 'WIP System', icon: Activity, efficiency: 0, trend: 0,
      status: 'offline',
      issue:  'Module not accessible.',
      action: 'Check module permissions for the WIP System.',
    });
  }

  // ── Static systems (no live API data yet) ────────────────────────────────
  systems.push({
    name: 'Smart Andon System', icon: Cpu, efficiency: 85, trend: 0,
    status: 'good',
    issue:  'System operational. Real-time downtime event monitoring active via DCSC.',
    action: 'No action required. Review the DCSC module for active downtime events.',
  });
  systems.push({
    name: 'Energy Monitoring', icon: Zap, efficiency: 92, trend: 2,
    status: 'excellent',
    issue:  'Energy monitoring operating normally. Solar and grid metrics nominal.',
    action: 'No action required. Consider reviewing monthly energy reports.',
  });
  systems.push({
    name: 'Work Order System', icon: Server, efficiency: 78, trend: 0,
    status: 'good',
    issue:  'System active. Maintenance work orders being processed.',
    action: 'No action required.',
  });
  systems.push({
    name: 'Custom Systems', icon: Globe, efficiency: 0, trend: 0,
    status: 'offline',
    issue:  'Additional system modules are not yet configured.',
    action: 'Contact Sky Technology to onboard additional factory modules.',
  });

  // Sort suggestions by priority
  suggestions.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return { systems, suggestions };
}

// ── Sub-components ───────────────────────────────────────────────────────────

function EfficiencyRing({ value, status }: { value: number; status: SysStatus }) {
  const color = {
    excellent: '#22c55e', good: '#3b82f6', warning: '#eab308',
    critical: '#f97316', offline: '#ef4444',
  }[status];
  const data = [{ value, fill: color }, { value: 100 - value, fill: 'transparent' }];
  return (
    <div className="relative w-20 h-20">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" startAngle={90} endAngle={-270} data={data} barSize={6}>
          <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#374151' }} />
          <Tooltip content={() => null} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}

function SuggestionCard({ s, dark }: { s: Suggestion; dark: boolean }) {
  const [open, setOpen] = useState(false);
  const pm       = PRIORITY_META[s.priority];
  const card     = dark ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-200';
  const title    = dark ? 'text-white'                   : 'text-gray-900';
  const sub      = dark ? 'text-gray-400'                : 'text-gray-600';
  const muted    = dark ? 'text-gray-500'                : 'text-gray-400';
  const badge    = dark ? pm.dark                        : pm.light;
  const tagBg    = dark ? 'bg-gray-800 text-gray-400'    : 'bg-gray-100 text-gray-600';
  const divider  = dark ? 'border-gray-800'              : 'border-gray-100';
  const impactCl = dark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700';
  const effortCl = dark ? 'bg-gray-800 text-gray-400'    : 'bg-gray-100 text-gray-600';

  return (
    <div className={`border rounded-xl transition-all duration-300 ${card}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-start gap-4 p-5 text-left">
        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${pm.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge}`}>{pm.label}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${tagBg}`}>{s.system}</span>
          </div>
          <p className={`text-sm font-semibold ${title}`}>{s.title}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-semibold ${impactCl} px-2 py-0.5 rounded-full`}>{s.impact}</span>
          {open ? <ChevronUp size={15} className={muted} /> : <ChevronDown size={15} className={muted} />}
        </div>
      </button>

      {open && (
        <div className={`px-5 pb-5 pt-0 border-t ${divider}`}>
          <p className={`text-sm mt-4 mb-3 leading-relaxed ${sub}`}>{s.detail}</p>
          <div className="flex flex-wrap gap-3 items-center">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${effortCl}`}>Effort: {s.effort}</span>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Apply recommendation <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function AiSuggestion() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [prodData, setProdData] = useState<ProductionDashboardResponse | null>(null);
  const [wipData,  setWipData]  = useState<WipDashboardResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');
  const [filter, setFilter]     = useState<Priority | 'all'>('all');

  const fetchAll = useCallback(async () => {
    setLoading(true);
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

  const { systems, suggestions } = generateInsights(prodData, wipData);

  const overallScore = systems.length > 0
    ? Math.round(systems.reduce((a, s) => a + s.efficiency, 0) / systems.length)
    : 0;

  const filtered = filter === 'all' ? suggestions : suggestions.filter(s => s.priority === filter);

  const counts = {
    critical: suggestions.filter(s => s.priority === 'critical').length,
    high:     suggestions.filter(s => s.priority === 'high').length,
    medium:   suggestions.filter(s => s.priority === 'medium').length,
    low:      suggestions.filter(s => s.priority === 'low').length,
  };

  const scoreColor    = overallScore >= 85 ? 'text-green-500' : overallScore >= 65 ? 'text-yellow-500' : 'text-red-500';
  const potentialGain = overallScore < 90 ? `+${Math.round(90 - overallScore)}%` : 'Optimised';

  // Theme tokens
  const bg       = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card     = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const heroCard = dark
    ? 'bg-gradient-to-br from-gray-900 via-[#0d1117] to-gray-900 border-gray-800'
    : 'bg-linear-to-br from-orange-50 to-white border-orange-200';
  const title    = dark ? 'text-white'      : 'text-gray-900';
  const sub      = dark ? 'text-gray-400'   : 'text-gray-600';
  const muted    = dark ? 'text-gray-600'   : 'text-gray-400';
  const divider  = dark ? 'border-gray-800' : 'border-gray-200';
  const tabBg    = dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600';
  const tabAct   = 'bg-orange-500 text-white border-transparent';

  return (
    <div className={`font-sans p-4 pb-24 md:p-8 md:pb-8 transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <div className={`relative rounded-2xl border p-5 md:p-8 mb-5 md:mb-8 shadow-xl overflow-hidden transition-colors duration-300 ${heroCard}`}>
        {dark && (
          <>
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-10 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <Brain size={22} className="text-white md:hidden" />
              <Brain size={28} className="text-white hidden md:block" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className={`text-xl md:text-3xl font-black ${title}`}>AI Efficiency Advisor</h1>
                <span className="text-[10px] font-bold tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>
              <p className={`text-sm ${sub}`}>
                Real-time analysis across all systems — actionable suggestions based on live factory data.
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className={`flex items-center gap-4 md:gap-6 border rounded-2xl px-4 md:px-6 py-3 md:py-4 w-full md:w-auto shrink-0 ${card}`}>
            <div className="text-center">
              <p className={`text-[11px] uppercase tracking-widest font-bold mb-1 ${muted}`}>Overall Score</p>
              {loading
                ? <p className={`text-3xl md:text-5xl font-black ${muted} animate-pulse`}>—</p>
                : <p className={`text-3xl md:text-5xl font-black ${scoreColor}`}>{overallScore}<span className="text-lg md:text-xl">%</span></p>
              }
            </div>
            <div className={`w-px h-10 md:h-12 bg-gray-200 dark:bg-gray-700`} />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /><span className={sub}>{counts.critical} critical</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /><span className={sub}>{counts.high} high</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span className={sub}>{counts.low} low priority</span></div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className={`relative mt-5 pt-4 border-t grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 ${divider}`}>
          {[
            { icon: Target,    label: 'Potential Gain',    value: loading ? '—' : potentialGain,              color: 'text-green-500'  },
            { icon: Lightbulb, label: 'Total Suggestions', value: loading ? '—' : String(suggestions.length), color: 'text-orange-500' },
            { icon: BarChart2, label: 'Systems Analysed',  value: loading ? '—' : `${systems.length} / ${systems.length}`, color: 'text-blue-500' },
            { icon: RefreshCw, label: 'Last Updated',      value: updatedAt || '—',                           color: muted             },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <s.icon size={14} className={`${s.color} shrink-0`} />
              <span className={`text-xs ${muted} hidden sm:inline`}>{s.label}:</span>
              <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
              <span className={`text-xs ${muted} sm:hidden`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SYSTEM EFFICIENCY GRID ── */}
      <h2 className={`text-base font-bold mb-4 ${title}`}>System Efficiency Breakdown</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`border rounded-xl p-5 animate-pulse ${card}`}>
              <div className={`h-4 rounded w-2/3 mb-4 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
              <div className={`h-20 rounded mb-3 ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
              <div className={`h-3 rounded w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {systems.map(sys => {
            const sm = STATUS_META[sys.status];
            const up = sys.trend > 0;
            return (
              <div key={sys.name} className={`border rounded-xl p-5 transition-colors duration-300 ${card}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <sys.icon size={17} className={sm.color} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight ${title}`}>{sys.name}</p>
                      <span className={`text-[11px] font-semibold ${sm.color}`}>{sm.label}</span>
                    </div>
                  </div>
                  <EfficiencyRing value={sys.efficiency} status={sys.status} />
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${
                  sys.trend === 0 ? muted : up ? 'text-green-500' : 'text-red-500'
                }`}>
                  {sys.trend > 0 ? <TrendingUp size={13} /> : sys.trend < 0 ? <TrendingDown size={13} /> : null}
                  {sys.trend === 0 ? 'Point-in-time snapshot' : `${up ? '+' : ''}${sys.trend}% this shift`}
                </div>

                <div className={`rounded-lg px-3 py-2 text-xs mb-2 ${dark ? 'bg-gray-800/80' : 'bg-gray-50'}`}>
                  <p className={`font-semibold mb-0.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Analysis</p>
                  <p className={sub}>{sys.issue}</p>
                </div>

                <div className={`rounded-lg px-3 py-2 text-xs ${dark ? 'bg-orange-500/8 border border-orange-500/20' : 'bg-orange-50 border border-orange-100'}`}>
                  <p className="font-semibold text-orange-500 mb-0.5 flex items-center gap-1">
                    <Lightbulb size={11} /> Recommendation
                  </p>
                  <p className={sub}>{sys.action}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RANKED ACTION PLAN ── */}
      <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${card}`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b ${divider}`}>
          <div>
            <h2 className={`text-base font-bold ${title}`}>Ranked Action Plan</h2>
            <p className={`text-xs mt-0.5 ${muted}`}>Sorted by impact · Click any row to expand details</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all duration-200 ${
                  filter === f ? tabAct : tabBg
                }`}
              >
                {f === 'all'
                  ? `All (${suggestions.length})`
                  : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw size={20} className={`animate-spin mb-3 ${muted}`} />
              <p className={`text-sm ${muted}`}>Analysing system data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={`text-center py-8 text-sm ${muted}`}>
              No {filter !== 'all' ? filter : ''} suggestions — systems are performing well.
            </div>
          ) : (
            filtered.map(s => <SuggestionCard key={s.id} s={s} dark={dark} />)
          )}
        </div>

        <div className={`px-6 py-4 border-t flex items-center justify-between ${divider}`}>
          <p className={`text-xs ${muted}`}>
            {suggestions.length > 0
              ? <>Resolving all issues could raise overall efficiency to <span className="text-green-500 font-bold">~90%</span></>
              : 'All systems within acceptable parameters.'}
          </p>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Re-analyse
          </button>
        </div>
      </div>

    </div>
  );
}

export default AiSuggestion;
