import { useState } from 'react';
import {
  Settings, Building2, ToggleLeft, Shield, Bell, Monitor,
  Code2, Save, CheckCircle, Lock, Copy, RefreshCw,
  Factory, Cpu, Zap, Brain, Globe, Server, Activity,
  AlertTriangle, Info,
} from 'lucide-react';
import { useAuth } from './sky_auth';
import { useTheme } from '../../context/ThemeContext';

// ── Types ──────────────────────────────────────────────────────────────────────
type Cat = 'company' | 'modules' | 'security' | 'notifications' | 'system' | 'developer';

interface ModuleCfg {
  key: string; name: string; desc: string;
  Icon: React.ElementType; enabled: boolean; tag?: string;
}

// ── Sub-components (defined OUTSIDE — no recreation on render) ─────────────────

interface ToggleProps {
  checked: boolean; onChange: (v: boolean) => void;
  disabled?: boolean; dark: boolean;
}
function Toggle({ checked, onChange, disabled = false, dark }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
        disabled ? 'opacity-40 cursor-not-allowed' :
        checked   ? 'bg-orange-500' :
        dark      ? 'bg-zinc-700'   : 'bg-gray-300'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`}/>
    </button>
  );
}

interface RowProps {
  label: string; desc?: string; right: React.ReactNode;
  divider?: boolean; dividerClass?: string;
}
function SettingRow({ label, desc, right, divider = true, dividerClass = '' }: RowProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${divider ? `border-b ${dividerClass}` : ''}`}>
      <div className="mr-4 min-w-0">
        <p className="text-sm font-medium leading-tight">{label}</p>
        {desc && <p className="text-xs mt-0.5 opacity-60">{desc}</p>}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

