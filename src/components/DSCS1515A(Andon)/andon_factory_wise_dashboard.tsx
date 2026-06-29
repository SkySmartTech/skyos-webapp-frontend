import { useEffect, useMemo, useState } from "react";
import { getAndonEvents, type AndonEvent } from "../../api/andonService";
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

function calcMinutes(start?: string, stop?: string) {
  if (!start || !stop) return 0;
  const s = new Date(start).getTime();
  const e = new Date(stop).getTime();
  if (isNaN(s) || isNaN(e)) return 0;
  return Math.max(0, (e - s) / 60000);
}

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
      <header
        className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold ${header} ${titleBg}`}
      >
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

  const [events, setEvents] = useState<AndonEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AndonEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Input states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAndonEvents();
      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    };
    load();
  }, []);

  // BUTTON HANDLER: Updates filteredEvents only when clicked
  const handleViewReport = () => {
    let data = [...events];

    if (startDate) {
      const start = new Date(startDate);
      data = data.filter((e) => new Date(e.StartTime?.date || "") >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      data = data.filter((e) => new Date(e.StartTime?.date || "") <= end);
    }

    setFilteredEvents(data);
  };

  // Memoized calculations depend on filteredEvents
  const lineData: LineDowntime[] = useMemo(() => {
    const map: Record<string, LineDowntime> = {};
    for (const e of filteredEvents) {
      const line = (e.WorkCenter || "UNKNOWN").trim();
      const dept = (e.CategoryName as DeptKey) || "TECHNICAL";
      const downtime = calcMinutes(e.StartTime?.date, e.StopTime?.date);

      if (!map[line]) {
        map[line] = { line, downtime: 0, occurrence: 0, TECHNICAL: 0, MMT: 0, CUTTING: 0, "QA/MQA": 0 };
      }
      map[line].occurrence += 1;
      map[line].downtime += downtime;
      if (dept in map[line]) map[line][dept] += downtime;
    }
    return Object.values(map).sort((a, b) => b.downtime - a.downtime);
  }, [filteredEvents]);

  const totalByDept = useMemo(() => {
    const totals: Record<DeptKey, number> = { TECHNICAL: 0, MMT: 0, CUTTING: 0, "QA/MQA": 0 };
    for (const e of filteredEvents) {
      const dept = (e.CategoryName as DeptKey) || "TECHNICAL";
      const downtime = calcMinutes(e.StartTime?.date, e.StopTime?.date);
      if (dept in totals) totals[dept] += downtime;
    }
    return (Object.keys(departmentColors) as DeptKey[]).map((key) => ({
      name: key,
      value: totals[key],
      fill: departmentColors[key],
    }));
  }, [filteredEvents]);

  const totalOccurrenceByDept = useMemo(() => {
    const totals: Record<DeptKey, number> = { TECHNICAL: 0, MMT: 0, CUTTING: 0, "QA/MQA": 0 };
    for (const e of filteredEvents) {
      const dept = (e.CategoryName as DeptKey) || "TECHNICAL";
      totals[dept] += 1;
    }
    return (Object.keys(departmentColors) as DeptKey[]).map((key) => ({
      name: key,
      value: totals[key],
      fill: departmentColors[key],
    }));
  }, [filteredEvents]);

  const tooltipStyle = { backgroundColor: dark ? "#0f172a" : "#ffffff", border: `1px solid ${dark ? "#334155" : "#d1d5db"}`, borderRadius: 8, fontSize: 12, color: dark ? "#e2e8f0" : "#111827" };
  const page = dark ? "bg-[#0b1220] text-slate-100" : "bg-[#f3f3f3] text-gray-800";
  const gridStroke = dark ? "#334155" : "#e5e7eb";
  const axisTick = dark ? { fill: "#cbd5e1", fontSize: 10 } : { fill: "#6b7280", fontSize: 10 };
  const legendText = dark ? { color: "#cbd5e1", fontSize: 11 } : { color: "#6b7280", fontSize: 11 };

  return (
    <div className={`h-full w-full overflow-y-auto p-3 ${page}`}>
      <div className="space-y-3">
        {loading && <div className="text-sm opacity-70">Loading Andon data...</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm  font-medium">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded border p-2 text-white" />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded border p-2 text-white" />
          </div>
          <div className="flex items-end">
            <button onClick={handleViewReport} className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-white w-full">
              Load Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {/* Charts keep original structure */}
          <ReportPanel title="Department Wise Total Downtime" titleBg="bg-red-500" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={totalByDept} dataKey="value" nameKey="name" innerRadius={40} outerRadius={62}>
                  {totalByDept.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Legend wrapperStyle={legendText} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ReportPanel>
          <ReportPanel title="Department wise Occurrence" titleBg="bg-red-500" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={totalOccurrenceByDept} dataKey="value" nameKey="name" outerRadius={72}>
                  {totalOccurrenceByDept.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Legend wrapperStyle={legendText} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ReportPanel>
          <ReportPanel title="Line Wise Total Downtime (Minutes)" titleBg="bg-green-600" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <CartesianGrid stroke={gridStroke} />
                <XAxis dataKey="line" tick={axisTick} />
                <YAxis tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar dataKey="downtime" fill="#4b9bc4" />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>
          <ReportPanel title="Line Wise Occurrence" titleBg="bg-green-600" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <CartesianGrid stroke={gridStroke} />
                <XAxis dataKey="line" tick={axisTick} />
                <YAxis tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar dataKey="occurrence" fill="#4b9bc4" />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>
          <ReportPanel title="Line Wise Category Downtime" titleBg="bg-green-600" dark={dark}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <CartesianGrid stroke={gridStroke} />
                <XAxis dataKey="line" tick={axisTick} />
                <YAxis tick={axisTick} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendText} />
                <Bar dataKey="TECHNICAL" stackId="a" fill={departmentColors.TECHNICAL} />
                <Bar dataKey="MMT" stackId="a" fill={departmentColors.MMT} />
                <Bar dataKey="CUTTING" stackId="a" fill={departmentColors.CUTTING} />
                <Bar dataKey="QA/MQA" stackId="a" fill={departmentColors["QA/MQA"]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportPanel>
        </div>
      </div>
    </div>
  );
}