import React, { useState } from 'react';
import {
  Settings, Building2, ToggleLeft, Shield, Bell, Monitor,
  Code2, Save, CheckCircle, Lock, Copy, RefreshCw,
  Factory, Cpu, Zap, BarChart3, Layers,
  AlertTriangle, Info, ChevronDown, ChevronRight,
  LayoutDashboard, LineChart, Wrench, RefreshCcw, AlertCircle,
  SunMedium, Database, ClipboardList,
} from 'lucide-react';
import { useAuth } from './sky_auth';
import { useTheme } from '../../context/ThemeContext';

type Cat = 'company' | 'modules' | 'security' | 'notifications' | 'system' | 'developer';

interface SubFeature {
  key: string;
  label: string;
  desc: string;
  Icon: React.ElementType;
  enabled: boolean;
}

interface ModuleCfg {
  key: string;
  name: string;
  code: string;
  desc: string;
  Icon: React.ElementType;
  enabled: boolean;
  tag?: string;
  features: SubFeature[];
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({
  checked, onChange, disabled = false, dark, size = 'md',
}: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; dark: boolean; size?: 'sm' | 'md' }) {
  const sm = size === 'sm';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative rounded-full transition-colors shrink-0 ${sm ? 'w-9 h-5' : 'w-11 h-6'} ${
        disabled ? 'opacity-40 cursor-not-allowed' :
        checked   ? 'bg-orange-500' :
        dark      ? 'bg-zinc-700'   : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-0.5 rounded-full bg-white shadow-sm transition-all ${
        sm
          ? checked ? 'left-4.5 w-4 h-4' : 'left-0.5 w-4 h-4'
          : checked ? 'left-5.5 w-5 h-5'   : 'left-0.5 w-5 h-5'
      }`} />
    </button>
  );
}

// ── SettingRow ─────────────────────────────────────────────────────────────────
function SettingRow({
  label, desc, right, divider = true, dividerClass = '',
}: { label: string; desc?: string; right: React.ReactNode; divider?: boolean; dividerClass?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2 sm:gap-0 ${divider ? `border-b ${dividerClass}` : ''}`}>
      <div className="min-w-0 sm:mr-4 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs mt-0.5 opacity-60">{desc}</p>}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

// ── SectionCard ────────────────────────────────────────────────────────────────
function SectionCard({
  title, desc, children, card, textPri, textMut, warn,
}: { title: string; desc?: string; children: React.ReactNode; card: string; textPri: string; textMut: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${card}`}>
      <div className="flex items-start gap-2 mb-4">
        {warn && <AlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5" />}
        <div>
          <h3 className={`text-sm font-bold ${textPri}`}>{title}</h3>
          {desc && <p className={`text-xs mt-0.5 ${textMut}`}>{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── SettingInput ───────────────────────────────────────────────────────────────
function SettingInput({
  value, onChange, readOnly = false, type = 'text', className = '', inp, placeholder,
}: { value: string; onChange?: (v: string) => void; readOnly?: boolean; type?: string; className?: string; inp: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={e => onChange?.(e.target.value)}
      className={`px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inp} ${readOnly ? 'opacity-55 cursor-not-allowed' : ''} ${className}`}
    />
  );
}

// ── SettingSelect ──────────────────────────────────────────────────────────────
function SettingSelect({
  value, onChange, options, readOnly = false, inp, textMut, className = '',
}: { value: string; onChange?: (v: string) => void; options: { value: string; label: string }[]; readOnly?: boolean; inp: string; textMut: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        disabled={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full appearance-none px-3 py-2 rounded-lg border text-sm outline-none pr-8 ${inp} ${readOnly ? 'opacity-55 cursor-not-allowed' : ''}`}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] ${textMut}`}>▾</span>
    </div>
  );
}

// ── CatItem ────────────────────────────────────────────────────────────────────
function CatItem({
  id, Icon, label, active, onClick, activeClass, hoverClass, textSec,
}: { id: Cat; Icon: React.ElementType; label: string; active: boolean; onClick: (id: Cat) => void; activeClass: string; hoverClass: string; textSec: string }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${active ? activeClass : `${textSec} ${hoverClass}`}`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

