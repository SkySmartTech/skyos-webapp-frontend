// src/components/Sidebar.tsx

import {
  LayoutDashboard,
  BarChart3,
  Users,
  Wrench,
  User,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[280px] h-screen bg-[#f5f5f5] border-r border-gray-200 px-6 py-6">
      
      {/* SYSTEMS */}
      <div>
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">
          SYSTEMS
        </p>

        {/* Dashboard */}
        <div className="flex items-center justify-between mb-6 cursor-pointer">
          <div className="flex items-center gap-3 text-blue-500">
            <LayoutDashboard size={20} />
            <span className="text-[18px] font-medium">
              Dashboard
            </span>
          </div>

          <div className="w-6 h-6 rounded-full bg-green-400 text-white text-xs flex items-center justify-center font-semibold">
            3
          </div>
        </div>

        {/* P2P Section */}
        <div className="flex items-center justify-between text-gray-600 cursor-pointer">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} />
            <span className="text-[18px] font-medium">
              P2P Section
            </span>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>

      {/* CONFIGURATION */}
      <div className="mt-12">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">
          CONFIGURATION
        </p>

        {/* User Management */}
        <div className="flex items-center justify-between mb-6 text-gray-600 cursor-pointer">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <span className="text-[18px] font-medium">
              User Management
            </span>
          </div>

          <ChevronDown size={18} />
        </div>

        {/* System Management */}
        <div className="flex items-center justify-between text-gray-600 cursor-pointer">
          <div className="flex items-center gap-3">
            <Wrench size={20} />
            <span className="text-[18px] font-medium">
              System Management
            </span>
          </div>

          <ChevronDown size={18} />
        </div>
      </div>

      {/* COMPONENTS */}
      <div className="mt-12">
        <p className="text-xs font-bold tracking-widest text-gray-400 mb-5">
          COMPONENTS
        </p>

        <div className="space-y-6">
          
          {/* User Profile */}
          <div className="flex items-center gap-3 text-gray-600 cursor-pointer">
            <User size={20} />
            <span className="text-[18px] font-medium">
              User Profile
            </span>
          </div>

          {/* Help */}
          <div className="flex items-center gap-3 text-gray-600 cursor-pointer">
            <HelpCircle size={20} />
            <span className="text-[18px] font-medium">
              Help
            </span>
          </div>

          {/* Logout */}
          <div className="flex items-center gap-3 text-gray-600 cursor-pointer">
            <LogOut size={20} />
            <span className="text-[18px] font-medium">
              Logout
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;