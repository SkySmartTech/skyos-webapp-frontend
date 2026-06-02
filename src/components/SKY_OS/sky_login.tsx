import { useState } from 'react';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './sky_auth';
import { useTheme } from '../../context/ThemeContext';
import skyosLogo from '../../assets/skyos.png';

interface SkyLoginProps {
  /** When true the root is transparent and the card uses glassmorphism —
   *  designed to sit on top of the Three.js SkyBackground canvas. */
  glass?: boolean;
}

export default function SkyLogin({ glass = false }: SkyLoginProps) {
  const { login } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    if (!employeeId || !password) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      if (employeeId.toUpperCase() === 'E001' && password === 'password123') {
        login('E001', 'Super admin', 'John Doe');
      } else if (employeeId.toUpperCase() === 'E002' && password === 'password123') {
        login('E002', 'user', 'Jane Smith');
      } else {
        setError('Invalid Employee ID or Password.');
        setLoading(false);
      }
    }, 1000);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const rootClass = glass
    ? 'login-enter absolute inset-0 flex items-center justify-center'
    : `login-enter min-h-screen flex items-center justify-center ${
        dark
          ? 'bg-linear-to-br from-[#050505] to-[#111111]'
          : 'bg-linear-to-br from-gray-100 to-gray-200'
      }`;

  const cardClass = glass
    ? 'w-full max-w-md rounded-3xl border p-8 shadow-2xl backdrop-blur-2xl bg-black/45 border-white/10'
    : `w-full max-w-md rounded-3xl border shadow-2xl p-8 ${
        dark ? 'bg-[#111111] border-zinc-800' : 'bg-white border-gray-200'
      }`;

  const inputClass = `flex items-center gap-3 border rounded-2xl px-4 py-3 transition-colors ${
    glass || dark
      ? 'bg-white/5 border-white/10 focus-within:border-orange-500/70'
      : 'bg-gray-50 border-gray-200 focus-within:border-orange-400'
  }`;

  const textClass = `bg-transparent flex-1 text-sm outline-none ${
    glass || dark
      ? 'text-white placeholder:text-white/25'
      : 'text-gray-900 placeholder:text-gray-400'
  }`;

  return (
    <div className={rootClass}>
      <style>{`
        @keyframes loginEnter {
          from { opacity: 0; transform: scale(1.1); }
          to   { opacity: 1; transform: scale(1); }
        }
        .login-enter {
          animation: loginEnter 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className={cardClass}>

        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <img src={skyosLogo} alt="SkyOS" className="w-20 h-20 object-contain rounded-2xl mb-4" />
          <h1 className={`text-3xl font-extrabold tracking-wide ${glass || dark ? 'text-white' : 'text-gray-900'}`}>
            Sky<span className="text-orange-500">OS</span>
          </h1>
          <p className={`text-xs tracking-wider uppercase mt-1 ${glass || dark ? 'text-white/30' : 'text-gray-400'}`}>
            Smart Factory Operating System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className={inputClass}>
            <User size={17} className="text-white/30" />
            <input
              type="text"
              placeholder="Employee ID (e.g., E001)"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className={textClass}
            />
          </div>

          <div className={inputClass}>
            <Lock size={17} className="text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={textClass}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)} className="shrink-0">
              {showPassword
                ? <EyeOff size={16} className="text-white/30" />
                : <Eye    size={16} className="text-white/30" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-orange-500/25"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>

        <p className={`text-center text-xs mt-6 ${glass || dark ? 'text-white/20' : 'text-gray-400'}`}>
          © 2025 SkyOS · Smart Factory Platform
        </p>
      </div>
    </div>
  );
}
