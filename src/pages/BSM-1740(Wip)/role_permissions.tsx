import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Edit2, Plus, Settings2, X } from "lucide-react";

type RoleCard = {
  name: string;
  description: string;
  users: number;
  permissions: number;
  accent: string;
};

const roleCards: RoleCard[] = [
  {
    name: "Admin",
    description: "Full system access and control",
    users: 3,
    permissions: 45,
    accent: "from-orange-500 to-amber-600",
  },
  {
    name: "Manager",
    description: "Department management and reporting",
    users: 8,
    permissions: 32,
    accent: "from-slate-500 to-slate-700",
  },
  {
    name: "Developer",
    description: "Code access and deployment",
    users: 15,
    permissions: 28,
    accent: "from-cyan-500 to-sky-700",
  },
  {
    name: "Designer",
    description: "Design tools and assets",
    users: 6,
    permissions: 18,
    accent: "from-fuchsia-500 to-pink-700",
  },
  {
    name: "Analyst",
    description: "Insights and data review",
    users: 10,
    permissions: 20,
    accent: "from-emerald-500 to-green-700",
  },
  {
    name: "Support",
    description: "Customer issue handling",
    users: 12,
    permissions: 16,
    accent: "from-blue-500 to-indigo-700",
  },
  {
    name: "Viewer",
    description: "Read-only access across dashboards",
    users: 18,
    permissions: 8,
    accent: "from-zinc-400 to-zinc-700",
  },
  {
    name: "Finance",
    description: "Financial controls and approvals",
    users: 5,
    permissions: 22,
    accent: "from-violet-500 to-purple-700",
  },
  {
    name: "HR",
    description: "Employee and policy administration",
    users: 4,
    permissions: 19,
    accent: "from-rose-500 to-red-700",
  },
  {
    name: "Sales",
    description: "Commercial tracking and pipeline access",
    users: 9,
    permissions: 21,
    accent: "from-amber-500 to-orange-700",
  },
];

const permissionPresets = [
  "Read only",
  "Operations",
  "Manager level",
  "Admin level",
];

const quickPermissions = [
  "User Management",
  "Data Entry",
  "Reports Access",
  "Production Control",
];

export default function RolePermissions() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    level: permissionPresets[1],
    userManagement: false,
    dataEntry: false,
    reportsAccess: false,
    productionControl: false,
  });

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark
    ? "border-white/10 bg-[#0e0e0e]"
    : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const field = dark
    ? "border-white/10 bg-[#111111] text-white placeholder:text-slate-500"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";

  function closeModal() {
    setShowModal(false);
    setForm({
      name: "",
      description: "",
      level: permissionPresets[1],
      userManagement: false,
      dataEntry: false,
      reportsAccess: false,
      productionControl: false,
    });
  }

  return (
    <div className={`h-full w-full p-6 ${page}`}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Access Control</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Manage users, roles, and permissions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm shadow-black/10 dark:bg-white dark:text-slate-900"
        >
          <Plus size={14} />
          Add Role
        </button>
      </div>

      <div className="mb-4 inline-flex rounded-2xl border p-1 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-white/5">
        <button
          onClick={() => setActiveTab("roles")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "roles"
              ? "bg-zinc-800 text-white dark:bg-white dark:text-slate-900"
              : `${muted} hover:text-white dark:hover:text-white`
          }`}
        >
          Roles
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "permissions"
              ? "bg-zinc-800 text-white dark:bg-white dark:text-slate-900"
              : `${muted} hover:text-white dark:hover:text-white`
          }`}
        >
          Permissions
        </button>
      </div>

      {activeTab === "roles" ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {roleCards.map((role) => (
            <article
              key={role.name}
              className={`rounded-3xl border p-6 shadow-sm shadow-black/5 ${card}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {role.name}
                  </h2>
                  <p className={`text-lg ${muted}`}>{role.description}</p>
                </div>
                <button
                  className={`rounded-lg border p-2 ${dark ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                >
                  <Edit2 size={16} />
                </button>
              </div>

              <div className="mt-10 grid grid-cols-[1fr_auto] gap-y-3 text-sm">
                <span className={muted}>Users</span>
                <span
                  className={`rounded-full px-3 py-1 font-semibold ${dark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}
                >
                  {role.users}
                </span>
                <span className={muted}>Permissions</span>
                <span
                  className={`rounded-full px-3 py-1 font-semibold ${dark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900"}`}
                >
                  {role.permissions}
                </span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className={`w-full rounded-xl border py-2.5 text-sm font-semibold transition ${
                    dark
                      ? "border-white/10 bg-[#111111] text-white hover:bg-white/5"
                      : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Manage Permissions
                </button>
              </div>

              <div
                className={`mt-5 h-1.5 rounded-full bg-linear-to-r ${role.accent}`}
              />
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <article className={`rounded-3xl border p-6 ${card}`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${muted}`}>
              Quick Summary
            </p>
            <h2 className="mt-2 text-2xl font-bold">Role coverage</h2>
            <p className={`mt-2 text-sm ${muted}`}>
              Base access profiles for production and office users.
            </p>
          </article>
          <article className={`rounded-3xl border p-6 ${card}`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${muted}`}>
              Active roles
            </p>
            <h2 className="mt-2 text-2xl font-bold">10</h2>
            <p className={`mt-2 text-sm ${muted}`}>Admin through Sales</p>
          </article>
          <article className={`rounded-3xl border p-6 ${card}`}>
            <p className={`text-sm uppercase tracking-[0.3em] ${muted}`}>
              Policies
            </p>
            <h2 className="mt-2 text-2xl font-bold">4</h2>
            <p className={`mt-2 text-sm ${muted}`}>Preset access levels</p>
          </article>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              closeModal();
            }}
            className={`relative z-10 w-full max-w-xl rounded-3xl border p-6 shadow-2xl ${dark ? "border-white/10 bg-[#f7f7f7] text-slate-900" : "border-slate-200 bg-white text-slate-900"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Add New Role</h2>
                <p className="text-sm text-slate-500">
                  Create a new role with custom permissions
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-slate-500 transition hover:bg-black/5 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Role Name
                </span>
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter role name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ring-0 ${field}`}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Description
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe the role and its purpose"
                  rows={3}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ring-0 ${field}`}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Permission Level
                </span>
                <select
                  value={form.level}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      level: event.target.value,
                    }))
                  }
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ring-0 ${field}`}
                >
                  {permissionPresets.map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className="mb-3 text-sm font-semibold">Quick Permissions</p>
                <div className="space-y-3">
                  {quickPermissions.map((label) => {
                    const checkedKey =
                      label === "User Management"
                        ? "userManagement"
                        : label === "Data Entry"
                          ? "dataEntry"
                          : label === "Reports Access"
                            ? "reportsAccess"
                            : "productionControl";
                    const checked = form[
                      checkedKey as keyof typeof form
                    ] as boolean;

                    return (
                      <label
                        key={label}
                        className="flex items-center justify-between gap-4 text-sm font-medium"
                      >
                        <span>{label}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              [checkedKey]: !checked,
                            }))
                          }
                          className={`relative h-6 w-11 rounded-full border transition ${
                            checked
                              ? "border-orange-500 bg-orange-500"
                              : "border-slate-300 bg-slate-200"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                              checked ? "left-5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Role
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
