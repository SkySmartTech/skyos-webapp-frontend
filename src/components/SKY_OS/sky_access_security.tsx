import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AlertTriangle, Check, CheckCircle, ChevronDown, ClipboardList,
  Crown, Edit2, Eye, EyeOff, Lock, Loader2, Plus, Search, Shield,
  Trash2, User, Users, X,
} from 'lucide-react';
import { useAuth, type UserRole } from './sky_auth';
import { useTheme } from '../../context/ThemeContext';
import userService, { type ApiUser, type AuditLogEntry } from '../../api/userService';

// ── Permission types ───────────────────────────────────────────────────────────
type RoleKey = 'super_admin' | 'admin' | 'super_user' | 'user';
type TabType  = 'users' | 'permissions' | 'audit';

type Permission =
  | 'core.dashboard.view'    | 'core.analytics.view'
  | 'core.users.view'        | 'core.users.manage'     | 'core.users.manage_super_admins'
  | 'core.modules.view'      | 'core.modules.manage'   | 'core.modules.toggle'
  | 'core.modules.manage_ai_keys'
  | 'core.audit.view'        | 'core.settings.view'    | 'core.settings.manage'
  | 'core.notifications.view'| 'core.profile.view'
  | 'smart_andon.view'       | 'smart_andon.alerts.view' | 'smart_andon.alerts.resolve'
  | 'smart_andon.stations.manage' | 'smart_andon.reports.view'
  | 'production_tracking.view' | 'production_tracking.orders.manage'
  | 'production_tracking.shifts.view' | 'production_tracking.reports.view'
  | 'wip_system.view'        | 'wip_system.lots.manage'
  | 'wip_system.movements.view' | 'wip_system.reports.view';

const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  super_admin: [
    'core.dashboard.view','core.analytics.view',
    'core.users.view','core.users.manage','core.users.manage_super_admins',
    'core.modules.view','core.modules.manage','core.modules.toggle','core.modules.manage_ai_keys',
    'core.audit.view','core.settings.view','core.settings.manage',
    'core.notifications.view','core.profile.view',
    'smart_andon.view','smart_andon.alerts.view','smart_andon.alerts.resolve',
    'smart_andon.stations.manage','smart_andon.reports.view',
    'production_tracking.view','production_tracking.orders.manage',
    'production_tracking.shifts.view','production_tracking.reports.view',
    'wip_system.view','wip_system.lots.manage',
    'wip_system.movements.view','wip_system.reports.view',
  ],
  admin: [
    'core.dashboard.view','core.analytics.view',
    'core.users.view','core.users.manage',
    'core.modules.view',
    'core.audit.view','core.settings.view',
    'core.notifications.view','core.profile.view',
    'smart_andon.view','smart_andon.alerts.view','smart_andon.alerts.resolve',
    'smart_andon.stations.manage','smart_andon.reports.view',
    'production_tracking.view','production_tracking.orders.manage',
    'production_tracking.shifts.view','production_tracking.reports.view',
    'wip_system.view','wip_system.lots.manage',
    'wip_system.movements.view','wip_system.reports.view',
  ],
  super_user: [
    'core.analytics.view',
    'core.notifications.view','core.profile.view',
    'smart_andon.view','smart_andon.alerts.view','smart_andon.reports.view',
    'production_tracking.view','production_tracking.shifts.view','production_tracking.reports.view',
    'wip_system.view','wip_system.movements.view','wip_system.reports.view',
  ],
  user: [
    'core.notifications.view','core.profile.view',
    'smart_andon.view','smart_andon.alerts.view',
    'production_tracking.view',
    'wip_system.view',
  ],
};

function toRoleKey(role: UserRole): RoleKey {
  const map: Record<UserRole, RoleKey> = {
    'Super admin': 'super_admin', admin: 'admin', 'Super User': 'super_user', user: 'user',
  };
  return map[role];
}

function usePermissions() {
  const { user } = useAuth();
  const permSet = useMemo(() => {
    if (!user) return new Set<Permission>();
    return new Set(ROLE_PERMISSIONS[toRoleKey(user.role)]);
  }, [user]);
  return {
    can:  (p: Permission) => permSet.has(p),
    role: user ? toRoleKey(user.role) : null,
  };
}

