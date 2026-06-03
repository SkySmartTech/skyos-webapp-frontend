"use client";

import { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface RealTimeData {
  thermalEnergy: number;
  chWaterFlow: number;
  chWaterSupTemp: number;
  chWaterRetTemp: number;
}
interface OperationGroup { title: string; states: boolean[]; }

function Gauge({ value, min = 0, max = 1200 }: { value: number; min?: number; max?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.78, r = W * 0.40;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 16; ctx.strokeStyle = "#2a2d40"; ctx.stroke();
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const fillA = Math.PI + ratio * Math.PI;
    const g = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    g.addColorStop(0, "#22c55e"); g.addColorStop(0.45, "#f59e0b"); g.addColorStop(1, "#ef4444");
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, fillA);
    ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.strokeStyle = g; ctx.stroke();
    const nx = cx + (r - 2) * Math.cos(fillA), ny = cy + (r - 2) * Math.sin(fillA);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
    ctx.lineWidth = 2.5; ctx.strokeStyle = "#fff"; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI); ctx.fillStyle = "#fff"; ctx.fill();
  }, [value, min, max]);
  return <canvas ref={ref} width={150} height={90} />;
}

function RealTimeTable({ title, data }: { title: string; data: RealTimeData }) {
  const rows: [string, string][] = [
    ["Thermal energy", `${data.thermalEnergy} KW`],
    ["CH Water Flow", `${data.chWaterFlow} m3/h`],
    ["CH Water Sup Temp", `${data.chWaterSupTemp} °C`],
    ["CH Water Ret Temp", `${data.chWaterRetTemp} °C`],
  ];
  return (
    <div className="bg-[#1c1f2e] rounded-xl p-3 flex flex-col">
      <h3 className="text-center text-[#e0e0e0] text-xs font-semibold border-b border-[#2e3248] pb-2 mb-2">{title}</h3>
      <table className="w-full text-xs">
        <tbody>
          {rows.map(([l, v]) => (
            <tr key={l} className="border-b border-[#2a2d40] last:border-0">
              <td className="py-1.5 font-semibold text-[#e0e0e0]">{l}</td>
              <td className="py-1.5 text-[#e0e0e0]">: {v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OperationsPanel({ groups }: { groups: OperationGroup[] }) {
  const [states, setStates] = useState(groups.map((g) => [...g.states]));
  const toggle = (gi: number, bi: number) =>
    setStates((prev) => prev.map((g, i) => i === gi ? g.map((s, j) => j === bi ? !s : s) : g));
  return (
    <div className="bg-[#1c1f2e] rounded-xl p-3 flex flex-col gap-2">
      <p className="text-[#ccc] text-xs text-center mb-1">Chiller Operations</p>
      {groups.map((g, gi) => (
        <div key={gi} className={`rounded-md p-2 ${gi % 2 === 0 ? "bg-[#252839]" : "bg-[#1e2130]"}`}>
          <p className="text-[#bbb] text-[10px] text-center mb-1.5">{g.title}</p>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {states[gi].map((on, bi) => (
              <button
                key={bi}
                onClick={() => toggle(gi, bi)}
                className={`px-3 py-1 rounded text-white text-[11px] font-bold cursor-pointer border-none
                  ${on ? "bg-[#22aa44] hover:bg-[#1a9038]" : "bg-[#cc2200] hover:bg-[#b31e00]"}`}
              >
                {on ? "ON" : "OFF"}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const chartData = [
  { date: "05-27", MFM: 380, MFI: 740 },
  { date: "05-28", MFM: 460, MFI: 820 },
  { date: "05-29", MFM: 600, MFI: 760 },
  { date: "05-30", MFM: 10,  MFI: 30  },
  { date: "05-31", MFM: -120, MFI: -100 },
  { date: "06-01", MFM: 300, MFI: 450 },
  { date: "06-02", MFM: 580, MFI: 680 },
  { date: "06-03", MFM: 620, MFI: 900 },
];

const operationGroups: OperationGroup[] = [
  { title: "CHILLERS",          states: [false, false, false, false] },
  { title: "CHILLER PUMP",      states: [false, false, false, false] },
  { title: "CILLER OUTER PUMP", states: [false, false, false, false] },
  { title: "COOLING TOWER",     states: [false, false, false, false] },
];

const mfmData: RealTimeData = { thermalEnergy: 952, chWaterFlow: 253, chWaterSupTemp: 9.3, chWaterRetTemp: 12.5 };
const mfiData: RealTimeData = { thermalEnergy: 953, chWaterFlow: 162, chWaterSupTemp: 8.3, chWaterRetTemp: 13.3 };

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function HVACDashboard() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);

  return (
    <div className="min-h-screen bg-[#12141f] p-3 font-sans">
      <h1 className="text-center text-[#f5a623] text-xl font-bold mb-3">
        HVAC Performance Monitoring System of MFM &amp; MFI
      </h1>

      {/* Top Row */}
      <div className="grid grid-cols-4 gap-2.5 mb-2.5">
        <div className="bg-[#1c1f2e] rounded-xl p-3 flex flex-col items-center">
          <p className="text-[#e0e0e0] text-xs font-semibold mb-1">MFM kW</p>
          <Gauge value={952} />
          <p className="text-white text-xl font-bold -mt-2">952</p>
          <div className="flex justify-between w-[130px] text-[10px] text-[#888] mt-1">
            <span>Low</span><span>High</span>
          </div>
        </div>

        <RealTimeTable title="MFM Real Time Data" data={mfmData} />

        <div className="bg-[#1c1f2e] rounded-xl p-3 flex flex-col items-center">
          <p className="text-[#e0e0e0] text-xs font-semibold mb-1">MFI kW</p>
          <Gauge value={953} />
          <p className="text-white text-xl font-bold -mt-2">953</p>
          <div className="flex justify-between w-[130px] text-[10px] text-[#888] mt-1">
            <span>Low</span><span>High</span>
          </div>
        </div>

        <RealTimeTable title="MFI Real Time Data" data={mfiData} />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-2.5" style={{ gridTemplateColumns: "1.7fr 0.85fr 1fr" }}>
        {/* Chart */}
        <div className="bg-[#1c1f2e] rounded-xl p-3">
          <p className="text-[#e0e0e0] text-xs font-semibold text-center mb-2">MFM &amp; MFI Cooling Load</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData} margin={{ top: 5, right: 8, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222538" />
              <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 10 }} axisLine={{ stroke: "#333" }} />
              <YAxis
                tick={{ fill: "#888", fontSize: 10 }}
                axisLine={{ stroke: "#333" }}
                domain={[-200, 1100]}
                ticks={[-200, 0, 200, 400, 600, 800, 1000]}
              />
              <Tooltip
                contentStyle={{ background: "#1c1f2e", border: "1px solid #2e3248", borderRadius: 8 }}
                labelStyle={{ color: "#e5e7eb" }}
              />
              <Legend formatter={(v) => <span style={{ color: "#aaa", fontSize: 11 }}>{v}</span>} />
              <Line type="monotone" dataKey="MFM" stroke="#14b8a6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="MFI" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total kW / COP */}
        <div className="bg-[#1c1f2e] rounded-xl p-4 flex flex-col items-center justify-center gap-1">
          <p className="text-white text-lg font-bold">Total kW</p>
          <p className="text-white text-5xl font-black leading-none">1905</p>
          <p className="text-white text-lg font-bold mt-2">Chiller COP</p>
          <p className="text-white text-5xl font-black leading-none">3.2</p>
          <div className="mt-4 text-center">
            <p className="text-[#f5a623] text-[10px] font-semibold">Last Updated Time MFM</p>
            <p className="text-[#f5a623] text-[10px]">{fmtDate(now)}</p>
            <p className="text-[#f5a623] text-[10px] font-semibold mt-1.5">Last Updated Time MFI</p>
            <p className="text-[#f5a623] text-[10px]">{fmtDate(new Date(now.getTime() + 1000))}</p>
          </div>
        </div>

        {/* Operations */}
        <OperationsPanel groups={operationGroups} />
      </div>
    </div>
  );
}