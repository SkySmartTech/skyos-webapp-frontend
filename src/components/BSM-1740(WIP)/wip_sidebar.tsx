import { useState, useEffect, type ElementType } from "react";
import {
  LayoutDashboard, Warehouse, Activity, Cpu,
  Settings2, ShieldCheck, ChevronDown, X, Menu, LogOut,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../SKY_OS/sky_auth";
import dioLogo from "../../assets/dio-logo.png";

export type WipView =
  | "dashboard" | "inventory" | "reports" | "ai"
  | "setupLines" | "setupStyles"
  | "accessUsers" | "accessPermissions";

interface WipSidebarProps {
  activeView: WipView;
  onNavigate: (view: WipView) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function WipSidebar({ activeView, onNavigate, isOpen, onClose }: WipSidebarProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);
  const [expanded, setExpanded] = useState(false);
  const [setupOpen, setSetupOpen] = useState(activeView === "setupLines" || activeView === "setupStyles");
  const [accessOpen, setAccessOpen] = useState(activeView === "accessUsers" || activeView === "accessPermissions");

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) setExpanded(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const mini = isFullscreen && !expanded;

  const base    = dark ? "bg-[#0f172a] border-[#1e293b] text-[#94a3b8]" : "bg-white border-[#e2e8f0] text-[#64748b]";
  const lbl     = dark ? "text-[#475569]" : "text-[#94a3b8]";
  const active  = dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
  const hover   = dark ? "hover:bg-[#1e293b] hover:text-white" : "hover:bg-[#f8fafc] hover:text-[#0f172a]";
  const divider = dark ? "border-[#1e293b]" : "border-[#e2e8f0]";
  const subActive = dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600";
  const subHover  = dark ? "hover:bg-[#1e293b]/60 hover:text-white" : "hover:bg-[#f8fafc] hover:text-[#0f172a]";

  const navItem = (view: WipView, Icon: ElementType, label: string) => (
    <div
      key={view}
      onClick={() => { onNavigate(view); onClose(); setExpanded(false); }}
      title={label}
      className={`flex items-center ${mini ? "justify-center" : "gap-2.5"} mb-1 cursor-pointer px-2 py-2 rounded-xl transition-all duration-200 ${
        activeView === view ? active : hover
      }`}
    >
      <Icon size={mini ? 18 : 17} className="shrink-0" />
      {!mini && <span className="text-sm font-medium truncate">{label}</span>}
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
          ? `relative ${mini ? "w-14 px-1 py-4" : "w-64 px-4 py-5"}`
          : `fixed md:relative inset-y-0 md:inset-auto left-0 md:left-auto z-40 md:z-auto
             w-64 px-4 py-5 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`
        }
        ${base}
      `}>

        {/* Header */}
        {mini ? (
          <div className={`flex flex-col items-center gap-1.5 pb-3 mb-2 border-b ${divider}`}>
            <button onClick={() => setExpanded(true)} title="Expand menu" className={`p-1.5 rounded-lg transition-colors ${hover}`}>
              <Menu size={17} />
            </button>
            <img src={dioLogo} alt="DIO" className="w-8 h-8 rounded-md object-cover" />
            <div className="w-full flex justify-center">
              <span className="text-[7px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 text-center leading-tight">
                WIP
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
                <button onClick={() => setExpanded(false)} title="Collapse menu" className={`p-1 rounded-lg shrink-0 transition-colors ${dark ? "hover:bg-[#1e293b] text-[#94a3b8]" : "hover:bg-[#f8fafc] text-[#64748b]"}`}>
                  <Menu size={16} />
                </button>
              )}
              {!isFullscreen && (
                <button onClick={onClose} className={`md:hidden p-1 rounded-lg shrink-0 transition-colors ${dark ? "hover:bg-[#1e293b] text-[#94a3b8]" : "hover:bg-[#f8fafc] text-[#64748b]"}`}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 mx-1 mt-2 mb-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider uppercase text-orange-400">Flowtrace System</p>
                <p className={`text-[9px] ${dark ? "text-orange-300/60" : "text-orange-500/70"}`}>BSM-1740</p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN NAV */}
        <div>
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase ${lbl}`}>Main</p>}
          {navItem("dashboard", LayoutDashboard, "Dashboard")}
          {navItem("inventory", Warehouse,       "Inventory Entry")}
          {navItem("reports",   Activity,        "Reports")}
          {navItem("ai",        Cpu,             "AI Assistant")}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* PRODUCTION SETUP */}
        <div>
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase ${lbl}`}>Setup</p>}
          {mini ? (
            navItem("setupLines", Settings2, "Production Setup")
          ) : (
            <>
              <button
                onClick={() => setSetupOpen(p => !p)}
                className={`w-full flex items-center justify-between mb-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                  activeView === "setupLines" || activeView === "setupStyles"
                    ? active
                    : `${dark ? "text-[#94a3b8]" : "text-[#64748b]"} ${hover}`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings2 size={17} className="shrink-0" />
                  <span className="text-sm font-medium">Production Setup</span>
                </div>
                <ChevronDown size={15} className={`transition-transform duration-200 ${setupOpen ? "" : "-rotate-90"}`} />
              </button>
              {setupOpen && (
                <div className="ml-3 mt-1 space-y-0.5">
                  {([["setupLines", "Lines"], ["setupStyles", "Styles"]] as [WipView, string][]).map(([v, l]) => (
                    <div
                      key={v}
                      onClick={() => { onNavigate(v); onClose(); }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium ${
                        activeView === v ? subActive : subHover
                      }`}
                    >
                      <span className="truncate">{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={`border-t my-3 ${divider}`} />

        {/* ACCESS CONTROL */}
        <div>
          {!mini && <p className={`text-xs font-bold tracking-widest mb-3 uppercase ${lbl}`}>Access</p>}
          {mini ? (
            navItem("accessUsers", ShieldCheck, "Access Control")
          ) : (
            <>
              <button
                onClick={() => setAccessOpen(p => !p)}
                className={`w-full flex items-center justify-between mb-1 px-2 py-2 rounded-xl transition-all duration-200 ${
                  activeView === "accessUsers" || activeView === "accessPermissions"
                    ? active
                    : `${dark ? "text-[#94a3b8]" : "text-[#64748b]"} ${hover}`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={17} className="shrink-0" />
                  <span className="text-sm font-medium">Access Control</span>
                </div>
                <ChevronDown size={15} className={`transition-transform duration-200 ${accessOpen ? "" : "-rotate-90"}`} />
              </button>
              {accessOpen && (
                <div className="ml-3 mt-1 space-y-0.5">
                  {([["accessUsers", "Users"], ["accessPermissions", "Role & Permissions"]] as [WipView, string][]).map(([v, l]) => (
                    <div
                      key={v}
                      onClick={() => { onNavigate(v); onClose(); }}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-xs font-medium ${
                        activeView === v ? subActive : subHover
                      }`}
                    >
                      <span className="truncate">{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className={`mt-auto pt-4 border-t ${divider}`}>
          {mini ? (
            <button onClick={logout} title="Logout" className="w-full flex justify-center px-2 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors duration-200">
              <LogOut size={18} />
            </button>
          ) : (
            <>
              <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors duration-200 font-medium text-sm">
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