// ── Display helpers ────────────────────────────────────────────────────────────
const ROLE_LABEL: Record<RoleKey, string> = {
  super_admin:'Super Admin', admin:'Admin', super_user:'Super User', user:'User',
};
const ROLE_COLOR: Record<RoleKey, string> = {
  super_admin:'bg-purple-500/15 text-purple-400 border-purple-500/25',
  admin:      'bg-blue-500/15   text-blue-400   border-blue-500/25',
  super_user: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  user:       'bg-gray-500/15   text-gray-400   border-gray-500/25',
};
const ROLE_ICON: Record<RoleKey, React.ReactNode> = {
  super_admin:<Crown  size={12}/>, admin:<Shield size={12}/>,
  super_user: <User   size={12}/>, user: <User   size={12}/>,
};
const ALL_ROLES: RoleKey[] = ['super_admin','admin','super_user','user'];

// ── SystemUser type ────────────────────────────────────────────────────────────
interface SystemUser {
  id: string;
  numericId: number;
  name: string;
  empId: string;
  email: string;
  role: RoleKey;
  status: 'active' | 'pending' | 'disabled';
  lastLogin: string;
}

function formatLoginTime(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString();
}

function mapApiUser(u: ApiUser): SystemUser {
  return {
    id: String(u.id),
    numericId: u.id,
    name: u.name,
    empId: u.employee_id,
    email: u.email,
    role: u.role as RoleKey,
    status: u.status,
    lastLogin: formatLoginTime(u.last_login_at),
  };
}

function extractApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
  const errs = e?.response?.data?.errors;
  if (errs) {
    const first = Object.values(errs)[0];
    if (first?.[0]) return first[0];
  }
  return e?.response?.data?.message ?? 'An unexpected error occurred.';
}

function auditEntryType(action: string): 'info' | 'success' | 'warning' | 'error' {
  const a = action.toLowerCase();
  if (a.includes('failed') || a.includes('denied') || a.includes('error') || a.includes('unauthori')) return 'error';
  if (a.includes('delet') || a.includes('disabled') || a.includes('suspend') || a.includes('inactive')) return 'warning';
  if (a.includes('creat') || a.includes('updat') || a.includes('enabl') || a.includes('toggl') || a.includes('success')) return 'success';
  return 'info';
}

function formatAuditTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const PERM_GROUPS = [
  { module:'core',  label:'Core Platform', perms:[
    { key:'core.dashboard.view'              as Permission, label:'Dashboard'           },
    { key:'core.analytics.view'              as Permission, label:'Analytics'           },
    { key:'core.users.view'                  as Permission, label:'View Users'          },
    { key:'core.users.manage'                as Permission, label:'Manage Users'        },
    { key:'core.users.manage_super_admins'   as Permission, label:'Manage Super Admins' },
    { key:'core.modules.view'                as Permission, label:'View Modules'        },
    { key:'core.modules.manage'              as Permission, label:'Manage Modules'      },
    { key:'core.settings.view'               as Permission, label:'View Settings'       },
    { key:'core.settings.manage'             as Permission, label:'Manage Settings'     },
    { key:'core.audit.view'                  as Permission, label:'Audit Logs'          },
  ]},
  { module:'andon', label:'Smart Andon', perms:[
    { key:'smart_andon.view'             as Permission, label:'View'             },
    { key:'smart_andon.alerts.view'      as Permission, label:'View Alerts'      },
    { key:'smart_andon.alerts.resolve'   as Permission, label:'Resolve Alerts'   },
    { key:'smart_andon.stations.manage'  as Permission, label:'Manage Stations'  },
    { key:'smart_andon.reports.view'     as Permission, label:'Reports'          },
  ]},
  { module:'prod',  label:'Production Tracking', perms:[
    { key:'production_tracking.view'            as Permission, label:'View'           },
    { key:'production_tracking.orders.manage'   as Permission, label:'Manage Orders'  },
    { key:'production_tracking.shifts.view'     as Permission, label:'View Shifts'    },
    { key:'production_tracking.reports.view'    as Permission, label:'Reports'        },
  ]},
  { module:'wip',   label:'WIP System', perms:[
    { key:'wip_system.view'           as Permission, label:'View'           },
    { key:'wip_system.lots.manage'    as Permission, label:'Manage Lots'    },
    { key:'wip_system.movements.view' as Permission, label:'View Movements' },
    { key:'wip_system.reports.view'   as Permission, label:'Reports'        },
  ]},
];

