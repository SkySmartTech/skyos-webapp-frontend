import { useState, useEffect, type ElementType } from "react";
import {
  LayoutDashboard, FileText, PieChart, User, ChevronDown, X, Menu, LogOut,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../SKY_OS/sky_auth";
import dioLogo from "../../assets/dio-logo.png";

export type SolarView =
  | "dashboard" | "mfm" | "mfi"
  | "details" | "energy" | "intimo" | "thermal" | "thermal-ceb"
  | "userprofile";

interface SolarSidebarProps {
  activeView: SolarView;
  onNavigate: (view: SolarView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SolarSidebar({ activeView, onNavigate, isOpen, onClose }: SolarSidebarProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { logout } = useAuth();
  const [reportsOpen, setReportsOpen] = useState(true);
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

  const base      = dark ? "bg-[#0f172a] border-[#1e293b] text-[#94a3b8]" : "bg-white border-[#e2e8f0] text-[#64748b]";
  const lbl       = dark ? "text-[#475569]" : "text-[#94a3b8]";
  const active    = dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
  const hover     = dark ? "hover:bg-[#1e293b] hover:text-white" : "hover:bg-[#f8fafc] hover:text-[#0f172a]";
  const divider   = dark ? "border-[#1e293b]" : "border-[#e2e8f0]";
  const subActive = dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
  const subHover  = dark ? "hover:bg-[#1e293b]/60 hover:text-white" : "hover:bg-[#f8fafc] hover:text-[#0f172a]";

  const navItem = (view: SolarView, Icon: ElementType, label: string) => (
    <div
      key={view}
      onClick={() => { onNavigate(view); onClose(); setExpanded(false); }}
      title={label}
      className={`flex items-center ${mini ? 'justify-center' : 'gap-2.5'} mb-1 cursor-pointer px-2 py-2 rounded-xl transition-all duration-200 ${
        activeView === view ? active : hover
      }`}
    >
      <Icon size={mini ? 18 : 17} className="shrink-0" />
      {!mini && <span className="text-sm font-medium truncate">{label}</span>}
    </div>
  );

  const reportItems: { view: SolarView; label: string }[] = [
    { view: "details",     label: "Details Report" },
    { view: "energy",      label: "Report Energy" },
    { view: "intimo",      label: "Report Intimo" },
    { view: "thermal",     label: "Thermal Consumption" },
    { view: "thermal-ceb", label: "Thermal & CEB" },
  ];

  return (
    <>
      {isOpen && !isFullscreen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}

      <div className={`
        shrink-0 h-full border-r overflow-y-auto flex flex-col
        transition-all duration-300 ease-in-out
        ${isFullscreen
          ? `relative ${mini ? 'w-14 px-1 py-4' : 'w-64 px-4 py-5'}`
          : `fixed md:relative inset-y-0 md:inset-auto left-0 md:left-auto z-40 md:z-auto
             w-64 px-4 py-5 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`
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
              <span className="text-[7px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-teal-600/20 text-teal-400 text-center leading-tight">
                PMS
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            <div className={`flex items-center gap-3 px-1 py-3 border-b ${divider}`}>
              <img src={dioLogo} alt="DIO" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold leading-tight ${dark ? "text-white" : "text-gray-900"}`}>
                  DIO Manufacture LTD
                </p>
              </div>
              {isFullscreen && (
                <button
                  onClick={() => setExpanded(false)}
                  title="Collapse menu"
                  className={`p-1 rounded-lg shrink-0 transition-colors ${dark ? "hover:bg-[#1e293b] text-[#94a3b8]" : "hover:bg-[#f8fafc] text-[#64748b]"}`}
                >
                  <Menu size={16} />
                </button>
              )}
              {!isFullscreen && (
                <button
                  onClick={onClose}
                  className={`md:hidden p-1 rounded-lg shrink-0 transition-colors ${dark ? "hover:bg-[#1e293b] text-[#94a3b8]" : "hover:bg-[#f8fafc] text-[#64748b]"}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* System indicator — full */}
            <div className="flex items-center gap-2 px-3 py-2 mx-1 mt-2 mb-3 rounded-lg bg-teal-600/10 border border-teal-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider uppercase text-teal-400">Energy Monitoring</p>
                <p className={`text-[9px] ${dark ? 'text-teal-300/60' : 'text-teal-600/70'}`}>PMS-1682</p>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARDS */}
        <div>
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase ${lbl}`}>Dashboards</p>}
          {navItem("dashboard", LayoutDashboard, "Dashboard")}
          {navItem("mfm",       LayoutDashboard, "Dashboard MFM")}
          {navItem("mfi",       LayoutDashboard, "Dashboard MFI")}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* REPORTS */}
        <div>
          {mini ? (
            <div
              title="Reports"
              onClick={() => setReportsOpen(p => !p)}
              className={`flex justify-center mb-1 cursor-pointer px-2 py-2 rounded-xl transition-all duration-200 ${hover}`}
            >
              <FileText size={18} className="shrink-0" />
            </div>
          ) : (
            <button
              onClick={() => setReportsOpen(p => !p)}
              className={`w-full flex items-center justify-between mb-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                dark ? "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white" : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={17} className="shrink-0" />
                <span className="text-sm font-medium">Reports</span>
              </div>
              <ChevronDown size={15} className={`transition-transform duration-200 ${reportsOpen ? "" : "-rotate-90"}`} />
            </button>
          )}

          {reportsOpen && !mini && (
            <div className="ml-3 mt-1 space-y-0.5">
              {reportItems.map(item => (
                <div
                  key={item.view}
                  onClick={() => { onNavigate(item.view); onClose(); setExpanded(false); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium ${
                    activeView === item.view ? subActive : subHover
                  }`}
                >
                  <PieChart size={14} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {reportsOpen && mini && (
            <div className="space-y-0.5">
              {reportItems.map(item => (
                <div
                  key={item.view}
                  onClick={() => { onNavigate(item.view); onClose(); setExpanded(false); }}
                  title={item.label}
                  className={`flex justify-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeView === item.view ? subActive : subHover
                  }`}
                >
                  <PieChart size={16} className="shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* SYSTEM */}
        <div>
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase ${lbl}`}>System</p>}
          {navItem("userprofile", User, "User Profile")}
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
              <p className={`text-[11px] text-center font-semibold mt-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>NEXIS V01</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
