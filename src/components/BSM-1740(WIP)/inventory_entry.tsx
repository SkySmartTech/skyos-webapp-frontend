import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Plus, Filter, Download, Edit2, Trash2, Eye } from "lucide-react";

type InventoryEntry = { id: string; productName: string; category: string; price: number; quantity: number; date: string; status: "In Stock" | "Low Stock" };

const recentEntries: InventoryEntry[] = [
  { id: "ITM-1234", productName: "Whole Milk 1L", category: "Dairy", price: 3.99, quantity: 245, date: "2026-06-05", status: "In Stock" },
  { id: "ITM-1233", productName: "Fresh Bananas", category: "Produce", price: 2.49, quantity: 180, date: "2026-06-05", status: "In Stock" },
  { id: "ITM-1232", productName: "White Bread", category: "Groceries", price: 2.99, quantity: 150, date: "2026-06-05", status: "In Stock" },
  { id: "ITM-1231", productName: "Orange Juice 2L", category: "Beverages", price: 4.99, quantity: 95, date: "2026-06-04", status: "In Stock" },
  { id: "ITM-1230", productName: "Tomatoes 500g", category: "Produce", price: 3.49, quantity: 12, date: "2026-06-04", status: "Low Stock" },
  { id: "ITM-1229", productName: "Cheddar Cheese", category: "Dairy", price: 5.99, quantity: 78, date: "2026-06-04", status: "In Stock" },
  { id: "ITM-1228", productName: "Toilet Paper 12pk", category: "Household", price: 8.99, quantity: 165, date: "2026-06-03", status: "In Stock" },
  { id: "ITM-1227", productName: "Chicken Breast 1kg", category: "Frozen", price: 12.99, quantity: 45, date: "2026-06-03", status: "In Stock" },
  { id: "ITM-1226", productName: "Coca Cola 2L", category: "Beverages", price: 3.29, quantity: 220, date: "2026-06-02", status: "In Stock" },
  { id: "ITM-1225", productName: "Rice 5kg", category: "Groceries", price: 15.99, quantity: 88, date: "2026-06-02", status: "In Stock" },
];

