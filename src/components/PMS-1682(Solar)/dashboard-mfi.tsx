"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Thermometer, Droplets, ArrowUpRight, Activity } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

function Gauge({ value, min = 0, max = 1200 }: { value: number; min?: number; max?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.78, r = W * 0.38;
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 14; ctx.strokeStyle = "#1e293b"; ctx.stroke();
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const fillA = Math.PI + ratio * Math.PI;
    const g = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    g.addColorStop(0, "#22c55e"); g.addColorStop(0.45, "#f59e0b"); g.addColorStop(1, "#ef4444");
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, fillA);
    ctx.lineWidth = 14; ctx.lineCap = "round"; ctx.strokeStyle = g; ctx.stroke();
    const nx = cx + (r - 2) * Math.cos(fillA), ny = cy + (r - 2) * Math.sin(fillA);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
    ctx.lineWidth = 2.5; ctx.strokeStyle = "#fff"; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 2 * Math.PI); ctx.fillStyle = "#fff"; ctx.fill();
  }, [value, min, max]);
  return <canvas ref={ref} width={160} height={96} className="w-full max-w-40" />;
}

const chartData = [
  { date: "05-27", MFM: 400, MFI: 750 },
  { date: "05-28", MFM: 390, MFI: 820 },
  { date: "05-29", MFM: 520, MFI: 840 },
  { date: "05-30", MFM: 200, MFI: 300 },
  { date: "05-31", MFM: 620, MFI: 700 },
  { date: "06-01", MFM: 660, MFI: 740 },
  { date: "06-02", MFM: 600, MFI: 640 },
  { date: "06-03", MFM: 960, MFI: 664 },
];

const rtData = [
  { label: "Thermal Energy",       value: "664 KW",    color: "text-[#14B8A6]" },
  { label: "CH Water Flow",        value: "147 m³/h",  color: "text-[#14B8A6]" },
  { label: "CH Water Supply Temp", value: "7.1 °C",    color: "text-[#22C55E]" },
  { label: "CH Water Return Temp", value: "11.0 °C",   color: "text-[#f59e0b]" },
  { label: "Total kW",             value: "1,659 kW",  color: "text-[#14B8A6]" },
  { label: "Chiller COP",          value: "3.2",       color: "text-[#22C55E]" },
  { label: "System Load",          value: "55 %",      color: "text-[#f59e0b]" },
  { label: "Last Updated",         value: "Live",      color: "text-[#22C55E]" },
];

