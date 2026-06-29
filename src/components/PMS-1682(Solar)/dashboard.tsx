"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Activity } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

// ── Gauge ─────────────────────────────────────────────────────────────────────
function Gauge({ value, min = 0, max = 1200 }: { value: number; min?: number; max?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.80, r = W * 0.40;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 16; ctx.strokeStyle = "#1e293b"; ctx.stroke();
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
  return <canvas ref={ref} width={180} height={110} className="w-full max-w-45" />;
}

// ── ON/OFF Button ─────────────────────────────────────────────────────────────
function OpButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`min-w-13 px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-colors duration-200 ${
        on ? "bg-[#22C55E] hover:bg-green-600 text-white" : "bg-[#dc3545] hover:bg-red-700 text-white"
      }`}
    >
      {on ? "ON" : "OFF"}
    </button>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const chartData = [
  { date: "06-02", MFM: 580, MFI: 680 },
  { date: "06-03", MFM: 1020, MFI: 900 },
  { date: "06-04", MFM: 460, MFI: 820 },
  { date: "06-05", MFM: 380, MFI: 740 },
  { date: "06-06", MFM: 600, MFI: 760 },
  { date: "06-07", MFM: 300, MFI: 450 },
  { date: "06-08", MFM: 650, MFI: 800 },
  { date: "06-09", MFM: 720, MFI: 850 },
];

const mfmRows = [
  { label: "Thermal energy",    value: "952.0 KW"   },
  { label: "CH Water Flow",     value: "237.0 m3/h" },
  { label: "CH Water Sup Temp", value: "9.4 °C"     },
  { label: "CH Water Ret Temp", value: "12.9 °C"    },
];
const mfiRows = [
  { label: "Thermal energy",    value: "859.0 KW"   },
  { label: "CH Water Flow",     value: "151.0 m3/h" },
  { label: "CH Water Sup Temp", value: "8.5 °C"     },
  { label: "CH Water Ret Temp", value: "13.3 °C"    },
];


