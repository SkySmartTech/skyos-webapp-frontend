import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  Activity,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Cpu,
  LayoutDashboard,
  Layers3,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Warehouse,
} from "lucide-react";
import InventoryEntry from "./inventory_entry";
import Reports from "./reports";
import AiAssistant from "./ai_assistant";

type StatCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Activity;
};

type LineCard = {
  title: string;
  code: string;
  type: string;
  status: string;
  upperLimit: string;
  lowerLimit: string;
  efficiency: string;
};

const stats: StatCard[] = [
  {
    title: "Active Lines",
    value: "3",
    subtitle: "Out of 3 total lines",
    icon: Activity,
  },
  {
    title: "Avg. Efficiency",
    value: "94%",
    subtitle: "System performance",
    icon: ArrowUpRight,
  },
  {
    title: "Total Capacity",
    value: "3,500",
    subtitle: "Items per day",
    icon: Warehouse,
  },
  {
    title: "Daily Revenue",
    value: "$52,400",
    subtitle: "Today’s sales",
    icon: Sparkles,
  },
];

const lineCards: LineCard[] = [
  {
    title: "Checkout Line 1",
    code: "LINE-001",
    type: "Express",
    status: "Active",
    upperLimit: "1500 items/day",
    lowerLimit: "500 items/day",
    efficiency: "94%",
  },
  {
    title: "Checkout Line 2",
    code: "LINE-002",
    type: "Standard",
    status: "Active",
    upperLimit: "1200 items/day",
    lowerLimit: "400 items/day",
    efficiency: "91%",
  },
  {
    title: "Self-Checkout 1",
    code: "LINE-003",
    type: "Self-Service",
    status: "Active",
    upperLimit: "800 items/day",
    lowerLimit: "300 items/day",
    efficiency: "97%",
  },
];

function SidebarLink({
  icon: Icon,
  label,
  active = false,
  collapsible = false,
  onClick,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
  collapsible?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
        active
          ? "border-orange-500/30 bg-orange-500/10 text-orange-300 shadow-[0_0_0_1px_rgba(249,115,22,0.18)]"
          : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={16} />
        {label}
      </span>
      {collapsible ? <ChevronDown size={14} className="opacity-70" /> : null}
    </button>
  );
}

