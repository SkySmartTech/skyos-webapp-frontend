import { useState, useRef } from 'react';
import {
  ArrowLeft, Camera, Save, CheckCircle,
  User, Mail, MapPin, IdCard, Shield,
} from 'lucide-react';
import { useAuth } from '../SKY_OS/sky_auth';
import { useTheme } from '../../context/ThemeContext';

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [fullName, setFullName] = useState(user?.fullName ?? user?.name ?? '');
  const [email,    setEmail]    = useState(user?.email   ?? '');
  const [address,  setAddress]  = useState(user?.address ?? '');
  const [avatar,   setAvatar]   = useState(user?.avatar  ?? '');
  const [saved,    setSaved]    = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateProfile({ fullName, email, address, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Style tokens ────────────────────────────────────────────────────────────
  const bg      = dark ? 'bg-gray-950'              : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inp     = dark
    ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-400';
  const lbl     = dark ? 'text-zinc-400' : 'text-gray-500';
  const textPri = dark ? 'text-white'    : 'text-gray-900';
  const textMut = dark ? 'text-zinc-500' : 'text-gray-400';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`min-h-full p-8 transition-colors duration-300 ${bg}`}>

      {/* ── Back ───────────────────────────────────────────────────────────── */}
      <button
        onClick={onBack}
        className={`flex items-center gap-2 mb-8 text-sm font-medium transition-colors ${
          dark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Avatar + identity card ────────────────────────────────────────── */}
        <div className={`rounded-2xl border p-8 ${card}`}>
          <div className="flex flex-col sm:flex-row items-center gap-8">

            {/* Avatar circle — click to upload */}
            <div className="relative group shrink-0">
              <div
                onClick={() => fileRef.current?.click()}
                className="w-32 h-32 rounded-full overflow-hidden cursor-pointer ring-4 ring-orange-500/20 hover:ring-orange-500/50 transition-all"
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                    <User size={44} className="text-white" />
                  </div>
                )}
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Camera size={22} className="text-white" />
                  <span className="text-white text-[10px] font-semibold">Change</span>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Identity info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className={`text-2xl font-bold ${textPri}`}>
                {user?.fullName ?? user?.name ?? 'User'}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  {user?.role}
                </span>
              </div>
              <div className={`mt-3 flex flex-col gap-1 text-sm ${textMut}`}>
                <span className="flex items-center gap-2">
                  <IdCard size={13} />
                  Employee ID: <span className="font-mono font-semibold">{user?.employeeId}</span>
                </span>
                {user?.email && (
                  <span className="flex items-center gap-2">
                    <Mail size={13} /> {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Edit form ─────────────────────────────────────────────────────── */}
        <div className={`rounded-2xl border p-8 ${card}`}>
          <div className="flex items-center gap-2 mb-6">
            <Shield size={17} className="text-orange-500" />
            <h3 className={`text-base font-bold ${textPri}`}>Edit Profile</h3>
          </div>

          <div className="space-y-5">

            {/* Full Name */}
            <div>
              <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${lbl}`}>
                <User size={11} /> Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${inp}`}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${lbl}`}>
                <Mail size={11} /> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${inp}`}
              />
            </div>

            {/* Address */}
            <div>
              <label className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 ${lbl}`}>
                <MapPin size={11} /> Address
              </label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter your address"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${inp}`}
              />
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t my-6 ${divider}`} />

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/20"
            >
              <Save size={15} />
              Save Changes
            </button>

            {saved && (
              <div className="flex items-center gap-2 text-green-500 text-sm font-semibold animate-pulse">
                <CheckCircle size={16} />
                Profile updated!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