const BLANK: Omit<SystemUser, 'id' | 'numericId'> = {
  name: '', empId: '', email: '', role: 'user', status: 'active', lastLogin: '—',
};

// ── Sub-components (defined OUTSIDE main component — no re-create on render) ──

interface TabBtnProps {
  id: TabType; icon: React.ReactNode; label: string;
  activeTab: TabType; onTabChange: (id: TabType) => void; textSec: string;
}
function TabBtn({ id, icon, label, activeTab, onTabChange, textSec }: TabBtnProps) {
  return (
    <button
      onClick={() => onTabChange(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
        activeTab === id
          ? 'border-orange-500 text-orange-500'
          : `border-transparent ${textSec} hover:text-current`
      }`}
    >
      {icon} {label}
    </button>
  );
}

interface SlideFieldProps {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; readOnly?: boolean;
  inp: string; textMut: string;
}
function SlideField({ label, value, onChange, type='text', placeholder='', readOnly=false, inp, textMut }: SlideFieldProps) {
  return (
    <div>
      <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${textMut}`}>{label}</label>
      <input
        type={type} value={value} readOnly={readOnly}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inp} ${
          readOnly ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}

interface RoleSelectProps {
  value: RoleKey; onChange: (v: RoleKey) => void; inp: string; textMut: string;
}
function RoleSelect({ value, onChange, inp, textMut }: RoleSelectProps) {
  return (
    <div>
      <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${textMut}`}>Role</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as RoleKey)}
          className={`w-full appearance-none px-3 py-2 rounded-lg border text-sm outline-none transition-colors pr-8 ${inp}`}
        >
          {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
        </select>
        <ChevronDown size={13} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${textMut}`}/>
      </div>
    </div>
  );
}

interface StatusSelectProps {
  value: 'active' | 'pending' | 'disabled';
  onChange: (v: 'active' | 'pending' | 'disabled') => void;
  inp: string; textMut: string;
}
function StatusSelect({ value, onChange, inp, textMut }: StatusSelectProps) {
  return (
    <div>
      <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${textMut}`}>Status</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as 'active' | 'pending' | 'disabled')}
          className={`w-full appearance-none px-3 py-2 rounded-lg border text-sm outline-none transition-colors pr-8 ${inp}`}
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
        </select>
        <ChevronDown size={13} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${textMut}`}/>
      </div>
    </div>
  );
}

