import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Edit2, Settings, Plus, X } from "lucide-react";

type Line = {
  id: number;
  title: string;
  code: string;
  type: string;
  upperLimit: number;
  lowerLimit: number;
  efficiency: string;
  active: boolean;
};

export default function ProductionSetup() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [showModal, setShowModal] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    {
      id: 1,
      title: "Checkout Line 1",
      code: "LINE-001",
      type: "Express",
      upperLimit: 1500,
      lowerLimit: 500,
      efficiency: "94%",
      active: true,
    },
    {
      id: 2,
      title: "Checkout Line 2",
      code: "LINE-002",
      type: "Standard",
      upperLimit: 1200,
      lowerLimit: 400,
      efficiency: "91%",
      active: true,
    },
    {
      id: 3,
      title: "Self-Checkout 1",
      code: "LINE-003",
      type: "Self-Service",
      upperLimit: 800,
      lowerLimit: 300,
      efficiency: "97%",
      active: true,
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    type: "",
    upperLimit: "",
    lowerLimit: "",
    active: true,
  });

  const page = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  function openModal() {
    setForm({ title: "", type: "", upperLimit: "", lowerLimit: "", active: true });
    setShowModal(true);
  }

  function handleAddLine(e?: React.FormEvent) {
    e?.preventDefault();
    const id = Date.now();
    const newLine: Line = {
      id,
      title: form.title || `Line ${lines.length + 1}`,
      code: `LINE-${String(id).slice(-3)}`,
      type: form.type || "Standard",
      upperLimit: Number(form.upperLimit) || 0,
      lowerLimit: Number(form.lowerLimit) || 0,
      efficiency: "0%",
      active: form.active,
    };
    setLines((s) => [newLine, ...s]);
    setShowModal(false);
  }

  return (
    <div className={`h-full w-full overflow-auto p-6 ${page}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Production Setup</h1>
          <p className={`mt-1 text-sm ${muted}`}>Configure production lines and styles</p>
        </div>
        <button onClick={openModal} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg dark:bg-orange-500 dark:text-white">
          <Plus size={14} /> Add Production Line
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {lines.map((line) => (
          <div key={line.id} className={`rounded-2xl border p-6 ${card}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{line.title}</h3>
                <p className="text-sm text-slate-400">{line.code} • {line.type}</p>
              </div>
              <div className="text-right">
                {line.active && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">Active</span>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Upper Limit</p>
                <p className="mt-1 font-medium">{line.upperLimit} items/day</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Lower Limit</p>
                <p className="mt-1 font-medium">{line.lowerLimit} items/day</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Efficiency</p>
                <p className="mt-1 font-medium">{line.efficiency}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm">
                <Edit2 size={14} /> Edit
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm">
                <Settings size={14} /> Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <form
            onSubmit={handleAddLine}
            className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 text-slate-900 border border-slate-200 dark:bg-[#0b0b0b] dark:text-white dark:border-white/10"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Line</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-1">
                <X />
              </button>
            </div>

            <p className="mt-2 text-sm text-slate-500">Set up a new production line with style, limits and status colors</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold">Line Name</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Line 1, Assembly Line A"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Style</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="">No Style</option>
                  <option value="Express">Express</option>
                  <option value="Standard">Standard</option>
                  <option value="Self-Service">Self-Service</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Upper Limit</label>
                  <input
                    value={form.upperLimit}
                    onChange={(e) => setForm({ ...form, upperLimit: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Lower Limit</label>
                  <input
                    value={form.lowerLimit}
                    onChange={(e) => setForm({ ...form, lowerLimit: e.target.value })}
                    className="mt-2 w-full rounded-lg border px-3 py-2 text-sm bg-transparent border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Line Status</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="accent-orange-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Line is active and operational</span>
                </label>
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
              <button type="submit" className="rounded-md bg-orange-600 px-4 py-2 text-sm text-white">Create Line</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
