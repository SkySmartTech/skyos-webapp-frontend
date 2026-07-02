import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  getWorkOrders,
  type WorkOrderFilters,
} from "../../api/workOrderService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Finishing",
  "Knitting",
  "DryFinishing",
  "Dyeing",
  "RM_Warehouse",
];
const CATEGORIES = [
  "All",
  "Fabrication",
  "Civil",
  "Electrical",
  "Mechanical",
  "Other",
];
const STATUSES = ["All", "New", "Inprogress", "Closed"];

export default function BuildingMaintenanceReport() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [filters, setFilters] = useState<WorkOrderFilters>({
    category: "BuildingMaintenance",
  });
  const [workOrders, setWorkOrders] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getWorkOrders(filters);
        setWorkOrders(data);
      } catch (error) {
        console.error("Failed to load building maintenance work orders", error);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [filters]);

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

  const summaryTotal = workOrders.length;
  const statusCounts = workOrders.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filtered = workOrders.filter((wo) => {
    if (
      search &&
      !Object.values(wo).join(" ").toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div
      className={`flex flex-col h-full overflow-auto ${dark ? "bg-[#020617]" : "bg-slate-100"}`}
    >
      <div className="p-4 space-y-4">
        <div className={`rounded-xl border p-4 ${card}`}>
          <h2 className={`text-base font-bold mb-4 ${text}`}>
            Building Maintenance Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Department
              </label>
              <select
                value={filters.department ?? "All"}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department:
                      e.target.value === "All" ? undefined : e.target.value,
                  }))
                }
                className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Category
              </label>
              <select
                value={filters.category ?? "All"}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category:
                      e.target.value === "All" ? undefined : e.target.value,
                  }))
                }
                className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Status
              </label>
              <select
                value={filters.status ?? "All"}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status:
                      e.target.value === "All" ? undefined : e.target.value,
                  }))
                }
                className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${muted}`}>
                Search
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
                placeholder="Search work orders"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-xs font-semibold ${muted}`}>Total Requests</p>
            <p className={`text-2xl font-bold ${text}`}>{summaryTotal}</p>
          </div>
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-xs font-semibold ${muted}`}>New</p>
            <p className={`text-2xl font-bold ${text}`}>
              {statusCounts.New ?? 0}
            </p>
          </div>
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-xs font-semibold ${muted}`}>In Progress</p>
            <p className={`text-2xl font-bold ${text}`}>
              {statusCounts.Inprogress ?? 0}
            </p>
          </div>
        </div>

        <div className={`rounded-xl border p-4 ${card}`}>
          <p className={`text-sm font-bold mb-4 ${text}`}>
            Request Status Trend
          </p>
          <div className="h-60 flex items-center justify-center text-sm text-gray-400">
            Chart will appear once data is loaded.
          </div>
        </div>

        <div className={`rounded-xl border overflow-hidden ${card}`}>
          <div className="bg-teal-600 px-4 py-3">
            <h3 className="text-sm font-bold text-white">
              Building Maintenance Work Orders
            </h3>
          </div>
          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            <span className={`text-xs ${muted}`}>
              {filtered.length} entries
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tblHead}>
                  <th className="px-3 py-2 text-left">WO</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Department</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Requested By</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`text-center py-8 text-xs ${muted}`}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`text-center py-8 text-xs ${muted}`}
                    >
                      No work orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((wo) => (
                    <tr key={wo.id} className={`border-t ${tblRow}`}>
                      <td className="px-3 py-2">{wo.wo}</td>
                      <td className="px-3 py-2">{wo.time}</td>
                      <td className="px-3 py-2">{wo.department}</td>
                      <td className="px-3 py-2">{wo.category}</td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {wo.description}
                      </td>
                      <td className="px-3 py-2">{wo.status}</td>
                      <td className="px-3 py-2">{wo.by}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