// ── Status badge config ────────────────────────────────────────────────────────
const STATUS_CONF = {
  active:   { label: 'Active',   cls: 'bg-green-500/10  text-green-500  border border-green-500/20',  dot: 'bg-green-500'  },
  pending:  { label: 'Pending',  cls: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20', dot: 'bg-yellow-500' },
  disabled: { label: 'Disabled', cls: 'bg-gray-500/10   text-gray-400   border border-gray-500/20',   dot: 'bg-gray-400'   },
};

// ══════════════════════════════════════════════════════════════════════════════
export default function SkyAccessSecurity() {
  const { user: me } = useAuth();
  const { can, role: myRole } = usePermissions();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [tab,          setTab]          = useState<TabType>('users');
  const [users,        setUsers]        = useState<SystemUser[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [apiError,     setApiError]     = useState<string | null>(null);
  const [search,       setSearch]       = useState('');
  const [slideUser,    setSlideUser]    = useState<SystemUser | null>(null);
  const [showAdd,      setShowAdd]      = useState(false);
  const [newUser,      setNewUser]      = useState<Omit<SystemUser, 'id' | 'numericId'>>(BLANK);
  const [newPassword,  setNewPassword]  = useState('');
  const [slidePassword,setSlidePassword]= useState('');
  const [showNewPw,    setShowNewPw]    = useState(false);
  const [showSlidePw,  setShowSlidePw]  = useState(false);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [saved,        setSaved]        = useState(false);
  const [formError,    setFormError]    = useState<string | null>(null);
  const [auditLogs,    setAuditLogs]    = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // ── Style tokens ─────────────────────────────────────────────────────────────
  const bg      = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inp     = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const textPri = dark ? 'text-white'    : 'text-gray-900';
  const textSec = dark ? 'text-zinc-400' : 'text-gray-500';
  const textMut = dark ? 'text-zinc-500' : 'text-gray-400';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';
  const rowHov  = dark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
  const hdr     = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  // ── Data fetching ─────────────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const list = await userService.getUsers();
      setUsers(list.map(mapApiUser));
    } catch {
      setApiError('Failed to load users. Check your connection or permissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const logs = await userService.getAuditLogs(50);
      setAuditLogs(logs);
    } catch {
      // no access or network — keep empty
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (tab === 'audit') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadAuditLogs();
    }
  }, [tab, loadAuditLogs]);

  // ── Access gate ───────────────────────────────────────────────────────────────
  if (!can('core.users.view')) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${dark?'bg-gray-950':'bg-slate-100'}`}>
        <div className={`rounded-2xl border p-10 text-center max-w-sm ${card}`}>
          <Lock size={40} className="text-red-400 mx-auto mb-4"/>
          <h2 className={`text-lg font-bold mb-2 ${textPri}`}>Access Denied</h2>
          <p className={`text-sm mb-4 ${textSec}`}>
            You don't have permission to view Access &amp; Security.<br/>Contact your Super Admin.
          </p>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${ROLE_COLOR[myRole ?? 'user']}`}>
            {ROLE_ICON[myRole ?? 'user']} {ROLE_LABEL[myRole ?? 'user']}
          </span>
        </div>
      </div>
    );
  }

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.empId.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const saveEdit = async () => {
    if (!slideUser) return;
    setFormError(null);
    try {
      await userService.updateUser(slideUser.numericId, {
        employee_id: slideUser.empId,
        name: slideUser.name,
        email: slideUser.email,
        sky_role: slideUser.role,
        status: slideUser.status,
        ...(slidePassword ? { password: slidePassword } : {}),
      });
      setSlideUser(null); setSlidePassword(''); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      loadUsers();
    } catch (err) {
      setFormError(extractApiError(err));
    }
  };

  const saveAdd = async () => {
    if (!newUser.name || !newUser.empId || !newUser.email || !newPassword) {
      setFormError('Name, Employee ID, Email and Password are required.');
      return;
    }
    setFormError(null);
    try {
      await userService.createUser({
        employee_id: newUser.empId,
        name: newUser.name,
        email: newUser.email,
        password: newPassword,
        sky_role: newUser.role,
        status: newUser.status,
        assigned_modules: [],
      });
      setNewUser(BLANK); setNewPassword(''); setShowAdd(false);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      loadUsers();
    } catch (err) {
      setFormError(extractApiError(err));
    }
  };

  const doDelete = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    try {
      await userService.deleteUser(target.numericId);
      setDeleteId(null);
      loadUsers();
    } catch (err) {
      setApiError(extractApiError(err));
      setDeleteId(null);
    }
  };

  const closePanel = () => {
    setSlideUser(null); setShowAdd(false);
    setFormError(null); setSlidePassword('');
  };

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className={`w-full h-full flex flex-col overflow-hidden relative ${bg}`}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className={`shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 md:px-6 py-3 border-b ${hdr}`}>
        <div className="flex items-center gap-2">
          <Shield size={17} className="text-orange-500"/>
          <h1 className={`text-base font-bold ${textPri}`}>Access &amp; Security</h1>
          {myRole && (
            <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLOR[myRole]}`}>
              {ROLE_ICON[myRole]} {ROLE_LABEL[myRole]}
            </span>
          )}
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-500 text-xs font-semibold">
            <CheckCircle size={13}/> Saved
          </span>
        )}
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className={`shrink-0 flex items-center gap-1 px-2 md:px-4 border-b overflow-x-auto ${hdr}`}>
        <TabBtn id="users"       icon={<Users       size={14}/>} label="Users"              activeTab={tab} onTabChange={setTab} textSec={textSec}/>
        <TabBtn id="permissions" icon={<Shield      size={14}/>} label="Permissions Matrix" activeTab={tab} onTabChange={setTab} textSec={textSec}/>
        <TabBtn id="audit"       icon={<ClipboardList size={14}/>} label="Audit Log"         activeTab={tab} onTabChange={setTab} textSec={textSec}/>
      </div>

      {/* ══ USERS TAB ══════════════════════════════════════════════════════════ */}
      {tab === 'users' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className={`shrink-0 flex flex-wrap items-center gap-2 md:gap-3 px-3 md:px-5 py-3 border-b ${hdr}`}>
            <div className={`flex items-center gap-2 flex-1 min-w-0 max-w-sm border rounded-xl px-3 py-2 ${inp}`}>
              <Search size={14} className={textMut}/>
              <input
                type="text" placeholder="Search users…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent flex-1 text-sm outline-none placeholder:text-inherit"
              />
            </div>
            <span className={`text-xs ${textMut}`}>{filtered.length} user{filtered.length!==1?'s':''}</span>
            {can('core.users.manage') && (
              <button
                onClick={() => { setShowAdd(true); setSlideUser(null); setFormError(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all shadow shadow-orange-500/20"
              >
                <Plus size={14}/> Add User
              </button>
            )}
          </div>

          {/* API error banner */}
          {apiError && (
            <div className="shrink-0 mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              <AlertTriangle size={13}/> {apiError}
            </div>
          )}

          {/* Table — horizontally scrollable on mobile */}
          <div className="flex-1 min-h-0 overflow-auto">
            {isLoading ? (
              <div className={`flex items-center justify-center gap-2 py-16 text-sm ${textMut}`}>
                <Loader2 size={16} className="animate-spin"/> Loading users…
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead className={`${dark?'bg-gray-900/80':'bg-gray-50'} sticky top-0 z-10`}>
                  <tr>
                    {['User','Employee ID','Email','Role','Status','Last Login','Actions'].map(h => (
                      <th key={h} className={`px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border-b ${divider} ${textMut}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const isMe      = u.empId === me?.employeeId;
                    const isDeleting = deleteId === u.id;
                    const sc = STATUS_CONF[u.status] ?? STATUS_CONF.disabled;
                    return (
                      <tr key={u.id} className={`transition-colors ${rowHov} border-b ${divider}`}>
                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-linear-to-br from-orange-500 to-orange-700 shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className={`font-semibold text-sm leading-tight ${textPri}`}>
                                {u.name}
                                {isMe && <span className="text-[9px] text-orange-500 font-bold ml-1">(You)</span>}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 font-mono text-xs font-semibold ${textPri}`}>{u.empId}</td>
                        <td className={`px-4 py-3 text-xs ${textSec}`}>{u.email}</td>
                        {/* Role badge */}
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLOR[u.role]}`}>
                            {ROLE_ICON[u.role]} {ROLE_LABEL[u.role]}
                          </span>
                        </td>
                        {/* Status badge */}
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sc.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}/>
                            {sc.label}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-xs ${textMut}`}>{u.lastLogin}</td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          {can('core.users.manage') ? (
                            isDeleting ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${textMut}`}>Delete?</span>
                                <button onClick={() => doDelete(u.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold">
                                  <Check size={11}/> Yes
                                </button>
                                <button onClick={() => setDeleteId(null)}
                                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${card}`}>
                                  <X size={11}/> No
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setSlideUser({...u}); setShowAdd(false); setFormError(null); setSlidePassword(''); }}
                                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                    dark ? 'border-gray-700 text-zinc-400 hover:bg-gray-700 hover:text-white'
                                         : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                  }`}>
                                  <Edit2 size={11}/> Edit
                                </button>
                                {(!isMe && !(u.role==='super_admin' && myRole!=='super_admin')) && (
                                  <button onClick={() => setDeleteId(u.id)}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all">
                                    <Trash2 size={11}/> Delete
                                  </button>
                                )}
                              </div>
                            )
                          ) : (
                            <span className={`flex items-center gap-1 text-xs ${textMut}`}>
                              <Eye size={11}/> View only
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {!isLoading && filtered.length === 0 && !apiError && (
              <div className={`py-12 text-center text-sm ${textMut}`}>No users match your search.</div>
            )}
          </div>
        </div>
      )}

      {/* ══ PERMISSIONS MATRIX TAB ═════════════════════════════════════════════ */}
      {tab === 'permissions' && (
        <div className="flex-1 min-h-0 overflow-auto p-5">
          <div className="min-w-max">
            {PERM_GROUPS.map(group => (
              <div key={group.module} className={`rounded-xl border mb-4 overflow-hidden ${card}`}>
                <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${dark?'bg-gray-800/50 border-gray-800':'bg-gray-50 border-gray-200'}`}>
                  <Shield size={13} className="text-orange-500"/>
                  <span className={`text-xs font-bold uppercase tracking-wider ${textPri}`}>{group.label}</span>
                </div>
                {/* Role header */}
                <div className={`grid border-b ${divider}`} style={{ gridTemplateColumns:'220px repeat(4,130px)' }}>
                  <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${textMut}`}>Permission</div>
                  {ALL_ROLES.map(r => (
                    <div key={r} className="px-3 py-2 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLOR[r]}`}>
                        {ROLE_ICON[r]} {ROLE_LABEL[r]}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Permission rows */}
                {group.perms.map((perm, i) => (
                  <div key={perm.key}
                    className={`grid ${i%2===0 ? '' : dark?'bg-gray-800/20':'bg-gray-50/60'}`}
                    style={{ gridTemplateColumns:'220px repeat(4,130px)' }}>
                    <div className={`px-4 py-2.5 text-xs font-medium flex items-center gap-2 border-r ${divider} ${textSec}`}>
                      {perm.label}
                    </div>
                    {ALL_ROLES.map(r => {
                      const granted = ROLE_PERMISSIONS[r].includes(perm.key);
                      return (
                        <div key={r} className={`px-3 py-2.5 flex items-center justify-center border-r last:border-r-0 ${divider}`}>
                          {granted
                            ? <CheckCircle size={16} className="text-green-500"/>
                            : <X size={14} className={dark?'text-zinc-700':'text-gray-300'}/>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ AUDIT LOG TAB ══════════════════════════════════════════════════════ */}
      {tab === 'audit' && (
        <div className="flex-1 min-h-0 overflow-auto p-5">
          <div className={`rounded-xl border overflow-hidden ${card}`}>
            <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${dark?'bg-gray-800/50 border-gray-800':'bg-gray-50 border-gray-200'}`}>
              <ClipboardList size={13} className="text-orange-500"/>
              <span className={`text-xs font-bold uppercase tracking-wider ${textPri}`}>Security Event Log</span>
              <span className="ml-auto text-[10px] font-semibold text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> Live
              </span>
            </div>
            {auditLoading ? (
              <div className={`flex items-center justify-center gap-2 py-10 text-sm ${textMut}`}>
                <Loader2 size={15} className="animate-spin"/> Loading audit log…
              </div>
            ) : auditLogs.length === 0 ? (
              <div className={`py-10 text-center text-sm ${textMut}`}>No audit events recorded yet.</div>
            ) : (
              auditLogs.map((ev, i) => {
                const type = auditEntryType(ev.action);
                const colors = { info:'text-blue-400', success:'text-green-400', warning:'text-yellow-400', error:'text-red-400' };
                const icons  = {
                  info:    <Eye          size={13}/>,
                  success: <CheckCircle  size={13}/>,
                  warning: <AlertTriangle size={13}/>,
                  error:   <X            size={13}/>,
                };
                const actionLabel = ev.target_label
                  ? `${ev.action}: ${ev.target_label}`
                  : ev.action;
                return (
                  <div key={ev.id} className={`flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 ${i < auditLogs.length - 1 ? `border-b ${divider}` : ''} ${rowHov} transition-colors`}>
                    <span className={`shrink-0 font-mono text-[11px] ${textMut}`}>{formatAuditTime(ev.created_at)}</span>
                    <span className={`shrink-0 ${colors[type]}`}>{icons[type]}</span>
                    <span className={`text-xs font-semibold shrink-0 hidden sm:block ${textPri}`}>{ev.user?.name ?? 'System'}</span>
                    <span className={`text-xs min-w-0 flex-1 truncate ${textSec}`} title={actionLabel}>{actionLabel}</span>
                    <span className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize hidden xs:block ${
                      type==='success' ? 'bg-green-500/10  text-green-500'  :
                      type==='warning' ? 'bg-yellow-500/10 text-yellow-500' :
                      type==='error'   ? 'bg-red-500/10    text-red-400'    :
                                         'bg-blue-500/10   text-blue-400'
                    }`}>{type}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══ SLIDE-OVER PANEL (Edit / Add) ══════════════════════════════════════ */}
      {(slideUser || showAdd) && (
        <>
          <div className="absolute inset-0 bg-black/40 z-30" onClick={closePanel}/>
          <div className={`absolute right-0 top-0 h-full w-full max-w-xs sm:w-80 z-40 shadow-2xl flex flex-col overflow-hidden ${
            dark ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'
          }`}>
            {/* Header */}
            <div className={`shrink-0 flex items-center justify-between px-5 py-4 border-b ${dark?'border-gray-800':'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                {showAdd ? <Plus size={15} className="text-orange-500"/> : <Edit2 size={15} className="text-orange-500"/>}
                <h3 className={`text-sm font-bold ${textPri}`}>{showAdd ? 'Add New User' : 'Edit User'}</h3>
              </div>
              <button onClick={closePanel}
                className={`p-1.5 rounded-lg transition-colors ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}>
                <X size={15} className={textMut}/>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {showAdd ? (
                <>
                  <SlideField label="Full Name"   value={newUser.name}  onChange={v=>setNewUser(p=>({...p,name:v}))}   placeholder="Full name"       inp={inp} textMut={textMut}/>
                  <SlideField label="Employee ID" value={newUser.empId} onChange={v=>setNewUser(p=>({...p,empId:v}))}  placeholder="E001"            inp={inp} textMut={textMut}/>
                  <SlideField label="Email"       value={newUser.email} onChange={v=>setNewUser(p=>({...p,email:v}))}  type="email" placeholder="user@skyos.lk" inp={inp} textMut={textMut}/>
                  {/* Password field */}
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${textMut}`}>Initial Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Set password"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors pr-9 ${inp}`}
                      />
                      <button type="button" onClick={() => setShowNewPw(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showNewPw ? <EyeOff size={13} className={textMut}/> : <Eye size={13} className={textMut}/>}
                      </button>
                    </div>
                  </div>
                  <RoleSelect   value={newUser.role}   onChange={v=>setNewUser(p=>({...p,role:v}))}   inp={inp} textMut={textMut}/>
                  <StatusSelect value={newUser.status} onChange={v=>setNewUser(p=>({...p,status:v}))} inp={inp} textMut={textMut}/>
                </>
              ) : slideUser && (
                <>
                  <SlideField label="Full Name"   value={slideUser.name}  onChange={v=>setSlideUser(p=>p?{...p,name:v}:p)}  placeholder="Full name" inp={inp} textMut={textMut}/>
                  <SlideField label="Employee ID" value={slideUser.empId} onChange={v=>setSlideUser(p=>p?{...p,empId:v}:p)} readOnly={slideUser.empId===me?.employeeId} inp={inp} textMut={textMut}/>
                  <SlideField label="Email"       value={slideUser.email} onChange={v=>setSlideUser(p=>p?{...p,email:v}:p)} type="email" inp={inp} textMut={textMut}/>
                  <RoleSelect   value={slideUser.role}   onChange={v=>setSlideUser(p=>p?{...p,role:v}:p)}   inp={inp} textMut={textMut}/>
                  <StatusSelect value={slideUser.status} onChange={v=>setSlideUser(p=>p?{...p,status:v}:p)} inp={inp} textMut={textMut}/>

                  {/* Optional password change */}
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 block ${textMut}`}>New Password <span className="normal-case font-normal">(leave blank to keep)</span></label>
                    <div className="relative">
                      <input
                        type={showSlidePw ? 'text' : 'password'}
                        value={slidePassword}
                        onChange={e => setSlidePassword(e.target.value)}
                        placeholder="Change password…"
                        className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors pr-9 ${inp}`}
                      />
                      <button type="button" onClick={() => setShowSlidePw(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showSlidePw ? <EyeOff size={13} className={textMut}/> : <Eye size={13} className={textMut}/>}
                      </button>
                    </div>
                  </div>

                  {/* Permissions preview */}
                  <div>
                    <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${textMut}`}>
                      Permissions ({ROLE_PERMISSIONS[slideUser.role].length})
                    </label>
                    <div className={`rounded-lg border p-3 max-h-44 overflow-y-auto space-y-1 ${dark?'border-gray-700 bg-zinc-800/50':'border-gray-200 bg-gray-50'}`}>
                      {ROLE_PERMISSIONS[slideUser.role].map(p => (
                        <div key={p} className="flex items-center gap-1.5">
                          <CheckCircle size={10} className="text-green-500 shrink-0"/>
                          <span className={`text-[10px] font-mono ${textSec}`}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className={`shrink-0 p-4 border-t ${dark?'border-gray-800':'border-gray-200'}`}>
              {formError && (
                <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0"/>
                  <span>{formError}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={showAdd ? saveAdd : saveEdit}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all">
                  <Check size={14}/> {showAdd ? 'Create User' : 'Save Changes'}
                </button>
                <button onClick={closePanel}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    dark ? 'border-gray-700 text-zinc-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
