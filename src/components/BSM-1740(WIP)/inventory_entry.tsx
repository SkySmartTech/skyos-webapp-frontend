import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, RefreshCw, Loader2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import wipService, { type WipLine } from "../../api/wipService";

type Row = WipLine & { inQty: number; outQty: number };

/** Mirrors the backend's DashboardController::resolveCardColor() threshold logic. */
function resolveBorderColor(line: WipLine): string {
  if (!line.is_active) return "#cbd5e1";
  if (line.balance >= line.upper_limit) return line.u_color;
  if (line.balance <= line.lower_limit) return line.l_color;
  return line.m_color;
}

export default function InventoryEntry() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLines = useCallback(async () => {
    setLoading(true);
    try {
      const lines = await wipService.getLines();
      setRows(lines.filter(l => l.is_active).map(l => ({ ...l, inQty: 0, outQty: 0 })));
      setError(null);
    } catch {
      setError("Could not load lines from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLines(); }, [fetchLines]);

  const handleIn  = (i: number, val: string) => setRows(prev => prev.map((l, idx) => idx === i ? { ...l, inQty:  Math.max(0, parseInt(val) || 0) } : l));
  const handleOut = (i: number, val: string) => setRows(prev => prev.map((l, idx) => idx === i ? { ...l, outQty: Math.max(0, parseInt(val) || 0) } : l));

  const handleUpdate = async () => {
    const entries = rows
      .filter(l => l.inQty > 0 || l.outQty > 0)
      .map(l => ({ line_id: l.id, qty_in: l.inQty, qty_out: l.outQty }));

    if (entries.length === 0) return;

    setSaving(true);
    try {
      await wipService.createDataLogEntries(entries);
      await fetchLines(); // re-pull authoritative balances from the backend
    } catch {
      setError("Failed to save entries — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => setRows(prev => prev.map(l => ({ ...l, inQty: 0, outQty: 0 })));

  const bg      = dark ? "bg-[#0d1117]"       : "bg-[#f3f5f7]";
  const topBar  = dark ? "bg-[#161b27] border-[#1e293b]" : "bg-white border-[#e2e8f0]";
  const tbl     = dark ? "bg-[#0d1117]"       : "bg-white";
  const thCls   = dark ? "bg-[#161b27] text-[#64748b] border-[#1e293b]" : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]";
  const rowCls  = dark ? "border-[#1e293b] hover:bg-[#161b27]/60" : "border-[#e2e8f0] hover:bg-[#f8fafc]";
  const txtPri  = dark ? "text-white"         : "text-gray-900";
  const txtMut  = dark ? "text-[#94a3b8]"     : "text-[#64748b]";
  const inpCls  = dark ? "bg-[#1e2533] border-[#2d3a52] text-white" : "bg-[#f1f5f9] border-[#e2e8f0] text-gray-900";

  const balanceDisplay = (line: Row) => {
    if (line.balance >= line.upper_limit) return <span className="bg-red-600 text-white text-sm font-bold px-2 py-0.5 rounded">{line.balance.toLocaleString()}</span>;
    if (line.balance > 0)     return <span className="text-green-400 font-bold text-sm">{line.balance.toLocaleString()}</span>;
    return <span className="text-gray-500 font-bold text-sm">0</span>;
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${bg}`}>

      {/* Top bar */}
      <div className={`shrink-0 flex items-center justify-between px-4 py-3 border-b ${topBar}`}>
        <div className="flex items-center gap-3">
          <LayoutGrid size={18} className={txtMut} />
          <h1 className={`text-base font-bold ${txtPri}`}>Data Entry</h1>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-xs text-red-400">{error}</span>}
          <span className={`text-xs ${txtMut}`}>Powered by <span className="font-semibold text-blue-400">Buildteck Asia</span></span>
        </div>
      </div>

      {/* Sub-header */}
      <div className={`shrink-0 flex items-center justify-between px-4 py-2.5 border-b ${topBar}`}>
        <p className={`text-sm ${txtMut}`}>Enter In/Out quantities for production lines</p>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLines}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition disabled:opacity-60 ${dark ? "border-[#2d3a52] bg-[#1e2533] text-white hover:bg-[#2d3a52]" : "border-[#e2e8f0] bg-white text-gray-700 hover:bg-gray-50"}`}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
          </button>
          <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition">
            <span className="text-red-400">✕</span> Clear
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <span>⬆</span>} Update
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${tbl}`}>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className={`border-b ${thCls}`}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Line Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-green-500">In</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-red-400">Out</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Current Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr><td colSpan={4} className={`px-4 py-10 text-center text-sm ${txtMut}`}>No active lines found.</td></tr>
            )}
            {rows.map((line, i) => (
              <tr key={line.id} className={`border-b transition ${rowCls}`}>
                {/* Line Name */}
                <td className={`pl-0 pr-4 py-3`}>
                  <div className="flex items-center gap-3 border-l-4 pl-3" style={{ borderColor: resolveBorderColor(line) }}>
                    <span className={`font-semibold text-sm ${txtPri}`}>{line.name}</span>
                    {line.style && (
                      <span className={`text-xs ${txtMut}`}>{line.style.name}</span>
                    )}
                  </div>
                </td>
                {/* In */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={line.inQty || ""}
                    placeholder="0"
                    onChange={e => handleIn(i, e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-center text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 ${inpCls}`}
                  />
                </td>
                {/* Out */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={line.outQty || ""}
                    placeholder="0"
                    onChange={e => handleOut(i, e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-center text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 ${inpCls}`}
                  />
                </td>
                {/* Balance */}
                <td className="px-4 py-3 text-right">
                  {balanceDisplay(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