interface CardProps {
  title: string; desc?: string; children: React.ReactNode;
  card: string; textPri: string; textMut: string; warn?: boolean;
}
function SectionCard({ title, desc, children, card, textPri, textMut, warn }: CardProps) {
  return (
    <div className={`rounded-xl border p-5 ${card}`}>
      <div className="flex items-start gap-2 mb-4">
        {warn && <AlertTriangle size={15} className="text-yellow-500 shrink-0 mt-0.5"/>}
        <div>
          <h3 className={`text-sm font-bold ${textPri}`}>{title}</h3>
          {desc && <p className={`text-xs mt-0.5 ${textMut}`}>{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

interface InputProps {
  value: string; onChange?: (v: string) => void;
  readOnly?: boolean; type?: string; className?: string; inp: string;
}
function SettingInput({ value, onChange, readOnly = false, type = 'text', className = '', inp }: InputProps) {
  return (
    <input
      type={type} value={value} readOnly={readOnly}
      onChange={e => onChange?.(e.target.value)}
      className={`px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inp} ${
        readOnly ? 'opacity-55 cursor-not-allowed' : ''
      } ${className}`}
    />
  );
}

interface SelectProps {
  value: string; onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  readOnly?: boolean; inp: string; textMut: string; className?: string;
}
function SettingSelect({ value, onChange, options, readOnly = false, inp, textMut, className = '' }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value} disabled={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full appearance-none px-3 py-2 rounded-lg border text-sm outline-none transition-colors pr-8 ${inp} ${
          readOnly ? 'opacity-55 cursor-not-allowed' : ''
        }`}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] ${textMut}`}>▾</span>
    </div>
  );
}

interface CatItemProps {
  id: Cat; Icon: React.ElementType; label: string;
  active: boolean; onClick: (id: Cat) => void;
  activeClass: string; hoverClass: string; textSec: string;
}
function CatItem({ id, Icon, label, active, onClick, activeClass, hoverClass, textSec }: CatItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-1 ${
        active ? activeClass : `${textSec} ${hoverClass}`
      }`}
    >
      <Icon size={16}/> {label}
    </button>
  );
}

// ── Static data ────────────────────────────────────────────────────────────────
const CATEGORIES: { id: Cat; Icon: React.ElementType; label: string }[] = [
  { id:'company',       Icon:Building2,   label:'Company'        },
  { id:'modules',       Icon:ToggleLeft,  label:'System Modules' },
  { id:'security',      Icon:Shield,      label:'Security'       },
  { id:'notifications', Icon:Bell,        label:'Notifications'  },
  { id:'system',        Icon:Monitor,     label:'System'         },
  { id:'developer',     Icon:Code2,       label:'Developer'      },
];

const INIT_MODULES: ModuleCfg[] = [
  { key:'dashboard',   name:'Dashboard',           desc:'Main OS command center with KPIs and system overview.',      Icon:Monitor,  enabled:true  },
  { key:'production',  name:'Production Tracking',  desc:'Real-time production line monitoring and shift analytics.',  Icon:Factory,  enabled:true  },
  { key:'wip',         name:'WIP System',            desc:'Work-in-progress lot tracking and movement management.',     Icon:Activity, enabled:true  },
  { key:'dcsc',        name:'DCSC1515A',             desc:'Industrial control system integration module.',             Icon:Cpu,      enabled:true  },
  { key:'andon',       name:'Smart Andon',           desc:'Andon alert system for production line issue escalation.',  Icon:Bell,     enabled:true  },
  { key:'solar',       name:'Solar System',          desc:'Solar energy management and grid monitoring.',              Icon:Zap,      enabled:true  },
  { key:'custom1',     name:'Custom System 1',       desc:'Auxiliary module for secondary automation workflows.',      Icon:Globe,    enabled:true  },
  { key:'custom2',     name:'Custom System 2',       desc:'Backup controller and redundancy management.',             Icon:Server,   enabled:false, tag:'Beta' },
  { key:'ai',          name:'AI Insights',           desc:'AI-powered production analytics and recommendations.',     Icon:Brain,    enabled:true  },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function SkySettings() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const isSuperAdmin = user?.role === 'Super admin';
  const isAdminPlus  = isSuperAdmin || user?.role === 'admin';
  const canManage    = isSuperAdmin;

  // ── Form state ────────────────────────────────────────────────────────────
  const [cat,     setCat]     = useState<Cat>('company');
  const [saved,   setSaved]   = useState<Cat | null>(null);
  const [apiMask, setApiMask] = useState(true);

  // Company
  const [company,   setCompany]   = useState('Sky Technology (Pvt) Ltd');
  const [timezone,  setTimezone]  = useState('Asia/Colombo');
  const [language,  setLanguage]  = useState('en');
  const [currency,  setCurrency]  = useState('LKR');

  // Modules
  const [modules, setModules] = useState<ModuleCfg[]>(INIT_MODULES);

  // Security
  const [enforce2FA,     setEnforce2FA]     = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [minPwLen,       setMinPwLen]       = useState('8');
  const [maxAttempts,    setMaxAttempts]    = useState('5');
  const [ipWhitelist,    setIpWhitelist]    = useState('');
  const [auditLog,       setAuditLog]       = useState(true);

  // Notifications
  const [emailNotif,   setEmailNotif]   = useState(true);
  const [smsNotif,     setSmsNotif]     = useState(false);
  const [pushNotif,    setPushNotif]    = useState(true);
  const [slackNotif,   setSlackNotif]   = useState(false);
  const [emailAddr,    setEmailAddr]    = useState('admin@skyos.lk');
  const [slackWebhook, setSlackWebhook] = useState('');

  // System
  const [defaultTheme, setDefaultTheme] = useState('dark');
  const [dateFormat,   setDateFormat]   = useState('YYYY-MM-DD');
  const [timeFormat,   setTimeFormat]   = useState('24h');
  const [autoLogout,   setAutoLogout]   = useState(true);

  // Developer
  const [debugMode,   setDebugMode]   = useState(false);
  const [maintenance, setMaintenance] = useState(false);
  const [apiKey] = useState('sk-live-7f3k2p9m4n8q1r5t0v6w');

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleModule = (key: string) =>
    setModules(m => m.map(x => x.key === key ? { ...x, enabled: !x.enabled } : x));

  const doSave = (section: Cat) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2500);
  };

  // ── Style tokens ──────────────────────────────────────────────────────────
  const bg      = dark ? 'bg-gray-950'                  : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-200';
  const inp     = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const textPri  = dark ? 'text-white'    : 'text-gray-900';
  const textSec  = dark ? 'text-zinc-400' : 'text-gray-600';
  const textMut  = dark ? 'text-zinc-500' : 'text-gray-400';
  const divider  = dark ? 'border-gray-800' : 'border-gray-200';
  const hdr      = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const catBg    = dark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200';
  const catActive = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
  const catHover  = dark ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900';

  const saveBtn = (section: Cat) =>
    canManage ? (
      <div className="flex items-center gap-3 pt-4 mt-2">
        <button
          onClick={() => doSave(section)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow shadow-orange-500/20"
        >
          <Save size={13}/> Save Changes
        </button>
        {saved === section && (
          <span className="flex items-center gap-1.5 text-green-500 text-sm font-semibold">
            <CheckCircle size={14}/> Saved!
          </span>
        )}
      </div>
    ) : null;

  // ── Access gate ───────────────────────────────────────────────────────────
  if (!isAdminPlus) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${bg}`}>
        <div className={`rounded-2xl border p-10 text-center max-w-sm ${card}`}>
          <Lock size={40} className="text-red-400 mx-auto mb-4"/>
          <h2 className={`text-lg font-bold mb-2 ${textPri}`}>Access Denied</h2>
          <p className={`text-sm ${textSec}`}>Only Admins and Super Admins can access Settings.</p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${bg}`}>

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className={`shrink-0 flex items-center gap-3 px-6 py-3 border-b ${hdr}`}>
        <Settings size={17} className="text-orange-500"/>
        <h1 className={`text-base font-bold ${textPri}`}>System Settings</h1>
        <span className={`text-xs ${textMut}`}>— SkyOS Configuration</span>
        {!canManage && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-yellow-500 font-semibold">
            <Info size={12}/> View-only mode
          </span>
        )}
      </div>

      {/* ── Two-panel layout ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* LEFT: category list */}
        <div className={`shrink-0 w-52 border-r overflow-y-auto px-3 py-4 ${catBg}`}>
          {CATEGORIES.map(c => (
            <CatItem
              key={c.id} id={c.id} Icon={c.Icon} label={c.label}
              active={cat === c.id} onClick={setCat}
              activeClass={catActive} hoverClass={catHover} textSec={textSec}
            />
          ))}
        </div>

        {/* RIGHT: content */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 max-w-3xl space-y-5">

            {/* ── COMPANY ──────────────────────────────────────────────────── */}
            {cat === 'company' && (
              <>
                <SectionCard title="Organisation Profile" desc="Displayed across all modules of the OS." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Company Name" desc="Shown in the topbar and reports"
                      dividerClass={divider}
                      right={<SettingInput value={company} onChange={canManage ? setCompany : undefined} readOnly={!canManage} inp={inp} className="w-60"/>}
                    />
                    <SettingRow label="Timezone" desc="Used for all timestamps in the system"
                      dividerClass={divider}
                      right={
                        <SettingSelect value={timezone} onChange={canManage ? setTimezone : undefined} readOnly={!canManage}
                          options={[
                            { value:'Asia/Colombo',    label:'Asia/Colombo (IST+0:30)' },
                            { value:'Asia/Kolkata',    label:'Asia/Kolkata (IST)' },
                            { value:'UTC',             label:'UTC' },
                            { value:'America/New_York',label:'America/New_York (EST)' },
                            { value:'Europe/London',   label:'Europe/London (GMT)' },
                          ]}
                          inp={inp} textMut={textMut} className="w-60"
                        />
                      }
                    />
                    <SettingRow label="Language" desc="Default display language"
                      dividerClass={divider}
                      right={
                        <SettingSelect value={language} onChange={canManage ? setLanguage : undefined} readOnly={!canManage}
                          options={[
                            { value:'en', label:'English' },
                            { value:'si', label:'Sinhala' },
                            { value:'ta', label:'Tamil' },
                            { value:'ja', label:'Japanese' },
                          ]}
                          inp={inp} textMut={textMut} className="w-60"
                        />
                      }
                    />
                    <SettingRow label="Currency" desc="Used in financial reports and exports" divider={false}
                      right={
                        <SettingSelect value={currency} onChange={canManage ? setCurrency : undefined} readOnly={!canManage}
                          options={[
                            { value:'LKR', label:'LKR — Sri Lankan Rupee' },
                            { value:'USD', label:'USD — US Dollar' },
                            { value:'EUR', label:'EUR — Euro' },
                            { value:'JPY', label:'JPY — Japanese Yen' },
                          ]}
                          inp={inp} textMut={textMut} className="w-60"
                        />
                      }
                    />
                  </div>
                  {saveBtn('company')}
                </SectionCard>
              </>
            )}

            {/* ── MODULES ──────────────────────────────────────────────────── */}
            {cat === 'modules' && (
              <>
                <div className={`rounded-xl border p-4 flex items-start gap-2 ${dark?'bg-blue-900/10 border-blue-500/20':'bg-blue-50 border-blue-200'}`}>
                  <Info size={14} className="text-blue-400 shrink-0 mt-0.5"/>
                  <p className="text-xs text-blue-400">
                    Disabling a module hides it from the sidebar and blocks all user access. Active sessions are terminated immediately.
                  </p>
                </div>
                <SectionCard title="System Modules" desc="Toggle individual modules on or off across the entire OS." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider}`}>
                    {modules.map((m, i) => (
                      <div key={m.key} className={`flex items-center justify-between py-3.5 ${i===modules.length-1?'':'border-b '+divider}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            m.enabled
                              ? dark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600'
                              : dark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <m.Icon size={17}/>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold ${m.enabled ? textPri : textMut}`}>{m.name}</p>
                              {m.tag && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-500/15 text-yellow-500 border border-yellow-500/20">{m.tag}</span>}
                              {!m.enabled && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${dark?'bg-zinc-800 text-zinc-500':'bg-gray-100 text-gray-400'}`}>DISABLED</span>}
                            </div>
                            <p className={`text-xs mt-0.5 ${textMut}`}>{m.desc}</p>
                          </div>
                        </div>
                        <Toggle checked={m.enabled} onChange={() => canManage && toggleModule(m.key)} dark={dark} disabled={!canManage}/>
                      </div>
                    ))}
                  </div>
                  {saveBtn('modules')}
                </SectionCard>
              </>
            )}

            {/* ── SECURITY ─────────────────────────────────────────────────── */}
            {cat === 'security' && (
              <>
                <SectionCard title="Authentication" desc="Login and session management policies." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Enforce 2FA for all users" desc="TOTP required on every login"
                      dividerClass={divider}
                      right={<Toggle checked={enforce2FA} onChange={canManage ? setEnforce2FA : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                    <SettingRow label="Session timeout (minutes)" desc="Force re-login after inactivity"
                      dividerClass={divider}
                      right={<SettingInput value={sessionTimeout} onChange={canManage ? setSessionTimeout : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24"/>}
                    />
                    <SettingRow label="Max login attempts" desc="Account locked after this many failed attempts"
                      dividerClass={divider}
                      right={<SettingInput value={maxAttempts} onChange={canManage ? setMaxAttempts : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24"/>}
                    />
                    <SettingRow label="Minimum password length" desc="Enforced at registration and password change" divider={false}
                      right={<SettingInput value={minPwLen} onChange={canManage ? setMinPwLen : undefined} readOnly={!canManage} type="number" inp={inp} className="w-24"/>}
                    />
                  </div>
                  {saveBtn('security')}
                </SectionCard>

                <SectionCard title="Audit &amp; Access" desc="Logging and IP restriction settings." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Enable audit log" desc="Log all user actions and system events"
                      dividerClass={divider}
                      right={<Toggle checked={auditLog} onChange={canManage ? setAuditLog : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                    <SettingRow label="IP Whitelist" desc="Comma-separated IPs (leave empty to allow all)" divider={false}
                      right={<SettingInput value={ipWhitelist} onChange={canManage ? setIpWhitelist : undefined} readOnly={!canManage} inp={inp} className="w-60" placeholder="192.168.1.0/24, 10.0.0.1"/>}
                    />
                  </div>
                  {saveBtn('security')}
                </SectionCard>
              </>
            )}

            {/* ── NOTIFICATIONS ────────────────────────────────────────────── */}
            {cat === 'notifications' && (
              <>
                <SectionCard title="Notification Channels" desc="Choose how the system delivers alerts to users." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Email notifications" desc="Send alerts via email"
                      dividerClass={divider}
                      right={<Toggle checked={emailNotif} onChange={canManage ? setEmailNotif : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                    <SettingRow label="SMS notifications" desc="Send critical alerts via SMS gateway"
                      dividerClass={divider}
                      right={<Toggle checked={smsNotif} onChange={canManage ? setSmsNotif : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                    <SettingRow label="Push notifications" desc="In-browser push alerts"
                      dividerClass={divider}
                      right={<Toggle checked={pushNotif} onChange={canManage ? setPushNotif : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                    <SettingRow label="Slack integration" desc="Post alerts to a Slack channel" divider={false}
                      right={<Toggle checked={slackNotif} onChange={canManage ? setSlackNotif : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                  </div>
                  {saveBtn('notifications')}
                </SectionCard>

                <SectionCard title="Delivery Configuration" desc="Addresses and endpoints for each channel." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Admin email address" desc="Primary email for system alerts"
                      dividerClass={divider}
                      right={<SettingInput value={emailAddr} onChange={canManage ? setEmailAddr : undefined} readOnly={!canManage} type="email" inp={inp} className="w-60"/>}
                    />
                    <SettingRow label="Slack webhook URL" desc="Incoming webhook from your Slack workspace" divider={false}
                      right={<SettingInput value={slackWebhook} onChange={canManage ? setSlackWebhook : undefined} readOnly={!canManage} inp={inp} className="w-60" placeholder="https://hooks.slack.com/…"/>}
                    />
                  </div>
                  {saveBtn('notifications')}
                </SectionCard>
              </>
            )}

            {/* ── SYSTEM ───────────────────────────────────────────────────── */}
            {cat === 'system' && (
              <>
                <SectionCard title="Appearance &amp; Locale" desc="Default interface settings applied to all new sessions." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Default theme" desc="Applied when a user logs in for the first time"
                      dividerClass={divider}
                      right={
                        <SettingSelect value={defaultTheme} onChange={canManage ? setDefaultTheme : undefined} readOnly={!canManage}
                          options={[{ value:'dark', label:'Dark' }, { value:'light', label:'Light' }]}
                          inp={inp} textMut={textMut} className="w-40"
                        />
                      }
                    />
                    <SettingRow label="Date format"
                      dividerClass={divider}
                      right={
                        <SettingSelect value={dateFormat} onChange={canManage ? setDateFormat : undefined} readOnly={!canManage}
                          options={[
                            { value:'YYYY-MM-DD', label:'YYYY-MM-DD' },
                            { value:'DD/MM/YYYY', label:'DD/MM/YYYY' },
                            { value:'MM/DD/YYYY', label:'MM/DD/YYYY' },
                          ]}
                          inp={inp} textMut={textMut} className="w-40"
                        />
                      }
                    />
                    <SettingRow label="Time format" divider={false}
                      right={
                        <SettingSelect value={timeFormat} onChange={canManage ? setTimeFormat : undefined} readOnly={!canManage}
                          options={[{ value:'24h', label:'24-hour' }, { value:'12h', label:'12-hour (AM/PM)' }]}
                          inp={inp} textMut={textMut} className="w-40"
                        />
                      }
                    />
                  </div>
                  {saveBtn('system')}
                </SectionCard>

                <SectionCard title="Session Behaviour" card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Auto-logout on tab close" desc="Immediately invalidate session when browser tab is closed" divider={false}
                      right={<Toggle checked={autoLogout} onChange={canManage ? setAutoLogout : ()=>{}} dark={dark} disabled={!canManage}/>}
                    />
                  </div>
                  {saveBtn('system')}
                </SectionCard>
              </>
            )}

            {/* ── DEVELOPER ────────────────────────────────────────────────── */}
            {cat === 'developer' && (
              <>
                {!isSuperAdmin && (
                  <div className={`rounded-xl border p-4 flex items-start gap-2 ${dark?'bg-yellow-900/10 border-yellow-500/20':'bg-yellow-50 border-yellow-200'}`}>
                    <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5"/>
                    <p className="text-xs text-yellow-500">Developer settings require Super Admin access. Viewing only.</p>
                  </div>
                )}

                <SectionCard title="API Access" desc="REST API key for external integrations." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${textMut}`}>API Key</div>
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-xs ${dark?'bg-zinc-800 border-zinc-700':'bg-gray-50 border-gray-200'}`}>
                    <span className={`flex-1 ${textSec}`}>
                      {apiMask ? '•'.repeat(apiKey.length) : apiKey}
                    </span>
                    <button onClick={() => setApiMask(p => !p)}
                      className={`p-1 rounded transition-colors ${dark?'hover:bg-zinc-700':'hover:bg-gray-200'} ${textMut}`} title="Toggle visibility">
                      {apiMask ? <span className="text-[10px]">Show</span> : <span className="text-[10px]">Hide</span>}
                    </button>
                    <button onClick={() => navigator.clipboard?.writeText(apiKey)}
                      className={`p-1 rounded transition-colors ${dark?'hover:bg-zinc-700':'hover:bg-gray-200'} ${textMut}`} title="Copy">
                      <Copy size={12}/>
                    </button>
                    {isSuperAdmin && (
                      <button className={`p-1 rounded transition-colors ${dark?'hover:bg-zinc-700':'hover:bg-gray-200'} text-orange-400`} title="Regenerate">
                        <RefreshCw size={12}/>
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Debug &amp; Maintenance" warn card={card} textPri={textPri} textMut={textMut}
                  desc="Changes here affect all active users immediately.">
                  <div className={`divide-y ${divider} ${textPri}`}>
                    <SettingRow label="Debug mode" desc="Enable verbose logging and stack traces in the UI"
                      dividerClass={divider}
                      right={<Toggle checked={debugMode} onChange={isSuperAdmin ? setDebugMode : ()=>{}} dark={dark} disabled={!isSuperAdmin}/>}
                    />
                    <SettingRow label="Maintenance mode" desc="Lock all users out except Super Admins" divider={false}
                      right={<Toggle checked={maintenance} onChange={isSuperAdmin ? setMaintenance : ()=>{}} dark={dark} disabled={!isSuperAdmin}/>}
                    />
                  </div>
                  {maintenance && (
                    <div className={`mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${dark?'bg-red-900/20 text-red-400':'bg-red-50 text-red-500'}`}>
                      <AlertTriangle size={12}/> Maintenance mode is <strong>ON</strong> — all non-admin users are currently blocked.
                    </div>
                  )}
                  {isSuperAdmin && saveBtn('developer')}
                </SectionCard>

                {/* System info (read-only) */}
                <SectionCard title="System Information" desc="Build and runtime details." card={card} textPri={textPri} textMut={textMut}>
                  <div className={`divide-y ${divider}`}>
                    {[
                      ['SkyOS Version',   '2.0.0'],
                      ['Build',           '20250604-prod'],
                      ['Environment',     'Production'],
                      ['Runtime',         'React 19 / Vite 8'],
                      ['API Status',      '● Online'],
                      ['Database',        '● Connected'],
                      ['Last Deploy',     '2025-06-04  14:32 UTC'],
                    ].map(([k, v]) => (
                      <div key={k} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${divider}`}>
                        <span className={`text-xs ${textSec}`}>{k}</span>
                        <span className={`text-xs font-mono font-semibold ${
                          String(v).startsWith('●') ? 'text-green-500' : textPri
                        }`}>{v}</span>
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