// ── Static data ────────────────────────────────────────────────────────────────
const CATEGORIES: { id: Cat; Icon: React.ElementType; label: string }[] = [
  { id: 'company',       Icon: Building2,  label: 'Company'        },
  { id: 'modules',       Icon: ToggleLeft, label: 'System Modules' },
  { id: 'security',      Icon: Shield,     label: 'Security'       },
  { id: 'notifications', Icon: Bell,       label: 'Notifications'  },
  { id: 'system',        Icon: Monitor,    label: 'System'         },
  { id: 'developer',     Icon: Code2,      label: 'Developer'      },
];

const INIT_MODULES: ModuleCfg[] = [
  {
    key: 'spm1693', name: 'Production Tracking System', code: 'SPM-1693',
    desc: 'Real-time production line monitoring, shift analytics and performance tracking.',
    Icon: Factory, enabled: true,
    features: [
      { key: 'spm-dashboard',  label: 'Dashboard',          desc: 'KPI overview, hourly targets and production summary.',  Icon: LayoutDashboard, enabled: true  },
      { key: 'spm-analytics',  label: 'Analytics & Charts', desc: 'Trend charts, efficiency graphs and shift comparisons.', Icon: LineChart,       enabled: true  },
      { key: 'spm-update',     label: 'Production Update',  desc: 'Live count entry — success, rework and defect input.',   Icon: RefreshCcw,     enabled: true  },
      { key: 'spm-settings',   label: 'Plan Settings',      desc: 'Configure targets, SMV, buyer and style details.',       Icon: Wrench,         enabled: true  },
    ],
  },
  {
    key: 'dscs1515a', name: 'DSCS1515A', code: 'DSCS1515A',
    desc: 'Industrial Andon control system for production line issue escalation and alerts.',
    Icon: Cpu, enabled: true,
    features: [
      { key: 'dscs-dashboard', label: 'Dashboard',       desc: 'Live Andon board with active alerts and line status.',     Icon: LayoutDashboard, enabled: true  },
      { key: 'dscs-analytics', label: 'Analytics',       desc: 'Alert frequency, response time and downtime reports.',     Icon: LineChart,       enabled: true  },
      { key: 'dscs-alerts',    label: 'Andon Alerts',    desc: 'Configure alert categories, escalation rules and sounds.', Icon: AlertCircle,    enabled: true  },
      { key: 'dscs-devices',   label: 'Device Control',  desc: 'Manage connected Andon lights and hardware endpoints.',    Icon: Wrench,         enabled: false, },
    ],
  },
  {
    key: 'pms1682', name: 'PMS-1682', code: 'PMS-1682',
    desc: 'Solar energy management, power monitoring and grid analytics system.',
    Icon: Zap, enabled: true,
    features: [
      { key: 'pms-dashboard', label: 'Dashboard',       desc: 'Live solar output, consumption and savings overview.',      Icon: LayoutDashboard, enabled: true  },
      { key: 'pms-analytics', label: 'Analytics',       desc: 'Energy trend charts, daily/monthly production reports.',    Icon: LineChart,       enabled: true  },
      { key: 'pms-grid',      label: 'Grid Monitoring', desc: 'Real-time grid status, voltage and power flow metrics.',    Icon: SunMedium,      enabled: true  },
      { key: 'pms-reports',   label: 'Energy Reports',  desc: 'Exportable energy usage and cost savings reports.',         Icon: ClipboardList,  enabled: true  },
    ],
  },
  {
    key: 'spm1693b', name: 'SPM-1693', code: 'SPM-1693',
    desc: 'Sewing production monitoring, lot tracking and shift performance management.',
    Icon: BarChart3, enabled: true,
    features: [
      { key: 'spb-dashboard', label: 'Dashboard',        desc: 'Shift overview, lot status and operator performance.',     Icon: LayoutDashboard, enabled: true  },
      { key: 'spb-analytics', label: 'Analytics',        desc: 'Efficiency trends, DHU analysis and productivity charts.', Icon: LineChart,       enabled: true  },
      { key: 'spb-shifts',    label: 'Shift Management', desc: 'Define shift schedules, breaks and handover logs.',        Icon: ClipboardList,  enabled: true  },
      { key: 'spb-lots',      label: 'Lot Tracking',     desc: 'Track lot movement, WIP status and completion rates.',     Icon: Database,       enabled: false },
    ],
  },
  {
    key: 'bsm1740', name: 'BSM-1740', code: 'BSM-1740',
    desc: 'Batch and WIP system — work-in-progress lot tracking and movement management.',
    Icon: Layers, enabled: true,
    features: [
      { key: 'bsm-dashboard', label: 'Dashboard',          desc: 'WIP summary, batch status and floor movement map.',      Icon: LayoutDashboard, enabled: true  },
      { key: 'bsm-analytics', label: 'Analytics',          desc: 'Batch throughput, cycle time and bottleneck reports.',   Icon: LineChart,       enabled: true  },
      { key: 'bsm-wip',       label: 'WIP Tracking',       desc: 'Live lot location tracking across production stages.',   Icon: Database,       enabled: true  },
      { key: 'bsm-batch',     label: 'Batch Management',   desc: 'Create, assign and close production batches.',           Icon: ClipboardList,  enabled: true  },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function SkySettings() {
  const { user }  = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const isSuperAdmin = user?.role === 'Super admin';
  const isAdminPlus  = isSuperAdmin || user?.role === 'admin';
  const canManage    = isSuperAdmin;

  // State
  const [cat,       setCat]       = useState<Cat>('company');
  const [saved,     setSaved]     = useState<Cat | null>(null);
  const [apiMask,   setApiMask]   = useState(true);
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set());

  const [company,  setCompany]  = useState('Sky Technology (Pvt) Ltd');
  const [timezone, setTimezone] = useState('Asia/Colombo');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('LKR');

  const [modules, setModules] = useState<ModuleCfg[]>(INIT_MODULES);

  const [enforce2FA,     setEnforce2FA]     = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [minPwLen,       setMinPwLen]       = useState('8');
  const [maxAttempts,    setMaxAttempts]    = useState('5');
  const [ipWhitelist,    setIpWhitelist]    = useState('');
  const [auditLog,       setAuditLog]       = useState(true);

  const [emailNotif,   setEmailNotif]   = useState(true);
  const [smsNotif,     setSmsNotif]     = useState(false);
  const [pushNotif,    setPushNotif]    = useState(true);
  const [slackNotif,   setSlackNotif]   = useState(false);
  const [emailAddr,    setEmailAddr]    = useState('admin@skyos.lk');
  const [slackWebhook, setSlackWebhook] = useState('');

  const [defaultTheme, setDefaultTheme] = useState('dark');
  const [dateFormat,   setDateFormat]   = useState('YYYY-MM-DD');
  const [timeFormat,   setTimeFormat]   = useState('24h');
  const [autoLogout,   setAutoLogout]   = useState(true);

  const [debugMode,   setDebugMode]   = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [apiKey] = useState('sk-live-7f3k2p9m4n8q1r5t0v6w');

  // Helpers
  const toggleExpand = (key: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const toggleModule = (key: string) =>
    setModules(m => m.map(x => x.key === key ? { ...x, enabled: !x.enabled } : x));

  const toggleFeature = (moduleKey: string, featureKey: string) =>
    setModules(m => m.map(x =>
      x.key === moduleKey
        ? { ...x, features: x.features.map(f => f.key === featureKey ? { ...f, enabled: !f.enabled } : f) }
        : x
    ));

  const doSave = (section: Cat) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  // Style tokens
  const bg        = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card      = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inp       = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const textPri   = dark ? 'text-white'    : 'text-gray-900';
  const textSec   = dark ? 'text-zinc-400' : 'text-gray-600';
  const textMut   = dark ? 'text-zinc-500' : 'text-gray-400';
  const divider   = dark ? 'border-gray-800' : 'border-gray-200';
  const hdr       = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const catBg     = dark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200';
  const catActive = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
  const catHover  = dark ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900';
  const subBg     = dark ? 'bg-gray-800/50' : 'bg-gray-50';

  const SaveBtn = ({ section }: { section: Cat }) =>
    canManage ? (
      <div className="flex items-center gap-3 pt-4 mt-2">
        <button
          onClick={() => doSave(section)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow shadow-orange-500/20"
        >
          <Save size={13} /> Save Changes
        </button>
        {saved === section && (
          <span className="flex items-center gap-1.5 text-green-500 text-sm font-semibold">
            <CheckCircle size={14} /> Saved!
          </span>
        )}
      </div>
    ) : null;

  // Access gate
  if (!isAdminPlus) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${bg}`}>
        <div className={`rounded-2xl border p-10 text-center max-w-sm ${card}`}>
          <Lock size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className={`text-lg font-bold mb-2 ${textPri}`}>Access Denied</h2>
          <p className={`text-sm ${textSec}`}>Only Admins and Super Admins can access Settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${bg}`}>

      {/* Header */}
      <div className={`shrink-0 flex flex-wrap items-center gap-2 md:gap-3 px-4 md:px-6 py-3 border-b ${hdr}`}>
        <Settings size={17} className="text-orange-500 shrink-0" />
        <h1 className={`text-base font-bold ${textPri}`}>System Settings</h1>
        <span className={`text-xs ${textMut} hidden sm:inline`}>— SkyOS Configuration</span>
        {!canManage && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-yellow-500 font-semibold">
            <Info size={12} /> View-only mode
          </span>
        )}
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">

        {/* Categories — horizontal strip on mobile, vertical list on desktop */}
        <div className={`shrink-0 md:w-52 border-b md:border-b-0 md:border-r overflow-x-auto md:overflow-x-hidden md:overflow-y-auto px-3 py-2 md:py-4 ${catBg}`}>
          <div className="flex md:flex-col gap-1 w-max md:w-auto">
            {CATEGORIES.map(c => (
              <CatItem
                key={c.id} id={c.id} Icon={c.Icon} label={c.label}
                active={cat === c.id} onClick={setCat}
                activeClass={catActive} hoverClass={catHover} textSec={textSec}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-3xl space-y-5">

            {/* ── COMPANY ───────────────────────────────────────────────────── */}
            {cat === 'company' && (
              <SectionCard title="Organisation Profile" desc="Displayed across all modules of the OS." card={card} textPri={textPri} textMut={textMut}>
                <div className={`divide-y ${divider} ${textPri}`}>
                  <SettingRow label="Company Name" desc="Shown in the topbar and reports" dividerClass={divider}
                    right={<SettingInput value={company} onChange={canManage ? setCompany : undefined} readOnly={!canManage} inp={inp} className="w-full sm:w-60" />}
                  />
                  <SettingRow label="Timezone" desc="Used for all timestamps" dividerClass={divider}
                    right={
                      <SettingSelect value={timezone} onChange={canManage ? setTimezone : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-60"
                        options={[
                          { value: 'Asia/Colombo',     label: 'Asia/Colombo (IST+0:30)' },
                          { value: 'Asia/Kolkata',     label: 'Asia/Kolkata (IST)'       },
                          { value: 'UTC',              label: 'UTC'                      },
                          { value: 'America/New_York', label: 'America/New_York (EST)'   },
                          { value: 'Europe/London',    label: 'Europe/London (GMT)'      },
                        ]}
                      />
                    }
                  />
                  <SettingRow label="Language" desc="Default display language" dividerClass={divider}
                    right={
                      <SettingSelect value={language} onChange={canManage ? setLanguage : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-60"
                        options={[
                          { value: 'en', label: 'English'  },
                          { value: 'si', label: 'Sinhala'  },
                          { value: 'ta', label: 'Tamil'    },
                          { value: 'ja', label: 'Japanese' },
                        ]}
                      />
                    }
                  />
                  <SettingRow label="Currency" desc="Used in financial reports" divider={false}
                    right={
                      <SettingSelect value={currency} onChange={canManage ? setCurrency : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-60"
                        options={[
                          { value: 'LKR', label: 'LKR — Sri Lankan Rupee' },
                          { value: 'USD', label: 'USD — US Dollar'        },
                          { value: 'EUR', label: 'EUR — Euro'              },
                          { value: 'JPY', label: 'JPY — Japanese Yen'     },
                        ]}
                      />
                    }
                  />
                </div>
                <SaveBtn section="company" />
              </SectionCard>
            )}

            {/* ── MODULES ───────────────────────────────────────────────────── */}
            {cat === 'modules' && (
              <>
                {/* Info banner */}
                <div className={`rounded-xl border p-4 flex items-start gap-2 ${dark ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                  <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-400">
                    Disabling a system hides it entirely. Expand any system to control its individual features — Dashboard, Analytics and more.
                  </p>
                </div>

                {/* One card per system */}
                {modules.map(m => {
                  const isOpen     = expanded.has(m.key);
                  const allOn      = m.features.every(f => f.enabled);
                  const someOn     = m.features.some(f => f.enabled);
                  const enabledCnt = m.features.filter(f => f.enabled).length;

                  return (
                    <div key={m.key} className={`rounded-xl border overflow-hidden transition-all ${card}`}>

                      {/* ── System header row ─────────────────────────────── */}
                      <div className="flex items-center gap-3 px-4 py-3.5">

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          m.enabled
                            ? dark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600'
                            : dark ? 'bg-zinc-800 text-zinc-600'        : 'bg-gray-100 text-gray-400'
                        }`}>
                          <m.Icon size={18} />
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-bold ${m.enabled ? textPri : textMut}`}>{m.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                              dark ? 'border-zinc-700 text-zinc-500 bg-zinc-800' : 'border-gray-200 text-gray-400 bg-gray-100'
                            }`}>{m.code}</span>
                            {m.tag && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/20">{m.tag}</span>
                            )}
                            {!m.enabled && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${dark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-400'}`}>DISABLED</span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${textMut}`}>{m.desc}</p>
                        </div>

                        {/* Feature count pill */}
                        {m.enabled && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            allOn
                              ? dark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-600'
                              : someOn
                                ? dark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600'
                                : dark ? 'bg-zinc-800 text-zinc-500'        : 'bg-gray-100 text-gray-400'
                          }`}>
                            {enabledCnt}/{m.features.length} on
                          </span>
                        )}

                        {/* Master toggle */}
                        <Toggle
                          checked={m.enabled}
                          onChange={() => canManage && toggleModule(m.key)}
                          dark={dark}
                          disabled={!canManage}
                        />

                        {/* Expand button */}
                        <button
                          onClick={() => toggleExpand(m.key)}
                          className={`p-1.5 rounded-lg transition-colors shrink-0 ${dark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          {isOpen
                            ? <ChevronDown size={16} />
                            : <ChevronRight size={16} />}
                        </button>
                      </div>

                      {/* ── Sub-features panel ────────────────────────────── */}
                      {isOpen && (
                        <div className={`border-t ${divider} ${subBg} px-4 py-3 space-y-1`}>

                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${textMut}`}>
                            Feature Controls
                          </p>

                          {m.features.map((f, fi) => {
                            const isLast    = fi === m.features.length - 1;
                            const dimmed    = !m.enabled;

                            return (
                              <div
                                key={f.key}
                                className={`flex items-center gap-3 py-2.5 ${!isLast ? `border-b ${divider}` : ''} ${dimmed ? 'opacity-40 pointer-events-none' : ''}`}
                              >
                                {/* Feature icon */}
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  f.enabled
                                    ? dark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-500'
                                    : dark ? 'bg-zinc-700 text-zinc-500'        : 'bg-gray-200 text-gray-400'
                                }`}>
                                  <f.Icon size={13} />
                                </div>

                                {/* Label + desc */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-semibold ${f.enabled ? textPri : textMut}`}>{f.label}</p>
                                  <p className={`text-[11px] mt-0.5 ${textMut}`}>{f.desc}</p>
                                </div>

                                {/* Status badge */}
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                  f.enabled
                                    ? dark ? 'bg-green-500/15 text-green-400' : 'bg-green-50 text-green-600'
                                    : dark ? 'bg-zinc-700 text-zinc-500'      : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {f.enabled ? 'ON' : 'OFF'}
                                </span>

                                {/* Feature toggle (sm) */}
                                <Toggle
                                  size="sm"
                                  checked={f.enabled}
                                  onChange={() => canManage && toggleFeature(m.key, f.key)}
                                  dark={dark}
                                  disabled={!canManage}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <SaveBtn section="modules" />
              </>
            )}

            {/* ── SECURITY ──────────────────────────────────────────────────── */}
            {cat === 'security' && (
              <>
                <SectionCard title="Authentication" desc="Login and session management policies." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Enforce 2FA for all users" desc="TOTP required on every login" dividerClass={divider}
                      right={<Toggle checked={enforce2FA} onChange={canManage ? setEnforce2FA : () => {}} dark={dark} disabled={!canManage} />}
                    />
                    <SettingRow label="Session timeout (minutes)" desc="Force re-login after inactivity" dividerClass={divider}
                      right={<SettingInput value={sessionTimeout} onChange={canManage ? setSessionTimeout : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24" />}
                    />
                    <SettingRow label="Max login attempts" desc="Account locked after this many failed attempts" dividerClass={divider}
                      right={<SettingInput value={maxAttempts} onChange={canManage ? setMaxAttempts : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24" />}
                    />
                    <SettingRow label="Minimum password length" desc="Enforced at registration and password change" divider={false}
                      right={<SettingInput value={minPwLen} onChange={canManage ? setMinPwLen : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24" />}
                    />
                  </div>
                  <SaveBtn section="security" />
                </SectionCard>

                <SectionCard title="Audit & Access" desc="Logging and IP restriction settings." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Enable audit log" desc="Log all user actions and system events" dividerClass={divider}
                      right={<Toggle checked={auditLog} onChange={canManage ? setAuditLog : () => {}} dark={dark} disabled={!canManage} />}
                    />
                    <SettingRow label="IP Whitelist" desc="Comma-separated IPs (leave empty to allow all)" divider={false}
                      right={<SettingInput value={ipWhitelist} onChange={canManage ? setIpWhitelist : undefined} readOnly={!canManage} inp={inp} className="w-full sm:w-60" placeholder="192.168.1.0/24, 10.0.0.1" />}
                    />
                  </div>
                  <SaveBtn section="security" />
                </SectionCard>
              </>
            )}

            {/* ── NOTIFICATIONS ─────────────────────────────────────────────── */}
            {cat === 'notifications' && (
              <>
                <SectionCard title="Notification Channels" desc="Choose how the system delivers alerts to users." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Email notifications" desc="Send alerts via email" dividerClass={divider}
                      right={<Toggle checked={emailNotif} onChange={canManage ? setEmailNotif : () => {}} dark={dark} disabled={!canManage} />}
                    />
                    <SettingRow label="SMS notifications" desc="Send critical alerts via SMS gateway" dividerClass={divider}
                      right={<Toggle checked={smsNotif} onChange={canManage ? setSmsNotif : () => {}} dark={dark} disabled={!canManage} />}
                    />
                    <SettingRow label="Push notifications" desc="In-browser push alerts" dividerClass={divider}
                      right={<Toggle checked={pushNotif} onChange={canManage ? setPushNotif : () => {}} dark={dark} disabled={!canManage} />}
                    />
                    <SettingRow label="Slack integration" desc="Post alerts to a Slack channel" divider={false}
                      right={<Toggle checked={slackNotif} onChange={canManage ? setSlackNotif : () => {}} dark={dark} disabled={!canManage} />}
                    />
                  </div>
                  <SaveBtn section="notifications" />
                </SectionCard>

                <SectionCard title="Delivery Configuration" desc="Addresses and endpoints for each channel." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Admin email address" desc="Primary email for system alerts" dividerClass={divider}
                      right={<SettingInput value={emailAddr} onChange={canManage ? setEmailAddr : undefined} readOnly={!canManage} type="email" inp={inp} className="w-full sm:w-60" />}
                    />
                    <SettingRow label="Slack webhook URL" desc="Incoming webhook from your Slack workspace" divider={false}
                      right={<SettingInput value={slackWebhook} onChange={canManage ? setSlackWebhook : undefined} readOnly={!canManage} inp={inp} className="w-full sm:w-60" placeholder="https://hooks.slack.com/…" />}
                    />
                  </div>
                  <SaveBtn section="notifications" />
                </SectionCard>
              </>
            )}

            {/* ── SYSTEM ────────────────────────────────────────────────────── */}
            {cat === 'system' && (
              <>
                <SectionCard title="Appearance & Locale" desc="Default interface settings applied to all new sessions." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Default theme" desc="Applied when a user logs in for the first time" dividerClass={divider}
                      right={
                        <SettingSelect value={defaultTheme} onChange={canManage ? setDefaultTheme : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-40"
                          options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
                        />
                      }
                    />
                    <SettingRow label="Date format" dividerClass={divider}
                      right={
                        <SettingSelect value={dateFormat} onChange={canManage ? setDateFormat : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-40"
                          options={[
                            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                          ]}
                        />
                      }
                    />
                    <SettingRow label="Time format" divider={false}
                      right={
                        <SettingSelect value={timeFormat} onChange={canManage ? setTimeFormat : undefined} readOnly={!canManage} inp={inp} textMut={textMut} className="w-full sm:w-40"
                          options={[{ value: '24h', label: '24-hour' }, { value: '12h', label: '12-hour (AM/PM)' }]}
                        />
                      }
                    />
                  </div>
                  <SaveBtn section="system" />
                </SectionCard>

                <SectionCard title="Session Behaviour" card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Auto-logout on tab close" desc="Immediately invalidate session when browser tab is closed" divider={false}
                      right={<Toggle checked={autoLogout} onChange={canManage ? setAutoLogout : () => {}} dark={dark} disabled={!canManage} />}
                    />
                  </div>
                  <SaveBtn section="system" />
                </SectionCard>
              </>
            )}

            {/* ── DEVELOPER ─────────────────────────────────────────────────── */}
            {cat === 'developer' && (
              <>
                {!isSuperAdmin && (
                  <div className={`rounded-xl border p-4 flex items-start gap-2 ${dark ? 'bg-yellow-900/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'}`}>
                    <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-500">Developer settings require Super Admin access. Viewing only.</p>
                  </div>
                )}

                <SectionCard title="API Access" desc="REST API key for external integrations." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${textMut}`}>API Key</div>
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-xs ${dark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
                    <span className={`flex-1 ${textSec}`}>{apiMask ? '•'.repeat(apiKey.length) : apiKey}</span>
                    <button onClick={() => setApiMask(p => !p)}
                      className={`p-1 rounded transition-colors ${dark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'} ${textMut}`}>
                      <span className="text-[10px]">{apiMask ? 'Show' : 'Hide'}</span>
                    </button>
                    <button onClick={() => navigator.clipboard?.writeText(apiKey)}
                      className={`p-1 rounded transition-colors ${dark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'} ${textMut}`}>
                      <Copy size={12} />
                    </button>
                    {isSuperAdmin && (
                      <button className={`p-1 rounded transition-colors ${dark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200'} text-orange-400`}>
                        <RefreshCw size={12} />
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Debug & Maintenance" warn desc="Changes here affect all active users immediately." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Debug mode" desc="Enable verbose logging and stack traces in the UI" dividerClass={divider}
                      right={<Toggle checked={debugMode} onChange={isSuperAdmin ? setDebugMode : () => {}} dark={dark} disabled={!isSuperAdmin} />}
                    />
                    <SettingRow label="Maintenance mode" desc="Lock all users out except Super Admins" divider={false}
                      right={<Toggle checked={maintenance} onChange={isSuperAdmin ? setMaintenance : () => {}} dark={dark} disabled={!isSuperAdmin} />}
                    />
                  </div>
                  {maintenance && (
                    <div className={`mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
                      <AlertTriangle size={12} /> Maintenance mode is <strong>ON</strong> — all non-admin users are currently blocked.
                    </div>
                  )}
                  {isSuperAdmin && <SaveBtn section="developer" />}
                </SectionCard>

                <SectionCard title="System Information" desc="Build and runtime details." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider}`}>
                    {[
                      ['SkyOS Version', '2.0.0'],
                      ['Build',         '20250604-prod'],
                      ['Environment',   'Production'],
                      ['Runtime',       'React 19 / Vite 8'],
                      ['API Status',    '● Online'],
                      ['Database',      '● Connected'],
                      ['Last Deploy',   '2025-06-04  14:32 UTC'],
                    ].map(([k, v]) => (
                      <div key={k} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${divider}`}>
                        <span className={`text-xs ${textSec}`}>{k}</span>
                        <span className={`text-xs font-mono font-semibold ${String(v).startsWith('●') ? 'text-green-500' : textPri}`}>{v}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
