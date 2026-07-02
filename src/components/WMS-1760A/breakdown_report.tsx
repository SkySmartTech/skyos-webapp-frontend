import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import {
  getWorkOrders,
  type BreakdownWorkOrder,
} from "../../api/workOrderService";

const FAULT_COLORS: Record<string, string> = {
  Electrical: "#ef4444",
  Mechanical: "#22c55e",
  "Select data": "#3b82f6",
  Pneumatic: "#f59e0b",
  NA: "#a855f7",
};

const MACHINE_DATA = [
  { machine: "MC24", Electrical: 0.01, Mechanical: 0.0, Pneumatic: 0.0 },
  { machine: "GI 02", Electrical: 0.0, Mechanical: 0.04, Pneumatic: 0.0 },
  { machine: "SB 07", Electrical: 0.03, Mechanical: 0.02, Pneumatic: 0.0 },
  { machine: "MJ 07", Electrical: 0.04, Mechanical: 0.01, Pneumatic: 0.01 },
  { machine: "TX 02", Electrical: 0.05, Mechanical: 0.03, Pneumatic: 0.0 },
  { machine: "JL 08", Electrical: 0.03, Mechanical: 0.02, Pneumatic: 0.01 },
  { machine: "JB 01", Electrical: 0.04, Mechanical: 0.05, Pneumatic: 0.0 },
  { machine: "SC09", Electrical: 0.02, Mechanical: 0.03, Pneumatic: 0.01 },
  { machine: "SC04", Electrical: 0.01, Mechanical: 0.04, Pneumatic: 0.0 },
  { machine: "SB07", Electrical: 0.03, Mechanical: 0.02, Pneumatic: 0.01 },
  { machine: "SC03", Electrical: 0.02, Mechanical: 0.01, Pneumatic: 0.0 },
  { machine: "SB09", Electrical: 0.01, Mechanical: 0.03, Pneumatic: 0.0 },
  { machine: "MC39", Electrical: 0.05, Mechanical: 0.09, Pneumatic: 0.01 },
  {
    machine: "Light Box 01",
    Electrical: 0.04,
    Mechanical: 0.06,
    Pneumatic: 0.0,
  },
  { machine: "SB04", Electrical: 0.02, Mechanical: 0.03, Pneumatic: 0.01 },
];

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Finishing",
  "Knitting",
  "DryFinishing",
  "Dyeing",
];
const MACHINE_CATEGORIES = ["All", "JL", "SC", "SB", "TX", "MJ"];
const FAULT_TYPES = ["All", "Electrical", "Mechanical", "Pneumatic", "NA"];

export default function BreakdownReport() {
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
  const [faultType, setFaultType] = useState("All");
  const [search, setSearch] = useState("");
  const [workOrders, setWorkOrders] = useState<BreakdownWorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWorkOrders = async () => {
      setLoading(true);
      try {
        const data = await getWorkOrders({
          category: "BreakDown",
          department: dept !== "All" ? dept : undefined,
          machine_category: machineCat !== "All" ? machineCat : undefined,
          fault_type: faultType !== "All" ? faultType : undefined,
          created_from: startDate,
          created_to: endDate,
        });

        setWorkOrders(data);
      } catch (error) {
        console.error("Failed to load breakdown work orders", error);
        setWorkOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadWorkOrders();
  }, [dept, machineCat, faultType, startDate, endDate]);

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
        {/* Header */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>
            Breakdown Report
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
                Fault Type
              </label>
              <select
                value={faultType}
                onChange={(e) => setFaultType(e.target.value)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              >
                {FAULT_TYPES.map((f) => (
                  <option key={f}>{f}</option>
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

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Breakdown Duration", value: "—" },
            { label: "Total Waiting Time", value: "—" },
            { label: "Department Wise Occurrence", value: "—" },
            { label: "Fault Type", value: "—" },
          ].map((c) => (
            <div key={c.label} className={`rounded-xl border p-4 ${card}`}>
              <p className={`text-xs font-semibold ${muted}`}>{c.label}</p>
              <p className={`text-lg font-bold mt-1 ${text}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-xs font-semibold mb-1 ${muted}`}>
              Machine Category
            </p>
            <p className={`text-sm ${muted}`}>—</p>
          </div>
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-xs font-semibold mb-1 ${muted}`}>
              Department Wise Average Waiting Time
            </p>
            <p className={`text-sm ${muted}`}>—</p>
          </div>
        </div>

        {/* Machine Wise Breakdown Chart */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <p className={`text-sm font-bold mb-4 ${text}`}>
            Machine Wise Breakdown
          </p>
          <div className="flex flex-wrap gap-3 mb-3 text-xs">
            {Object.entries(FAULT_COLORS).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: c }}
                />
                {k}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={MACHINE_DATA}
              margin={{ top: 5, right: 5, left: -25, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={dark ? "#1e293b" : "#f0f0f0"}
              />
              <XAxis
                dataKey="machine"
                tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }}
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
              <Bar dataKey="Electrical" stackId="a" fill="#ef4444" />
              <Bar dataKey="Mechanical" stackId="a" fill="#22c55e" />
              <Bar dataKey="Pneumatic" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown W/O Details Table */}
        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <div className="bg-red-600 px-4 py-2.5">
            <h3 className="text-sm font-bold text-white">
              Breakdown W/O Details
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
                  <th className="px-3 py-2 text-left">WO</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Department</th>
                  <th className="px-3 py-2 text-left">Machine Category</th>
                  <th className="px-3 py-2 text-left">Machine Number</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Requested By</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.map((row) => (
                  <tr key={row.id} className={`border-t ${tblRow}`}>
                    <td className="px-3 py-2">{row.wo}</td>
                    <td className="px-3 py-2">{row.time}</td>
                    <td className="px-3 py-2">{row.department}</td>
                    <td className="px-3 py-2">{row.machine_category ?? "-"}</td>
                    <td className="px-3 py-2">{row.machine || "-"}</td>
                    <td className="px-3 py-2 max-w-xs truncate">
                      {row.description}
                    </td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">{row.by}</td>
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
