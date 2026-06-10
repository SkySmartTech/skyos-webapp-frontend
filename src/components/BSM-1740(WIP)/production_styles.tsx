import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Plus, X, Edit2, Trash2 } from "lucide-react";

type Style = { id: number; code: string; name: string; type: string; color: string; material: string; status: "Active" | "Limited" | "Archived" };

const initialStyles: Style[] = [
  { id: 1, code: "STY-001", name: "Classic Black", type: "Standard", color: "Black", material: "Cotton", status: "Active" },
  { id: 2, code: "STY-002", name: "Navy Blue Pro", type: "Premium", color: "Navy", material: "Polyester", status: "Active" },
  { id: 3, code: "STY-003", name: "Red Sport", type: "Athletic", color: "Red", material: "Mesh", status: "Active" },
  { id: 4, code: "STY-004", name: "White Essential", type: "Standard", color: "White", material: "Cotton", status: "Active" },
  { id: 5, code: "STY-005", name: "Gray Deluxe", type: "Premium", color: "Gray", material: "Wool Blend", status: "Active" },
  { id: 6, code: "STY-006", name: "Green Eco", type: "Sustainable", color: "Green", material: "Recycled", status: "Active" },
  { id: 7, code: "STY-007", name: "Blue Comfort", type: "Casual", color: "Light Blue", material: "Cotton", status: "Active" },
  { id: 8, code: "STY-008", name: "Purple Elite", type: "Premium", color: "Purple", material: "Silk Blend", status: "Limited" },
  { id: 9, code: "STY-009", name: "Orange Active", type: "Athletic", color: "Orange", material: "Performance", status: "Active" },
  { id: 10, code: "STY-010", name: "Charcoal Pro", type: "Professional", color: "Charcoal", material: "Wool", status: "Active" },
];

export default function ProductionStyles() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [styles, setStyles] = useState<Style[]>(initialStyles);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", type: "", color: "", material: "", status: "Active" });

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";

  function addStyle(e?: React.FormEvent) {
    e?.preventDefault();
    const id = Date.now();
    setStyles((s) => [
      { id, code: form.code || `STY-${String(id).slice(-3)}`, name: form.name, type: form.type, color: form.color, material: form.material, status: form.status as any },
      ...s,
    ]);
    setShowModal(false);
    setForm({ code: "", name: "", type: "", color: "", material: "", status: "Active" });
  }

  return (
    <div className={`h-full w-full p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Style Configurations (10 Examples)</h1>
          <p className="mt-1 text-sm text-slate-500">Manage style codes, materials and status</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-orange-500 dark:text-white"><Plus size={14} /> Add Style</button>
      </div>

      <div className={`rounded-2xl border ${card} overflow-hidden`}>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-400">
              <th className="px-6 py-4">Style Code</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Color</th>
              <th className="px-6 py-4">Material</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {styles.map((s) => (
              <tr key={s.id} className="border-t border-white/5">
                <td className="px-6 py-4 text-sm text-slate-300">{s.code}</td>
                <td className="px-6 py-4 text-sm">{s.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{s.type}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{s.color}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{s.material}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs ${s.status === "Active" ? "bg-white/5 text-white" : "bg-slate-700 text-white"}`}>{s.status}</span></td>
                <td className="px-6 py-4 text-sm flex items-center gap-3"><button className="p-2 rounded-md border"><Edit2 size={14} /></button><button className="p-2 rounded-md border"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <form onSubmit={addStyle} className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-6 text-slate-900 border border-slate-200 dark:bg-[#0f0f10] dark:text-white dark:border-white/10 shadow-2xl ring-1 ring-white/5">
            <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Add Style</h2><button type="button" onClick={() => setShowModal(false)} className="rounded-full p-1"><X /></button></div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold">Style Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="e.g., STY-011" /></div>
              <div><label className="text-sm font-semibold">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="Style name" /></div>
              <div><label className="text-sm font-semibold">Type</label><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="Standard / Premium" /></div>
              <div><label className="text-sm font-semibold">Color</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="e.g., Black" /></div>
              <div><label className="text-sm font-semibold">Material</label><input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="e.g., Cotton" /></div>
              <div><label className="text-sm font-semibold">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"><option>Active</option><option>Limited</option><option>Archived</option></select></div>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowModal(false)} className="rounded-md px-4 py-2 text-sm bg-transparent border border-slate-200 dark:border-white/10">Cancel</button><button type="submit" className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white">Add Style</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
