import { useState, useRef, type ReactNode } from 'react';
import {
  ArrowLeft, Camera, Save, CheckCircle, User, Mail, MapPin,
  Phone, Lock, Eye, EyeOff, LogOut, Shield, IdCard,
  Bell, Building2, Activity, Star, Clock, Key,
} from 'lucide-react';
import { useAuth } from '../SKY_OS/sky_auth';
import { useTheme } from '../../context/ThemeContext';

interface ProfileProps { onBack: () => void; }

function Field({ dark, label: l, icon, value, onChange, type = 'text', placeholder = '', readOnly = false, right }: {
  dark: boolean; label?: string; icon?: ReactNode; value: string;
  onChange?: (v: string) => void; type?: string; placeholder?: string;
  readOnly?: boolean; right?: ReactNode;
}) {
  const inp = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const lbl = dark ? 'text-zinc-500' : 'text-gray-400';
  return (
    <div>
      {l && (
        <label className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1.5 ${lbl}`}>
          {icon} {l}
        </label>
      )}
      <div className="relative">
        <input
          type={type} value={value} readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${inp} ${
            readOnly ? 'opacity-50 cursor-not-allowed' : ''
          } ${right ? 'pr-10' : ''}`}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  );
}

function PwEye({ dark, show, toggle }: { dark: boolean; show: boolean; toggle: () => void }) {
  const textMut = dark ? 'text-zinc-500' : 'text-gray-400';
  return (
    <button type="button" onClick={toggle}>
      {show ? <EyeOff size={13} className={textMut}/> : <Eye size={13} className={textMut}/>}
    </button>
  );
}

function SaveRow({ dark, onSave, saved, label }: { dark: boolean; onSave: () => void; saved: boolean; label: string }) {
  const divider = dark ? 'border-gray-800' : 'border-gray-200';
  return (
    <div className={`flex items-center gap-3 pt-3 mt-1 border-t ${divider}`}>
      <button onClick={onSave}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-xs transition-all shadow shadow-orange-500/20">
        <Save size={12}/> {label}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-green-500 text-xs font-semibold">
          <CheckCircle size={13}/> Saved!
        </span>
      )}
    </div>
  );
}

