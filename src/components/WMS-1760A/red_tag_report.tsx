import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CATEGORY_PIE = [
  { name: "Safety",                value: 1,  color: "#ef4444" },
  { name: "Leakages",             value: 1,  color: "#3b82f6" },
  { name: "Worn Out or Broken Part", value: 0, color: "#22c55e" },
  { name: "Unusual Vibration/Heat", value: 0, color: "#ec4899" },
  { name: "Hard to Clean Area",   value: 0,  color: "#eab308" },
  { name: "Other",                value: 0,  color: "#6b7280" },
];

const STATUS_DONUT = [
  { name: "Completed", value: 2, color: "#ef4444" },
  { name: "Pending",   value: 0, color: "#3b82f6" },
];

const DEPT_BAR_DATA = [
  { dept: "Knitting", Safety: 1, Leakages: 1, WornOut: 0, Vibration: 0, HardClean: 0, Other: 0 },
];

const TABLE_DATA = [
  { dept: "Knitting", machineCat: "JL", machineNo: "JL 02", category: "Safety", woDesc: "Exposed wiring near panel", woStatus: "Completed", createdBy: "Dinesh", resolvedDate: "2026-06-18", techName: "Francis" },
  { dept: "Knitting", machineCat: "JL", machineNo: "JL 01", category: "Leakages", woDesc: "Oil dripping from gearbox", woStatus: "Completed", createdBy: "Aravinda", resolvedDate: "2026-06-17", techName: "Ruwan" },
];

const DEPARTMENTS = ["All", "Engineering", "Finishing", "Knitting", "DryFinishing", "Dyeing"];
const CATEGORIES_OPT = ["All", "Safety", "Leakages", "Worn Out or Broken Part", "Unusual Vibration/Heat", "Hard to Clean Area", "Other"];
const STATUSES = ["All", "Completed", "Pending"];

export default function RedTagReport() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const today = new Date();
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(fmt(weekAgo));
  const [endDate, setEndDate] = useState(fmt(today));
  const [dept, setDept] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");

  const bg    = dark ? "bg-[#020617]" : "bg-slate-100";
  const card  = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-gray-200";
  const text  = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inp   = dark ? "bg-[#1e293b] border-[#334155] text-white" : "bg-white border-gray-300 text-gray-900";
  const tblHead = "bg-teal-600 text-white text-xs";
  const tblRow  = dark ? "border-[#1e293b] text-gray-300 text-xs" : "border-gray-100 text-gray-700 text-xs";

  const filteredTable = TABLE_DATA.filter(row => {
    if (dept !== "All" && row.dept !== dept) return false;
    if (category !== "All" && row.category !== category) return false;
    if (status !== "All" && row.woStatus !== status) return false;
    if (search && !Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={`flex flex-col h-full overflow-auto ${bg}`}>
      <div className="p-4 space-y-4">

        {/* Filter Header */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>Red Tag Report</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`} />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`} />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {CATEGORIES_OPT.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>Current Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">View Report</button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">Print Report</button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Red Tag Category Donut */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-3 ${text}`}>Red Tag Category</p>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {CATEGORY_PIE.map(d => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={CATEGORY_PIE.filter(d => d.value > 0)} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} label={({ value }) => value}>
                  {CATEGORY_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: dark ? "#111827" : "#fff", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Red Tag Status Donut */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-3 ${text}`}>Red Tag Status</p>
            <div className="flex gap-4 text-xs mb-2">
              {STATUS_DONUT.map(d => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={STATUS_DONUT.filter(d => d.value > 0)} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} label={({ value }) => value}>
                  {STATUS_DONUT.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: dark ? "#111827" : "#fff", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Red Tag by Departments Bar */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-2 ${text}`}>Red Tag Request by Departments</p>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {[
                { label: "Safety", color: "#ef4444" },
                { label: "Leakages", color: "#22c55e" },
                { label: "Worn Out or Broken Part", color: "#3b82f6" },
                { label: "Unusual Vibration/Heat", color: "#eab308" },
                { label: "Hard to Clean Area", color: "#ec4899" },
                { label: "Other", color: "#06b6d4" },
              ].map(({ label, color }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={DEPT_BAR_DATA} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#1e293b" : "#f0f0f0"} />
                <XAxis type="number" tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 9, fill: dark ? "#64748b" : "#9ca3af" }} width={55} />
                <Tooltip contentStyle={{ background: dark ? "#111827" : "#fff", border: "1px solid #374151", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="Safety"   stackId="a" fill="#ef4444" />
                <Bar dataKey="Leakages" stackId="a" fill="#22c55e" />
                <Bar dataKey="WornOut"  stackId="a" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Wise Red Tag Category */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <p className={`text-sm font-bold mb-2 ${text}`}>Machine Wise Red Tag Category</p>
          <p className={`text-xs ${muted}`}>Select department and click View Report to load machine-wise data.</p>
        </div>

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <div className="bg-red-600 px-4 py-2.5">
            <h3 className="text-sm font-bold text-white">Red Tag W/O Details</h3>
          </div>
          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            {["Copy", "Excel", "CSV", "PDF", "Print"].map(btn => (
              <button key={btn} className={`px-3 py-1 rounded text-xs border font-medium transition-colors ${dark ? "border-[#334155] text-gray-300 hover:bg-[#1e293b]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>{btn}</button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className={`text-xs ${muted}`}>Search:</label>
              <input value={search} onChange={e => setSearch(e.target.value)} className={`rounded border px-2 py-1 text-xs w-32 ${inp}`} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tblHead}>
                  <th className="px-3 py-2 text-left">Department</th>
                  <th className="px-3 py-2 text-left">Machine Category</th>
                  <th className="px-3 py-2 text-left">Machine Number</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">W/O Description</th>
                  <th className="px-3 py-2 text-left">W/O Status</th>
                  <th className="px-3 py-2 text-left">Created By</th>
                  <th className="px-3 py-2 text-left">Resolved Date</th>
                  <th className="px-3 py-2 text-left">Technician</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row, i) => (
                  <tr key={i} className={`border-t ${tblRow}`}>
                    <td className="px-3 py-2">{row.dept}</td>
                    <td className="px-3 py-2">{row.machineCat}</td>
                    <td className="px-3 py-2">{row.machineNo}</td>
                    <td className="px-3 py-2">{row.category}</td>
                    <td className="px-3 py-2 max-w-xs truncate">{row.woDesc}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.woStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {row.woStatus}
                      </span>
                    </td>
                    <td className="px-3 py-2">{row.createdBy}</td>
                    <td className="px-3 py-2">{row.resolvedDate}</td>
                    <td className="px-3 py-2">{row.techName}</td>
                  </tr>
                ))}
                {filteredTable.length === 0 && (
                  <tr><td colSpan={9} className={`text-center py-6 text-xs ${muted}`}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className={`flex items-center justify-between px-4 py-3 text-xs ${muted}`}>
            <span>{filteredTable.length} entries</span>
            <div className="flex gap-2">
              <button className={`px-3 py-1 rounded border ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}>Previous</button>
              <button className={`px-3 py-1 rounded border ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
