import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Loader2, FileSpreadsheet, CopyPlus, Power, PowerOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import productionTrackingService, {
  type ProductionDayPlan,
  type ProductionDayPlanPayload,
} from '../../api/productionTrackingService';

interface PRSettingProps { onUploaded: () => void; }

const today = () => new Date().toISOString().slice(0, 10);

const emptyPlan = {
  plan_date: today(),
  team: '', resp_employee: '', buyer: '', style: '', gauge: '',
  smv: '', display_wh: '', actual_wh: '', plan_target_pcs: '',
  per_hour_pcs: '', available_carder: '', present_linkers: '',
};

type PlanForm = typeof emptyPlan;

// Maps a normalized spreadsheet column header -> our field key.
// Normalizing strips spaces/punctuation so "Plan Date", "PlanDate" and
// "plan_date" all match the same key, regardless of how the sheet was built.
const HEADER_MAP: Record<string, keyof PlanForm> = {
  plandate: 'plan_date', date: 'plan_date',
  team: 'team', line: 'team', lineno: 'team', teamline: 'team',
  respemployee: 'resp_employee', responsibleemployee: 'resp_employee', employee: 'resp_employee',
  buyer: 'buyer',
  style: 'style',
  gg: 'gauge', gauge: 'gauge',
  smv: 'smv',
  displaywh: 'display_wh', displaywh1: 'display_wh',
  actualwh: 'actual_wh',
  plantgtpcs: 'plan_target_pcs', plantargetpcs: 'plan_target_pcs', plantarget: 'plan_target_pcs',
  perhourpcs: 'per_hour_pcs', perhour: 'per_hour_pcs',
  availablecarder: 'available_carder', availablecader: 'available_carder', carder: 'available_carder',
  presentlinkers: 'present_linkers', linkers: 'present_linkers',
};

const normalizeHeader = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '');

/** A plan's `status` is "active" per team+date — it does NOT mean "valid for today". */
const isPlanToday = (p: ProductionDayPlan) => p.plan_date.slice(0, 10) === today();

/** Reads the first data row of the first sheet and maps it onto our form shape. */
async function parseDayPlanFile(file: File): Promise<Partial<PlanForm>> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error('The workbook has no sheets.');

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', raw: false });
  if (rows.length === 0) throw new Error('No data rows found in the first sheet.');

  const result: Partial<PlanForm> = {};
  for (const [rawHeader, value] of Object.entries(rows[0])) {
    const key = HEADER_MAP[normalizeHeader(rawHeader)];
    if (key && value !== '') result[key] = String(value).trim();
  }

  // Normalize the date to YYYY-MM-DD for the <input type="date"> field.
  if (result.plan_date && !/^\d{4}-\d{2}-\d{2}$/.test(result.plan_date)) {
    const parsed = new Date(result.plan_date);
    result.plan_date = Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
  }

  return result;
}

