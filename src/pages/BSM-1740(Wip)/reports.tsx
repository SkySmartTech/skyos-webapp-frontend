import { useTheme } from "../../context/ThemeContext";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const summary = [
  { title: "Monthly Revenue", value: "$312,000", sub: "+4.7% from last month" },
  { title: "Transactions", value: "15,890", sub: "+5.2% from last month" },
  { title: "Avg. Transaction", value: "$42.35", sub: "+2.1% from last month" },
  { title: "Items in Stock", value: "3,421", sub: "Across all categories" },
];

const revenueData = [
  { month: "Jan", revenue: 200000, expenses: 160000 },
  { month: "Feb", revenue: 240000, expenses: 180000 },
  { month: "Mar", revenue: 230000, expenses: 170000 },
  { month: "Apr", revenue: 260000, expenses: 190000 },
  { month: "May", revenue: 280000, expenses: 200000 },
  { month: "Jun", revenue: 300000, expenses: 220000 },
];

const transactionTrend = [
  { month: "Jan", tx: 12000 },
  { month: "Feb", tx: 13000 },
  { month: "Mar", tx: 12500 },
  { month: "Apr", tx: 14000 },
  { month: "May", tx: 15000 },
  { month: "Jun", tx: 15890 },
];

const pieData = [
  { name: "Groceries", value: 40, color: "#8b5cf6" },
  { name: "Fresh Produce", value: 25, color: "#06b6d4" },
  { name: "Beverages", value: 15, color: "#f97316" },
  { name: "Household", value: 12, color: "#10b981" },
  { name: "Other", value: 8, color: "#ef4444" },
];

const topProducts = [
  { product: "Whole Milk 1L", sales: 1842, revenue: "$7,350" },
  { product: "White Bread", sales: 1598, revenue: "$4,780" },
  { product: "Fresh Bananas", sales: 1467, revenue: "$3,650" },
  { product: "Coca Cola 2L", sales: 1234, revenue: "$4,060" },
  { product: "Toilet Paper 12pk", sales: 989, revenue: "$8,890" },
];

export default function Reports() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg = dark ? "bg-[#070707] text-white" : "bg-[#f3f5f7] text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const heading = dark ? "text-white" : "text-slate-900";
  const axis = dark ? "#6b7280" : "#9ca3af";
  const grid = dark ? "#1f2937" : "#f3f4f6";

  return (
    <div className={`h-full w-full overflow-hidden ${bg}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-black ${heading}`}>Reports & Analytics</h1>
            <p className={`text-sm ${muted}`}>View comprehensive business insights</p>
          </div>
          <button className={`rounded-lg border px-4 py-2 text-sm font-semibold ${dark ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-4">
          {summary.map((s) => (
            <div key={s.title} className={`rounded-xl border p-4 ${card}`}>
              <p className={`text-sm font-semibold ${muted}`}>{s.title}</p>
              <p className={`mt-3 text-2xl font-black ${heading}`}>{s.value}</p>
              <p className={`text-xs mt-1 ${muted}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-semibold ${muted}`}>Revenue vs Expenses</p>
            <p className={`text-xs ${muted}`}>Monthly financial overview</p>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="month" stroke={axis} />
                  <YAxis stroke={axis} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                  <Bar dataKey="expenses" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-semibold ${muted}`}>Transaction Trend</p>
            <p className={`text-xs ${muted}`}>Daily transaction volume</p>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transactionTrend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} />
                  <XAxis dataKey="month" stroke={axis} />
                  <YAxis stroke={axis} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tx" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-semibold ${muted}`}>Category Distribution</p>
            <p className={`text-xs ${muted}`}>Sales by product category</p>
            <div className="h-56 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`text-sm font-semibold ${muted}`}>Top Performing Products</p>
            <p className={`text-xs ${muted}`}>Best sellers this month</p>
            <div className="mt-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-400">
                    <th className="py-2">Product</th>
                    <th className="py-2">Sales</th>
                    <th className="py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.product} className="border-t">
                      <td className="py-3">{p.product}</td>
                      <td className="py-3">{p.sales}</td>
                      <td className="py-3">{p.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
