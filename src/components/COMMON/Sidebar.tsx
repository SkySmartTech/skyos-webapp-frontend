import {
  LayoutDashboard, BarChart3, ChevronDown, Settings, Activity, Users, LogOut, User,
} from "lucide-react";
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  setActiveView: (view: 'dashboard' | 'settings' | 'update') => void;
  activeView: 'dashboard' | 'settings' | 'update';
}

const Sidebar = ({ setActiveView, activeView }: SidebarProps) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const base = dark
    ? 'bg-gray-900 border-gray-800 text-gray-400'
    : 'bg-white border-gray-200 text-gray-600';

  const label = dark ? 'text-gray-600' : 'text-gray-400';

  const active = dark
    ? 'bg-orange-500/10 text-orange-400'
    : 'bg-orange-50 text-orange-600';

  const hover = dark
    ? 'hover:bg-gray-800 hover:text-white'
    : 'hover:bg-gray-100 hover:text-gray-900';

  const divider = dark ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`w-[280px] h-full border-r px-6 py-6 overflow-y-auto transition-colors duration-300 ${base}`}>

      {/* SYSTEMS */}
      <div>
        <p className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}>Systems</p>

        {/* Dashboard */}
        <div
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center justify-between mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === 'dashboard' ? active : hover
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard size={19} />
            <span className="text-base font-medium">Dashboard</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
            3
          </div>
        </div>

        {/* P2P Section */}
        <div className={`flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}>
          <div className="flex items-center gap-3">
            <BarChart3 size={19} />
            <span className="text-base font-medium">P2P Section</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* DIVIDER */}
      <div className={`border-t my-6 ${divider}`} />

      {/* CONFIGURATION */}
      <div>
        <p className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}>Configuration</p>

        {/* Production Update */}
        <div
          onClick={() => setActiveView('update')}
          className={`flex items-center gap-3 mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === 'update' ? active : hover
          }`}
        >
          <Activity size={19} />
          <span className="text-base font-medium">Production Update</span>
        </div>

        {/* Plan Settings */}
        <div
          onClick={() => setActiveView('settings')}
          className={`flex items-center gap-3 mb-2 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${
            activeView === 'settings' ? active : hover
          }`}
        >
          <Settings size={19} />
          <span className="text-base font-medium">Plan Settings</span>
        </div>

        {/* Company Setting */}
        <div className={`flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}>
          <div className="flex items-center gap-3">
            <Users size={19} />
            <span className="text-base font-medium">Company Setting</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* DIVIDER */}
      <div className={`border-t my-6 ${divider}`} />

      {/* COMPONENTS */}
      <div>
        <p className={`text-xs font-bold tracking-widest mb-5 uppercase ${label}`}>Account</p>
        <div className="space-y-1">
          <div className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}>
            <User size={19} />
            <span className="text-base font-medium">User Profile</span>
          </div>
          <div className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl transition-all duration-200 ${hover}`}>
            <LogOut size={19} />
            <span className="text-base font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