export default function WipDashboardPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "inventory" | "reports" | "ai" | "setup" | "access"
  >("dashboard");

  const page = dark ? "bg-[#070707] text-white" : "bg-[#f3f5f7] text-slate-900";
  const sidebar = dark
    ? "border-white/10 bg-[#0b0b0b]"
    : "border-slate-200 bg-white";
  const sidebarMuted = dark ? "text-slate-500" : "text-slate-400";
  const card = dark
    ? "border-white/10 bg-[#0e0e0e]"
    : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const heading = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-500" : "text-slate-500";

  return (
    <div className={`h-full w-full overflow-hidden ${page}`}>
      <div className="flex h-full min-h-0">
        <aside
          className={`hidden w-[250px] shrink-0 border-r px-4 py-4 lg:block ${sidebar}`}
        >
          <div className="mb-6 flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-700 text-white shadow-lg shadow-orange-500/20">
              <Layers3 size={18} />
            </div>
            <div>
              <p className={`text-[14px] font-bold tracking-wide ${heading}`}>
                Flowtrace System
              </p>
              <p
                className={`text-[11px] uppercase tracking-[0.25em] ${sidebarMuted}`}
              >
                WIP Dashboard
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarLink
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => setActiveSection("dashboard")}
            />
            <SidebarLink
              icon={Warehouse}
              label="Inventory Entry"
              active={activeSection === "inventory"}
              onClick={() => setActiveSection("inventory")}
            />
            <SidebarLink
              icon={Activity}
              label="Reports"
              active={activeSection === "reports"}
              onClick={() => setActiveSection("reports")}
            />
            <SidebarLink
              icon={Cpu}
              label="AI Assistant"
              active={activeSection === "ai"}
              onClick={() => setActiveSection("ai")}
            />
            <SidebarLink
              icon={Settings2}
              label="Production Setup"
              collapsible
              active={activeSection === "setup"}
              onClick={() => setActiveSection("setup")}
            />
            <SidebarLink
              icon={ShieldCheck}
              label="Access Control"
              collapsible
              active={activeSection === "access"}
              onClick={() => setActiveSection("access")}
            />
          </nav>

          <div
            className={`my-6 border-t ${dark ? "border-white/10" : "border-slate-200"}`}
          />

          <div
            className={`rounded-2xl border p-4 ${dark ? "border-orange-500/15 bg-orange-500/5" : "border-orange-200 bg-orange-50"}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-orange-500">
                System Health
              </p>
              <Bell size={16} className="text-orange-500" />
            </div>
            <p className={`mt-3 text-2xl font-black ${heading}`}>99.2%</p>
            <p className={`mt-1 text-xs ${muted}`}>
              All dashboards synced and monitored.
            </p>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {activeSection === "inventory" ? (
            <InventoryEntry />
          ) : activeSection === "reports" ? (
            <Reports />
          ) : activeSection === "ai" ? (
            <AiAssistant />
          ) : activeSection === "setup" ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className={`text-lg font-semibold ${heading}`}>
                  Production Setup
                </p>
                <p className={`text-sm ${muted}`}>Coming Soon</p>
              </div>
            </div>
          ) : activeSection === "access" ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className={`text-lg font-semibold ${heading}`}>
                  Access Control
                </p>
                <p className={`text-sm ${muted}`}>Coming Soon</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`border-b px-6 py-5 ${dark ? "border-white/10" : "border-slate-200"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.3em] ${muted}`}
                    >
                      Dashboard
                    </p>
                    <h1
                      className={`mt-1 text-3xl font-black tracking-tight ${heading}`}
                    >
                      Flowtrace Supermarket System Overview
                    </h1>
                    <p className={`mt-2 text-sm ${sub}`}>
                      WIP click කරන විට open වන operational dashboard shell එක.
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:translate-y-[-1px] hover:bg-slate-100 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400">
                    <Plus size={16} />
                    Add Line
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <section className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                  {stats.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article
                        key={item.title}
                        className={`rounded-2xl border p-5 ${card}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`text-sm font-semibold ${heading}`}>
                              {item.title}
                            </p>
                            <p
                              className={`mt-8 text-[2rem] font-black leading-none ${heading}`}
                            >
                              {item.value}
                            </p>
                            <p className={`mt-2 text-xs ${muted}`}>
                              {item.subtitle}
                            </p>
                          </div>
                          <div
                            className={`rounded-xl border px-3 py-3 ${dark ? "border-white/10 bg-white/5 text-orange-400" : "border-slate-200 bg-slate-50 text-orange-600"}`}
                          >
                            <Icon size={18} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>

                <section className={`mt-5 rounded-3xl border p-5 ${card}`}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className={`text-lg font-bold ${heading}`}>
                        Production Lines (3)
                      </h2>
                      <p className={`text-sm ${muted}`}>
                        Live line cards, efficiency and control actions.
                      </p>
                    </div>
                    <div
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${dark ? "border-white/10 text-orange-300" : "border-slate-200 text-orange-600"}`}
                    >
                      Active monitoring
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {lineCards.map((line) => (
                      <article
                        key={line.code}
                        className={`rounded-2xl border p-5 ${dark ? "border-white/10 bg-[#0b0b0b]" : "border-slate-200 bg-slate-50"}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`text-lg font-bold ${heading}`}>
                              {line.title}
                            </h3>
                            <p className={`text-sm ${muted}`}>
                              {line.code} - {line.type}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-900 shadow-sm">
                            {line.status}
                          </span>
                        </div>

                        <div className="mt-8 grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-sm">
                          <span className={muted}>Upper Limit</span>
                          <span className={`font-semibold ${heading}`}>
                            {line.upperLimit}
                          </span>
                          <span className={muted}>Lower Limit</span>
                          <span className={`font-semibold ${heading}`}>
                            {line.lowerLimit}
                          </span>
                          <span className={muted}>Efficiency</span>
                          <span
                            className={`font-black ${dark ? "text-white" : "text-slate-900"}`}
                          >
                            {line.efficiency}
                          </span>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <button
                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${dark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"}`}
                          >
                            <LayoutDashboard size={15} />
                            Edit
                          </button>
                          <button
                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${dark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"}`}
                          >
                            <Settings2 size={15} />
                            Configure
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