export default function InventoryEntry() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ productName: "", category: "", price: "", quantity: "", description: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log("Form submitted:", formData); setFormData({ productName: "", category: "", price: "", quantity: "", description: "" }); };

  const page = dark ? "bg-[#070707] text-white" : "bg-[#f3f5f7] text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";
  const input = dark ? "bg-[#1a1a1a] border-white/10 text-white placeholder:text-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400";
  const muted = dark ? "text-slate-400" : "text-slate-500";
  const heading = dark ? "text-white" : "text-slate-900";
  const label = dark ? "text-slate-300" : "text-slate-700";
  const table = dark ? "border-white/10 bg-[#0b0b0b]" : "border-slate-200 bg-white";
  const tableHead = dark ? "bg-[#0b0b0b] border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700";
  const tableRow = dark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50";

  return (
    <div className={`h-full w-full overflow-hidden ${page}`}>
      <div className="flex h-full flex-col">
        <div className={`border-b px-6 py-5 ${dark ? "border-white/10" : "border-slate-200"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-black tracking-tight ${heading}`}>Inventory Entry</h1>
              <p className={`mt-1 text-sm ${muted}`}>Manage supermarket inventory and stock</p>
            </div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:translate-y-[-1px] hover:bg-slate-100 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400"><Plus size={16} /> Add New Item</button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className={`rounded-3xl border p-6 lg:col-span-1 ${card}`}>
              <h2 className={`mb-4 text-lg font-bold ${heading}`}>New Inventory Item</h2>
              <p className={`mb-6 text-sm ${muted}`}>Add a new item to supermarket inventory</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${label}`}>Product Name</label>
                  <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} placeholder="Enter product name" className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
                </div>
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${label}`}>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`}>
                    <option value="">Select category</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Household">Household</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${label}`}>Price</label>
                    <div className="relative"><span className={`absolute left-3 top-2.5 text-sm font-semibold ${muted}`}>$</span><input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" step="0.01" className={`w-full rounded-lg border pl-6 pr-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} /></div>
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm font-semibold ${label}`}>Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="0" className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
                  </div>
                </div>
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${label}`}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" rows={3} className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
                </div>
                <button type="submit" className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-slate-100 dark:bg-orange-500 dark:text-white dark:hover:bg-orange-400">Submit Entry</button>
              </form>
            </div>

            <div className={`rounded-3xl border p-6 lg:col-span-2 ${card}`}>
              <h2 className={`mb-6 text-lg font-bold ${heading}`}>Entry Statistics</h2>
              <div className="space-y-4">
                <div className={`rounded-xl border px-4 py-3 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                  <p className={`text-sm font-semibold ${muted}`}>Total Entries</p>
                  <p className={`mt-2 text-3xl font-black ${heading}`}>1,234</p>
                </div>
                <div className={`rounded-xl border px-4 py-3 ${dark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}>
                  <p className={`text-sm font-semibold ${muted}`}>Today's Entries</p>
                  <p className={`mt-2 text-3xl font-black text-orange-500`}>47</p>
                </div>
                <div className={`rounded-xl border px-4 py-3 ${dark ? "border-orange-500/15 bg-orange-500/5" : "border-orange-200 bg-orange-50"}`}>
                  <p className={`text-sm font-semibold ${muted}`}>Pending Review</p>
                  <p className={`mt-2 text-3xl font-black text-orange-500`}>12</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`mt-5 rounded-3xl border ${card}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-white/10" : "border-slate-200"}`}>
              <div className="flex items-center justify-between gap-3">
                <h2 className={`text-lg font-bold ${heading}`}>Recent Entries (10 Examples)</h2>
                <div className="flex items-center gap-2">
                  <button className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${dark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}><Filter size={16} /> Filter</button>
                  <button className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${dark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}><Download size={16} /> Export</button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${tableHead}`}>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry) => (
                    <tr key={entry.id} className={`border-b transition ${tableRow}`}>
                      <td className={`px-6 py-3 text-sm font-medium text-orange-500`}>{entry.id}</td>
                      <td className={`px-6 py-3 text-sm ${heading}`}>{entry.productName}</td>
                      <td className={`px-6 py-3 text-sm ${muted}`}>{entry.category}</td>
                      <td className={`px-6 py-3 text-sm font-semibold ${heading}`}>${entry.price.toFixed(2)}</td>
                      <td className={`px-6 py-3 text-sm font-semibold ${heading}`}>{entry.quantity}</td>
                      <td className={`px-6 py-3 text-sm ${muted}`}>{entry.date}</td>
                      <td className={`px-6 py-3 text-sm`}><span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${entry.status === "In Stock" ? "bg-white text-slate-900 dark:bg-slate-900 dark:text-white" : "bg-red-500 text-white"}`}>{entry.status}</span></td>
                      <td className={`px-6 py-3 text-sm`}>
                        <div className="flex items-center gap-2">
                          <button className={`rounded p-1 transition ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}><Eye size={16} className={muted} /></button>
                          <button className={`rounded p-1 transition ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}><Edit2 size={16} className={muted} /></button>
                          <button className={`rounded p-1 transition ${dark ? "hover:bg-red-500/20" : "hover:bg-red-100"}`}><Trash2 size={16} className="text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${card}`}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className={`text-xl font-bold ${heading}`}>Add New Inventory Item</h2>
                <p className={`mt-1 text-sm ${muted}`}>Add a new product to the supermarket inventory</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`rounded-lg p-1 transition ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}>✕</button>
            </div>

            <form onSubmit={(e) => { handleSubmit(e); setShowModal(false); }} className="space-y-4">
              <div>
                <label className={`mb-2 block text-sm font-semibold ${label}`}>Product Name</label>
                <input type="text" placeholder="Enter product name" className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
              </div>
              <div>
                <label className={`mb-2 block text-sm font-semibold ${label}`}>Category</label>
                <select className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`}>
                  <option>Select category</option>
                  <option>Dairy</option>
                  <option>Produce</option>
                  <option>Groceries</option>
                  <option>Beverages</option>
                  <option>Household</option>
                  <option>Frozen</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${label}`}>Price</label>
                  <div className="relative"><span className={`absolute left-3 top-2.5 text-sm font-semibold ${muted}`}>$</span><input type="number" placeholder="0.00" step="0.01" className={`w-full rounded-lg border pl-6 pr-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} /></div>
                </div>
                <div>
                  <label className={`mb-2 block text-sm font-semibold ${label}`}>Quantity</label>
                  <input type="number" placeholder="0" className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
                </div>
              </div>
              <div>
                <label className={`mb-2 block text-sm font-semibold ${label}`}>Description</label>
                <textarea placeholder="Enter product description" rows={3} className={`w-full rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${input}`} />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${dark ? "border-white/10 bg-white/5 text-white hover:bg-white/10" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100"}`}>Cancel</button>
                <button type="submit" className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-400">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
