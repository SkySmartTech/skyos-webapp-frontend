import { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './sky_auth';
import { useTheme } from '../../context/ThemeContext';
import nexisLogo from '../../assets/nexis.png';

export default function SkyLogin() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    if (!employeeId || !password) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    try {
      await login(employeeId, password);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
          ?.response?.data?.errors?.employee_id?.[0]
        ?? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Invalid Employee ID or Password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const cardClass = `w-full max-w-md rounded-3xl border shadow-2xl p-8 ${
    dark ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-[#e2e8f0]'
  }`;

  const inputClass = `flex items-center gap-3 border rounded-2xl px-4 py-3 transition-colors ${
    dark
      ? 'bg-[#1e293b] border-[#334155] focus-within:border-[#2563EB]'
      : 'bg-[#f8fafc] border-[#e2e8f0] focus-within:border-[#2563EB]'
  }`;

  const textClass = `bg-transparent flex-1 text-sm outline-none ${
    dark ? 'text-white placeholder:text-[#475569]' : 'text-[#0f172a] placeholder:text-[#94a3b8]'
  }`;

  const iconClass = dark ? 'text-[#475569]' : 'text-[#94a3b8]';

  return (
    <div className={cardClass}>

      {/* Branding */}
      <div className="flex flex-col items-center mb-8">
        <img src={nexisLogo} alt="NEXIS" className="w-20 h-20 object-contain rounded-2xl mb-4" />
        <h1 className={`text-3xl font-extrabold tracking-wide ${dark ? 'text-white' : 'text-[#0f172a]'}`}>
          NEX<span className="text-[#2563EB]">IS</span>
        </h1>
        <p className={`text-xs tracking-wider uppercase mt-1 ${dark ? 'text-[#475569]' : 'text-[#94a3b8]'}`}>
          Smart Factory Operating System
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-[#EF4444] text-sm text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className={inputClass}>
          <User size={17} className={iconClass} />
          <input
            type="text"
            placeholder="Employee ID (e.g., E001)"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            className={textClass}
          />
        </div>

        <div className={inputClass}>
          <Lock size={17} className={iconClass} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={textClass}
          />
          <button type="button" onClick={() => setShowPassword(p => !p)} className="shrink-0">
            {showPassword
              ? <EyeOff size={16} className={iconClass} />
              : <Eye    size={16} className={iconClass} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1e40af] text-white font-semibold text-sm transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><LogIn size={16} /> Sign In</>
          )}
        </button>
      </form>

      <p className={`text-center text-xs mt-6 ${dark ? 'text-[#475569]' : 'text-[#94a3b8]'}`}>
        © 2025 NEXIS · Smart Factory Platform
      </p>
    </div>
  );
}