export default function HVACMFIDashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const bg        = dark ? "bg-[#020617]"                  : "bg-[#f8fafc]";
  const card      = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-[#e2e8f0]";
  const textPri   = dark ? "text-[#f8fafc]"                : "text-[#0f172a]";
  const textSec   = dark ? "text-[#94a3b8]"                : "text-[#64748b]";
  const textMut   = dark ? "text-[#475569]"                : "text-[#94a3b8]";
  const divider   = dark ? "border-[#1e293b]"              : "border-[#e2e8f0]";
  const rowHover  = dark ? "hover:bg-[#1e293b]/40"         : "hover:bg-[#f8fafc]";
  const chartGrid = dark ? "#1e293b" : "#e2e8f0";
  const chartAxis = dark ? "#475569" : "#94a3b8";

  const [time, setTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  const kpis = [
    { label: "MFI kW",      value: "664",  unit: "kW",   icon: Zap,         color: dark ? "bg-teal-600/10 border-teal-500/20 text-teal-400"    : "bg-teal-50 border-teal-200 text-teal-600",      trend: "+1.8%" },
    { label: "Water Flow",  value: "147",  unit: "m³/h", icon: Droplets,    color: dark ? "bg-teal-600/10 border-teal-500/20 text-teal-400"    : "bg-teal-50 border-teal-200 text-teal-600",      trend: "Normal" },
    { label: "Supply Temp", value: "7.1",  unit: "°C",   icon: Thermometer, color: dark ? "bg-green-600/10 border-green-500/20 text-green-400" : "bg-[#f0fdf4] border-[#dcfce7] text-[#22C55E]",  trend: "Optimal" },
    { label: "Return Temp", value: "11.0", unit: "°C",   icon: Thermometer, color: dark ? "bg-teal-600/10 border-teal-500/20 text-teal-400"    : "bg-teal-50 border-teal-200 text-teal-600",      trend: "Stable" },
  ];

  return (
    <div className={`font-sans flex flex-col h-full p-3 sm:p-4 md:p-5 gap-3 md:gap-4 transition-colors duration-300 ${bg}`}>

      {/* Header */}
      <div className={`grid grid-cols-3 items-center px-4 py-3 rounded-xl border ${card}`}>
        <div />
        <h1 className={`text-xl font-extrabold tracking-widest uppercase text-center ${textPri}`}>
          MFI Dashboard
        </h1>
        <div className="flex justify-end">
          <span className={`text-2xl font-mono font-bold ${dark ? 'text-teal-400' : 'text-teal-600'}`}>{time}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-xl border p-4 transition-colors duration-300 ${k.color}`}>
            <div className="flex items-start justify-between mb-3">
              <k.icon size={18} />
              <span className="text-[10px] sm:text-xs font-semibold flex items-center gap-1">
                <ArrowUpRight size={11} />{k.trend}
              </span>
            </div>
            <div className={`text-2xl sm:text-3xl font-black ${textPri}`}>
              {k.value}<span className={`text-xs sm:text-sm font-normal ml-1 ${textSec}`}>{k.unit}</span>
            </div>
            <div className={`text-[10px] mt-1 uppercase tracking-widest font-semibold ${textSec}`}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gauge + Real-time data + Chart */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

        {/* Left: Gauge + real-time data table */}
        <div className={`border rounded-xl p-4 flex flex-col transition-colors duration-300 ${card}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 text-center ${textMut}`}>MFI Unit — Real-Time</p>

          {/* Gauge */}
          <div className="flex flex-col items-center mb-3">
            <Gauge value={664} />
            <div className={`flex justify-between w-40 text-[10px] mt-0.5 ${textMut}`}>
              <span>Low</span><span>High</span>
            </div>
            <p className={`text-4xl font-black mt-1 ${textPri}`}>664 <span className={`text-sm font-normal ${textSec}`}>kW</span></p>
          </div>

          {/* Real-time parameters */}
          <div className={`flex-1 border-t ${divider}`}>
            {rtData.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-1 py-2 text-xs ${i < rtData.length - 1 ? `border-b ${divider}` : ''} ${rowHover} transition-colors`}
              >
                <span className={textSec}>{row.label}</span>
                <span className={`font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart */}
        <div className={`md:col-span-2 border rounded-xl p-4 flex flex-col transition-colors duration-300 ${card}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold uppercase tracking-widest ${textMut}`}>MFM &amp; MFI Cooling Load (kW)</p>
            <span className="text-[10px] tracking-widest text-[#22C55E] uppercase font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <Activity size={9} className="inline mr-1" />Live
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="date" tick={{ fill: chartAxis, fontSize: 10 }} axisLine={{ stroke: chartGrid }} />
                <YAxis tick={{ fill: chartAxis, fontSize: 10 }} axisLine={{ stroke: chartGrid }} domain={[0, 1100]} />
                <Tooltip contentStyle={{ background: dark ? "#111827" : "#fff", border: `1px solid ${dark ? "#1e293b" : "#e2e8f0"}`, borderRadius: 8 }} labelStyle={{ color: dark ? "#f8fafc" : "#0f172a" }} />
                <Legend formatter={(v) => <span style={{ color: chartAxis, fontSize: 11 }}>{v}</span>} />
                <Line type="monotone" dataKey="MFM" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="MFI" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${divider} ${textMut}`}>
        <span>MFI Unit — Main Factory Integrated</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> MFI Online</span>
      </div>
    </div>
  );
}
