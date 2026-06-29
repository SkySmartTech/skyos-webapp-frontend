import { useState, useEffect, useCallback } from 'react';
import { Check, AlertCircle, X, ChevronDown, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import productionTrackingService, {
  type CheckResult,
  type ProductionHourlyStatus,
  type ProductionCheckFilters,
} from '../../api/productionTrackingService';

interface PRUpdateProps {
  onChecked: () => void;
}

// Shown only until the real catalog loads from the backend (or as a
// fallback on a brand-new install with no history yet).
const FALLBACK_FILTERS: ProductionCheckFilters = {
  teams: ['Team 01', 'Team 02'],
  styles: ['GJ51S812(Top+Bottom)'],
  colors: ['Green', 'Blue', 'Red'],
  sizes: ['L', 'M', 'S', 'XL'],
  check_points: ['End Line QC', 'In-line QC'],
};

const POLL_INTERVAL_MS = 5000;

function PRUpdate({ onChecked }: PRUpdateProps) {
  const [filters, setFilters] = useState<ProductionCheckFilters>(FALLBACK_FILTERS);
  const [form, setForm] = useState({
    team_no: FALLBACK_FILTERS.teams[0],
    style: FALLBACK_FILTERS.styles[0],
    color: FALLBACK_FILTERS.colors[0],
    size: FALLBACK_FILTERS.sizes[0],
    check_point: FALLBACK_FILTERS.check_points[0],
  });
  // The active day plan + current hour for whichever team is selected in
  // the "Team No" dropdown above — resolved independently of any other
  // screen's team selection, since a check must be filed against the
  // selected team's own plan, not whatever team the Dashboard happens to
  // be showing.
  const [activePlan, setActivePlan] = useState<{ id: number; currentHour: number } | null>(null);
  const [hour, setHour] = useState(1);
  const [hourlyStatus, setHourlyStatus] = useState<ProductionHourlyStatus[]>([]);
  const [saving, setSaving] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const fetchActivePlan = useCallback(async (resetHour: boolean) => {
    if (!form.team_no) { setActivePlan(null); return; }
    try {
      const resp = await productionTrackingService.getDashboard(form.team_no);
      const plan = resp.day_plan ? { id: resp.day_plan.id, currentHour: resp.stats?.current_hour ?? 1 } : null;
      setActivePlan(plan);
      // Only snap the hour selector when the team changed (or on first
      // load) — not on every background poll, so it doesn't yank the
      // operator back to "now" while they're logging an earlier hour.
      if (resetHour) setHour(plan?.currentHour ?? 1);
    } catch {
      setActivePlan(null);
    }
  }, [form.team_no]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivePlan(true);
    const id = setInterval(() => fetchActivePlan(false), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchActivePlan]);

  const dayPlanId = activePlan?.id ?? null;

  const fetchFilters = useCallback(async () => {
    try {
      const data = await productionTrackingService.getCheckFilters();
      // Real teams/styles/colors/sizes/check points already used in the
      // database — replaces the placeholder list once it's loaded.
      setFilters({
        teams: data.teams.length ? data.teams : FALLBACK_FILTERS.teams,
        styles: data.styles.length ? data.styles : FALLBACK_FILTERS.styles,
        colors: data.colors.length ? data.colors : FALLBACK_FILTERS.colors,
        sizes: data.sizes.length ? data.sizes : FALLBACK_FILTERS.sizes,
        check_points: data.check_points.length ? data.check_points : FALLBACK_FILTERS.check_points,
      });
    } catch {
      // keep the fallback list — form stays usable even if this call fails
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchFilters(); }, [fetchFilters]);

  // Once the real catalog loads, snap any selected value that no longer
  // exists in its list back to the first real option.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(f => ({
      team_no:     filters.teams.includes(f.team_no) ? f.team_no : filters.teams[0],
      style:       filters.styles.includes(f.style) ? f.style : filters.styles[0],
      color:       filters.colors.includes(f.color) ? f.color : filters.colors[0],
      size:        filters.sizes.includes(f.size) ? f.size : filters.sizes[0],
      check_point: filters.check_points.includes(f.check_point) ? f.check_point : filters.check_points[0],
    }));
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    if (!dayPlanId) { setHourlyStatus([]); return; }
    try {
      // Scoped to the selected team — each team tracks its own counts.
      const summary = await productionTrackingService.getChecksSummary(dayPlanId, form.team_no);
      setHourlyStatus(summary?.by_hour ?? []);
    } catch {
      // non-fatal — counts just stay at their last known value
    }
  }, [dayPlanId, form.team_no]);

  // Pull this team's counts as soon as we know the active day plan, and
  // again whenever the Team No selection changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const bg    = dark ? 'bg-gray-950'                 : 'bg-slate-100';
  const card  = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const label = dark ? 'text-gray-400'               : 'text-gray-500';
  const val   = dark ? 'text-gray-100'               : 'text-gray-700';
  const sel   = dark
    ? 'border-gray-700 bg-gray-800 text-gray-200 focus:ring-orange-500'
    : 'border-gray-300 bg-white text-gray-700 focus:ring-orange-400';
  const headerText = dark ? 'text-gray-300' : 'text-gray-600';
  const divider    = dark ? 'border-gray-800' : 'border-gray-100';
  const hourHead   = dark ? 'bg-gray-900 border-gray-800 text-gray-500' : 'bg-white border-gray-200 text-gray-500';
  const hourRow    = dark ? 'bg-gray-800'    : 'bg-[#a6cddc]';
  const hourBorder = dark ? 'border-gray-700' : 'border-[#96bac8]';

  const totalSuccess = hourlyStatus.reduce((sum, h) => sum + h.success, 0);
  const totalRework  = hourlyStatus.reduce((sum, h) => sum + h.rework, 0);
  const totalDefect  = hourlyStatus.reduce((sum, h) => sum + h.defect, 0);

  const dropdowns: { key: keyof typeof form; label: string; options: string[] }[] = [
    { key: 'team_no',     label: 'Team No',      options: filters.teams },
    { key: 'style',       label: 'Style',        options: filters.styles },
    { key: 'color',       label: 'Color',        options: filters.colors },
    { key: 'size',        label: 'Size',         options: filters.sizes },
    { key: 'check_point', label: 'Check Point',  options: filters.check_points },
  ];

  const recordCheck = async (result: CheckResult) => {
    if (!dayPlanId) {
      setError('No active day plan for today — create one under Plan Settings first.');
      return;
    }
    setError(null);
    setSaving(result);
    try {
      const { summary } = await productionTrackingService.createCheck({
        day_plan_id: dayPlanId,
        team_no: form.team_no,
        style: form.style,
        color: form.color,
        size: form.size,
        check_point: form.check_point,
        hour,
        result,
      });
      setHourlyStatus(summary.by_hour);
      onChecked();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Failed to record the check.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className={`min-h-screen p-3 pb-24 md:p-6 font-sans transition-colors duration-300 ${bg}`}>
      <div className={`border rounded-xl shadow-sm p-4 md:p-8 transition-colors duration-300 ${card}`}>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Header Info */}
        <div className={`flex flex-wrap items-center justify-between gap-3 text-sm font-semibold tracking-wide mb-8 border-b pb-4 ${headerText} ${divider}`}>
          <div className="flex items-center gap-2">
            <span className={label}>HOUR</span>
            <select
              value={hour}
              onChange={e => setHour(Number(e.target.value))}
              className={`appearance-none border rounded-lg py-1 px-2 text-sm focus:outline-none focus:ring-1 cursor-pointer ${sel}`}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>{dayPlanId ? `Day Plan #${dayPlanId}` : 'No active day plan'}</div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
          {dropdowns.map(d => (
            <div key={d.label} className="flex flex-col">
              <label className={`text-xs font-semibold tracking-wide uppercase mb-2 ${label}`}>{d.label}</label>
              <div className="relative">
                <select
                  value={form[d.key]}
                  onChange={e => setForm(f => ({ ...f, [d.key]: e.target.value }))}
                  className={`w-full appearance-none border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-1 cursor-pointer transition-colors ${sel}`}
                >
                  {d.options.map(o => <option key={o}>{o}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <ChevronDown size={15} className={label} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counter Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">

          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{totalSuccess}</div>
            <button
              onClick={() => recordCheck('success')}
              disabled={saving !== null}
              className="w-full bg-[#7bc17e] hover:bg-[#6ba96e] transition-colors text-white py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm disabled:opacity-60"
            >
              {saving === 'success' ? <Loader2 size={24} className="animate-spin" /> : <Check size={24} />} Success
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{totalRework}</div>
            <button
              onClick={() => recordCheck('rework')}
              disabled={saving !== null}
              className="w-full bg-[#edc05c] hover:bg-[#d8ae4f] transition-colors text-[#2c2c2c] py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm disabled:opacity-60"
            >
              {saving === 'rework' ? <Loader2 size={22} className="animate-spin" /> : <AlertCircle size={22} />} Rework
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{totalDefect}</div>
            <button
              onClick={() => recordCheck('defect')}
              disabled={saving !== null}
              className="w-full bg-[#d64152] hover:bg-[#bd3846] transition-colors text-white py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm disabled:opacity-60"
            >
              {saving === 'defect' ? <Loader2 size={26} className="animate-spin" /> : <X size={26} />} Defect
            </button>
          </div>
        </div>

        {/* Hourly Table */}
        <div className="border rounded-lg overflow-hidden border-gray-700 overflow-x-auto -mx-1">
          <div className={`grid grid-cols-8 border-b text-center min-w-lg ${hourHead}`}>
            {[1,2,3,4,5,6,7,8].map(h => (
              <div key={h} className={`py-3 md:py-4 text-xs font-semibold uppercase tracking-wider ${h < 8 ? `border-r ${hourBorder}` : ''}`}>
                Hour: {h}
              </div>
            ))}
          </div>
          <div className={`grid grid-cols-8 text-center min-w-lg ${hourRow}`}>
            {[1,2,3,4,5,6,7].map(h => (
              <div key={h} className={`py-3 md:py-4 text-gray-800 border-r ${hourBorder}`}>
                {hourlyStatus.find(s => s.hour === h)?.success ?? 0}
              </div>
            ))}
            <div className="py-3 md:py-4 bg-orange-600 text-white font-bold">{totalSuccess}</div>
          </div>
        </div>

        <p className={`mt-2 text-right text-[10px] uppercase tracking-wide ${val}`}>Hourly success breakdown shown above. Totals update live from the server.</p>
      </div>
    </div>
  );
}

export default PRUpdate;
