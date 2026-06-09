import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { UserPlus, X, Edit2, Trash2 } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  lastActive: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Admin",
    department: "IT",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Manager",
    department: "Sales",
    status: "Active",
    lastActive: "15 min ago",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    role: "Developer",
    department: "Engineering",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "Designer",
    department: "Creative",
    status: "Active",
    lastActive: "3 hours ago",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.w@company.com",
    role: "Manager",
    department: "Operations",
    status: "Active",
    lastActive: "5 hours ago",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.a@company.com",
    role: "Analyst",
    department: "Finance",
    status: "Active",
    lastActive: "1 day ago",
  },
  {
    id: 7,
    name: "David Lee",
    email: "david.lee@company.com",
    role: "Developer",
    department: "Engineering",
    status: "Away",
    lastActive: "2 days ago",
  },
  {
    id: 8,
    name: "Jennifer Brown",
    email: "jen.brown@company.com",
    role: "Support",
    department: "Customer Service",
    status: "Active",
    lastActive: "30 min ago",
  },
  {
    id: 9,
    name: "James Taylor",
    email: "james.t@company.com",
    role: "Manager",
    department: "Marketing",
    status: "Active",
    lastActive: "4 hours ago",
  },
  {
    id: 10,
    name: "Maria Garcia",
    email: "maria.g@company.com",
    role: "Viewer",
    department: "HR",
    status: "Inactive",
    lastActive: "1 week ago",
  },
];

export default function AccessUsers() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark
    ? "border-white/10 bg-[#0e0e0e]"
    : "border-slate-200 bg-white";

  function addUser(e?: React.FormEvent) {
    e?.preventDefault();
    const id = Date.now();
    setUsers((s) => [
      {
        id,
        name: form.name || "New User",
        email: form.email || "",
        role: form.role || "Viewer",
        department: form.department || "",
        status: form.status,
        lastActive: "just now",
      },
      ...s,
    ]);
    setShowModal(false);
    setForm({
      name: "",
      email: "",
      role: "",
      department: "",
      status: "Active",
    });
  }

  return (
    <div className={`h-full w-full p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Access Control</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles, and permissions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-orange-500 dark:text-white"
        >
          <UserPlus size={14} /> Add User
        </button>
      </div>

      <div className={`rounded-2xl border ${card} overflow-hidden`}>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-semibold">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm">{u.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {u.department}
                </td>
                <td className="px-6 py-4 text-sm">
                  {u.status === "Active" ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-700 px-3 py-1 text-xs">
                      {u.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {u.lastActive}
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-3">
                  <button className="p-2 rounded-md border">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-2 rounded-md border">
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
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <form
            onSubmit={addUser}
            className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 text-slate-900 border border-slate-200 dark:bg-[#0f0f10] dark:text-white dark:border-white/10 shadow-2xl ring-1 ring-white/5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1"
              >
                <X />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Create a new user account with role and permissions
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@company.com"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="">Select role</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Developer</option>
                    <option>Support</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  >
                    <option value="">Select department</option>
                    <option>IT</option>
                    <option>Sales</option>
                    <option>Engineering</option>
                    <option>Creative</option>
                    <option>Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option>Active</option>
                  <option>Away</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md px-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
