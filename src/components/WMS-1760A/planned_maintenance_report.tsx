import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import {
  getWorkOrders,
  type BreakdownWorkOrder,
} from "../../api/workOrderService";

const DEPT_PIE = [
  { name: "Engineering", value: 8, color: "#ef4444" },
  { name: "DesignDevelopment", value: 4, color: "#22c55e" },
  { name: "Knitting", value: 4, color: "#eab308" },
  { name: "DryFinishing", value: 5, color: "#3b82f6" },
  { name: "Dyeing", value: 6, color: "#a855f7" },
  { name: "Finishing", value: 8, color: "#06b6d4" },
  { name: "RM_Warehouse", value: 3, color: "#6b7280" },
];

const STATUS_DONUT = [
  { name: "Completed", value: 33, color: "#ef4444" },
  { name: "Pending", value: 5, color: "#3b82f6" },
];

const MACHINE_CAT_BAR = [
  { cat: "ETP", count: 1 },
  { cat: "MS", count: 1 },
  { cat: "ML", count: 1 },
  { cat: "JL", count: 2 },
  { cat: "Inspection", count: 1 },
  { cat: "Men Padder", count: 1 },
  { cat: "Allover insp.", count: 1 },
  { cat: "Jet dyeing m.", count: 9 },
  { cat: "Rewinding", count: 2 },
  { cat: "Scouring", count: 4 },
  { cat: "Scissor Lift", count: 3 },
  { cat: "Steamer", count: 2 },
  { cat: "Sewing mach.", count: 2 },
  { cat: "TX", count: 2 },
  { cat: "Tow Truck", count: 1 },
  { cat: "Electric Fork", count: 1 },
];

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Finishing",
  "Knitting",
  "DryFinishing",
  "Dyeing",
];
const MACHINE_CATEGORIES = [
  "All",
  "JL",
  "SC",
  "SB",
  "TX",
  "MJ",
  "Jet dyeing m.",
  "Steamer",
];
const STATUSES = ["All", "Completed", "Pending"];

export default function PlannedMaintenanceReport() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(fmt(weekAgo));
  const [endDate, setEndDate] = useState(fmt(today));
  const [dept, setDept] = useState("All");
  const [machineCat, setMachineCat] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [workOrders, setWorkOrders] = useState<BreakdownWorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWorkOrders = async () => {
      setLoading(true);
      try {
        const data = await getWorkOrders({
          category: "PlannedMaintenance",
          department: dept !== "All" ? dept : undefined,
          machine_category: machineCat !== "All" ? machineCat : undefined,
          status: status !== "All" ? status : undefined,
          created_from: startDate,
          created_to: endDate,
        });
        setWorkOrders(data);
      } catch (error) {
        console.error("Failed to load planned maintenance work orders", error);
        setWorkOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadWorkOrders();
  }, [dept, machineCat, status, startDate, endDate]);

  const bg = dark ? "bg-[#020617]" : "bg-slate-100";
  const card = dark
    ? "bg-[#111827] border-[#1e293b]"
    : "bg-white border-gray-200";
  const text = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-white border-gray-300 text-gray-900";
  const tblHead = "bg-teal-600 text-white text-xs";
  const tblRow = dark
    ? "border-[#1e293b] text-gray-300 text-xs"
    : "border-gray-100 text-gray-700 text-xs";

  const filteredTable = workOrders.filter((row) => {
    if (
      search &&
      !Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className={`flex flex-col h-full overflow-auto ${bg}`}>
      <div className="p-4 space-y-4">
        {/* Filter Header */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>
            Planned Maintenance
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Department
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Machine Category
              </label>
              <select
                value={machineCat}
                onChange={(e) => setMachineCat(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              >
                {MACHINE_CATEGORIES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              View Report
            </button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              Print Report
            </button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Department Wise Pie */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-3 ${text}`}>Department Wise</p>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {DEPT_PIE.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={DEPT_PIE}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ value }) => value}
                >
                  {DEPT_PIE.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: dark ? "#111827" : "#fff",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Donut */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-3 ${text}`}>
              Planned Maintenance Status
            </p>
            <div className="flex gap-4 text-xs mb-2">
              {STATUS_DONUT.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm inline-block"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={STATUS_DONUT}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  label={({ value }) => value}
                >
                  {STATUS_DONUT.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: dark ? "#111827" : "#fff",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Machine Category Bar */}
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-bold mb-3 ${text}`}>
              Machine Category Wise Planned Maintenance
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={MACHINE_CAT_BAR}
                margin={{ top: 5, right: 5, left: -25, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={dark ? "#1e293b" : "#f0f0f0"}
                />
                <XAxis
                  dataKey="cat"
                  tick={{ fontSize: 7, fill: dark ? "#64748b" : "#9ca3af" }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    background: dark ? "#111827" : "#fff",
                    border: "1px solid #374151",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="count" name="Work Order Count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Machine Wise Maintenance */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <p className={`text-sm font-bold mb-2 ${text}`}>
            Machine Wise Maintenance
          </p>
          <p className={`text-xs ${muted}`}>
            Select department and click View Report to load machine-wise data.
          </p>
        </div>

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <div className="bg-red-600 px-4 py-2.5">
            <h3 className="text-sm font-bold text-white">
              Planned Maintenance W/O Details
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
              <button
                key={btn}
                className={`px-3 py-1 rounded text-xs border font-medium transition-colors ${dark ? "border-[#334155] text-gray-300 hover:bg-[#1e293b]" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {btn}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className={`text-xs ${muted}`}>Search:</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`rounded border px-2 py-1 text-xs w-32 ${inp}`}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tblHead}>
                  <th className="px-3 py-2 text-left">Department</th>
                  <th className="px-3 py-2 text-left">Machine Category</th>
                  <th className="px-3 py-2 text-left">Machine Number</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Scheduled Date</th>
                  <th className="px-3 py-2 text-left">Completed Date</th>
                  <th className="px-3 py-2 text-left">Technician</th>
                  <th className="px-3 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row, i) => (
                  <tr key={i} className={`border-t ${tblRow}`}>
                    <td className="px-3 py-2">{row.dept}</td>
                    <td className="px-3 py-2">{row.machineCat}</td>
                    <td className="px-3 py-2">{row.machineNo}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${row.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{row.scheduledDate}</td>
                    <td className="px-3 py-2">{row.completedDate}</td>
                    <td className="px-3 py-2">{row.techName}</td>
                    <td className="px-3 py-2">{row.duration}</td>
                  </tr>
                ))}
                {filteredTable.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className={`text-center py-6 text-xs ${muted}`}
                    >
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`flex items-center justify-between px-4 py-3 text-xs ${muted}`}
          >
            <span>{filteredTable.length} entries</span>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded border ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}
              >
                Previous
              </button>
              <button
                className={`px-3 py-1 rounded border ${dark ? "border-[#334155] hover:bg-[#1e293b]" : "border-gray-300 hover:bg-gray-50"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