function PRSetting({ onUploaded }: PRSettingProps) {
  const [file, setFile] = useState<File | null>(null);
  const [plan, setPlan] = useState<PlanForm>(emptyPlan);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ProductionDayPlan[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg      = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'    : 'bg-white border-gray-200';
  const title   = dark ? 'text-white'                     : 'text-gray-900';
  const sub     = dark ? 'text-gray-500'                  : 'text-gray-500';
  const thClass = dark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700';
  const tdClass = dark ? 'border-gray-800 text-gray-400'  : 'border-gray-300 text-gray-600';
  const inpCls  = dark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-800';
  const btn     = dark
    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-200'
    : 'border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800';

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      setHistory(await productionTrackingService.getDayPlans());
    } catch {
      // non-fatal — history is informational
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const field = (key: keyof PlanForm, val: string) => setPlan(p => ({ ...p, [key]: val }));

  const persist = async (data: PlanForm, sourceFile: string | null) => {
    if (!data.smv || !data.display_wh || !data.plan_target_pcs || !data.per_hour_pcs || !data.available_carder) {
      throw new Error('SMV, Display WH, Target Pcs, Per Hour Pcs and Available Carder are required.');
    }
    const payload: ProductionDayPlanPayload = {
      plan_date: data.plan_date,
      team: data.team,
      resp_employee: data.resp_employee,
      buyer: data.buyer,
      style: data.style,
      gauge: data.gauge,
      smv: Number(data.smv),
      display_wh: data.display_wh,
      actual_wh: data.actual_wh,
      plan_target_pcs: Number(data.plan_target_pcs),
      per_hour_pcs: Number(data.per_hour_pcs),
      available_carder: Number(data.available_carder),
      present_linkers: data.present_linkers ? Number(data.present_linkers) : undefined,
      source_file: sourceFile,
    };
    await productionTrackingService.createDayPlan(payload);
    setPlan(emptyPlan);
    setFile(null);
    await loadHistory();
    onUploaded();
  };

  /** "Read" button: parses the selected spreadsheet and immediately saves it as the day plan. */
  const handleReadAndUpload = async () => {
    if (!file) { setError('Choose an .xlsx file first.'); return; }
    setError(null);
    setReading(true);
    try {
      const parsed = await parseDayPlanFile(file);
      const merged = { ...plan, ...parsed };
      setPlan(merged);
      await persist(merged, file.name);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? (err instanceof Error ? err.message : 'Failed to read/save the file.'));
    } finally {
      setReading(false);
    }
  };

  /**
   * History row action: one click directly activates that team for today —
   * saves a new day plan dated today using that row's details, no form
   * step required. The row then flips straight to "Active today".
   */
  const handleUseToday = async (p: ProductionDayPlan) => {
    setError(null);
    setActivatingId(p.id);
    try {
      await persist({
        plan_date: today(),
        team: p.team, resp_employee: p.resp_employee, buyer: p.buyer, style: p.style, gauge: p.gauge,
        smv: String(p.smv), display_wh: p.display_wh, actual_wh: p.actual_wh,
        plan_target_pcs: String(p.plan_target_pcs), per_hour_pcs: String(p.per_hour_pcs),
        available_carder: String(p.available_carder), present_linkers: String(p.present_linkers),
      }, null);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? (err instanceof Error ? err.message : `Failed to activate ${p.team || 'this plan'} for today.`));
    } finally {
      setActivatingId(null);
    }
  };

  /** History row action: disable an active plan, or re-enable a disabled one — for today's date, no new row created. */
  const handleToggleStatus = async (p: ProductionDayPlan) => {
    setError(null);
    setTogglingId(p.id);
    try {
      await productionTrackingService.toggleDayPlanStatus(p.id);
      await loadHistory();
      onUploaded();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? `Failed to update ${p.team || 'this plan'}.`);
    } finally {
      setTogglingId(null);
    }
  };

  /** "Save Day Plan" button: saves whatever is currently in the fields (manual entry / edited-after-read). */
  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await persist(plan, file?.name ?? null);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? (err instanceof Error ? err.message : 'Failed to save the day plan.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 pb-24 md:p-8 font-sans transition-colors duration-300 ${bg}`}>

      {/* Header */}
      <div className={`border rounded-xl shadow-sm p-4 md:p-5 flex flex-wrap justify-between items-center gap-2 mb-6 transition-colors duration-300 ${card}`}>
        <h1 className={`text-lg md:text-xl font-bold ${title}`}>Day Plan Upload</h1>
        <div className={`text-sm ${sub}`}>
          <span>Settings</span> &gt; <span>Day Plan Upload</span>
        </div>
      </div>

      {/* Upload */}
      <div className={`border rounded-xl shadow-sm p-4 md:p-6 mb-6 flex flex-wrap items-center gap-3 transition-colors duration-300 ${card}`}>
        <span className={`font-semibold text-sm ${sub}`}>*.XLSX</span>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:bg-orange-500 file:text-white file:rounded file:font-medium hover:file:bg-orange-600 cursor-pointer"
        />
        <button
          onClick={handleReadAndUpload}
          disabled={reading || !file}
          className={`border py-2 px-5 rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 inline-flex items-center gap-2 ${btn}`}
        >
          {reading ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
          Read and Upload
        </button>
        {file && <span className={`text-xs ${sub}`}>{file.name}</span>}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* Day plan fields — auto-filled by "Read and Upload", or fill manually */}
      <div className={`overflow-x-auto border rounded-xl shadow-sm transition-colors duration-300 ${card}`}>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className={`text-xs border-b ${thClass}`}>
            <tr>
              {['Plan Date','Team / Line','Resp Employee','Buyer','Style','GG','SMV',
                'Display WH','Actual WH','PlanTgtPcs','Per_Hour_Pcs',
                'Available Carder','Present Linkers'].map(h => (
                <th key={h} className={`px-4 py-3 font-semibold border-r last:border-r-0 ${tdClass}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {([
                ['plan_date', 'date'], ['team', 'text'], ['resp_employee', 'text'], ['buyer', 'text'],
                ['style', 'text'], ['gauge', 'text'], ['smv', 'number'],
                ['display_wh', 'text'], ['actual_wh', 'text'], ['plan_target_pcs', 'number'],
                ['per_hour_pcs', 'number'], ['available_carder', 'number'], ['present_linkers', 'number'],
              ] as [keyof PlanForm, string][]).map(([key, type]) => (
                <td key={key} className={`px-2 py-2 border-r last:border-r-0 ${tdClass}`}>
                  <input
                    type={type}
                    value={plan[key]}
                    onChange={e => field(key, e.target.value)}
                    className={`w-28 rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 ${inpCls}`}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`border py-2 px-5 rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-60 inline-flex items-center gap-2 ${btn}`}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Day Plan
        </button>
      </div>

      {/* Upload history */}
      <div className={`mt-8 border rounded-xl shadow-sm transition-colors duration-300 ${card}`}>
        <div className={`px-4 py-3 border-b ${tdClass}`}>
          <h2 className={`text-sm font-bold ${title}`}>Upload History</h2>
          <p className={`text-xs ${sub}`}>
            Every day plan saved from this page, newest first. A plan only powers the Dashboard / QC Update for
            the date shown — "Active" means current for <em>that</em> date, not necessarily today.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className={`text-xs border-b ${thClass}`}>
              <tr>
                {['Date','Team','Buyer','Style','Target Pcs','Source File','Status','Uploaded By','Uploaded At','Actions'].map(h => (
                  <th key={h} className={`px-4 py-2.5 font-semibold border-r last:border-r-0 ${tdClass}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr><td colSpan={10} className={`px-4 py-6 text-center ${sub}`}><Loader2 size={14} className="animate-spin inline mr-2" />Loading history…</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={10} className={`px-4 py-6 text-center ${sub}`}>No day plans uploaded yet.</td></tr>
              ) : history.map(p => {
                const activeToday    = p.status === 'active' && isPlanToday(p);
                const todayDisabled  = p.status !== 'active' && isPlanToday(p);
                return (
                  <tr key={p.id} className={`border-b ${tdClass}`}>
                    <td className="px-4 py-2.5 border-r">{p.plan_date.slice(0, 10)}</td>
                    <td className="px-4 py-2.5 border-r">{p.team || '—'}</td>
                    <td className="px-4 py-2.5 border-r">{p.buyer || '—'}</td>
                    <td className="px-4 py-2.5 border-r">{p.style || '—'}</td>
                    <td className="px-4 py-2.5 border-r">{p.plan_target_pcs}</td>
                    <td className="px-4 py-2.5 border-r">{p.source_file ?? '— manual —'}</td>
                    <td className="px-4 py-2.5 border-r">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                        activeToday ? 'bg-emerald-600/20 text-emerald-400'
                        : p.status === 'active' ? 'bg-amber-600/20 text-amber-400'
                        : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {activeToday ? 'Active today' : p.status === 'active' ? 'Active (not today)' : p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 border-r">{p.created_by_name}</td>
                    <td className="px-4 py-2.5 border-r">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {(activeToday || todayDisabled) && (
                          <button
                            onClick={() => handleToggleStatus(p)}
                            disabled={togglingId !== null}
                            title={activeToday ? 'Disable this team for today — stops it appearing on the Dashboard / QC Update immediately' : 'Re-enable this team for today'}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                              activeToday
                                ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {togglingId === p.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : activeToday ? (
                              <PowerOff size={12} />
                            ) : (
                              <Power size={12} />
                            )}
                            {togglingId === p.id ? '…' : activeToday ? 'Disable' : 'Enable'}
                          </button>
                        )}
                        {!isPlanToday(p) && (
                          <button
                            onClick={() => handleUseToday(p)}
                            disabled={activatingId !== null}
                            title="Activate this team for today using these same details — one click, no form needed"
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-60 ${btn}`}
                          >
                            {activatingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <CopyPlus size={12} />}
                            {activatingId === p.id ? 'Activating…' : 'Use Today'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PRSetting;