// ── Component ─────────────────────────────────────────────────────────────────
export default function HVACDashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  const [chillers,     setChillers]     = useState([false, false, false, false]);
  const [chillerPumps, setChillerPumps] = useState([false, false, false, false]);
  const [outerPumps,   setOuterPumps]   = useState([false, false, false, false]);
  const [coolingTower, setCoolingTower] = useState([false, false, false, false]);

  const toggle = (_arr: boolean[], set: Dispatch<SetStateAction<boolean[]>>, i: number) =>
    set(prev => prev.map((v, j) => j === i ? !v : v));

  const bg        = dark ? "bg-[#0d1117]"                  : "bg-[#f0f2f5]";
  const card      = dark ? "bg-[#161b27] border-[#1e293b]" : "bg-white border-[#e2e8f0]";
  const cardAlt   = dark ? "bg-[#1e2538] border-[#2d3a52]" : "bg-[#f8fafc] border-[#e2e8f0]";
  const opSection = dark ? "bg-[#252e42]"                  : "bg-[#eef2f7]";
  const textPri   = dark ? "text-white"                    : "text-[#0f172a]";
  const textSec   = dark ? "text-[#94a3b8]"                : "text-[#64748b]";
  const textMut   = dark ? "text-[#475569]"                : "text-[#94a3b8]";
  const divider   = dark ? "border-[#1e293b]"              : "border-[#e2e8f0]";
  const chartGrid = dark ? "#1e293b"                        : "#e2e8f0";
  const chartAxis = dark ? "#475569"                        : "#94a3b8";

  const opGroups = [
    { label: "CHILLERS",           state: chillers,     set: setChillers     },
    { label: "CHILLER PUMP",       state: chillerPumps, set: setChillerPumps },
    { label: "CILLER OUTER PUMP",  state: outerPumps,   set: setOuterPumps   },
    { label: "COOLING TOWER",      state: coolingTower, set: setCoolingTower },
  ];

  return (
    <div className={`font-sans flex flex-col h-full p-3 md:p-5 gap-3 md:gap-4 overflow-auto transition-colors duration-300 ${bg}`}>

      {/* ── HEADER ── */}
      <div className={`grid grid-cols-3 items-center px-4 py-3 rounded-xl border ${card}`}>
        <div />
        <h1 className={`text-xl font-extrabold tracking-widest uppercase text-center ${textPri}`}>
          HVAC Energy Monitoring Dashboard
        </h1>
        <div className="flex justify-end">
          <span className={`text-2xl font-mono font-bold ${dark ? 'text-teal-400' : 'text-teal-600'}`}>{time}</span>
        </div>
      </div>

{/* ── ROW 1: 4 equal cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

        {/* MFM Gauge */}
        <div className={`border rounded-xl overflow-hidden flex flex-col items-center transition-colors ${card}`}>
          <div className={`w-full flex items-center justify-center gap-2 px-3 py-2 border-b ${divider}`}>
            <div className="w-1 h-5 rounded-full bg-teal-500 shrink-0" />
            <p className={`text-sm font-extrabold tracking-widest uppercase ${dark ? 'text-teal-400' : 'text-teal-600'}`}>MFM kW</p>
          </div>
          <div className="p-4 flex flex-col items-center w-full">
          <Gauge value={952} />
          <div className={`flex justify-between w-full max-w-45 text-[10px] mt-0.5 ${textMut}`}>
            <span>Low</span><span>High</span>
          </div>
          <p className={`text-3xl font-black mt-1 ${textPri}`}>952</p>
          </div>
        </div>

        {/* MFM Real Time Data */}
        <div className={`border rounded-xl overflow-hidden transition-colors ${card}`}>
          <div className={`flex items-center justify-center gap-2 px-3 py-2 border-b ${divider}`}>
            <div className="w-1 h-5 rounded-full bg-teal-500 shrink-0" />
            <p className={`text-sm font-extrabold tracking-widest uppercase ${dark ? 'text-teal-400' : 'text-teal-600'}`}>MFM Real Time Data</p>
          </div>
          <div className="p-4">
            <div className={`border-t ${divider}`}>
              {mfmRows.map(row => (
                <div key={row.label} className={`flex justify-between items-center py-2 border-b ${divider}`}>
                  <span className={`text-xs font-bold ${textPri}`}>{row.label}</span>
                  <span className={`text-xs font-bold ml-2 whitespace-nowrap ${textPri}`}>: {row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MFI Gauge */}
        <div className={`border rounded-xl overflow-hidden flex flex-col items-center transition-colors ${card}`}>
          <div className={`w-full flex items-center justify-center gap-2 px-3 py-2 border-b ${divider}`}>
            <div className="w-1 h-5 rounded-full bg-teal-500 shrink-0" />
            <p className={`text-sm font-extrabold tracking-widest uppercase ${dark ? 'text-teal-400' : 'text-teal-600'}`}>MFI kW</p>
          </div>
          <div className="p-4 flex flex-col items-center w-full">
          <Gauge value={859} />
          <div className={`flex justify-between w-full max-w-45 text-[10px] mt-0.5 ${textMut}`}>
            <span>Low</span><span>High</span>
          </div>
          <p className={`text-3xl font-black mt-1 ${textPri}`}>859</p>
          </div>
        </div>

        {/* MFI Real Time Data */}
        <div className={`border rounded-xl overflow-hidden transition-colors ${card}`}>
          <div className={`flex items-center justify-center gap-2 px-3 py-2 border-b ${divider}`}>
            <div className="w-1 h-5 rounded-full bg-teal-500 shrink-0" />
            <p className={`text-sm font-extrabold tracking-widest uppercase ${dark ? 'text-teal-400' : 'text-teal-600'}`}>MFI Real Time Data</p>
          </div>
          <div className="p-4">
            <div className={`border-t ${divider}`}>
              {mfiRows.map(row => (
                <div key={row.label} className={`flex justify-between items-center py-2 border-b ${divider}`}>
                  <span className={`text-xs font-bold ${textPri}`}>{row.label}</span>
                  <span className={`text-xs font-bold ml-2 whitespace-nowrap ${textPri}`}>: {row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Chart + Totals + Chiller Ops ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 flex-1">

        {/* Chart */}
        <div className={`lg:col-span-5 border rounded-xl p-4 flex flex-col transition-colors ${card}`}>
          <p className={`text-xs text-center mb-2 ${textSec}`}>MFM &amp; MFI Cooling Load</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="date" tick={{ fill: chartAxis, fontSize: 10 }} axisLine={{ stroke: chartGrid }} />
              <YAxis tick={{ fill: chartAxis, fontSize: 10 }} axisLine={{ stroke: chartGrid }} domain={[200, 1200]} ticks={[300, 500, 700, 900, 1100]} />
              <Tooltip
                contentStyle={{ background: dark ? "#161b27" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8 }}
                labelStyle={{ color: dark ? "#f8fafc" : "#0f172a" }}
              />
              <Legend formatter={(v) => <span style={{ color: chartAxis, fontSize: 11 }}>{v}</span>} />
              <Line type="monotone" dataKey="MFM" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="MFI" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total kW + COP */}
        <div className={`lg:col-span-3 border rounded-xl p-5 flex flex-col items-center justify-center gap-3 transition-colors ${cardAlt}`}>
          <div className="text-center">
            <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${textSec}`}>Total kW</p>
            <p className={`text-6xl font-black leading-none ${textPri}`}>1811</p>
          </div>
          <div className={`w-full border-t ${divider}`} />
          <div className="text-center">
            <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${textSec}`}>Chiller COP</p>
            <p className="text-6xl font-black leading-none text-[#22C55E]">3.2</p>
          </div>
          <div className={`w-full border-t pt-3 space-y-2 text-center ${divider}`}>
            <div>
              <p className="text-[10px] font-bold text-[#f59e0b]">Last Updated Time MFM</p>
              <p className={`text-[11px] font-mono text-[#f59e0b]`}>2026-06-09 09:59:27</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#f59e0b]">Last Updated Time MFI</p>
              <p className={`text-[11px] font-mono text-[#f59e0b]`}>2026-06-09 09:59:34</p>
            </div>
          </div>
        </div>

        {/* Chiller Operations */}
        <div className={`lg:col-span-4 border rounded-xl overflow-hidden transition-colors ${card}`}>
          <p className={`px-4 py-3 text-sm font-bold text-center border-b ${divider} ${textSec}`}>
            Chiller Operations
          </p>
          <div className="p-3 space-y-2">
            {opGroups.map(({ label, state, set }) => (
              <div key={label} className={`rounded-lg p-3 ${opSection}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest text-center mb-2.5 ${textSec}`}>
                  {label}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {state.map((on, i) => (
                    <OpButton key={i} on={on} onToggle={() => toggle(state, set, i)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${divider} ${textMut}`}>
        <span>PMS-1682 Solar — HVAC Performance Monitoring</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> System Normal</span>
          <span className="flex items-center gap-1.5 text-[#14B8A6]"><Activity size={10} /> Real-time Data</span>
        </div>
      </div>
    </div>
  );
}
