"use client";

import { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ── Gauge ─────────────────────────────────────────────────────────────────────
function Gauge({ value, min = 0, max = 1200 }: { value: number; min?: number; max?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H * 0.78, r = W * 0.40;
    // track
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 16; ctx.strokeStyle = "#2a2d40"; ctx.stroke();
    // fill
    const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const fillA = Math.PI + ratio * Math.PI;
    const g = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    g.addColorStop(0, "#22c55e"); g.addColorStop(0.45, "#f59e0b"); g.addColorStop(1, "#ef4444");
    ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, fillA);
    ctx.lineWidth = 16; ctx.lineCap = "round"; ctx.strokeStyle = g; ctx.stroke();
    // needle
    const nx = cx + (r - 2) * Math.cos(fillA), ny = cy + (r - 2) * Math.sin(fillA);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nx, ny);
    ctx.lineWidth = 2.5; ctx.strokeStyle = "#fff"; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI); ctx.fillStyle = "#fff"; ctx.fill();
  }, [value, min, max]);
  return <canvas ref={ref} width={200} height={120} />;
}

// ── Chart Data ────────────────────────────────────────────────────────────────
const chartData = [
  { date: "05-27", MFM: 400, MFI: 750 },
  { date: "05-28", MFM: 480, MFI: 830 },
  { date: "05-29", MFM: 510, MFI: 840 },
  { date: "05-30", MFM: -100, MFI: -80 },
  { date: "05-31", MFM: 580, MFI: 650 },
  { date: "06-01", MFM: 640, MFI: 720 },
  { date: "06-02", MFM: 700, MFI: 620 },
  { date: "06-03", MFM: 960, MFI: 600 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HVACMFMDashboard() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#12141f] p-4 font-sans flex flex-col gap-3">
      {/* Title */}
      <h1 className="text-center text-[#f5a623] text-2xl font-bold">
        HVAC Performance Monitoring System of MFM
      </h1>

      {/* Top Row — 3 columns */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1.2fr 0.9fr" }}>

        {/* Gauge Panel */}
        <div className="bg-[#1c1f2e] rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-white text-sm font-bold mb-2">MFM kW</p>
          <Gauge value={960} />
          <p className="text-white text-3xl font-black -mt-3">960</p>
          <div className="flex justify-between w-[180px] text-xs text-[#888] mt-2">
            <span>Low</span><span>High</span>
          </div>
        </div>

        {/* Real Time Data */}
        <div className="bg-[#1c1f2e] rounded-xl p-5">
          <h3 className="text-center text-[#e0e0e0] text-sm font-semibold border-b border-[#2e3248] pb-3 mb-3">
            MFM Real Time Data
          </h3>
          <table className="w-full">
            <tbody>
              {[
                ["Thermal energy", ": 960.0 KW"],
                ["CH Water Flow",   ": 264.0 m3/h"],
                ["CH Water Sup Temp", ": 8.0 °C"],
                ["CH Water Ret Temp", ": 11.1 °C"],
              ].map(([l, v]) => (
                <tr key={l} className="border-b border-[#2a2d40] last:border-0">
                  <td className="py-3 font-bold text-[#e0e0e0] text-sm">{l}</td>
                  <td className="py-3 text-[#e0e0e0] text-sm">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total kW */}
        <div className="bg-[#1c1f2e] rounded-xl p-5 flex flex-col items-center justify-center gap-2">
          <p className="text-white text-2xl font-bold">Total kW</p>
          <p className="text-white text-6xl font-black leading-none">1572</p>
          <div className="mt-3 text-center">
            <p className="text-[#f5a623] text-xs font-semibold">Last Updated Time MFM</p>
            <p className="text-[#f5a623] text-xs">{fmtDate(now)}</p>
          </div>
        </div>
      </div>

      {/* Chart — full width */}
      <div className="bg-[#1c1f2e] rounded-xl p-5 flex-1">
        <p className="text-[#e0e0e0] text-sm font-semibold text-center mb-4">
          MFM &amp; MFI Cooling Load
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222538" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#888", fontSize: 12 }}
              axisLine={{ stroke: "#333" }}
            />
            <YAxis
              tick={{ fill: "#888", fontSize: 12 }}
              axisLine={{ stroke: "#333" }}
              domain={[-200, 1100]}
              ticks={[-200, 0, 200, 400, 600, 800, 1000]}
            />
            <Tooltip
              contentStyle={{ background: "#1c1f2e", border: "1px solid #2e3248", borderRadius: 8 }}
              labelStyle={{ color: "#e5e7eb" }}
            />
            <Legend
              formatter={(v) => <span style={{ color: "#aaa", fontSize: 12 }}>{v}</span>}
            />
            <Line type="monotone" dataKey="MFM" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="MFI" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}