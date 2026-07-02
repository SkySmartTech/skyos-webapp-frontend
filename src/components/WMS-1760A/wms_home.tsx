import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Search,
  X,
  AlertTriangle,
  Wrench,
  Tag,
  Building2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  createBreakdown,
  createBuildingMaintenance,
  createOtherProject,
  createPlannedMaintenance,
  createRedTag,
  getBreakdowns,
  type BreakdownPayload,
  type BreakdownWorkOrder,
} from "../../api/workOrderService";

// ─── Types ────────────────────────────────────────────────────────────────────

type WOStatus = "New" | "Inprogress" | "Closed";
type WOCategory =
  | "BreakDown"
  | "BuildingMaintenance"
  | "OtherProject"
  | "PlannedMaintenance"
  | "RedTag";

interface WorkOrder {
  id: number;
  wo: string;
  time: string;
  department: string;
  by: string;
  category: WOCategory;
  description: string;
  status: WOStatus;
  reOpen?: boolean;
  machine?: string;
  engagedMechanics: {
    epf: string;
    name: string;
    contact: string;
    duration: string;
  }[];
  allocatedMechanics: string[];
  eventLog: { text: string }[];
}

interface AllocateMechanic {
  epf: string;
  name: string;
  contact: string;
  startTime: string;
  endTime: string;
  duration: string;
}
interface ListMechanic {
  epf: string;
  name: string;
  contact: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const chartData = [
  {
    date: "05/01",
    placed: 8,
    completed: 5,
    placedBD: 3,
    completedBD: 2,
    duration: 120,
  },
  {
    date: "05/11",
    placed: 12,
    completed: 9,
    placedBD: 5,
    completedBD: 4,
    duration: 180,
  },
  {
    date: "05/23",
    placed: 18,
    completed: 14,
    placedBD: 8,
    completedBD: 6,
    duration: 240,
  },
  {
    date: "05/25",
    placed: 15,
    completed: 11,
    placedBD: 6,
    completedBD: 5,
    duration: 160,
  },
  {
    date: "05/27",
    placed: 22,
    completed: 17,
    placedBD: 10,
    completedBD: 8,
    duration: 300,
  },
  {
    date: "06/02",
    placed: 19,
    completed: 15,
    placedBD: 7,
    completedBD: 6,
    duration: 200,
  },
  {
    date: "06/04",
    placed: 25,
    completed: 20,
    placedBD: 12,
    completedBD: 10,
    duration: 350,
  },
  {
    date: "06/06",
    placed: 16,
    completed: 12,
    placedBD: 5,
    completedBD: 4,
    duration: 140,
  },
  {
    date: "06/08",
    placed: 20,
    completed: 16,
    placedBD: 8,
    completedBD: 7,
    duration: 220,
  },
  {
    date: "06/10",
    placed: 28,
    completed: 22,
    placedBD: 14,
    completedBD: 11,
    duration: 400,
  },
  {
    date: "06/12",
    placed: 24,
    completed: 19,
    placedBD: 10,
    completedBD: 9,
    duration: 280,
  },
  {
    date: "06/14",
    placed: 30,
    completed: 25,
    placedBD: 15,
    completedBD: 12,
    duration: 420,
  },
  {
    date: "06/16",
    placed: 14,
    completed: 10,
    placedBD: 4,
    completedBD: 3,
    duration: 100,
  },
  {
    date: "06/18",
    placed: 9,
    completed: 3,
    placedBD: 3,
    completedBD: 1,
    duration: 190,
  },
];

const LIST_MECHANICS: ListMechanic[] = [
  { epf: "54", name: "Nishan Costa", contact: "0772655052" },
  { epf: "55", name: "Ruwan", contact: "0772655053" },
  { epf: "86", name: "Ajith Priyananda", contact: "0772655056" },
  { epf: "107", name: "Aravinda", contact: "0772655066" },
  { epf: "133", name: "Janaka", contact: "0772655078" },
  { epf: "152", name: "Bodhinayaka", contact: "0772410470" },
  { epf: "322", name: "Suranga", contact: "0772655124" },
  { epf: "420", name: "Francis", contact: "0772985168" },
];

const ALREADY_ALLOCATED: AllocateMechanic[] = [
  {
    epf: "420",
    name: "Francis",
    contact: "0772985168",
    startTime: "26-06-19 08:02",
    endTime: "26-06-19 08:03",
    duration: "1",
  },
];

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Finishing",
  "Knitting",
  "DryFinishing",
  "Dyeing",
  "RM_Warehouse",
];
const MACHINE_CATEGORIES = ["JL", "SC", "SB", "TX", "MJ", "ML", "SD", "GI"];
const FAULT_TYPES = ["Electrical", "Mechanical", "Pneumatic", "NA"];
const FAULT_LEVELS = [
  "High Temperature",
  "Low Pressure",
  "Vibration",
  "Noise",
  "Other",
];
const CATEGORIES = [
  "Fabrication",
  "Civil",
  "Electrical",
  "Mechanical",
  "Other",
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: WOStatus }) {
  const map: Record<WOStatus, string> = {
    New: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300",
    Inprogress: "bg-blue-400/20 text-blue-700 dark:text-blue-300",
    Closed: "bg-green-400/20 text-green-700 dark:text-green-300",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className={`w-full max-w-lg rounded-xl shadow-2xl ${dark ? "bg-[#111827] text-white" : "bg-white text-gray-900"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600 rounded-t-xl">
          <h2 className="font-bold text-white text-base">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function BreakdownModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wo: BreakdownWorkOrder) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const [cat, setCat] = useState("");
  const [machineNo, setMachineNo] = useState("");
  const [faultType, setFaultType] = useState("");
  const [faultLevel, setFaultLevel] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dt] = useState(() => new Date().toLocaleString());

  const handleSubmit = async () => {
    if (!cat || !machineNo || !faultType || !faultLevel || !description.trim())
      return;

    const payload: BreakdownPayload = {
      department: "Engineering",
      machine_category: cat,
      machine_number: machineNo,
      fault_type: faultType,
      fault_level: faultLevel,
      description: description.trim(),
      note: note.trim(),
    };

    setSubmitting(true);
    try {
      const created = await createBreakdown(payload);
      onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to create breakdown", error);
      alert(
        "Failed to submit breakdown. Please verify your network/session and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Report a Breakdown" onClose={onClose}>
      <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        User's Department : Engineering
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Machine Category
          </label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select data</option>
            {MACHINE_CATEGORIES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Machine No</label>
          <select
            value={machineNo}
            onChange={(e) => setMachineNo(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select</option>
            {cat &&
              [1, 2, 3, 4, 5].map((n) => (
                <option key={n}>
                  {cat} 0{n}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Fault Type</label>
          <select
            value={faultType}
            onChange={(e) => setFaultType(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select</option>
            {FAULT_TYPES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">
            Fault Level
          </label>
          <select
            value={faultLevel}
            onChange={(e) => setFaultLevel(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select</option>
            {FAULT_LEVELS.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          readOnly
          value={dt}
          className={`rounded-lg border px-2.5 py-2 text-sm ${inp}`}
        />
        <input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`rounded-lg border px-2.5 py-2 text-sm ${inp}`}
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the breakdown issue"
          className={`w-full rounded-lg border px-2.5 py-2 text-sm resize-none ${inp}`}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function BuildingMaintenanceModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wo: BreakdownWorkOrder) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const [category, setCategory] = useState("Fabrication");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dt] = useState(() => new Date().toLocaleString());

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setSubmitting(true);

    try {
      const created = await createBuildingMaintenance({
        department: "Engineering",
        category,
        description: description.trim(),
        note: note.trim() || undefined,
      });

      onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to submit building maintenance request", error);
      alert("Unable to submit building maintenance request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Request Building Maintenance" onClose={onClose}>
      <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        User's Department : Engineering
      </p>
      <input
        readOnly
        value={dt}
        className={`w-full rounded-lg border px-2.5 py-2 text-sm mb-3 ${inp}`}
      />
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">
          Select the Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          placeholder="Additional details (optional)"
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-1">
          Write Description Here
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm resize-none ${inp}`}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

const RED_TAG_CATEGORIES = [
  "Safety",
  "Leakages",
  "Worn Out or Broken Part",
  "Unusual Vibration/Heat",
  "Hard to Clean Area",
  "Other",
];

function RedTagModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wo: BreakdownWorkOrder) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const [redTagCategory, setRedTagCategory] = useState(RED_TAG_CATEGORIES[0]);
  const [machineCategory, setMachineCategory] = useState(MACHINE_CATEGORIES[0]);
  const [machineNumber, setMachineNumber] = useState("");
  const [faultType, setFaultType] = useState(FAULT_TYPES[0]);
  const [faultLevel, setFaultLevel] = useState(FAULT_LEVELS[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dt] = useState(() => new Date().toLocaleString());

  const handleSubmit = async () => {
    if (
      !redTagCategory ||
      !machineCategory ||
      !machineNumber ||
      !faultType ||
      !faultLevel
    )
      return;

    setSubmitting(true);

    try {
      const created = await createRedTag({
        department: "Engineering",
        red_tag_category: redTagCategory,
        machine_category: machineCategory,
        machine_number: machineNumber,
        fault_type: faultType,
        fault_level: faultLevel,
        note: note.trim() || undefined,
      });

      onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to submit red tag request", error);
      alert("Unable to submit red tag request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Request a RedTag Service" onClose={onClose}>
      <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        User's Department : Engineering
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Red Tag Category
          </label>
          <select
            value={redTagCategory}
            onChange={(e) => setRedTagCategory(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            {RED_TAG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">
            Machine Category
          </label>
          <select
            value={machineCategory}
            onChange={(e) => setMachineCategory(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            {MACHINE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">Machine No</label>
          <input
            value={machineNumber}
            onChange={(e) => setMachineNumber(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
            placeholder="Select machine"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Fault Type</label>
          <select
            value={faultType}
            onChange={(e) => setFaultType(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            {FAULT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Fault Level
          </label>
          <select
            value={faultLevel}
            onChange={(e) => setFaultLevel(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            {FAULT_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Date</label>
          <input
            readOnly
            value={dt}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          placeholder="Note"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function OtherProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wo: BreakdownWorkOrder) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const [projectCategory, setProjectCategory] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dt] = useState(() => new Date().toLocaleString());

  const handleSubmit = async () => {
    if (!projectCategory.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const created = await createOtherProject({
        department: "Engineering",
        project_category: projectCategory.trim(),
        description: description.trim(),
        note: note.trim() || undefined,
      });
      onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to submit other project request", error);
      alert("Unable to submit other project request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Request Other Project" onClose={onClose}>
      <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        User's Department : Engineering
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Project Category
          </label>
          <input
            value={projectCategory}
            onChange={(e) => setProjectCategory(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
            placeholder="e.g. Special Repair"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Date</label>
          <input
            readOnly
            value={dt}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm resize-none ${inp}`}
          placeholder="Enter the other project details"
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-semibold mb-1">Note</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          placeholder="Optional note"
        />
      </div>
      <div
        className={`rounded-lg border p-3 mb-4 ${
          dark ? "border-[#334155] bg-[#111827]" : "border-gray-200 bg-gray-50"
        }`}
      >
        <p className="text-xs font-semibold mb-2">Preview</p>
        <div className={`text-xs ${dark ? "text-gray-200" : "text-gray-700"}`}>
          <p>Project Category: {projectCategory || "-"}</p>
          <p>Description: {description || "-"}</p>
          <p>Note: {note || "-"}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function PlannedMaintenanceModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (wo: BreakdownWorkOrder) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const [machineCategory, setMachineCategory] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dt] = useState(() => new Date().toLocaleString());

  const handleSubmit = async () => {
    if (!machineCategory || !machineNumber) return;

    setSubmitting(true);

    try {
      const created = await createPlannedMaintenance({
        department: "Engineering",
        machine_category: machineCategory,
        machine_number: machineNumber,
        note: note.trim() || undefined,
      });

      onCreated(created);
      onClose();
    } catch (error) {
      console.error("Failed to submit planned maintenance request", error);
      alert("Unable to submit planned maintenance request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Request a Planned Maintenance" onClose={onClose}>
      <p className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        User's Department : Engineering
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold mb-1">
            Machine Category
          </label>
          <select
            value={machineCategory}
            onChange={(e) => setMachineCategory(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select data</option>
            {MACHINE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Machine No</label>
          <select
            value={machineNumber}
            onChange={(e) => setMachineNumber(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          >
            <option value="">Select data</option>
            {machineCategory &&
              [1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={`${machineCategory} 0${value}`}>
                  {`${machineCategory} 0${value}`}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <input
            readOnly
            value={dt}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
          />
        </div>
        <div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`w-full rounded-lg border px-2.5 py-2 text-sm ${inp}`}
            placeholder="Note"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
}

function WorkOrderDetailsModal({
  wo,
  onClose,
  onAllocate,
}: {
  wo: WorkOrder;
  onClose: () => void;
  onAllocate: () => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const tbl = dark
    ? "bg-[#1e293b] border-[#334155]"
    : "bg-teal-600 border-teal-700";
  const row = dark
    ? "border-[#334155] text-gray-300"
    : "border-gray-200 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className={`w-full max-w-2xl rounded-xl shadow-2xl ${dark ? "bg-[#111827] text-white" : "bg-white text-gray-900"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600 rounded-t-xl">
          <h2 className="font-bold text-white text-base">Work Order Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-6">
            {/* Left */}
            <div>
              <h3 className="font-semibold text-teal-500 text-sm mb-3">
                Work Order Details
              </h3>
              <div
                className={`text-xs space-y-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <div className="flex gap-2">
                  <span className="font-semibold w-20 shrink-0">WO Number</span>
                  <span>: {wo.wo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-20 shrink-0">Date</span>
                  <span>: {wo.time}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-20 shrink-0">Problem</span>
                  <span>
                    : {wo.category} [{wo.department}]
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold w-20 shrink-0">Machine</span>
                  <span>: {wo.machine}</span>
                </div>
              </div>

              {/* Engaged Mechanics */}
              <h3 className="font-semibold text-sm mt-4 mb-2">
                Engaged Mechanics
              </h3>
              <table className="w-full text-xs rounded-lg overflow-hidden">
                <thead>
                  <tr className={`${tbl} text-white`}>
                    <th className="px-2 py-1.5 text-left font-semibold">EPF</th>
                    <th className="px-2 py-1.5 text-left font-semibold">
                      Name
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold">
                      Contact
                    </th>
                    <th className="px-2 py-1.5 text-left font-semibold">
                      Duration(Min)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wo.engagedMechanics.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className={`text-center py-3 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    wo.engagedMechanics.map((m, i) => (
                      <tr key={i} className={`border-t ${row}`}>
                        <td className="px-2 py-1.5">{m.epf}</td>
                        <td className="px-2 py-1.5">{m.name}</td>
                        <td className="px-2 py-1.5">{m.contact}</td>
                        <td className="px-2 py-1.5">{m.duration}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Event Log */}
              <h3 className="font-semibold text-sm mt-4 mb-2">Event Log</h3>
              <div
                className={`text-xs space-y-1 ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                {wo.eventLog.map((e, i) => (
                  <p key={i}>{e.text}</p>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Chat History</h3>
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">
                  Allocated Mechanics
                </h3>
                <div
                  className={`text-xs space-y-1 ${dark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {wo.allocatedMechanics.length === 0 ? (
                    <p className={dark ? "text-gray-500" : "text-gray-400"}>
                      None allocated
                    </p>
                  ) : (
                    wo.allocatedMechanics.map((m, i) => <p key={i}>{m}</p>)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onAllocate}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Allocate MC
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              Check In
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              Close WO
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              <CheckCircle size={12} /> Verify
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              <RotateCcw size={12} /> Re-Open
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              <MessageSquare size={12} /> Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocateModal({
  wo,
  onClose,
}: {
  wo: WorkOrder;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white"
    : "bg-gray-50 border-gray-200 text-gray-900";
  const tblHead = "bg-teal-600 text-white";
  const row = dark
    ? "border-[#334155] text-gray-300"
    : "border-gray-200 text-gray-700";
  const [dt] = useState(() => new Date().toLocaleString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        className={`w-full max-w-3xl rounded-xl shadow-2xl ${dark ? "bg-[#111827] text-white" : "bg-white text-gray-900"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600 rounded-t-xl">
          <h2 className="font-bold text-white text-base">
            Work Order Allocate
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-6">
          {/* Left */}
          <div>
            <div
              className={`text-xs space-y-1.5 mb-4 ${dark ? "text-gray-300" : "text-gray-700"}`}
            >
              <div className="flex gap-2">
                <span className="font-semibold w-20 shrink-0">WO Number</span>
                <span>: {wo.wo}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20 shrink-0">Date</span>
                <span>: {wo.time}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20 shrink-0">Problem</span>
                <span>
                  : {wo.category} [{wo.department}]
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold w-20 shrink-0">Machine</span>
                <span>: {wo.machine}</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">
                Allocate Start
              </label>
              <input
                readOnly
                value={dt}
                className={`w-full rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">
                Allocate End
              </label>
              <input
                readOnly
                value={dt}
                className={`w-full rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
              />
            </div>

            <h3 className="font-semibold text-sm mb-2">
              Already Allocated Mechanics
            </h3>
            <table className="w-full text-xs rounded-lg overflow-hidden">
              <thead>
                <tr className={tblHead}>
                  <th className="px-2 py-1.5 text-left">EPF</th>
                  <th className="px-2 py-1.5 text-left">Name</th>
                  <th className="px-2 py-1.5 text-left">Contact</th>
                  <th className="px-2 py-1.5 text-left">Start</th>
                  <th className="px-2 py-1.5 text-left">End</th>
                  <th className="px-2 py-1.5 text-left">Dur.</th>
                </tr>
              </thead>
              <tbody>
                {ALREADY_ALLOCATED.map((m, i) => (
                  <tr key={i} className={`border-t ${row}`}>
                    <td className="px-2 py-1.5">{m.epf}</td>
                    <td className="px-2 py-1.5">{m.name}</td>
                    <td className="px-2 py-1.5">{m.contact}</td>
                    <td className="px-2 py-1.5">{m.startTime}</td>
                    <td className="px-2 py-1.5">{m.endTime}</td>
                    <td className="px-2 py-1.5">{m.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right */}
          <div>
            <h3 className="font-semibold text-sm mb-2">List Of Mechanics</h3>
            <table className="w-full text-xs rounded-lg overflow-hidden">
              <thead>
                <tr className={tblHead}>
                  <th className="px-2 py-1.5 text-left">EPF</th>
                  <th className="px-2 py-1.5 text-left">Name</th>
                  <th className="px-2 py-1.5 text-left">Contact</th>
                  <th className="px-2 py-1.5 text-left">Allocate</th>
                </tr>
              </thead>
              <tbody>
                {LIST_MECHANICS.map((m, i) => (
                  <tr key={i} className={`border-t ${row}`}>
                    <td className="px-2 py-1.5">{m.epf}</td>
                    <td className="px-2 py-1.5">{m.name}</td>
                    <td className="px-2 py-1.5">{m.contact}</td>
                    <td className="px-2 py-1.5">
                      <input type="checkbox" className="accent-teal-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-5 pb-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-500 text-white text-sm font-semibold hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Allocate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function WmsHome() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("Engineering");
  const [periodFilter] = useState("Last 7 Days");
  const [sortField, setSortField] = useState<keyof WorkOrder | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showPlanned, setShowPlanned] = useState(false);
  const [showRedTag, setShowRedTag] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [showAllocate, setShowAllocate] = useState(false);

  const bg = dark ? "bg-[#020617]" : "bg-slate-100";
  const card = dark
    ? "bg-[#111827] border-[#1e293b]"
    : "bg-white border-gray-200";
  const text = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  const inp = dark
    ? "bg-[#1e293b] border-[#334155] text-white placeholder-gray-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400";
  const tblHead = "bg-teal-600 text-white text-xs";
  const tblRow = dark
    ? "border-[#1e293b] hover:bg-[#1e293b]/50 text-gray-300 text-xs cursor-pointer"
    : "border-gray-100 hover:bg-gray-50 text-gray-700 text-xs cursor-pointer";

  useEffect(() => {
    const loadWorkOrders = async () => {
      setLoading(true);
      try {
        const data = await getBreakdowns();
        const mapped = data.map((item) => ({
          id: item.id,
          wo: item.wo,
          time: item.time,
          department: item.department,
          by: item.by,
          category: item.category as WOCategory,
          description: item.description,
          status: item.status as WOStatus,
          reOpen: item.re_open,
          machine: item.machine,
          engagedMechanics: item.engagedMechanics ?? [],
          allocatedMechanics: item.allocatedMechanics ?? [],
          eventLog: item.eventLog ?? [],
        }));
        setWorkOrders(mapped);
      } catch (error) {
        console.error("Failed to load breakdowns", error);
      } finally {
        setLoading(false);
      }
    };

    void loadWorkOrders();
  }, []);

  const filtered = useMemo(() => {
    let data = workOrders;
    if (deptFilter !== "All")
      data = data.filter((w) => w.department === deptFilter);
    if (search)
      data = data.filter(
        (w) =>
          w.wo.toLowerCase().includes(search.toLowerCase()) ||
          w.description.toLowerCase().includes(search.toLowerCase()) ||
          w.by.toLowerCase().includes(search.toLowerCase()),
      );
    if (sortField) {
      data = [...data].sort((a, b) => {
        const av = String(a[sortField] ?? "");
        const bv = String(b[sortField] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return data;
  }, [search, deptFilter, sortField, sortDir]);

  const handleSort = (field: keyof WorkOrder) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof WorkOrder }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp
        size={9}
        className={
          sortField === field && sortDir === "asc"
            ? "text-white"
            : "text-white/40"
        }
      />
      <ChevronDown
        size={9}
        className={
          sortField === field && sortDir === "desc"
            ? "text-white"
            : "text-white/40"
        }
      />
    </span>
  );

  const rowBg = (status: WOStatus) => {
    if (status === "New") return dark ? "bg-yellow-500/10" : "bg-yellow-50";
    if (status === "Inprogress") return dark ? "bg-blue-500/10" : "bg-blue-50";
    return dark ? "bg-green-500/10" : "bg-green-50";
  };

  return (
    <div className={`flex flex-col h-full overflow-auto ${bg}`}>
      {/* ── Summary Row ── */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 pb-0`}>
        {/* Last 7 Day Summary */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <h3 className={`text-sm font-bold mb-3 text-center ${text}`}>
            Last 7 Day Summary
          </h3>
          <div className={`space-y-1.5 text-xs ${muted}`}>
            {[
              ["No Of Breakdown", "47"],
              ["Total Breakdown Duration", "123:27"],
              ["Average Breakdown Time", "02:38"],
              ["Total Attending Delay", "04:40"],
              ["Average Attending Time", "00:06"],
              ["Total Work Orders Placed", "150"],
              ["Completed Work Orders", "120"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span>{k}</span>
                <span className={`font-semibold ${text}`}>: {v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today Summary */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <h3 className={`text-sm font-bold mb-3 text-center ${text}`}>
            Today Summary
          </h3>
          <div className={`space-y-1.5 text-xs ${muted}`}>
            {[
              ["No Of Breakdown", "3"],
              ["Total Breakdown Duration", "03:10"],
              ["Average Breakdown Time", "01:03"],
              ["Total Attending Delay", "00:04"],
              ["Average Attending Time", "00:01"],
              ["Total Work Orders Placed", "9"],
              ["Completed Work Orders", "3"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span>{k}</span>
                <span className={`font-semibold ${text}`}>: {v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={`rounded-xl border p-4 ${card}`}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={dark ? "#1e293b" : "#f0f0f0"}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }}
              />
              <YAxis
                tick={{ fontSize: 8, fill: dark ? "#64748b" : "#9ca3af" }}
              />
              <Tooltip
                contentStyle={{
                  background: dark ? "#111827" : "#fff",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Line
                type="monotone"
                dataKey="placed"
                name="Placed Work Orders"
                stroke="#38bdf8"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="completed"
                name="Completed Work Orders"
                stroke="#ef4444"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="placedBD"
                name="Placed Breakdown"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="completedBD"
                name="Completed Breakdown"
                stroke="#22c55e"
                dot={false}
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="duration"
                name="Total Breakdown Duration"
                stroke="#a78bfa"
                dot={false}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Work Order Table ── */}
      <div className={`mx-4 mt-4 rounded-xl border overflow-hidden ${card}`}>
        {/* Table header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h3 className={`text-sm font-bold ${text}`}>
            List of all work orders
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={13}
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${muted}`}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Anything here"
                className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs w-44 ${inp}`}
              />
            </div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs ${inp}`}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <span className={`text-xs px-2.5 py-1.5 rounded-lg border ${inp}`}>
              {periodFilter}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={tblHead}>
                {[
                  ["id", "#"],
                  ["wo", "WO"],
                  ["time", "Time"],
                  ["department", "Department"],
                  ["by", "By"],
                  ["category", "Category"],
                  ["description", "Description"],
                  ["status", "Status"],
                  [null, "ReOpen"],
                ].map(([field, label]) => (
                  <th
                    key={label as string}
                    onClick={() =>
                      field && handleSort(field as keyof WorkOrder)
                    }
                    className={`px-3 py-2.5 text-left font-semibold whitespace-nowrap ${field ? "cursor-pointer select-none" : ""}`}
                  >
                    {label}
                    {field && <SortIcon field={field as keyof WorkOrder} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className={`text-center py-8 text-xs ${muted}`}
                  >
                    Loading work orders...
                  </td>
                </tr>
              ) : (
                filtered.map((wo) => (
                  <tr
                    key={wo.id}
                    onClick={() => setSelectedWO(wo)}
                    className={`border-t transition-colors ${tblRow} ${rowBg(wo.status)}`}
                  >
                    <td className="px-3 py-2">{wo.id}</td>
                    <td className="px-3 py-2 font-mono">{wo.wo}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{wo.time}</td>
                    <td className="px-3 py-2">{wo.department}</td>
                    <td className="px-3 py-2">{wo.by}</td>
                    <td className="px-3 py-2">{wo.category}</td>
                    <td className="px-3 py-2 max-w-xs truncate">
                      {wo.description}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={wo.status} />
                    </td>
                    <td className="px-3 py-2">{wo.reOpen ? "Yes" : ""}</td>
                  </tr>
                ))
              )}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className={`text-center py-8 text-xs ${muted}`}
                  >
                    No work orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-wrap gap-2 px-4 py-4">
        <button
          onClick={() => setShowBreakdown(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <AlertTriangle size={15} /> Break Down
        </button>
        <button
          onClick={() => setShowRedTag(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Tag size={15} /> Red Tag
        </button>
        <button
          onClick={() => setShowPlanned(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Wrench size={15} /> Planned Maintenance
        </button>
        <button
          onClick={() => setShowBuilding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Building2 size={15} /> Building Maintenance
        </button>
        <button
          onClick={() => setShowOther(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <MoreHorizontal size={15} /> Other Project
        </button>
      </div>

      {/* Footer */}
      <div
        className={`text-center text-[11px] py-3 border-t ${dark ? "border-[#1e293b] text-gray-500" : "border-gray-200 text-gray-400"}`}
      >
        Copyright © 2024 Sky Smart Technology Pvt Ltd. All Rights Reserved
        &nbsp;|&nbsp; Soft Ver: 4.8
      </div>

      {/* ── Modals ── */}
      {showBreakdown && (
        <BreakdownModal
          onClose={() => setShowBreakdown(false)}
          onCreated={(created) =>
            setWorkOrders((prev) => [
              {
                id: created.id,
                wo: created.wo,
                time: created.time,
                department: created.department,
                by: created.by,
                category: created.category as WOCategory,
                description: created.description,
                status: created.status as WOStatus,
                reOpen: created.re_open,
                machine: created.machine,
                engagedMechanics: created.engagedMechanics ?? [],
                allocatedMechanics: created.allocatedMechanics ?? [],
                eventLog: created.eventLog ?? [],
              },
              ...prev,
            ])
          }
        />
      )}
      {showPlanned && (
        <PlannedMaintenanceModal
          onClose={() => setShowPlanned(false)}
          onCreated={(created) =>
            setWorkOrders((prev) => [
              {
                id: created.id,
                wo: created.wo,
                time: created.time,
                department: created.department,
                by: created.by,
                category: created.category as WOCategory,
                description: created.description,
                status: created.status as WOStatus,
                reOpen: created.re_open,
                machine: created.machine,
                engagedMechanics: created.engagedMechanics ?? [],
                allocatedMechanics: created.allocatedMechanics ?? [],
                eventLog: created.eventLog ?? [],
              },
              ...prev,
            ])
          }
        />
      )}
      {showRedTag && (
        <RedTagModal
          onClose={() => setShowRedTag(false)}
          onCreated={(created) =>
            setWorkOrders((prev) => [
              {
                id: created.id,
                wo: created.wo,
                time: created.time,
                department: created.department,
                by: created.by,
                category: created.category as WOCategory,
                description: created.description,
                status: created.status as WOStatus,
                reOpen: created.re_open,
                machine: created.machine,
                engagedMechanics: created.engagedMechanics ?? [],
                allocatedMechanics: created.allocatedMechanics ?? [],
                eventLog: created.eventLog ?? [],
              },
              ...prev,
            ])
          }
        />
      )}
      {showOther && (
        <OtherProjectModal
          onClose={() => setShowOther(false)}
          onCreated={(created) =>
            setWorkOrders((prev) => [
              {
                id: created.id,
                wo: created.wo,
                time: created.time,
                department: created.department,
                by: created.by,
                category: created.category as WOCategory,
                description: created.description,
                status: created.status as WOStatus,
                reOpen: created.re_open,
                machine: created.machine,
                engagedMechanics: created.engagedMechanics ?? [],
                allocatedMechanics: created.allocatedMechanics ?? [],
                eventLog: created.eventLog ?? [],
              },
              ...prev,
            ])
          }
        />
      )}
      {showBuilding && (
        <BuildingMaintenanceModal
          onClose={() => setShowBuilding(false)}
          onCreated={(created) =>
            setWorkOrders((prev) => [
              {
                id: created.id,
                wo: created.wo,
                time: created.time,
                department: created.department,
                by: created.by,
                category: created.category as WOCategory,
                description: created.description,
                status: created.status as WOStatus,
                reOpen: created.re_open,
                machine: created.machine,
                engagedMechanics: created.engagedMechanics ?? [],
                allocatedMechanics: created.allocatedMechanics ?? [],
                eventLog: created.eventLog ?? [],
              },
              ...prev,
            ])
          }
        />
      )}
      {selectedWO && !showAllocate && (
        <WorkOrderDetailsModal
          wo={selectedWO}
          onClose={() => setSelectedWO(null)}
          onAllocate={() => setShowAllocate(true)}
        />
      )}
      {selectedWO && showAllocate && (
        <AllocateModal
          wo={selectedWO}
          onClose={() => {
            setShowAllocate(false);
            setSelectedWO(null);
          }}
        />
      )}
    </div>
  );
}
