import React, { useState } from 'react';
import {
  LayoutDashboard, BarChart3, Cpu, Zap, Factory,
  ChevronDown, ChevronRight, Settings, Brain, Shield, Layers,
  Activity, Bell, LineChart, Database, X,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ActiveModule } from '../../App';

export type SkyView = 'dashboard' | 'analytics' | 'ai' | 'security' | 'settings';

interface SkySidebarProps {
  activeView: SkyView;
  setActiveView: (v: SkyView) => void;
  onNavigateModule: (module: ActiveModule, view?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ModuleDef {
  key: string;
  label: string;
  Icon: React.ElementType;
  module: ActiveModule;
  links: { label: string; Icon: React.ElementType; view: string }[];
}

const SIDEBAR_MODULES: ModuleDef[] = [
  {
    key: 'spm1693', label: 'SPM-1693', Icon: Factory, module: 'production',
    links: [
      { label: 'Dashboard', Icon: LayoutDashboard, view: 'dashboard' },
      { label: 'Production Update', Icon: Activity, view: 'update' },
      { label: 'Plan Settings', Icon: Settings, view: 'settings' },
    ],
  },
  {
    key: 'dscs1515a', label: 'DSCS1515A', Icon: Cpu, module: 'dcsc',
    links: [
      { label: 'Dashboard', Icon: LayoutDashboard, view: 'dashboard' },
      { label: 'Andon Alerts', Icon: Bell, view: 'alerts' },
      { label: 'Analytics', Icon: LineChart, view: 'analytics' },
    ],
  },
  {
    key: 'pms1682', label: 'PMS-1682', Icon: Zap, module: 'custom',
    links: [
      { label: 'Dashboard', Icon: LayoutDashboard, view: 'dashboard' },
      { label: 'Grid Monitoring', Icon: LineChart, view: 'grid' },
      { label: 'Energy Reports', Icon: BarChart3, view: 'reports' },
    ],
  },
  {
    key: 'bsm1740', label: 'BSM-1740', Icon: Layers, module: 'wip',
    links: [
      { label: 'Dashboard', Icon: LayoutDashboard, view: 'dashboard' },
      { label: 'WIP Tracking', Icon: Database, view: 'wip' },
      { label: 'Batch Management', Icon: Activity, view: 'batch' },
    ],
  },
];

export default function SkySidebar({ activeView, setActiveView, onNavigateModule, isOpen, onClose }: SkySidebarProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const base = dark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600';
  const lbl = dark ? 'text-gray-600' : 'text-gray-400';
  const active = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
  const hover = dark ? 'hover:bg-gray-800 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900';
  const divider = dark ? 'border-gray-800' : 'border-gray-200';
  const textMut = dark ? 'text-gray-500' : 'text-gray-400';
  const subLine = dark ? 'border-gray-700' : 'border-gray-200';
  const subLink = dark ? 'text-zinc-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';

  const toggleModule = (key: string) =>
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const navItem = (view: SkyView, Icon: React.ElementType, label_: string, badge?: string | number) => (
    <div
      onClick={() => { setActiveView(view); onClose(); }}
      className={`flex items-center justify-between mb-1 cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${activeView === view ? active : hover
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon size={17} className="shrink-0" />
        <span className="text-sm font-medium truncate">{label_}</span>
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
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64
        md:relative md:z-auto md:translate-x-0 md:flex md:shrink-0
        transition-transform duration-300 ease-in-out
        h-full border-r px-3 py-4 overflow-y-auto flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${base}
      `}>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className={`md:hidden self-end mb-2 p-1.5 rounded-lg ${dark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X size={18} />
        </button>

        {/* OVERVIEW */}
        <div className="mb-2">
          <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>Overview</p>
          {navItem('dashboard', LayoutDashboard, 'Dashboard', 6)}
          {navItem('security', Shield, 'User Management')}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* ANALYTICS */}
        <div className="mb-2">
          <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>Analytics</p>
          {navItem('analytics', BarChart3, 'Analytics & Charts')}
          {navItem('ai', Brain, 'AI Insights')}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* MODULES */}
        <div>
          <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>
            Modules
          </p>

          {SIDEBAR_MODULES.map(mod => {
            const isExpanded = openModules.has(mod.key);

            return (
              <div key={mod.key} className="mb-1">
                <div
                  onClick={() => toggleModule(mod.key)}
                  className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-xl transition-all duration-200 ${isExpanded
                      ? dark
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-orange-50 text-orange-600'
                      : hover
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <mod.Icon size={17} className="shrink-0" />
                    <span className="text-sm font-medium truncate">{mod.label}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </div>

                {isExpanded && (
                  <div className={`ml-5 mt-1 mb-1 border-l pl-3 ${subLine}`}>
                    {mod.links.map(link => (
                      <div
                        key={link.view}
                        onClick={() => {
                          onNavigateModule(mod.module, link.view);
                          onClose();
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 mb-1 text-sm font-medium ${subLink}`}
                      >
                        <link.Icon size={14} />
                        <span>{link.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CONFIGURATION */}
        <div>
          <div className={`border-t my-3 ${divider}`} />

          <p className={`text-xs font-bold tracking-widest mb-3 uppercase px-1 ${lbl}`}>
            Configuration
          </p>

          {navItem('settings', Settings, 'System Settings')}
        </div>

        {/* FOOTER */}
        <div className={`mt-4 pt-4 border-t ${divider}`}>
          <p className={`text-[11px] text-center ${textMut}`}>SkyOS v2.0</p>
          <p className={`text-[10px] text-center mt-0.5 ${textMut}`}>
            Sky Technology (Pvt) Ltd
          </p>
        </div>

      </div>
    </>
  );
}
