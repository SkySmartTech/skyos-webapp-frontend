import { useState } from 'react';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Zap, Factory, Cpu, Activity, Globe, Server, ArrowRight,
  Lightbulb, Target, BarChart2, RefreshCw, ChevronDown, ChevronUp,
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type Priority = 'critical' | 'high' | 'medium' | 'low';
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

const SYSTEMS: SystemStat[] = [
  {
    name: 'Production Tracking', icon: Factory, efficiency: 87, trend: +5,
    status: 'good',
    issue: 'Line 7 running 12% below hourly target in afternoon shift.',
    action: 'Reassign 2 operators from Line 3 to Line 7 between 13:00–16:00.',
  },
  {
    name: 'DCSC1515A', icon: Cpu, efficiency: 72, trend: -3,
    status: 'warning',
    issue: 'Calibration drift detected — 3 checkpoints out of tolerance.',
    action: 'Schedule maintenance during next planned downtime window.',
  },
  {
    name: 'WIP032A', icon: Activity, efficiency: 65, trend: +2,
    status: 'warning',
    issue: 'Rework rate on Team 07 at 8.4% — above 5% threshold.',
    action: 'Run quality training for Team 07; enable auto-flag for rework patterns.',
  },
  {
    name: 'Solar System', icon: Zap, efficiency: 94, trend: +1,
    status: 'excellent',
    issue: 'Operating at peak performance. Grid switching is stable.',
    action: 'No action required. Consider expanding panel capacity by Q3.',
  },
  {
    name: 'Custom System 1', icon: Globe, efficiency: 45, trend: -8,
    status: 'critical',
    issue: 'Response latency spiked to 4.2s avg — 5× normal baseline.',
    action: 'Restart service container and investigate memory leak in module v2.1.',
  },
  {
    name: 'Custom System 2', icon: Server, efficiency: 0, trend: 0,
    status: 'offline',
    issue: 'System offline since 13:40. Network handshake failing.',
    action: 'Check network switch port 14. Escalate to infrastructure team.',
  },
];

const SUGGESTIONS: Suggestion[] = [
  {
    id: 1, priority: 'critical', system: 'Custom System 2',
    title: 'Restore offline system immediately',
    detail: 'Custom System 2 has been unreachable for 2h 20m. Each hour offline costs an estimated 3.2% in overall OS throughput.',
    impact: '+12% overall throughput', effort: 'Low',
  },
  {
    id: 2, priority: 'critical', system: 'Custom System 1',
    title: 'Fix latency spike — restart service container',
    detail: 'Latency at 4.2s average is causing upstream bottlenecks in data pipelines. Module v2.1 shows unclosed DB connections.',
    impact: '+8% data pipeline speed', effort: 'Low',
  },
  {
    id: 3, priority: 'high', system: 'WIP032A',
    title: 'Reduce Team 07 rework rate',
    detail: 'Team 07 rework is at 8.4% vs factory average of 3.1%. A targeted 1-hour QC refresher historically reduces rework by 40–60%.',
    impact: '+6% line efficiency', effort: 'Medium',
  },
  {
    id: 4, priority: 'high', system: 'DCSC1515A',
    title: 'Schedule calibration maintenance',
    detail: '3 checkpoints show ±0.8% drift from baseline. If left uncorrected, accuracy degrades further and may trigger production holds.',
    impact: '+5% accuracy', effort: 'Medium',
  },
  {
    id: 5, priority: 'medium', system: 'Production Tracking',
    title: 'Rebalance operator allocation on Line 7',
    detail: 'Line 7 afternoon output is 12% below target. Historical data shows operator rebalancing from Line 3 resolves this pattern.',
    impact: '+4% daily output', effort: 'Low',
  },
  {
    id: 6, priority: 'low', system: 'Solar System',
    title: 'Expand solar panel capacity',
    detail: 'Current solar covers 60% of daytime load. Adding 20 panels (est. cost: $18K) would push self-sufficiency to 88%, saving ~$2,400/month.',
    impact: '−28% grid cost', effort: 'High',
  },
];

