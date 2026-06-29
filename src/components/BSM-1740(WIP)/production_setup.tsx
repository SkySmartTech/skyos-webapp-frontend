import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Edit2, Power, Plus, Trash2, X, Loader2 } from "lucide-react";
import wipService, { type WipLine, type WipLinePayload, type WipStyleRef } from "../../api/wipService";

const emptyForm = {
  name: "",
  current_style_id: "" as string | number,
  upper_limit: "",
  lower_limit: "",
  u_color: "#ef4444",
  m_color: "#eab308",
  l_color: "#22c55e",
  is_active: true,
};

export default function ProductionSetup() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [lines, setLines] = useState<WipLine[]>([]);
  const [styles, setStyles] = useState<WipStyleRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [linesData, stylesData] = await Promise.all([wipService.getLines(), wipService.getActiveStyles()]);
      setLines(linesData);
      setStyles(stylesData);
      setError(null);
    } catch {
      setError("Could not load lines from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEditModal(line: WipLine) {
    setEditingId(line.id);
    setForm({
      name: line.name,
      current_style_id: line.current_style_id ?? "",
      upper_limit: String(line.upper_limit),
      lower_limit: String(line.lower_limit),
      u_color: line.u_color,
      m_color: line.m_color,
      l_color: line.l_color,
      is_active: line.is_active,
    });
    setShowModal(true);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const payload: WipLinePayload = {
      name: form.name,
      current_style_id: form.current_style_id === "" ? null : Number(form.current_style_id),
      upper_limit: Number(form.upper_limit) || 0,
      lower_limit: Number(form.lower_limit) || 0,
      u_color: form.u_color,
      m_color: form.m_color,
      l_color: form.l_color,
      is_active: form.is_active,
    };

    setSaving(true);
    try {
      if (editingId) {
        await wipService.updateLine(editingId, payload);
      } else {
        await wipService.createLine(payload);
      }
      setShowModal(false);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Failed to save the line.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(line: WipLine) {
    try {
      await wipService.toggleLineActive(line.id);
      await load();
    } catch {
      setError("Failed to toggle line status.");
    }
  }

  async function handleDelete(line: WipLine) {
    if (!confirm(`Delete "${line.name}"? This cannot be undone.`)) return;
    try {
      await wipService.deleteLine(line.id);
      await load();
    } catch {
      setError("Failed to delete the line.");
    }
  }

  return (
    <div className={`h-full w-full overflow-auto p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Production Setup</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Configure production lines, limits and live-board colors
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg dark:bg-orange-500 dark:text-white"
        >
          <Plus size={14} /> Add Production Line
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className={`flex items-center gap-2 text-sm ${muted}`}><Loader2 size={16} className="animate-spin" /> Loading lines…</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {lines.map((line) => (
            <div key={line.id} className={`rounded-2xl border p-6 ${card}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{line.name}</h3>
                  <p className="text-sm text-slate-400">{line.style?.name ?? "No style assigned"}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs ${line.is_active ? "bg-emerald-600/20 text-emerald-400" : "bg-slate-700 text-slate-300"}`}>
                    {line.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Upper Limit</p>
                  <p className="mt-1 font-medium">{line.upper_limit} pcs</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Lower Limit</p>
                  <p className="mt-1 font-medium">{line.lower_limit} pcs</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Balance</p>
                  <p className="mt-1 font-medium">{line.balance} pcs</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-slate-400">Colors:</span>
                {([["Upper", line.u_color], ["Mid", line.m_color], ["Lower", line.l_color]] as [string, string][]).map(([label, color]) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5 text-[10px]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => openEditModal(line)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={() => handleToggleActive(line)} className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm">
                  <Power size={14} /> {line.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(line)} className="inline-flex items-center justify-center gap-2 rounded-md border border-red-500/30 px-3 py-2 text-sm text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 text-slate-900 border border-slate-200 dark:bg-[#0b0b0b] dark:text-white dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Line" : "Create Line"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-1">
                <X />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Set up a production line with style, limits and live-board status colors
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold">Line Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Line 1, Assembly Line A"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Style</label>
                <select
                  value={form.current_style_id}
                  onChange={(e) => setForm({ ...form, current_style_id: e.target.value })}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="">No Style</option>
                  {styles.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Upper Limit</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.upper_limit}
                    onChange={(e) => setForm({ ...form, upper_limit: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Lower Limit</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.lower_limit}
                    onChange={(e) => setForm({ ...form, lower_limit: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Status Colors (live board)</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {([
                    ["u_color", "Above upper"],
                    ["m_color", "Healthy"],
                    ["l_color", "Below lower"],
                  ] as [keyof typeof form, string][]).map(([key, label]) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={form[key] as string}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="h-9 w-full rounded-md border border-slate-200 dark:border-white/10 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Line Status</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Line is active and operational
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-md px-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white disabled:opacity-60 inline-flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? "Save Changes" : "Create Line"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
