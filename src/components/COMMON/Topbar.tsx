import { useState, useEffect, type ElementType } from 'react';
import {
  Bell, User, LayoutDashboard, Factory,
  Cpu, Layers, Clock,
  Sun, Moon, Menu, X,
  Maximize, Minimize, Hammer,
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
  onWmsClick: () => void;
  productionActive: boolean;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onProfileClick: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}


export default function Topbar({
  activeModule,
  onDashboardClick,
  onProductionTrackingClick,
  onDcscClick,
  onWipClick,
  onCustomClick,
  onWmsClick,
  productionActive,
  showSidebar,
  onToggleSidebar,
  onProfileClick,
  isFullscreen,
  onToggleFullscreen,
}: TopbarProps) {

  const { theme, toggleTheme } = useTheme();
  useAuth();

  const dark = theme === 'dark';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const navBtn = (module: ActiveModule | null, onClick?: () => void, label?: string, Icon?: ElementType) => {
    const isActive = module !== null && activeModule === module;
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1.5 w-24 py-3 rounded-xl border shrink-0 transition-all duration-200 ${
          isActive
            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/30 hover:text-white'
        }`}
      >
        {Icon && <Icon size={20} />}
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </button>
    );
  };

  const mobileNavItem = (
    label: string,
    Icon: ElementType,
    onClick: () => void,
    module: ActiveModule | null
  ) => {
    const isActive = module !== null && activeModule === module;
    return (
      <button
        onClick={() => { onClick(); setMobileNavOpen(false); }}
        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-all rounded-xl border ${
          isActive
            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
            : 'border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={15} /> {label}
      </button>
    );
  };

  return (
    <div className="w-full z-10 relative">

      {/* ── NAVBAR (collapses to thin strip when hidden) ── */}
      <div className={`transition-colors duration-300 shadow-2xl ${dark ? 'bg-[#0f172a] text-white' : 'bg-gray-900 text-white'}`}>

        {/* Main nav row */}
        <div className="flex items-center px-4 py-2 gap-3">

            {/* LEFT — brand */}
            <div className="flex items-center shrink-0">
              <h1 className="text-base font-extrabold leading-tight">
                <span className="text-[#2563EB]">NEXIS</span>
              </h1>
            </div>

            {/* CENTER — nav buttons */}
            <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
              {navBtn('home', onDashboardClick, 'Dashboard', LayoutDashboard)}
              {navBtn('dcsc', onDcscClick, 'Andon Sys', Cpu)}
              {navBtn('wip', onWipClick, 'Super Market', Layers)}
              {navBtn('production', onProductionTrackingClick, 'Production Sys', Factory)}
              {navBtn('solar', onCustomClick, 'Energy Monitoring', Sun)}
              {navBtn('wms', onWmsClick, 'Work Orders', Hammer)}
            </div>

            {/* RIGHT — clock + actions */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <div className="hidden md:flex items-center gap-2.5 border border-white/15 rounded-lg px-3 py-1.5">
                <Clock size={15} className="text-[#2563EB] shrink-0" />
                <span className="font-mono font-bold text-sm text-white/90 tracking-widest">
                  {now.toLocaleTimeString()}
                </span>
                <span className="text-white/30">|</span>
                <span className="text-xs text-white/60">
                  {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <button onClick={toggleTheme} className="p-1.5 rounded-lg border bg-zinc-800 border-zinc-700 text-yellow-400">
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </button>

              <button onClick={onToggleFullscreen} className="p-1.5 rounded-lg border bg-zinc-800 border-zinc-700 text-white/70 hover:text-white">
                {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
              </button>

              <button className="relative p-1.5 rounded-lg border bg-zinc-800 border-zinc-700">
                <Bell size={15} className="text-yellow-400" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full">3</span>
              </button>

              <button onClick={onProfileClick} className="p-1.5 rounded-lg border bg-zinc-800 border-zinc-700 text-white/80">
                <User size={15} />
              </button>

              <button
                onClick={() => setMobileNavOpen(p => !p)}
                className="md:hidden p-1.5 rounded-lg border border-white/20 text-white/70"
              >
                {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
      </div>

      {/* ── MOBILE NAV ── */}
      {mobileNavOpen && (
        <div className="md:hidden p-3 space-y-1.5 bg-[#0f172a] border-t border-white/10">
          {mobileNavItem('Dashboard', LayoutDashboard, onDashboardClick, 'home')}
          {mobileNavItem('SPM-1693', Factory, onProductionTrackingClick, 'production')}
          {mobileNavItem('BSM-1740', Layers, onWipClick, 'wip')}
          {mobileNavItem('DSCS1515A', Cpu, onDcscClick, 'dcsc')}
          {mobileNavItem('PMS-1682', Sun, onCustomClick, 'solar')}
          {mobileNavItem('WMS-1760A', Hammer, onWmsClick, 'wms')}
          {productionActive && (
            <button
              onClick={() => { onToggleSidebar(); setMobileNavOpen(false); }}
              className="w-full px-4 py-2.5 text-sm text-white/70 border border-white/15 rounded-xl hover:bg-white/10"
            >
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
