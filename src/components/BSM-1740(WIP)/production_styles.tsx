import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Plus, X, Edit2, Trash2, Loader2 } from "lucide-react";
import wipService, { type WipStyle, type WipStylePayload } from "../../api/wipService";

const emptyForm = { code: "", name: "", description: "", is_active: true };

export default function ProductionStyles() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [styles, setStyles] = useState<WipStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStyles(await wipService.getStyles());
      setError(null);
    } catch {
      setError("Could not load styles from the backend.");
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

  function openEditModal(style: WipStyle) {
    setEditingId(style.id);
    setForm({ code: style.code, name: style.name, description: style.description ?? "", is_active: style.is_active });
    setShowModal(true);
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const payload: WipStylePayload = {
      code: form.code,
      name: form.name,
      description: form.description || null,
      is_active: form.is_active,
    };

    setSaving(true);
    try {
      if (editingId) {
        await wipService.updateStyle(editingId, payload);
      } else {
        await wipService.createStyle(payload);
      }
      setShowModal(false);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Failed to save the style.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(style: WipStyle) {
    if (!confirm(`Delete style "${style.name}"? Lines using it will be unassigned.`)) return;
    try {
      await wipService.deleteStyle(style.id);
      await load();
    } catch {
      setError("Failed to delete the style.");
    }
  }

  return (
    <div className={`h-full w-full p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Style Configurations</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage style codes and assignment to production lines
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-orange-500 dark:text-white"
        >
          <Plus size={14} /> Add Style
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className={`rounded-2xl border ${card} overflow-hidden`}>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="px-6 py-4">Style Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Lines</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400"><Loader2 size={16} className="animate-spin inline mr-2" />Loading styles…</td></tr>
            ) : styles.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">No styles yet.</td></tr>
            ) : styles.map((s) => (
              <tr key={s.id} className="border-t border-white/5">
                <td className="px-6 py-4 text-sm text-slate-300">{s.code}</td>
                <td className="px-6 py-4 text-sm">{s.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{s.description || "—"}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{s.lines_count}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${s.is_active ? "bg-white/5 text-white" : "bg-slate-700 text-white"}`}>
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-3">
                  <button onClick={() => openEditModal(s)} className="p-2 rounded-md border">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(s)} className="p-2 rounded-md border">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 text-slate-900 border border-slate-200 dark:bg-[#0f0f10] dark:text-white dark:border-white/10 shadow-2xl ring-1 ring-white/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Style" : "Add Style"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-1">
                <X />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Style Code</label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="e.g., STY-011"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Style name"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Optional notes about this style"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <label className="text-sm font-semibold">Status</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Active</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-md px-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white disabled:opacity-60 inline-flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingId ? "Save Changes" : "Add Style"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
