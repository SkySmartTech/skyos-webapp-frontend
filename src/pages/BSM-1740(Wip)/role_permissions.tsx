import { useTheme } from "../../context/ThemeContext";
import { ShieldCheck, LockKeyhole, Settings2, Users2 } from "lucide-react";

type PermissionGroup = {
  title: string;
  description: string;
  items: string[];
  icon: typeof ShieldCheck;
};

const permissionGroups: PermissionGroup[] = [
  {
    title: "Admin Roles",
    description: "Full access to manage system users and settings.",
    items: ["Create users", "Assign roles", "Edit permissions", "View audits"],
    icon: ShieldCheck,
  },
  {
    title: "Operations",
    description: "Access to day-to-day access control workflows.",
    items: ["View users", "Update status", "Reset passwords", "Review access logs"],
    icon: Users2,
  },
  {
    title: "Security Policies",
    description: "Define restrictions and approval flow for access changes.",
    items: ["MFA required", "Approval routing", "Session timeout", "Change history"],
    icon: LockKeyhole,
  },
];

export default function RolePermissions() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`h-full w-full p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Role & Permissions</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            Configure access levels, policies, and approval rules.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-orange-500 dark:text-white">
          <Settings2 size={14} />
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {permissionGroups.map((group) => {
          const Icon = group.icon;
          return (
            <article key={group.title} className={`rounded-2xl border p-5 ${card}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl border p-3 ${dark ? "border-white/10 bg-white/5 text-orange-400" : "border-slate-200 bg-slate-50 text-orange-600"}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{group.title}</h2>
                      <p className={`text-sm ${muted}`}>{group.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${dark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