function pwStrength(pw: string) {
  return [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
}
const PW_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const PW_COLORS = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

export default function Profile({ onBack }: ProfileProps) {
  const { user, updateProfile, logout } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [fullName, setFullName] = useState(user?.fullName ?? user?.name ?? '');
  const [email,    setEmail]    = useState(user?.email   ?? '');
  const [phone,    setPhone]    = useState(user?.phone   ?? '');
  const [address,  setAddress]  = useState(user?.address ?? '');
  const [avatar,   setAvatar]   = useState(user?.avatar  ?? '');

  const [curPw,     setCurPw]     = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCur,   setShowCur]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [showConf,  setShowConf]  = useState(false);

  const [savedProfile,  setSavedProfile]  = useState(false);
  const [savedSecurity, setSavedSecurity] = useState(false);
  const [pwError,       setPwError]       = useState('');
  const [notifs, setNotifs] = useState({ system: true, alerts: true, reports: false });

  const fileRef = useRef<HTMLInputElement>(null);
  const strength = pwStrength(newPw);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfile({ fullName, email, phone, address, avatar });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 3000);
  };

  const handleSaveSecurity = () => {
    setPwError('');
    if (!curPw)              { setPwError('Enter your current password.');           return; }
    if (newPw.length < 8)    { setPwError('New password must be at least 8 chars.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.');                return; }
    setSavedSecurity(true);
    setCurPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setSavedSecurity(false), 3000);
  };

  // ── Style tokens ────────────────────────────────────────────────────────
  const bg      = dark ? 'bg-gray-950'                  : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-200';
  const inp     = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const lbl     = dark ? 'text-zinc-500'  : 'text-gray-400';
  const textPri = dark ? 'text-white'     : 'text-gray-900';
  const textSec = dark ? 'text-zinc-400'  : 'text-gray-600';
  const textMut = dark ? 'text-zinc-500'  : 'text-gray-400';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';
  const topBar  = dark ? 'bg-gray-900 border-gray-800'  : 'bg-white border-gray-200';
  const leftBg  = dark ? 'bg-gray-900/40 border-gray-800' : 'bg-gray-50 border-gray-200';

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className={`w-full h-full flex flex-col overflow-hidden ${bg}`}>

      {/* ── 1. Back bar (never scrolls) ──────────────────────────────────── */}
      <div className={`shrink-0 flex items-center gap-3 px-5 py-2.5 border-b ${topBar}`}>
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            dark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ArrowLeft size={15}/> Back
        </button>
        <span className={`text-xs ${textMut}`}>/ Profile Settings</span>
      </div>

      {/* ── 2. Hero row (never scrolls) ──────────────────────────────────── */}
      <div className={`shrink-0 flex items-center justify-between px-5 py-3 border-b ${topBar}`}>

        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div
              onClick={() => fileRef.current?.click()}
              className={`w-14 h-14 rounded-full overflow-hidden cursor-pointer ring-2 shadow-md transition-all ${
                dark ? 'ring-gray-700 hover:ring-orange-500/60' : 'ring-gray-200 hover:ring-orange-400/60'
              }`}
            >
              {avatar ? (
                <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                  <User size={24} className="text-white"/>
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={15} className="text-white"/>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"/>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage}/>
          </div>
          <div>
            <h2 className={`text-base font-bold leading-tight ${textPri}`}>
              {user?.fullName ?? user?.name ?? 'User'}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                {user?.role}
              </span>
              <span className={`flex items-center gap-1 text-[11px] ${textMut}`}>
                <IdCard size={10}/> {user?.employeeId}
              </span>
              {user?.email && (
                <span className={`hidden lg:flex items-center gap-1 text-[11px] ${textMut}`}>
                  <Mail size={10}/> {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats pills */}
        <div className="hidden sm:flex items-center gap-2">
          {[
            { icon: <Activity size={12}/>, label: 'Status',  value: 'Active',      c: 'text-green-500  border-green-500/20  bg-green-500/8'  },
            { icon: <Shield size={12}/>,   label: 'Access',  value: 'Full Access', c: 'text-blue-500   border-blue-500/20   bg-blue-500/8'   },
            { icon: <Star size={12}/>,     label: 'Systems', value: '6 / 6',       c: 'text-orange-500 border-orange-500/20 bg-orange-500/8' },
            { icon: <Clock size={12}/>,    label: 'Session', value: 'Active',      c: 'text-purple-500 border-purple-500/20 bg-purple-500/8' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold ${s.c}`}>
              {s.icon}
              <span className={`hidden xl:inline text-[10px] font-normal ${textMut}`}>{s.label}:</span>
              {s.value}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Two-panel layout (fills remaining height, no outer scroll) ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* LEFT panel — account overview, notifications, danger zone */}
        <div className={`hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r overflow-y-auto ${leftBg}`}>
          <div className="p-4 space-y-5">

            {/* Account */}
            <section>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textMut}`}>Account</p>
              <div className={`rounded-xl border overflow-hidden ${card}`}>
                {[
                  { icon: <IdCard size={12}/>,    label: 'Employee ID', value: user?.employeeId ?? '—' },
                  { icon: <Shield size={12}/>,    label: 'Role',        value: user?.role ?? '—' },
                  { icon: <Building2 size={12}/>, label: 'Department',  value: 'Engineering' },
                  { icon: <Activity size={12}/>,  label: 'Status',      value: 'Active', green: true },
                  { icon: <Star size={12}/>,      label: 'Access',      value: 'Full Access' },
                  { icon: <Clock size={12}/>,     label: 'Last Login',  value: 'Just now' },
                ].map((item, i, arr) => (
                  <div key={item.label} className={`flex items-center justify-between px-3 py-2 ${
                    i < arr.length - 1 ? `border-b ${divider}` : ''
                  }`}>
                    <span className={`flex items-center gap-2 text-xs ${textSec}`}>
                      <span className={textMut}>{item.icon}</span>{item.label}
                    </span>
                    <span className={`text-xs font-semibold ${'green' in item && item.green ? 'text-green-500' : textPri}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Notifications */}
            <section>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${textMut}`}>
                <Bell size={10} className="inline mr-1"/>Notifications
              </p>
              <div className={`rounded-xl border overflow-hidden ${card}`}>
                {([
                  { k: 'system'  as const, label: 'System Alerts' },
                  { k: 'alerts'  as const, label: 'Production Alerts' },
                  { k: 'reports' as const, label: 'Daily Reports' },
                ] as const).map((n, i, arr) => (
                  <div key={n.k} className={`flex items-center justify-between px-3 py-2.5 ${
                    i < arr.length - 1 ? `border-b ${divider}` : ''
                  }`}>
                    <span className={`text-xs ${textSec}`}>{n.label}</span>
                    <button
                      onClick={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))}
                      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                        notifs[n.k] ? 'bg-orange-500' : dark ? 'bg-zinc-700' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                        notifs[n.k] ? 'left-4' : 'left-0.5'
                      }`}/>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Danger zone */}
            <section>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 text-red-500`}>Danger Zone</p>
              <div className="rounded-xl border border-red-500/20 p-3 bg-red-500/5">
                <p className={`text-xs mb-3 ${textMut}`}>This will end your current session.</p>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/25 transition-all"
                >
                  <LogOut size={13}/> Sign Out
                </button>
              </div>
            </section>

          </div>
        </div>

        {/* RIGHT panel — forms */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-5 space-y-4 max-w-3xl mx-auto">

            {/* Personal Information */}
            <div className={`rounded-xl border p-5 ${card}`}>
              <div className="flex items-center gap-2 mb-4">
                <User size={14} className="text-orange-500"/>
                <h3 className={`text-sm font-bold ${textPri}`}>Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field dark={dark} label="Full Name"   icon={<User size={10}/>}   value={fullName} onChange={setFullName} placeholder="Your full name"/>
                <Field dark={dark} label="Email"       icon={<Mail size={10}/>}   value={email}    onChange={setEmail}    type="email" placeholder="you@example.com"/>
                <Field dark={dark} label="Phone"       icon={<Phone size={10}/>}  value={phone}    onChange={setPhone}    type="tel"   placeholder="+94 77 000 0000"/>
                <Field dark={dark} label="Employee ID" icon={<IdCard size={10}/>} value={user?.employeeId ?? ''} readOnly/>
              </div>
              <div className="mt-3">
                <label className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1.5 ${lbl}`}>
                  <MapPin size={10}/> Address
                </label>
                <textarea
                  value={address} rows={2} onChange={e => setAddress(e.target.value)}
                  placeholder="Street, City, Province, Country"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors resize-none ${inp}`}
                />
              </div>
              <SaveRow dark={dark} onSave={handleSaveProfile} saved={savedProfile} label="Save Profile"/>
            </div>

            {/* Change Password */}
            <div className={`rounded-xl border p-5 ${card}`}>
              <div className="flex items-center gap-2 mb-4">
                <Key size={14} className="text-orange-500"/>
                <h3 className={`text-sm font-bold ${textPri}`}>Change Password</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field dark={dark} label="Current" icon={<Lock size={10}/>}
                  value={curPw} onChange={setCurPw}
                  type={showCur ? 'text' : 'password'} placeholder="Current password"
                  right={<PwEye dark={dark} show={showCur} toggle={() => setShowCur(p => !p)}/>}
                />
                <Field dark={dark} label="New Password" icon={<Lock size={10}/>}
                  value={newPw} onChange={setNewPw}
                  type={showNew ? 'text' : 'password'} placeholder="Min. 8 characters"
                  right={<PwEye dark={dark} show={showNew} toggle={() => setShowNew(p => !p)}/>}
                />
                <Field dark={dark} label="Confirm" icon={<Lock size={10}/>}
                  value={confirmPw} onChange={setConfirmPw}
                  type={showConf ? 'text' : 'password'} placeholder="Repeat new password"
                  right={<PwEye dark={dark} show={showConf} toggle={() => setShowConf(p => !p)}/>}
                />
              </div>
              {newPw.length > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        i <= strength ? PW_COLORS[strength] : dark ? 'bg-zinc-700' : 'bg-gray-200'
                      }`}/>
                    ))}
                  </div>
                  <span className={`text-[11px] font-semibold ${textMut}`}>{PW_LABELS[strength]}</span>
                </div>
              )}
              {pwError && <p className="text-red-400 text-xs mt-2">{pwError}</p>}
              <SaveRow dark={dark} onSave={handleSaveSecurity} saved={savedSecurity} label="Update Password"/>
            </div>

          </div>

          {/* Mobile-only: logout + notification toggles */}
          <div className={`md:hidden rounded-xl border p-4 ${card}`}>
            <div className="flex flex-wrap gap-3 mb-4">
              {([
                { k: 'system'  as const, label: 'System Alerts' },
                { k: 'alerts'  as const, label: 'Production Alerts' },
                { k: 'reports' as const, label: 'Daily Reports' },
              ] as const).map(n => (
                <div key={n.k} className={`flex items-center justify-between flex-1 min-w-35 px-3 py-2 rounded-lg border ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-xs ${textSec}`}>{n.label}</span>
                  <button
                    onClick={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ml-2 shrink-0 ${
                      notifs[n.k] ? 'bg-orange-500' : dark ? 'bg-zinc-700' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                      notifs[n.k] ? 'left-4' : 'left-0.5'
                    }`}/>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-semibold border border-red-500/25 transition-all"
            >
              <LogOut size={14}/> Sign Out
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
