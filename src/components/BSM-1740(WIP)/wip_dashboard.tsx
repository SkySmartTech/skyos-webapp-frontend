import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import wipService, { type WipDashboardLine, type WipDashboardStatistics } from "../../api/wipService";
import InventoryEntry from "./inventory_entry";
import Reports from "./reports";
import AiAssistant from "./ai_assistant";
import ProductionSetup from "./production_setup";
import ProductionStyles from "./production_styles";
import AccessUsers from "./access_users";
import RolePermissions from "./role_permissions";
import type { WipView } from "./wip_sidebar";

// Live board refresh interval — keeps the WIP System dashboard in sync with
// the backend (GET /m/wip-system/dashboard) without needing a websocket layer.
const POLL_INTERVAL_MS = 5000;

export default function WipDashboard({ activeSection }: { activeSection: WipView }) {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [lines, setLines] = useState<WipDashboardLine[]>([]);
  const [stats, setStats] = useState<WipDashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))
    , 1000);
    return () => clearInterval(id);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await wipService.getDashboard();
      setLines(data.lines);
      setStats(data.statistics);
      setError(null);
    } catch {
      setError("Unable to reach the WIP System backend. Showing last known data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Only poll the live board itself — admin sub-pages handle their own data.
  useEffect(() => {
    if (activeSection !== "dashboard") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
    pollRef.current = setInterval(fetchDashboard, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeSection, fetchDashboard]);

  const bg      = dark ? "bg-[#0b1220]" : "bg-[#f3f5f7]";
  const hCard   = dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-[#e2e8f0]";
  const heading = dark ? "text-white"   : "text-slate-900";
  const divider = dark ? "border-[#1e293b]" : "border-[#e2e8f0]";

  if (activeSection === "inventory")         return <InventoryEntry />;
  if (activeSection === "reports")           return <Reports />;
  if (activeSection === "ai")               return <AiAssistant />;
  if (activeSection === "setupLines")        return <ProductionSetup />;
  if (activeSection === "setupStyles")       return <ProductionStyles />;
  if (activeSection === "accessUsers")       return <AccessUsers />;
  if (activeSection === "accessPermissions") return <RolePermissions />;

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${bg}`}>

      {/* Header */}
      <div className={`shrink-0 grid grid-cols-3 items-center px-4 py-3 border-b ${hCard} ${divider}`}>
        <div className={`text-xs font-medium ${dark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
          {stats && (
            <span>
              {stats.active_lines}/{stats.total_lines} lines active · IN {stats.today_in.toLocaleString()} · OUT {stats.today_out.toLocaleString()}
            </span>
          )}
          {error && <span className="text-red-400 ml-2">{error}</span>}
        </div>
        <h1 className={`text-xl font-extrabold tracking-widest uppercase text-center ${heading}`}>
          Flowtrace Supermarket System Overview
        </h1>
        <div className="flex justify-end">
          <span className={`text-2xl font-mono font-bold ${dark ? "text-orange-400" : "text-orange-600"}`}>{time}</span>
        </div>
      </div>

      {/* Line Grid — fills remaining height */}
      {loading && lines.length === 0 ? (
        <div className={`flex-1 flex items-center justify-center text-sm font-semibold ${dark ? "text-[#64748b]" : "text-[#94a3b8]"}`}>
          Loading live board…
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-5 grid-rows-3">
          {lines.map((line) => (
            <div
              key={line.id}
              style={{ backgroundColor: line.card_color }}
              className="flex flex-col justify-between p-3 border border-black/10"
            >
              <p className="text-white font-bold text-sm leading-tight truncate">{line.name}</p>
              <p className="text-white font-black text-[clamp(1.8rem,3.5vw,3rem)] leading-none text-center">
                {line.balance.toLocaleString()}
              </p>
              <p className="text-white/90 font-semibold text-sm truncate text-center">{line.style ?? "—"}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
