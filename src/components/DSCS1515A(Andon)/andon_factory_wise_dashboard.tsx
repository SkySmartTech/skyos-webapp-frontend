import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";
import { useTheme } from "../../context/ThemeContext";

type DeptKey = "TECHNICAL" | "MMT" | "CUTTING" | "QA/MQA";

type LineDowntime = {
  line: string;
  downtime: number;
  occurrence: number;
  TECHNICAL: number;
  MMT: number;
  CUTTING: number;
  "QA/MQA": number;
};

const departmentColors: Record<DeptKey, string> = {
  TECHNICAL: "#ef4444",
  MMT: "#facc15",
  CUTTING: "#16a34a",
  "QA/MQA": "#1d4ed8",
};

const lineData: LineDowntime[] = [
  {
    line: "Line 01",
    downtime: 210,
    occurrence: 22,
    TECHNICAL: 3,
    MMT: 6,
    CUTTING: 11,
    "QA/MQA": 2,
  },
  {
    line: "Line 02",
    downtime: 420,
    occurrence: 9,
    TECHNICAL: 1,
    MMT: 2,
    CUTTING: 5,
    "QA/MQA": 1,
  },
  {
    line: "Line 03",
    downtime: 240,
    occurrence: 21,
    TECHNICAL: 8,
    MMT: 6,
    CUTTING: 5,
    "QA/MQA": 2,
  },
  {
    line: "Line 04",
    downtime: 170,
    occurrence: 13,
    TECHNICAL: 6,
    MMT: 4,
    CUTTING: 5,
    "QA/MQA": 1,
  },
  {
    line: "Line 05",
    downtime: 45,
    occurrence: 7,
    TECHNICAL: 3,
    MMT: 1,
    CUTTING: 3,
    "QA/MQA": 0,
  },
  {
    line: "Line 06",
    downtime: 70,
    occurrence: 11,
    TECHNICAL: 2,
    MMT: 3,
    CUTTING: 6,
    "QA/MQA": 0,
  },
  {
    line: "Line 07",
    downtime: 40,
    occurrence: 8,
    TECHNICAL: 1,
    MMT: 2,
    CUTTING: 5,
    "QA/MQA": 0,
  },
  {
    line: "Line 08",
    downtime: 180,
    occurrence: 23,
    TECHNICAL: 6,
    MMT: 5,
    CUTTING: 9,
    "QA/MQA": 3,
  },
  {
    line: "Line 09",
    downtime: 810,
    occurrence: 45,
    TECHNICAL: 11,
    MMT: 26,
    CUTTING: 15,
    "QA/MQA": 4,
  },
  {
    line: "Line 10",
    downtime: 160,
    occurrence: 12,
    TECHNICAL: 2,
    MMT: 9,
    CUTTING: 3,
    "QA/MQA": 2,
  },
  {
    line: "Line 11",
    downtime: 440,
    occurrence: 12,
    TECHNICAL: 3,
    MMT: 11,
    CUTTING: 6,
    "QA/MQA": 2,
  },
  {
    line: "Line 12",
    downtime: 360,
    occurrence: 15,
    TECHNICAL: 5,
    MMT: 7,
    CUTTING: 2,
    "QA/MQA": 2,
  },
  {
    line: "Line 13",
    downtime: 15,
    occurrence: 2,
    TECHNICAL: 1,
    MMT: 0,
    CUTTING: 1,
    "QA/MQA": 0,
  },
  {
    line: "Line 14",
    downtime: 65,
    occurrence: 5,
    TECHNICAL: 1,
    MMT: 2,
    CUTTING: 2,
    "QA/MQA": 0,
  },
  {
    line: "Line 15",
    downtime: 25,
    occurrence: 5,
    TECHNICAL: 1,
    MMT: 0,
    CUTTING: 3,
    "QA/MQA": 1,
  },
  {
    line: "Line 16",
    downtime: 33,
    occurrence: 3,
    TECHNICAL: 0,
    MMT: 2,
    CUTTING: 1,
    "QA/MQA": 0,
  },
  ...Array.from({ length: 14 }, (_, index) => ({
    line: `Line ${String(index + 17).padStart(2, "0")}`,
    downtime: 0,
    occurrence: 0,
    TECHNICAL: 0,
    MMT: 0,
    CUTTING: 0,
    "QA/MQA": 0,
  })),
];

