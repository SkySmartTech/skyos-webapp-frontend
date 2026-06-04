import React from 'react';
import { LayoutDashboard, Settings, Activity, X } from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  setActiveView: (view: 'dashboard' | 'settings' | 'update') => void;
  activeView: 'dashboard' | 'settings' | 'update';
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ setActiveView, activeView, isOpen, onClose }: SidebarProps) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const base    = dark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600';
  const lbl     = dark ? 'text-gray-600' : 'text-gray-400';
  const active  = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
  const hover   = dark ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';

  const navItem = (view: 'dashboard' | 'settings' | 'update', Icon: React.ElementType, label: string, badge?: number) => (
    <div
      onClick={() => { setActiveView(view); onClose(); }}
      className={`flex items-center justify-between mb-2 cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${
        activeView === view ? active : hover
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon size={17} className="shrink-0" />
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0 ml-1">{badge}</div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar panel — drawer on mobile, static on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-65
        md:relative md:z-auto md:translate-x-0 md:flex md:shrink-0
        transition-transform duration-300 ease-in-out
        h-full border-r px-4 py-5 overflow-y-auto flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${base}
      `}>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className={`md:hidden self-end mb-3 p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X size={18} />
        </button>

        {/* SYSTEMS */}
        <div>
          <p className={`text-xs font-bold tracking-widest mb-4 uppercase ${lbl}`}>Systems</p>
          {navItem('dashboard', LayoutDashboard, 'Dashboard', 3)}
        </div>

        <div className={`border-t my-5 ${divider}`} />

        {/* CONFIGURATION */}
        <div>
          <p className={`text-xs font-bold tracking-widest mb-4 uppercase ${lbl}`}>Configuration</p>
          {navItem('update',   Activity, 'Production Update')}
          {navItem('settings', Settings, 'Plan Settings')}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
