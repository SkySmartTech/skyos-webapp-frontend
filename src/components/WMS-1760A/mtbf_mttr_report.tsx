import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  Clock, Wrench, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Printer, Eye,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

// ─── Static data ───────────────────────────────────────────────────────────────

const TREND_DATA = [
  { date: "06/13", mtbf: 22.4, mttr: 1.8, availability: 92.6 },
  { date: "06/14", mtbf: 18.6, mttr: 2.4, availability: 88.6 },
  { date: "06/15", mtbf: 24.2, mttr: 1.6, availability: 93.8 },
  { date: "06/16", mtbf: 16.8, mttr: 3.1, availability: 84.4 },
  { date: "06/17", mtbf: 20.0, mttr: 2.2, availability: 90.1 },
  { date: "06/18", mtbf: 14.4, mttr: 3.8, availability: 79.1 },
  { date: "06/19", mtbf: 19.2, mttr: 2.6, availability: 88.1 },
];

const DEPT_DATA = [
  { dept: "Engineering",   mtbf: 21.4, mttr: 2.1 },
  { dept: "Knitting",      mtbf: 17.8, mttr: 3.2 },
  { dept: "DryFinishing",  mtbf: 24.6, mttr: 1.8 },
  { dept: "Dyeing",        mtbf: 15.2, mttr: 3.9 },
  { dept: "Finishing",     mtbf: 19.0, mttr: 2.4 },
  { dept: "RM_Warehouse",  mtbf: 28.3, mttr: 1.2 },
];

const MACHINE_DATA = [
  { machine: "JL 03", mtbf: 18.2, mttr: 2.8, breakdowns: 4, dept: "Engineering",  faultType: "Electrical" },
  { machine: "SC 09", mtbf: 22.5, mttr: 1.5, breakdowns: 2, dept: "Finishing",    faultType: "Pneumatic"  },
  { machine: "JL 01", mtbf: 15.4, mttr: 3.2, breakdowns: 5, dept: "Knitting",     faultType: "Electrical" },
  { machine: "SB 03", mtbf: 26.0, mttr: 1.8, breakdowns: 2, dept: "DryFinishing", faultType: "Mechanical" },
  { machine: "MJ 07", mtbf: 12.6, mttr: 4.1, breakdowns: 6, dept: "Dyeing",       faultType: "Mechanical" },
  { machine: "TX 02", mtbf: 20.8, mttr: 2.2, breakdowns: 3, dept: "Engineering",  faultType: "Electrical" },
  { machine: "SD 16", mtbf: 30.2, mttr: 1.1, breakdowns: 1, dept: "RM_Warehouse", faultType: "Mechanical" },
  { machine: "MC 39", mtbf: 10.4, mttr: 4.8, breakdowns: 7, dept: "Knitting",     faultType: "Electrical" },
];

const TABLE_DATA = [
  { id: "WO_00021139", machine: "Main Roller Door", machineCat: "BuildingMaint", dept: "Engineering",  faultType: "NA",          bdStart: "2026-06-19 08:01", repairStart: "2026-06-19 08:03", repairEnd: "—",              mtbf: "—",   mttr: "—",   avail: "—"    },
  { id: "WO_00021138", machine: "AHU Cooling Tower", machineCat: "BuildingMaint", dept: "Engineering", faultType: "Mechanical",   bdStart: "2026-06-19 07:51", repairStart: "2026-06-19 07:52", repairEnd: "2026-06-19 08:51", mtbf: "21.4", mttr: "1.0", avail: "95.5%" },
  { id: "WO_00021135", machine: "Scouring 01",       machineCat: "SC",            dept: "Finishing",   faultType: "Pneumatic",    bdStart: "2026-06-19 06:34", repairStart: "2026-06-19 06:35", repairEnd: "2026-06-19 06:50", mtbf: "22.5", mttr: "0.3", avail: "98.8%" },
  { id: "WO_00021134", machine: "JL 01",             machineCat: "JL",            dept: "Knitting",    faultType: "Electrical",   bdStart: "2026-06-19 04:24", repairStart: "2026-06-19 04:28", repairEnd: "2026-06-19 05:10", mtbf: "15.4", mttr: "0.8", avail: "96.0%" },
  { id: "WO_00021133", machine: "SB 03",             machineCat: "SB",            dept: "DryFinishing", faultType: "Mechanical",  bdStart: "2026-06-19 00:17", repairStart: "2026-06-19 00:22", repairEnd: "2026-06-19 01:30", mtbf: "26.0", mttr: "1.2", avail: "95.6%" },
  { id: "WO_00021131", machine: "MC 39",             machineCat: "MC",            dept: "Knitting",    faultType: "Electrical",   bdStart: "2026-06-18 23:27", repairStart: "2026-06-18 23:30", repairEnd: "2026-06-19 01:00", mtbf: "10.4", mttr: "1.5", avail: "87.4%" },
  { id: "WO_00021128", machine: "MJ 07",             machineCat: "MJ",            dept: "Dyeing",      faultType: "Mechanical",   bdStart: "2026-06-18 18:10", repairStart: "2026-06-18 18:14", repairEnd: "2026-06-18 22:24", mtbf: "12.6", mttr: "4.2", avail: "75.0%" },
  { id: "WO_00021124", machine: "TX 02",             machineCat: "TX",            dept: "Engineering", faultType: "Electrical",   bdStart: "2026-06-18 14:05", repairStart: "2026-06-18 14:10", repairEnd: "2026-06-18 16:20", mtbf: "20.8", mttr: "2.2", avail: "90.4%" },
];