const totalByDept = (Object.keys(departmentColors) as DeptKey[]).map((key) => ({
  name: key,
  value: lineData.reduce((sum, row) => sum + row[key], 0),
  fill: departmentColors[key],
}));

const totalOccurrenceByDept = (Object.keys(departmentColors) as DeptKey[]).map(
  (key) => ({
    name: key,
    value: lineData.reduce((sum, row) => sum + row[key], 0),
    fill: departmentColors[key],
  }),
);

function ReportPanel({
  title,
  titleBg,
  dark,
  children,
}: {
  title: string;
  titleBg: string;
  dark: boolean;
  children: ReactNode;
}) {
  const panel = dark
    ? "border-slate-700 bg-slate-900 shadow-black/20"
    : "border-gray-300 bg-white shadow-sm";
  const header = dark ? "text-slate-100" : "text-white";

  return (
    <section className={`overflow-hidden rounded-md border ${panel}`}>
      <header className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold ${header} ${titleBg}`}>
        <span>{title}</span>
        <span className="text-[16px] leading-none">-</span>
      </header>
      <div className="h-[250px] p-3">{children}</div>
    </section>
  );
}

export default function AndonFactoryWiseDashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const tooltipStyle = {
    backgroundColor: dark ? "#0f172a" : "#ffffff",
    border: `1px solid ${dark ? "#334155" : "#d1d5db"}`,
    borderRadius: 8,
    fontSize: 12,
    color: dark ? "#e2e8f0" : "#111827",
  };

  const page = dark ? "bg-[#0b1220] text-slate-100" : "bg-[#f3f3f3] text-gray-800";
  const outerPanel = dark ? "border-slate-700 bg-slate-900 shadow-black/20" : "border-gray-300 bg-white shadow-sm";
  const outerHeader = dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-gray-200 bg-[#f0f0f0] text-gray-700";
  const label = dark ? "text-slate-200" : "text-gray-700";
  const field = dark
    ? "border-slate-700 bg-slate-950 text-slate-100"
    : "border-gray-300 bg-white text-gray-700";
  const action = dark
    ? "bg-cyan-600 text-white hover:bg-cyan-500"
    : "bg-blue-600 text-white hover:bg-blue-700";
  const gridStroke = dark ? "#334155" : "#e5e7eb";
  const axisTick = dark ? { fill: "#cbd5e1", fontSize: 10 } : { fill: "#6b7280", fontSize: 10 };
  const legendText = dark ? { color: "#cbd5e1", fontSize: 11 } : { color: "#6b7280", fontSize: 11 };

  return (
    <div className={`h-full w-full overflow-y-auto p-3 ${page}`}>
      <div className="space-y-3">
        <section className={`rounded-md border ${outerPanel}`}>
          <header className={`border-b px-3 py-2 text-[13px] font-semibold ${outerHeader}`}>
            Downtime Reports
          </header>

          <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_1fr_170px]">
            <label className={`space-y-1 text-[12px] font-semibold ${label}`}>
              <span>Start Date Time:</span>
              <input
                type="text"
                defaultValue="06/08/2026 05:00 AM"
                className={`h-9 w-full rounded border px-2 text-[12px] ${field}`}
              />
            </label>

            <label className={`space-y-1 text-[12px] font-semibold ${label}`}>
              <span>End Date Time:</span>
              <input
                type="text"
                defaultValue="06/09/2026 10:30 PM"
                className={`h-9 w-full rounded border px-2 text-[12px] ${field}`}
              />
            </label>

            <label className={`space-y-1 text-[12px] font-semibold ${label}`}>
              <span>Shift</span>
              <select className={`h-9 w-full rounded border px-2 text-[12px] ${field}`}>
                <option>All</option>
                <option>Shift A</option>
                <option>Shift B</option>
                <option>Shift C</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 px-3 pb-3">
            <button className={`rounded px-4 py-2 text-[12px] font-semibold ${action}`}>
              View Report
            </button>
            <button className={`rounded px-4 py-2 text-[12px] font-semibold ${action}`}>
              Print Report
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <ReportPanel
            title="Department Wise Total Downtime"
            titleBg="bg-red-500"
            dark={dark}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalByDept}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={62}
                  cx="50%"
                  cy="52%"
                >
                  {totalByDept.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.fill}
                      stroke={dark ? "#0f172a" : "#ffffff"}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={30} iconType="rect" formatter={(value) => <span style={legendText}>{value}</span>} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ReportPanel>

          <ReportPanel
            title="Department wise Downtime Occurrence"
            titleBg="bg-red-500"
            dark={dark}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalOccurrenceByDept}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={72}
                  cx="50%"
                  cy="53%"
                >
                  {totalOccurrenceByDept.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.fill}
                      stroke={dark ? "#0f172a" : "#ffffff"}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={30} iconType="rect" formatter={(value) => <span style={legendText}>{value}</span>} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ReportPanel>

          <ReportPanel
            title="Line Wise Total Downtime (Minutes)"
            titleBg="bg-green-600"
            dark={dark}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineData}
                margin={{ top: 8, right: 8, left: -5, bottom: 0 }}
              >
                <CartesianGrid stroke={gridStroke} />
                <XAxis
                  dataKey="line"
                  tick={axisTick}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={48}
                />
                <YAxis tick={axisTick} width={35} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar dataKey="downtime" name="Downtime (Min)" fill="#4b9bc4" />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>

          <ReportPanel title="Line Wise Total Occurance" titleBg="bg-green-600" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineData}
                margin={{ top: 8, right: 8, left: -5, bottom: 0 }}
              >
                <CartesianGrid stroke={gridStroke} />
                <XAxis
                  dataKey="line"
                  tick={axisTick}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={48}
                />
                <YAxis tick={axisTick} width={35} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar dataKey="occurrence" name="Occurance" fill="#4b9bc4" />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>

          <ReportPanel
            title="Line and Category Wise Downtime Stacked Chart"
            titleBg="bg-green-600"
            dark={dark}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineData}
                margin={{ top: 8, right: 8, left: -5, bottom: 0 }}
              >
                <CartesianGrid stroke={gridStroke} />
                <XAxis
                  dataKey="line"
                  tick={axisTick}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={48}
                />
                <YAxis tick={axisTick} width={35} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar
                  dataKey="TECHNICAL"
                  stackId="a"
                  fill={departmentColors.TECHNICAL}
                />
                <Bar dataKey="MMT" stackId="a" fill={departmentColors.MMT} />
                <Bar
                  dataKey="CUTTING"
                  stackId="a"
                  fill={departmentColors.CUTTING}
                />
                <Bar
                  dataKey="QA/MQA"
                  stackId="a"
                  fill={departmentColors["QA/MQA"]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>

          <ReportPanel
            title="Line and Category Wise Occurrence Stacked Chart"
            titleBg="bg-green-600"
            dark={dark}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lineData}
                margin={{ top: 8, right: 8, left: -5, bottom: 0 }}
              >
                <CartesianGrid stroke={gridStroke} />
                <XAxis
                  dataKey="line"
                  tick={axisTick}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={48}
                />
                <YAxis tick={axisTick} width={35} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar
                  dataKey="TECHNICAL"
                  stackId="a"
                  fill={departmentColors.TECHNICAL}
                />
                <Bar dataKey="MMT" stackId="a" fill={departmentColors.MMT} />
                <Bar
                  dataKey="CUTTING"
                  stackId="a"
                  fill={departmentColors.CUTTING}
                />
                <Bar
                  dataKey="QA/MQA"
                  stackId="a"
                  fill={departmentColors["QA/MQA"]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>
        </div>
      </div>
    </div>
  );
}
