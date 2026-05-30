import React from 'react';
import {
  Search,
  Bell,
  User,
  LayoutDashboard,
  BarChart3,
  Factory,
  Cpu,
  ChevronDown,
  ChevronUp,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";

interface TopbarProps {
  onDashboardClick: () => void;
  onProductionTrackingClick: () => void;
  onDcscClick: () => void;
  onWipClick: () => void;
  onCustomClick: () => void;
  productionActive: boolean;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  onCloseTopbar: () => void;
}

export default function Topbar({
  onDashboardClick,
  onProductionTrackingClick,
  onDcscClick,
  onWipClick,
  onCustomClick,
  productionActive,
  showSidebar,
  onToggleSidebar,
  onCloseTopbar,
}: TopbarProps) {
  return (
    <div className="w-full z-10 bg-gradient-to-b from-[#050505] to-[#0f0f0f] text-white border-b border-zinc-800 shadow-2xl">

      {/* ================= TOP HEADER ================= */}
      <header className="flex items-center justify-between px-6 py-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30 border border-orange-400/20">
            </div>
            <div className="absolute inset-0 rounded-2xl bg-orange-500 blur-xl opacity-20"></div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Sky OS
            </h1>
            <p className="text-xs text-zinc-500 tracking-wider uppercase">
              Smart Factory Operating System
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden lg:flex items-center w-[450px] bg-zinc-900/80 border border-zinc-700 rounded-2xl px-4 py-3 backdrop-blur-md shadow-inner focus-within:border-orange-500 transition-all duration-300">
          <Search size={20} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search modules, users, systems..."
            className="bg-transparent w-full px-3 text-sm outline-none placeholder:text-zinc-500"
          />
          <kbd className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-lg border border-zinc-700">
            Ctrl K
          </kbd>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">

          <button className="relative group p-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-800 transition-all duration-300">
            <Bell
              size={22}
              className="text-yellow-400 group-hover:scale-110 transition-transform"
            />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center border border-black">
              3
            </span>
          </button>

          <button className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 hover:bg-zinc-800 rounded-2xl px-4 py-2 transition-all duration-300 shadow-lg">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-md">
              <User size={18} />
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white">
                Admin
              </p>
              <p className="text-xs text-zinc-400">
                Super User
              </p>
            </div>

            <ChevronDown size={16} className="text-zinc-500" />
          </button>

        </div>
      </header>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex flex-wrap items-center border-t border-zinc-800 bg-[#111111]">

        {/* Sidebar Toggle */}
        {productionActive && (
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-12 h-full border-r border-zinc-800 hover:bg-zinc-800 transition-all duration-300 text-zinc-400 hover:text-white"
            title={showSidebar ? "Close sidebar" : "Open sidebar"}
          >
            {showSidebar ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        )}

        {/* Dashboard */}
        <button
          onClick={onDashboardClick}
          className="group flex items-center gap-2 px-6 py-4 bg-lime-500 text-black font-semibold border-r border-zinc-800 hover:bg-lime-400 transition-all duration-300"
        >
          <LayoutDashboard
            size={18}
            className="group-hover:rotate-6 transition-transform"
          />
          Dashboard
        </button>

        {/* Analysis */}
        <button className="group flex items-center gap-2 px-6 py-4 bg-lime-500 text-black font-semibold border-r border-zinc-800 hover:bg-lime-400 transition-all duration-300">
          <BarChart3
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          Analysis
        </button>

        {/* Production Tracking */}
        <button
          onClick={onProductionTrackingClick}
          className="group flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-black font-semibold border-r border-zinc-800 hover:brightness-110 transition-all duration-300"
        >
          <Factory
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          Production Tracking
        </button>

        {/* WIP */}
        <button
          onClick={onWipClick}
          className="group flex items-center gap-2 px-6 py-4 bg-fuchsia-300 text-black border-r border-zinc-800 hover:bg-fuchsia-200 transition-all duration-300"
        >
          <Cpu
            size={18}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          WIP
        </button>

        {/* DCSC1515A */}
        <button
          onClick={onDcscClick}
          className="group flex items-center gap-2 px-6 py-4 bg-fuchsia-300 text-black border-r border-zinc-800 hover:bg-fuchsia-200 transition-all duration-300"
        >
          <Cpu
            size={18}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          DCSC1515A
        </button>

        {/* Custom System */}
        <button
          onClick={onCustomClick}
          className="group flex items-center gap-2 px-6 py-4 bg-fuchsia-300 text-black border-r border-zinc-800 hover:bg-fuchsia-200 transition-all duration-300"
        >
          <Cpu
            size={18}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          Custom System
        </button>

        {/* Hide Navigation */}
        <button
          onClick={onCloseTopbar}
          className="ml-auto flex items-center gap-2 px-4 py-4 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-200 border-l border-zinc-800"
          title="Hide navigation"
        >
          <ChevronUp size={16} />
          <span className="text-xs">Hide</span>
        </button>

      </nav>
    </div>
  );
}