const DEPARTMENTS = ["All", "Engineering", "Finishing", "Knitting", "DryFinishing", "Dyeing", "RM_Warehouse"];
const MACHINE_CATEGORIES = ["All", "JL", "SC", "SB", "TX", "MJ", "MC", "SD"];
const FAULT_TYPES = ["All", "Electrical", "Mechanical", "Pneumatic", "NA"];

// ─── KPI Cards ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  unit: string;
  sub: string;
  trend: "up" | "down" | "neutral";
  trendVal: string;
  icon: React.ElementType;
  color: "teal" | "blue" | "green" | "amber";
}

function KpiCard({ label, value, unit, sub, trend, trendVal, icon: Icon, color }: KpiCardProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const paletteDark: Record<string, string> = {
    teal:  "bg-teal-500/10  border-teal-500/20  text-teal-400",
    blue:  "bg-blue-500/10  border-blue-500/20  text-blue-400",
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  };
  const paletteLight: Record<string, string> = {
    teal:  "bg-teal-50  border-teal-200  text-teal-700",
    blue:  "bg-blue-50  border-blue-200  text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };
  const palette = dark ? paletteDark : paletteLight;

  const card = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-gray-200";
  const text = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const trendUp   = "text-green-400";
  const trendDown = "text-red-400";

  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 transition-colors duration-300 ${card}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${palette[color]}`}>
          <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend === "up" ? trendUp : trend === "down" ? trendDown : muted}`}>
          {trend === "up"   && <ArrowUpRight size={13} />}
          {trend === "down" && <ArrowDownRight size={13} />}
          {trendVal}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-black ${text}`}>
          {value}
          <span className={`text-sm font-normal ml-1 ${muted}`}>{unit}</span>
        </p>
        <p className={`text-[11px] uppercase tracking-widest font-bold mt-0.5 ${muted}`}>{label}</p>
      </div>
      <p className={`text-xs border-t pt-2 ${dark ? "border-[#1e293b]" : "border-gray-100"} ${muted}`}>{sub}</p>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  const card = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-gray-200";
  const text = dark ? "text-white" : "text-gray-900";
  return (
    <div className={`rounded-xl border overflow-hidden ${card}`}>
      <div className={`px-5 py-3 border-b ${dark ? "border-[#1e293b]" : "border-gray-100"}`}>
        <h3 className={`text-sm font-bold ${text}`}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Availability gauge (radial) ───────────────────────────────────────────────

function AvailabilityGauge({ value, dark }: { value: number; dark: boolean }) {
  const data = [{ name: "Availability", value, fill: "#14b8a6" }];
  const text = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
            startAngle={225} endAngle={-45} data={data} barSize={14}>
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: dark ? "#1e293b" : "#e2e8f0" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-black ${text}`}>{value}%</span>
          <span className={`text-[10px] uppercase tracking-widest font-semibold mt-0.5 ${muted}`}>Availability</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs text-center">
        <div><p className={`font-bold text-teal-400`}>18.5h</p><p className={muted}>MTBF</p></div>
        <div><p className={`font-bold text-blue-400`}>2.6h</p><p className={muted}>MTTR</p></div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MtbfMttrReport() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(fmt(weekAgo));
  const [endDate,   setEndDate]   = useState(fmt(today));
  const [dept,      setDept]      = useState("All");
  const [machineCat, setMachineCat] = useState("All");
  const [faultType, setFaultType] = useState("All");
  const [search,    setSearch]    = useState("");

  const bg    = dark ? "bg-[#020617]" : "bg-slate-100";
  const card  = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-gray-200";
  const text  = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inp   = dark ? "bg-[#1e293b] border-[#334155] text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900";
  const divider = dark ? "border-[#1e293b]" : "border-gray-100";
  const tblHead = "bg-teal-600 text-white text-xs";
  const tblRow  = dark
    ? "border-[#1e293b] hover:bg-[#1e293b]/50 text-gray-300 text-xs"
    : "border-gray-100 hover:bg-gray-50 text-gray-700 text-xs";

  const tooltipStyle = {
    contentStyle: {
      background: dark ? "#111827" : "#fff",
      border: `1px solid ${dark ? "#374151" : "#e5e7eb"}`,
      borderRadius: 8,
      fontSize: 11,
      color: dark ? "#f9fafb" : "#111827",
    },
  };

  const filteredTable = TABLE_DATA.filter(row => {
    if (dept !== "All" && row.dept !== dept) return false;
    if (machineCat !== "All" && !row.machineCat.includes(machineCat)) return false;
    if (faultType !== "All" && row.faultType !== faultType) return false;
    if (search && !Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`flex flex-col h-full overflow-auto ${bg}`}>
      <div className="p-4 space-y-4">

        {/* ── Page title ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-lg font-black ${text}`}>MTBF / MTTR Report</h1>
            <p className={`text-xs mt-0.5 ${muted}`}>Mean Time Between Failures &amp; Mean Time To Repair — reliability analysis</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
              <Eye size={13} /> View Report
            </button>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${dark ? "border-[#334155] text-gray-300 hover:bg-[#1e293b]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
              <Printer size={13} /> Print
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <div className="flex flex-wrap gap-3 items-end">
            {[
              { label: "Start Date", type: "date", val: startDate, set: setStartDate },
              { label: "End Date",   type: "date", val: endDate,   set: setEndDate   },
            ].map(f => (
              <div key={f.label}>
                <label className={`block text-xs font-semibold mb-1 ${muted}`}>{f.label}</label>
                <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`} />
              </div>
            ))}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Machine Category</label>
              <select value={machineCat} onChange={e => setMachineCat(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {MACHINE_CATEGORIES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Fault Type</label>
              <select value={faultType} onChange={e => setFaultType(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {FAULT_TYPES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Mean Time Between Failures" value="18.5" unit="hrs"  sub="Avg. across all machines this period"  trend="up"      trendVal="+2.1 hrs vs last week" icon={Clock}         color="teal"  />
          <KpiCard label="Mean Time To Repair"         value="2.6"  unit="hrs"  sub="Avg. repair duration this period"       trend="down"    trendVal="-0.4 hrs vs last week" icon={Wrench}        color="blue"  />
          <KpiCard label="System Availability"         value="87.6" unit="%"    sub="MTBF / (MTBF + MTTR) × 100"           trend="up"      trendVal="+1.2% vs last week"    icon={TrendingUp}    color="green" />
          <KpiCard label="Total Breakdowns"            value="47"   unit="WOs"  sub="Across all departments this period"    trend="neutral" trendVal="Last 7 days"           icon={AlertTriangle} color="amber" />
        </div>

        {/* ── Trend + Gauge Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* MTBF Trend */}
          <Section title="MTBF Trend (hrs)" dark={dark}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <YAxis tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="mtbf" name="MTBF (hrs)" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3, fill: "#14b8a6" }} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          {/* MTTR Trend */}
          <Section title="MTTR Trend (hrs)" dark={dark}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <YAxis tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="mttr" name="MTTR (hrs)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          {/* Availability Gauge */}
          <Section title="Overall Availability" dark={dark}>
            <div className="flex flex-col items-center justify-center h-full pt-2">
              <AvailabilityGauge value={87.6} dark={dark} />
              <p className={`text-[10px] mt-3 text-center ${muted}`}>
                Target: &ge; 90% &nbsp;|&nbsp; Formula: MTBF ÷ (MTBF + MTTR)
              </p>
            </div>
          </Section>
        </div>

        {/* ── Availability Trend + Dept Comparison ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Availability % trend */}
          <Section title="Availability % Trend" dark={dark}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Availability"]} />
                {/* 90% target reference rendered as a styled area */}
                <Line type="monotone" dataKey="availability" name="Availability %" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          {/* Department-wise MTBF vs MTTR grouped bar */}
          <Section title="Department Wise MTBF vs MTTR (hrs)" dark={dark}>
            <div className="flex gap-4 text-xs mb-3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block bg-teal-500" />MTBF</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-2.5 rounded-sm inline-block bg-blue-500" />MTTR</span>
            </div>
            <ResponsiveContainer width="100%" height={168}>
              <BarChart data={DEPT_DATA} margin={{ top: 0, right: 5, left: -20, bottom: 30 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
                <XAxis dataKey="dept" tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="mtbf" name="MTBF (hrs)" fill="#14b8a6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="mttr" name="MTTR (hrs)" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* ── Machine-wise MTBF bar ── */}
        <Section title="Machine Wise MTBF (hrs)" dark={dark}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MACHINE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
              <XAxis dataKey="machine" tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="mtbf" name="MTBF (hrs)" radius={[4, 4, 0, 0]}>
                {MACHINE_DATA.map((_, i) => (
                  <rect key={i} fill={i % 2 === 0 ? "#14b8a6" : "#0d9488"} />
                ))}
              </Bar>
              <Bar dataKey="mttr" name="MTTR (hrs)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* ── Breakdown Count by Machine ── */}
        <Section title="Breakdown Count by Machine" dark={dark}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {MACHINE_DATA.map(m => {
              const pct = Math.min(100, (m.breakdowns / 8) * 100);
              const barColor = m.breakdowns >= 6 ? "bg-red-500" : m.breakdowns >= 4 ? "bg-amber-500" : "bg-teal-500";
              return (
                <div key={m.machine} className={`rounded-lg border p-3 text-center ${dark ? "border-[#1e293b]" : "border-gray-100"}`}>
                  <p className={`text-[10px] font-bold truncate mb-2 ${muted}`}>{m.machine}</p>
                  <p className={`text-xl font-black ${m.breakdowns >= 6 ? "text-red-400" : m.breakdowns >= 4 ? "text-amber-400" : "text-teal-400"}`}>
                    {m.breakdowns}
                  </p>
                  <p className={`text-[9px] ${muted}`}>breakdowns</p>
                  <div className={`mt-2 h-1 rounded-full overflow-hidden ${dark ? "bg-[#1e293b]" : "bg-gray-100"}`}>
                    <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── Details Table ── */}
        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <div className="bg-teal-700 px-4 py-2.5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">MTBF / MTTR Details</h3>
          </div>

          {/* Table toolbar */}
          <div className={`px-4 py-3 flex flex-wrap items-center gap-2 border-b ${divider}`}>
            {["Copy", "Excel", "CSV", "PDF", "Print"].map(btn => (
              <button key={btn} className={`px-3 py-1 rounded text-xs border font-medium transition-colors
                ${dark ? "border-[#334155] text-gray-300 hover:bg-[#1e293b]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {btn}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className={`text-xs font-semibold ${muted}`}>Search:</label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`rounded-lg border px-2.5 py-1 text-xs w-36 ${inp}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tblHead}>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">W/O Number</th>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Machine</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Category</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Department</th>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Fault Type</th>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">BD Start</th>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Repair Start</th>
                  <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">Repair End</th>
                  <th className="px-3 py-2.5 text-left font-semibold">MTBF (hrs)</th>
                  <th className="px-3 py-2.5 text-left font-semibold">MTTR (hrs)</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Availability</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row, i) => (
                  <tr key={i} className={`border-t transition-colors ${tblRow}`}>
                    <td className="px-3 py-2 font-mono text-[11px]">{row.id}</td>
                    <td className="px-3 py-2">{row.machine}</td>
                    <td className="px-3 py-2">{row.machineCat}</td>
                    <td className="px-3 py-2">{row.dept}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.faultType === "Electrical" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
                        row.faultType === "Mechanical" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" :
                        row.faultType === "Pneumatic"  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" :
                        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                      }`}>{row.faultType}</span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[11px]">{row.bdStart}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-[11px]">{row.repairStart}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-[11px]">{row.repairEnd}</td>
                    <td className="px-3 py-2 font-semibold text-teal-400">{row.mtbf}</td>
                    <td className="px-3 py-2 font-semibold text-blue-400">{row.mttr}</td>
                    <td className="px-3 py-2">
                      {row.avail === "—" ? (
                        <span className={muted}>—</span>
                      ) : (
                        <span className={`font-semibold ${parseFloat(row.avail) >= 90 ? "text-green-400" : parseFloat(row.avail) >= 80 ? "text-amber-400" : "text-red-400"}`}>
                          {row.avail}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTable.length === 0 && (
                  <tr>
                    <td colSpan={11} className={`text-center py-8 text-xs ${muted}`}>
                      No records match the selected filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex items-center justify-between px-4 py-3 text-xs border-t ${divider} ${muted}`}>
            <span>Showing {filteredTable.length} of {TABLE_DATA.length} entries</span>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded border transition-colors ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}>Previous</button>
              <button className={`px-3 py-1 rounded border bg-teal-600 text-white border-teal-600`}>1</button>
              <button className={`px-3 py-1 rounded border transition-colors ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}>Next</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center text-[11px] py-3 border-t ${dark ? "border-[#1e293b] text-gray-500" : "border-gray-200 text-gray-400"}`}>
          Copyright © 2024 Sky Smart Technology Pvt Ltd. All Rights Reserved &nbsp;|&nbsp; Soft Ver: 4.8
        </div>
      </div>
    </div>
  );
}
