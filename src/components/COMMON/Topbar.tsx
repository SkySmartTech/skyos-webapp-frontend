import { useState } from 'react';
import {
  Bell, User, LayoutDashboard, BarChart3, Factory,
  Cpu, Zap, Layers, ChevronDown, ChevronUp,
  PanelLeftOpen, PanelLeftClose, Sun, Moon, Menu, X,
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
  onDashboardClick,
  onProductionTrackingClick,
  onDcscClick,
  onWipClick,
  onCustomClick,
  productionActive,
  showSidebar,
  onToggleSidebar,
  onCloseTopbar,
  onProfileClick,
}: TopbarProps) {

  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const dark = theme === 'dark';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName = user?.fullName ?? user?.name ?? 'Admin';
  const displayRole = user?.role ?? 'Super User';

  const navBtn = (module: ActiveModule | null) => {
    const isActive = module !== null && activeModule === module;

    const base =
      'flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-sm font-semibold border-r border-white/15 shrink-0 transition-all duration-200 ';

    return base + (isActive
      ? 'bg-orange-500 text-white border-orange-400/40 shadow-md shadow-orange-500/30'
      : 'text-white/75 hover:bg-orange-500 hover:text-white hover:border-orange-400/40'
    );
  };

  const mobileNavItem = (
    label: string,
    Icon: React.ElementType,
    onClick: () => void,
    module: ActiveModule | null
  ) => {
    const isActive = module !== null && activeModule === module;

    return (
      <button
        onClick={() => { onClick(); setMobileNavOpen(false); }}
        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all rounded-lg ${
          isActive
            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
            : 'text-white/75 hover:bg-orange-500 hover:text-white'
        }`}
      >
        <Icon size={16} /> {label}
      </button>
    );
  };

  return (
    <div className={`w-full z-10 border-b shadow-2xl transition-colors duration-300 ${
      dark
        ? 'bg-linear-to-b from-[#050505] to-[#0f0f0f] text-white border-zinc-800'
        : 'bg-white text-gray-900 border-gray-200'
    }`}>

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-3 py-3 md:px-6 md:py-4">

        {/* BRAND */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative shrink-0">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-700 shadow-lg" />
            <div className="absolute inset-0 rounded-xl bg-orange-500 blur-xl opacity-20" />
          </div>

          <div>
            <h1 className="text-lg md:text-2xl font-extrabold">
              Sky<span className="text-orange-500">OS</span>
            </h1>
            <p className="hidden sm:block text-xs uppercase text-gray-400 dark:text-zinc-500">
              Smart Factory Operating System
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className={`px-3 py-2 rounded-xl border ${
              dark
                ? 'bg-zinc-900 border-zinc-700 text-yellow-400'
                : 'bg-orange-50 border-orange-200 text-orange-600'
            }`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* BELL */}
          <button className="relative p-2 md:p-3 rounded-xl border bg-gray-100 dark:bg-zinc-900">
            <Bell size={18} className={dark ? 'text-yellow-400' : 'text-orange-500'} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {/* USER */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-100 dark:bg-zinc-900"
          >
            <User size={16} />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">{displayRole}</p>
            </div>
          </button>

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileNavOpen(p => !p)}
            className="md:hidden p-2 rounded-xl border"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── DESKTOP NAV ── */}
      <nav className="hidden md:flex items-center border-t bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700">

        {productionActive && (
          <button
            onClick={onToggleSidebar}
            className="w-12 h-full border-r text-white/80"
          >
            {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        )}

        <button onClick={onDashboardClick} className={navBtn('home')}>
          <LayoutDashboard size={16} /> Dashboard
        </button>

        <button className={navBtn(null)}>
          <BarChart3 size={16} /> Analysis
        </button>

        <button onClick={onProductionTrackingClick} className={navBtn('production')}>
          <Factory size={16} /> SPM-1693
        </button>

        <button onClick={onWipClick} className={navBtn('wip')}>
          <Layers size={16} /> BSM-1740
        </button>

        <button onClick={onDcscClick} className={navBtn('dcsc')}>
          <Cpu size={16} /> DSCS1515A
        </button>

        <button onClick={onCustomClick} className={navBtn('custom')}>
          <Zap size={16} /> PMS-1682
        </button>

        <button
          onClick={onCloseTopbar}
          className="ml-auto px-4 py-3 text-white/70 hover:text-white"
        >
          <ChevronUp size={16} /> Hide
        </button>
      </nav>

      {/* ── MOBILE NAV ── */}
      {mobileNavOpen && (
        <div className="md:hidden p-3 space-y-2 bg-gradient-to-b from-blue-700 via-indigo-700 to-violet-700">

          {mobileNavItem('Dashboard', LayoutDashboard, onDashboardClick, 'home')}
          {mobileNavItem('Analysis', BarChart3, () => {}, null)}
          {mobileNavItem('SPM-1693', Factory, onProductionTrackingClick, 'production')}
          {mobileNavItem('BSM-1740', Layers, onWipClick, 'wip')}
          {mobileNavItem('DSCS1515A', Cpu, onDcscClick, 'dcsc')}
          {mobileNavItem('PMS-1682', Zap, onCustomClick, 'custom')}

          {productionActive && (
            <button
              onClick={() => { onToggleSidebar(); setMobileNavOpen(false); }}
              className="w-full px-4 py-3 text-white/80"
            >
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
          )}

          <button
            onClick={() => { onCloseTopbar(); setMobileNavOpen(false); }}
            className="w-full px-4 py-3 text-white/80"
          >
            <ChevronUp size={16} /> Hide Topbar
          </button>

        </div>
      )}
    </div>
  );
}