const STATUS_META: Record<SysStatus, { color: string; bg: string; label: string }> = {
  excellent: { color: 'text-green-500',  bg: 'bg-green-500',  label: 'Excellent' },
  good:      { color: 'text-blue-500',   bg: 'bg-blue-500',   label: 'Good'      },
  warning:   { color: 'text-yellow-500', bg: 'bg-yellow-500', label: 'Warning'   },
  critical:  { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Critical'  },
  offline:   { color: 'text-red-500',    bg: 'bg-red-500',    label: 'Offline'   },
};

const PRIORITY_META: Record<Priority, { label: string; dark: string; light: string; dot: string }> = {
  critical: { label: 'Critical', dark: 'bg-red-500/15 text-red-400 border-red-500/30',     light: 'bg-red-50 text-red-700 border-red-200',     dot: 'bg-red-500'    },
  high:     { label: 'High',     dark: 'bg-orange-500/15 text-orange-400 border-orange-500/30', light: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  medium:   { label: 'Medium',   dark: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', light: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  low:      { label: 'Low',      dark: 'bg-blue-500/15 text-blue-400 border-blue-500/30',   light: 'bg-blue-50 text-blue-700 border-blue-200',   dot: 'bg-blue-400'   },
};

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
  const pm = PRIORITY_META[s.priority];
  const card  = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const title = dark ? 'text-white'   : 'text-gray-900';
  const sub   = dark ? 'text-gray-400' : 'text-gray-600';
  const muted = dark ? 'text-gray-500' : 'text-gray-400';
  const badge = dark ? pm.dark : pm.light;
  const tagBg = dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';
  const divider = dark ? 'border-gray-800' : 'border-gray-100';
  const impactCl = dark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700';
  const effortCl = dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';

  return (
    <div className={`border rounded-xl transition-all duration-300 ${card}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${pm.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge}`}>
              {pm.label}
            </span>
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
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${effortCl}`}>
              Effort: {s.effort}
            </span>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">
              Apply recommendation <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AiSuggestion() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [filter, setFilter] = useState<Priority | 'all'>('all');

  const bg      = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'    : 'bg-white border-gray-200';
  const heroCard = dark
    ? 'bg-gradient-to-br from-gray-900 via-[#0d1117] to-gray-900 border-gray-800'
    : 'bg-linear-to-br from-orange-50 to-white border-orange-200';
  const title   = dark ? 'text-white'     : 'text-gray-900';
  const sub     = dark ? 'text-gray-400'  : 'text-gray-600';
  const muted   = dark ? 'text-gray-600'  : 'text-gray-400';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';
  const tabBg   = dark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600';
  const tabAct  = 'bg-orange-500 text-white border-transparent';

  const overallScore = Math.round(
    SYSTEMS.reduce((a, s) => a + s.efficiency, 0) / SYSTEMS.length
  );

  const filtered = filter === 'all' ? SUGGESTIONS : SUGGESTIONS.filter(s => s.priority === filter);

  const counts = {
    critical: SUGGESTIONS.filter(s => s.priority === 'critical').length,
    high:     SUGGESTIONS.filter(s => s.priority === 'high').length,
    medium:   SUGGESTIONS.filter(s => s.priority === 'medium').length,
    low:      SUGGESTIONS.filter(s => s.priority === 'low').length,
  };

  const scoreColor = overallScore >= 85 ? 'text-green-500' : overallScore >= 65 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={`font-sans p-4 md:p-8 transition-colors duration-300 ${bg}`}>

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
                <span className="text-[10px] font-bold tracking-widest text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase">Beta</span>
              </div>
              <p className={`text-sm ${sub}`}>Real-time analysis across all systems — actionable suggestions to grow your factory efficiency.</p>
            </div>
          </div>

          {/* Overall Score */}
          <div className={`flex items-center gap-4 md:gap-6 border rounded-2xl px-4 md:px-6 py-3 md:py-4 w-full md:w-auto shrink-0 ${card}`}>
            <div className="text-center">
              <p className={`text-[11px] uppercase tracking-widest font-bold mb-1 ${muted}`}>Overall Score</p>
              <p className={`text-3xl md:text-5xl font-black ${scoreColor}`}>{overallScore}<span className="text-lg md:text-xl">%</span></p>
            </div>
            <div className={`w-px h-10 md:h-12 ${divider.replace('border-','bg-')}`} />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /><span className={sub}>{counts.critical} critical</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" /><span className={sub}>{counts.high} high</span></div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span className={sub}>{counts.low} optimised</span></div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className={`relative mt-5 pt-4 border-t grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 ${divider}`}>
          {[
            { icon: Target,   label: 'Potential Gain',    value: '+35%',    color: 'text-green-500'  },
            { icon: Lightbulb, label: 'Total Suggestions', value: String(SUGGESTIONS.length), color: 'text-orange-500' },
            { icon: BarChart2, label: 'Systems Analysed',  value: `${SYSTEMS.length} / ${SYSTEMS.length}`, color: 'text-blue-500'   },
            { icon: RefreshCw, label: 'Last Updated',      value: 'Just now',  color: muted             },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {SYSTEMS.map(sys => {
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

              {/* Trend */}
              <div className={`flex items-center gap-1.5 text-xs font-semibold mb-3 ${
                sys.trend === 0 ? muted : up ? 'text-green-500' : 'text-red-500'
              }`}>
                {sys.trend > 0 ? <TrendingUp size={13} /> : sys.trend < 0 ? <TrendingDown size={13} /> : null}
                {sys.trend === 0 ? 'No change' : `${up ? '+' : ''}${sys.trend}% this shift`}
              </div>

              {/* Issue */}
              <div className={`rounded-lg px-3 py-2 text-xs mb-2 ${dark ? 'bg-gray-800/80' : 'bg-gray-50'}`}>
                <p className={`font-semibold mb-0.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Issue</p>
                <p className={sub}>{sys.issue}</p>
              </div>

              {/* Action */}
              <div className={`rounded-lg px-3 py-2 text-xs ${dark ? 'bg-orange-500/8 border border-orange-500/20' : 'bg-orange-50 border border-orange-100'}`}>
                <p className="font-semibold text-orange-500 mb-0.5 flex items-center gap-1">
                  <Lightbulb size={11} /> AI Recommendation
                </p>
                <p className={sub}>{sys.action}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SUGGESTION LIST ── */}
      <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${card}`}>
        {/* Header */}
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
                {f === 'all' ? `All (${SUGGESTIONS.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-3">
          {filtered.map(s => (
            <SuggestionCard key={s.id} s={s} dark={dark} />
          ))}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${divider}`}>
          <p className={`text-xs ${muted}`}>
            Implementing all suggestions could raise overall efficiency to <span className="text-green-500 font-bold">~94%</span>
          </p>
          <button className="flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-400 transition-colors">
            <RefreshCw size={12} /> Re-analyse
          </button>
        </div>
      </div>

    </div>
  );
}

export default AiSuggestion;
