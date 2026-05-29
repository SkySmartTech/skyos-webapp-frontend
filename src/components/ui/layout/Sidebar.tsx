import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Wrench,
  User,
  HelpCircle,
  LogOut,
  ChevronDown,
  Settings // Added Settings icon
} from "lucide-react";

interface SidebarProps {
  setActiveView: (view: 'dashboard' | 'settings') => void;
  activeView: 'dashboard' | 'settings';
}

const Sidebar = ({ setActiveView, activeView }: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-[#f5f5f5] border-r border-gray-200 px-6 py-6 overflow-y-auto">
      
      {/* SYSTEMS */}
      <div>
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">SYSTEMS</p>

        {/* Dashboard Link */}
        <div 
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center justify-between mb-6 cursor-pointer p-2 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
        >
          <div className={`flex items-center gap-3 ${activeView === 'dashboard' ? 'text-blue-500' : 'text-gray-600'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[18px] font-medium">Dashboard</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-400 text-white text-xs flex items-center justify-center font-semibold">
            3
          </div>
        </div>

        {/* P2P Section */}
        <div className="flex items-center justify-between text-gray-600 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} />
            <span className="text-[18px] font-medium">P2P Section</span>
          </div>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* CONFIGURATION */}
      <div className="mt-12">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">CONFIGURATION</p>

        {/* Settings / Plan Upload Link */}
        <div 
          onClick={() => setActiveView('settings')}
          className={`flex items-center justify-between mb-6 cursor-pointer p-2 rounded-lg transition-colors ${activeView === 'settings' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
        >
          <div className={`flex items-center gap-3 ${activeView === 'settings' ? 'text-blue-500' : 'text-gray-600'}`}>
            <Settings size={20} />
            <span className="text-[18px] font-medium">Plan Settings</span>
          </div>
        </div>

        {/* User Management */}
        <div className="flex items-center justify-between mb-6 text-gray-600 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <span className="text-[18px] font-medium">Company Setting</span>
          </div>
          <ChevronDown size={18} />
        </div>
      </div>

      {/* COMPONENTS */}
      <div className="mt-12">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">COMPONENTS</p>
        <div className="space-y-2">
          {/* User Profile */}
          <div className="flex items-center gap-3 text-gray-600 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
            <User size={20} />
            <span className="text-[18px] font-medium">User Profile</span>
          </div>
          {/* Logout */}
          <div className="flex items-center gap-3 text-gray-600 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
            <LogOut size={20} />
            <span className="text-[18px] font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;