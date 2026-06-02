import {
  LayoutDashboard, BarChart3, Cpu, Activity, Zap, Factory,
  ChevronDown, Settings, Brain, Shield,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type SkyView = 'dashboard' | 'analytics' | 'ai';

interface SkySidebarProps {
  activeView: SkyView;
  setActiveView: (v: SkyView) => void;
}

export default function SkySidebar({ activeView, setActiveView }: SkySidebarProps) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // ── Shared class tokens (mirrors Sidebar.tsx exactly) ──────────────────────
  const base    = dark ? 'bg-gray-900 border-gray-800 text-gray-400'   : 'bg-white border-gray-200 text-gray-600';
  const label   = dark ? 'text-gray-600'                                : 'text-gray-400';
  const active  = dark ? 'bg-orange-500/10 text-orange-400'            : 'bg-orange-50 text-orange-600';
  const hover   = dark ? 'hover:bg-gray-800 hover:text-white'          : 'hover:bg-gray-100 hover:text-gray-900';
  const divider = dark ? 'border-gray-800'                              : 'border-gray-200';
  const textMut = dark ? 'text-gray-500'                                : 'text-gray-400';

  // ── Nav item builder ───────────────────────────────────────────────────────
  const navItem = (
    view: SkyView,
    Icon: React.ElementType,
    label_: string,
    badge?: string | number,
  ) => (
    <div
      onClick={() => setActiveView(view)}
      className={`flex items-center justify-between mb-2 cursor-pointer px-3 py-3 rounded-xl transition-all duration-200 ${
        activeView === view ? active : hover
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={19} />
        <span className="text-base font-medium">{label_}</span>
      </div>
      {badge !== undefined && (
        <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
          {badge}
        </div>
      )}
    </div>
  );

  // ── Static (non-navigating) item ───────────────────────────────────────────
  const staticItem = (Icon: React.ElementType, label_: string, right?: React.ReactNode) => (
    <div className={`flex items-center justify-between cursor-default px-3 py-3 rounded-xl mb-2 transition-all duration-200 ${hover}`}>
      <div className="flex items-center gap-3">
        <Icon size={19} />
        <span className="text-base font-medium">{label_}</span>
      </div>
      {right}
    </div>
  );

  return (
    <div className={`w-70 h-full border-r px-6 py-6 overflow-y-auto shrink-0 flex flex-col transition-colors duration-300 ${base}`}>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      <div>
        <p className={`text-xs font-bold tracking-widest mb-6 uppercase ${label}`}>Overview</p>
        {navItem('dashboard', LayoutDashboard, 'Dashboard', 6)}
      </div>

      <div className={`border-t my-7 ${divider}`} />
      <div>
        <p className={`text-xs font-bold tracking-widest mb-6 uppercase ${label}`}>Modules</p>

        {navItem('analytics', BarChart3, 'Analytics & Charts')}
        {navItem('ai', Brain, 'AI Insights')}
        {staticItem(Factory, 'Production Lines', <ChevronDown size={15} />)}
        {staticItem(Cpu, 'DCSC1515A', <ChevronDown size={15} />)}
        {staticItem(Zap, 'Solar System', <ChevronDown size={15} />)}
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
      <div className={`border-t my-7 ${divider}`} />

      {/* ── CONFIGURATION ────────────────────────────────────────────────── */}
      <div>
        <p className={`text-xs font-bold tracking-widest mb-6 uppercase ${label}`}>Configuration</p>

        {staticItem(Settings, 'System Settings', <ChevronDown size={15} />)}
        {staticItem(Shield, 'Security & Access')}
      </div>

      {/* ── VERSION FOOTER ───────────────────────────────────────────────── */}
      <div className={`mt-auto pt-6 border-t ${divider}`}>
        <p className={`text-[11px] text-center ${textMut}`}>SkyOS v2.0</p>
        <p className={`text-[10px] text-center mt-0.5 ${textMut}`}>Sky Technology (Pvt) Ltd</p>
      </div>
    </div>
  );
}
