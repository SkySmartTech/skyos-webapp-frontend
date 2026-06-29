import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, BarChart3,
  Settings, Brain, Shield, X, Menu, LogOut,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from './sky_auth';
import type { ActiveModule } from '../../App';
import dioLogo from '../../assets/dio-logo.png';

export type SkyView = 'dashboard' | 'analytics' | 'ai' | 'security' | 'settings';

interface SkySidebarProps {
  activeView: SkyView;
  setActiveView: (v: SkyView) => void;
  onNavigateModule: (module: ActiveModule, view?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SkySidebar({ activeView, setActiveView, isOpen, onClose }: SkySidebarProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const mini = isFullscreen && !expanded;

  const base    = dark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600';
  const lbl     = dark ? 'text-gray-600'                              : 'text-gray-400';
  const active  = dark ? 'bg-[#2563EB]/10 text-[#3b82f6]'            : 'bg-[#eff6ff] text-[#2563EB]';
  const hover   = dark ? 'hover:bg-gray-800 hover:text-white'         : 'hover:bg-gray-100 hover:text-gray-900';
  const divider = dark ? 'border-gray-800'                            : 'border-gray-200';
  const textMut = dark ? 'text-gray-500'                              : 'text-gray-400';

  const navItem = (view: SkyView, Icon: React.ElementType, label_: string, badge?: string | number) => (
    <div
      onClick={() => { setActiveView(view); onClose(); setExpanded(false); }}
      title={label_}
      className={`flex items-center ${mini ? 'justify-center' : 'justify-between'} mb-1 cursor-pointer px-2 py-2 rounded-xl transition-all duration-200 ${
        activeView === view ? active : hover
      }`}
    >
      {mini ? (
        <Icon size={18} className="shrink-0" />
      ) : (
        <>
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon size={17} className="shrink-0" />
            <span className="text-sm font-medium truncate">{label_}</span>
          </div>
          {badge !== undefined && (
            <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] flex items-center justify-center font-bold shrink-0 ml-1">{badge}</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {isOpen && !isFullscreen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}

      <div className={`
        shrink-0 h-full border-r overflow-y-auto flex flex-col
        transition-all duration-300 ease-in-out
        ${isFullscreen
          ? `relative ${mini ? 'w-14 px-1 py-4' : 'w-64 px-3 py-4'}`
          : `fixed md:relative inset-y-0 md:inset-auto left-0 md:left-auto z-40 md:z-auto
             w-64 px-3 py-4 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`
        }
        ${base}
      `}>

        {/* Header */}
        {mini ? (
          <div className={`flex flex-col items-center gap-1.5 pb-3 mb-2 border-b ${divider}`}>
            <button
              onClick={() => setExpanded(true)}
              title="Expand menu"
              className={`p-1.5 rounded-lg transition-colors ${hover}`}
            >
              <Menu size={17} />
            </button>
            <img src={dioLogo} alt="DIO" className="w-8 h-8 rounded-md object-cover" />
            {/* System tag — mini */}
            <div className="w-full flex justify-center">
              <span className="text-[7px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-400 text-center leading-tight">
                SKY
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            <div className={`flex items-center gap-3 px-2 py-3 border-b ${divider}`}>
              <img src={dioLogo} alt="DIO" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                  DIO Manufacture LTD
                </p>
              </div>
              {isFullscreen && (
                <button
                  onClick={() => setExpanded(false)}
                  title="Collapse menu"
                  className={`p-1 rounded-lg shrink-0 transition-colors ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <Menu size={16} />
                </button>
              )}
              {!isFullscreen && (
                <button
                  onClick={onClose}
                  className={`md:hidden p-1 rounded-lg shrink-0 transition-colors ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* System indicator — full */}
            <div className="flex items-center gap-2 px-3 py-2 mx-1 mt-2 mb-3 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">Smart Factory OS</p>
                <p className={`text-[9px] ${dark ? 'text-indigo-300/60' : 'text-indigo-500/70'}`}>SkyOS</p>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW */}
        <div className="mb-1">
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>Overview</p>}
          {navItem('dashboard', LayoutDashboard, 'Dashboard', 6)}
        </div>

        <div className={`border-t my-2 ${divider}`} />

        {/* ANALYTICS */}
        <div className="mb-1">
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>Analytics</p>}
          {navItem('analytics', BarChart3, 'Analytics & Charts')}
          {navItem('ai',        Brain,     'AI Insights')}
        </div>

        {/* CONFIGURATION */}
        <div>
          <div className={`border-t my-2 ${divider}`} />
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>Configuration</p>}
          {navItem('settings', Settings, 'System Settings')}
          {navItem('security',  Shield,  'User Management')}
        </div>

        <div className={`mt-auto pt-4 border-t ${divider}`}>
          {mini ? (
            <button
              onClick={logout}
              title="Logout"
              className="w-full flex justify-center px-2 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors duration-200"
            >
              <LogOut size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-medium text-sm"
              >
                <LogOut size={16} className="shrink-0" />
                Logout
              </button>
              <p className={`text-[11px] text-center font-semibold mt-3 ${textMut}`}>NEXIS V01</p>
              <p className={`text-[10px] text-center mt-0.5 ${textMut}`}>DIO Manufacture LTD</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
