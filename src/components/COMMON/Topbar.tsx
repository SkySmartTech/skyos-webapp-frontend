import {
  Search, Bell, User, LayoutDashboard, BarChart3, Factory,
  Cpu, ChevronDown, ChevronUp, PanelLeftOpen, PanelLeftClose, Sun, Moon,
} from "lucide-react";
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../SKY_OS/sky_auth';
import type { ActiveModule } from '../../App';

interface TopbarProps {
  activeModule: ActiveModule;
  onDashboardClick: () => void;
  onProductionTrackingClick: () => void;
  onDcscClick: () => void;
  onWipClick: () => void;
  onCustomClick: () => void;
  productionActive: boolean;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onCloseTopbar: () => void;
  onProfileClick: () => void;
}

export default function Topbar({
  activeModule,
  onDashboardClick, onProductionTrackingClick, onDcscClick, onWipClick, onCustomClick,
  productionActive, showSidebar, onToggleSidebar, onCloseTopbar,
  onProfileClick,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const dark = theme === 'dark';

  const displayName = user?.fullName ?? user?.name ?? 'Admin';
  const displayRole = user?.role ?? 'Super User';

  const navBtn = (module: ActiveModule | null) => {
    const isActive = module !== null && activeModule === module;
    const base = 'flex items-center gap-2 px-6 py-4 text-sm font-semibold border-r transition-all duration-200 ';
    if (isActive) {
      return base + (dark
        ? 'text-orange-400 bg-orange-500/10 border-zinc-800'
        : 'text-orange-600 bg-orange-50 border-gray-200');
    }
    return base + (dark
      ? 'text-gray-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
      : 'text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900');
  };

  return (
    <div className={`w-full z-10 border-b shadow-2xl transition-colors duration-300 ${
      dark
        ? 'bg-linear-to-b from-[#050505] to-[#0f0f0f] text-white border-zinc-800'
        : 'bg-white text-gray-900 border-gray-200'
    }`}>

      {/* ── TOP HEADER ── */}
      <header className="flex items-center justify-between px-6 py-4">

        {/* LOGO + BRAND */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-400/20" />
            <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-20 pointer-events-none" />
          </div>
          <div>
            <h1 className={`text-2xl font-extrabold tracking-wide ${dark ? 'text-white' : 'text-gray-900'}`}>
              Sky<span className="text-orange-500">OS</span>
            </h1>
            <p className={`text-xs tracking-wider uppercase ${dark ? 'text-zinc-500' : 'text-gray-400'}`}>
              Smart Factory Operating System
            </p>
          </div>
        </div>

       

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* DARK / LIGHT TOGGLE */}
          <button
            onClick={toggleTheme}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-semibold text-sm transition-all duration-300 ${
              dark
                ? 'bg-zinc-900 border-zinc-700 text-yellow-400 hover:border-orange-500/60 hover:bg-zinc-800'
                : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
            }`}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
           
          </button>

          {/* BELL */}
          <button className={`relative group p-3 rounded-2xl border transition-all duration-300 ${
            dark ? 'bg-zinc-900 border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-800' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
          }`}>
            <Bell size={20} className={dark ? 'text-yellow-400' : 'text-orange-500'} />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border border-black">3</span>
          </button>

          {/* USER — click opens profile page */}
          <button
            onClick={onProfileClick}
            className={`flex items-center gap-3 border rounded-2xl px-4 py-2 transition-all duration-300 shadow ${
              dark
                ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/40 hover:bg-zinc-800'
                : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {/* Avatar: show uploaded image or fallback icon */}
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-md">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>

            <div className="hidden md:block text-left">
              <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>
                {displayName}
              </p>
              <p className={`text-xs ${dark ? 'text-zinc-400' : 'text-gray-500'}`}>
                {displayRole}
              </p>
            </div>
            <ChevronDown size={15} className={dark ? 'text-zinc-500' : 'text-gray-400'} />
          </button>
        </div>
      </header>

      {/* ── NAV BAR ── */}
      <nav className={`flex flex-wrap items-center border-t transition-colors duration-300 ${
        dark ? 'border-zinc-800 bg-[#111111]' : 'border-gray-200 bg-gray-50'
      }`}>

        {productionActive && (
          <button
            onClick={onToggleSidebar}
            className={`flex items-center justify-center w-12 h-full border-r transition-all ${
              dark ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'border-gray-200 hover:bg-gray-200 text-gray-500 hover:text-gray-900'
            }`}
          >
            {showSidebar ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
          </button>
        )}

        <button onClick={onDashboardClick} className={navBtn('home')}>
          <LayoutDashboard size={17} />
          Dashboard
        </button>

        <button className={navBtn(null)}>
          <BarChart3 size={17} />
          Analysis
        </button>

        <button onClick={onProductionTrackingClick} className={navBtn('production')}>
          <Factory size={17} />
          Production Tracking
        </button>

        <button onClick={onWipClick} className={navBtn('wip')}>
          <Cpu size={17} />
          WIP
        </button>

        <button onClick={onDcscClick} className={navBtn('dcsc')}>
          <Cpu size={17} />
          DCSC1515A
        </button>

        <button onClick={onCustomClick} className={navBtn('custom')}>
          <Cpu size={17} />
          Custom System
        </button>

        <button
          onClick={onCloseTopbar}
          className={`ml-auto flex items-center gap-2 px-4 py-4 text-xs border-l transition-all duration-200 ${
            dark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800 border-zinc-800' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200 border-gray-200'
          }`}
        >
          <ChevronUp size={15} />
          Hide
        </button>
      </nav>
    </div>
  );
}
