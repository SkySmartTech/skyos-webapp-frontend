import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Edit2, Plus, X, Loader2, Trash2 } from "lucide-react";
import wipService, { type WipRole } from "../../api/wipService";

const accents = [
  "from-orange-500 to-amber-600",
  "from-cyan-500 to-sky-700",
  "from-emerald-500 to-green-700",
  "from-violet-500 to-purple-700",
  "from-rose-500 to-red-700",
  "from-blue-500 to-indigo-700",
];

const slugify = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "role";

export default function RolePermissions() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [roles, setRoles] = useState<WipRole[]>([]);
  const [catalog, setCatalog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form, setForm] = useState({ role_name: "", permissions: [] as string[] });

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const field = dark
    ? "border-white/10 bg-[#111111] text-white placeholder:text-slate-500"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, catalogData] = await Promise.all([
        wipService.getRoles(),
        wipService.getRolesPermissionsCatalog(),
      ]);
      setRoles(rolesData);
      setCatalog(catalogData);
      setError(null);
    } catch {
      setError("Could not load roles from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  function openCreateModal() {
    setEditingKey(null);
    setForm({ role_name: "", permissions: [] });
    setShowModal(true);
  }

  function openEditModal(role: WipRole) {
    setEditingKey(role.role_key);
    setForm({ role_name: role.role_name, permissions: [...role.permissions] });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function togglePermission(perm: string) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (form.permissions.length === 0) {
      setError("Select at least one permission.");
      return;
    }
    setSaving(true);
    try {
      if (editingKey) {
        await wipService.updateRole(editingKey, { role_name: form.role_name, permissions: form.permissions });
      } else {
        await wipService.createRole({
          role_key: slugify(form.role_name),
          role_name: form.role_name,
          permissions: form.permissions,
        });
      }
      setShowModal(false);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Failed to save the role.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(role: WipRole) {
    if (!confirm(`Delete role "${role.role_name}"?`)) return;
    try {
      await wipService.deleteRole(role.role_key);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Failed to delete the role.");
    }
  }

  return (
    <div className={`h-full w-full p-6 overflow-auto ${page}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">WIP System — Roles & Permissions</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Manage custom roles and their permissions for this module
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-black/10 dark:bg-white dark:text-slate-900"
        >
          <Plus size={14} /> Add Role
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className={`flex items-center gap-2 text-sm ${muted}`}><Loader2 size={16} className="animate-spin" /> Loading roles…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {roles.map((role, i) => (
            <article key={role.role_key} className={`rounded-3xl border p-6 shadow-sm shadow-black/5 ${card}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{role.role_name}</h2>
                  <p className={`text-sm ${muted}`}>{role.permissions.length} permission(s) granted</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(role)}
                    className={`rounded-lg border p-2 ${dark ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(role)}
                    className={`rounded-lg border p-2 ${dark ? "border-white/10 bg-white/5 text-red-400" : "border-slate-200 bg-slate-50 text-red-500"}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[1fr_auto] gap-y-3 text-sm">
                <span className={muted}>Users assigned</span>
                <span className={`rounded-full px-3 py-1 font-semibold justify-self-end ${dark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}>
                  {role.users_count}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {role.permissions.map((p) => (
                  <span key={p} className={`rounded-full px-2.5 py-1 text-[11px] ${dark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {p.replace("wip_system.", "")}
                  </span>
                ))}
              </div>

              <div className={`mt-5 h-1.5 rounded-full bg-linear-to-r ${accents[i % accents.length]}`} />
            </article>
          ))}
          {roles.length === 0 && (
            <p className={`text-sm ${muted}`}>No custom roles yet — add one to get started.</p>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
          <form
            onSubmit={handleSubmit}
            className={`relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border p-6 shadow-2xl ${dark ? "border-white/10 bg-[#f7f7f7] text-slate-900" : "border-slate-200 bg-white text-slate-900"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{editingKey ? "Edit Role" : "Add New Role"}</h2>
                <p className="text-sm text-slate-500">Create a role with custom permissions for the WIP System module</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-full p-1 text-slate-500 transition hover:bg-black/5 hover:text-slate-900">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Role Name</span>
                <input
                  required
                  value={form.role_name}
                  onChange={(e) => setForm((c) => ({ ...c, role_name: e.target.value }))}
                  placeholder="Enter role name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ring-0 ${field}`}
                />
              </label>
              <div>
                <p className="mb-3 text-sm font-semibold">Permissions</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {catalog.map((perm) => (
                    <label key={perm} className="flex items-center justify-between gap-4 text-sm font-medium">
                      <span>{perm}</span>
                      <button
                        type="button"
                        onClick={() => togglePermission(perm)}
                        className={`relative h-6 w-11 rounded-full border transition ${form.permissions.includes(perm) ? "border-orange-500 bg-orange-500" : "border-slate-300 bg-slate-200"}`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${form.permissions.includes(perm) ? "left-5" : "left-0.5"}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 inline-flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editingKey ? "Save Changes" : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
