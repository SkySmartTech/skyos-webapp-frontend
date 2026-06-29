import { useEffect, useMemo, useState } from "react";
import { getAndonEvents, type AndonEvent } from "../../api/andonService";
import { useTheme } from "../../context/ThemeContext";

type LineStatus = "RUNNING" | "ANDON";

function calcMinutes(start?: string, stop?: string) {
  if (!start || !stop) return 0;
  const s = new Date(start).getTime();
  const e = new Date(stop).getTime();
  if (isNaN(s) || isNaN(e)) return 0;
  return Math.max(0, (e - s) / 60000);
}

function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return { timeStr: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) };
}

function KpiCard({ label, value, accent, dark }: { label: string; value: string | number; accent: string; dark: boolean }) {
  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-1 ${dark ? "bg-[#111827] border-slate-700" : "bg-white border-gray-200"}`}>
      <div className={`w-8 h-1.5 rounded-full ${accent}`} />
      <div className={`text-[clamp(1.2rem,2.5vw,1.8rem)] font-extrabold leading-none mt-1 ${dark ? "text-white" : "text-gray-900"}`}>
        {value}
      </div>
      <div className={`text-[11px] font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>{label}</div>
    </div>
  );
}

export default function AndonHomeDashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { timeStr } = useClock();

  const [events, setEvents] = useState<AndonEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAndonEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  // Process data for charts/tables
  const dashboardData = useMemo(() => {
    const lineMap: Record<string, { status: LineStatus; department: string; downtime: number }> = {};
    const deptMap: Record<string, { calls: number; totalDowntime: number }> = {};

    events.forEach((e) => {
      const line = (e.WorkCenter || "UNKNOWN").trim();
      const dept = e.CategoryName || "TECHNICAL";
      const duration = calcMinutes(e.StartTime?.date, e.StopTime?.date);

      if (!lineMap[line]) {
        lineMap[line] = { status: "RUNNING", department: dept, downtime: 0 };
      }

      // Department Aggregation
      if (!deptMap[dept]) deptMap[dept] = { calls: 0, totalDowntime: 0 };
      deptMap[dept].calls += 1;
      deptMap[dept].totalDowntime += duration;
    });

    return { lineMap, deptMap };
  }, [events]);

  const { lineMap, deptMap } = dashboardData;
  const totalDowntime = Object.values(deptMap).reduce((sum, d) => sum + d.totalDowntime, 0);

  const page = dark ? "bg-[#0b1220] text-slate-100" : "bg-[#f0f2f5] text-gray-800";
  const card = dark ? "bg-[#111827] border-slate-700" : "bg-white border-gray-200";

  return (
    <div className={`h-full w-full overflow-y-auto p-3 ${page}`}>
      <header className="grid grid-cols-3 items-center bg-[#3a456d] px-4 py-3 rounded-md shadow-md mb-3">
        <div />
        <h1 className="text-[clamp(0.9rem,2vw,1.4rem)] font-bold tracking-tight text-[#d6de62] text-center">
          Smart Andon System
        </h1>
        <div className="text-right font-mono font-bold text-[#27d39a]">{timeStr}</div>
      </header>

      {loading ? (
        <div className="text-center p-10">Loading Data...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <KpiCard label="Total Lines" value={Object.keys(lineMap).length} accent="bg-[#3a456d]" dark={dark} />
            <KpiCard label="Lines Running" value={Object.keys(lineMap).length} accent="bg-green-500" dark={dark} />
          
            <KpiCard label="Downtime (Min)" value={Math.round(totalDowntime)} accent="bg-[#0b0bff]" dark={dark} />
          </div>

          <section className={`rounded border p-3 mb-3 ${card}`}>
            <h2 className="text-[13px] font-bold mb-3">Live Line Status</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
              {Object.entries(lineMap).map(([id]) => (
                <div 
                  key={id} 
                  className={`rounded-lg border p-2 text-center ${dark ? "bg-green-600/20 border-green-500/40 text-green-400" : "bg-green-50 border-green-300 text-green-700"}`}
                >
                  <div className="text-[11px] font-bold">{id}</div>
                  <div className="text-[9px]">RUNNING</div>
                </div>
              ))}
            </div>
          </section>

          <section className={`rounded border p-3 ${card}`}>
            <h2 className="text-[13px] font-bold mb-3">Department Summary</h2>
            <table className="w-full text-[12px]">
              <thead>
                <tr className={dark ? "bg-slate-800" : "bg-gray-100"}>
                  <th className="p-2 text-left">Dept</th>
                  <th className="p-2">Calls</th>
                  <th className="p-2">Downtime (Min)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(deptMap).map(([dept, data]) => (
                  <tr key={dept} className={`border-t ${dark ? "border-slate-700" : "border-gray-200"}`}>
                    <td className="p-2 font-bold">{dept}</td>
                    <td className="p-2 text-center">{data.calls}</td>
                    <td className="p-2 text-center">{Math.round(data.totalDowntime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}