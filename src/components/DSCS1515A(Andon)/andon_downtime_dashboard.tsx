import { useCallback, useEffect, useMemo, useState } from "react";
import { getAndonEvents, isEventClosed, isEventActive, type AndonEvent } from "../../api/andonService";

// How often (ms) to re-fetch live data from the API — every 3 minutes
const POLL_INTERVAL_MS = 180_000;

// One cell in the matrix: total seconds of completed downtime + the start
// time of any currently-open (active) event for that category × work-center pair
interface MatrixCell {
  completedSecs: number;
  activeStart: Date | null;
}

// Outer key = CategoryName, inner key = WorkCenter
type AndonMatrix = Record<string, Record<string, MatrixCell>>;

// Fixed colour scheme per category — falls back to DEFAULT_STYLE for unknowns
const CATEGORY_STYLE: Record<string, { header: string; cell: string; text: string }> = {
  TECHNICAL: { header: "bg-red-700",    cell: "bg-red-600",    text: "text-white" },
  CUTTING:   { header: "bg-green-700",  cell: "bg-green-600",  text: "text-white" },
  MMT:       { header: "bg-yellow-400", cell: "bg-yellow-400", text: "text-black" },
  "QA/MQA":  { header: "bg-cyan-400",   cell: "bg-cyan-400",   text: "text-black" },
};

const DEFAULT_STYLE = { header: "bg-blue-600", cell: "bg-blue-700", text: "text-white" };

// Converts a raw second count into a "HH:MM:SS" display string
const secsToHMS = (secs: number): string => {
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

// Converts the API's "YYYY-MM-DD HH:MM:SS" string to a JS Date.
// The space → "T" replacement makes it ISO-8601 so all browsers parse it correctly.
const parseApiDate = (s: string | undefined): Date =>
  new Date(s?.replace(" ", "T") ?? "");

// Turns a raw work-center code like "LB12" into the display form "LB 12"
const formatWC = (wc: string): string =>
  wc.replace(/^(LB)(\d+)$/i, (_, lb, num) => `${lb.toUpperCase()} ${num}`);

// ── buildTableData ────────────────────────────────────────────────────────────
// Main array-data loader. Receives the flat AndonEvent[] from the API and
// produces three things the table needs:
//   • categories  — sorted, deduplicated list of category names (row headers)
//   • workCenters — sorted, deduplicated list of work-center codes (column headers)
//   • matrix      — [category][workCenter] → MatrixCell for the LATEST event only
//
// Process steps:
//   1. Collect unique CategoryNames, excluding "Sending" noise values, sort them.
//   2. Collect unique WorkCenter codes, sort them.
//   3. Pre-fill the matrix so every [cat][wc] starts at zero / null.
//   4. Walk all events → keep only the ONE with the latest StartTime per cell.
//      The API returns historical records; accumulating them all produces wrong totals.
//   5. Apply that single latest event to the matrix cell:
//        • EventState 1 (downtime START) → set activeStart so the timer counts up
//          from StartTime: 00:00:00 → now − StartTime.
//        • EventState 3 (downtime OFF)   → set completedSecs = StopTime − StartTime
//          (fixed, not growing).
//   6. Return categories / workCenters / matrix for the table component.
function buildTableData(events: AndonEvent[]): {
  categories: string[];
  workCenters: string[];
  matrix: AndonMatrix;
} {
  // Step 1 — unique, sorted category names (drop "Sending" placeholder values)
  const EXCLUDED = new Set(["Sending", "SENDING", "sending"]);
  const categories = Array.from(
    new Set(events.map((e) => e.CategoryName?.trim()).filter((c) => c && !EXCLUDED.has(c)))
  ).sort();

  // Step 2 — unique, sorted work-center codes
  const workCenters = Array.from(
    new Set(events.map((e) => e.WorkCenter?.trim()).filter(Boolean))
  ).sort();

  // Step 3 — pre-fill matrix with zero cells for every [cat][wc] combination
  const mat: AndonMatrix = {};
  categories.forEach((cat) => {
    mat[cat] = {};
    workCenters.forEach((wc) => {
      mat[cat][wc] = { completedSecs: 0, activeStart: null };
    });
  });

  // Step 4 — find the single most-recent event per [cat][wc] by StartTime.
  // We intentionally do NOT accumulate — only the current downtime matters.
  const latestEvent: Record<string, Record<string, AndonEvent>> = {};

  events.forEach((item) => {
    const cat = item.CategoryName?.trim();
    const wc  = item.WorkCenter?.trim();
    if (!cat || !wc || !mat[cat]?.[wc]) return;

    if (!latestEvent[cat]) latestEvent[cat] = {};

    const existing     = latestEvent[cat][wc];
    const itemStart    = parseApiDate(item.StartTime?.date);
    const existStart   = existing ? parseApiDate(existing.StartTime?.date) : null;

    // Replace if this event started later than the currently stored one
    if (!existStart || itemStart > existStart) {
      latestEvent[cat][wc] = item;
    }
  });

  // Step 5 — apply the latest event to each matrix cell
  categories.forEach((cat) => {
    workCenters.forEach((wc) => {
      const event = latestEvent[cat]?.[wc];
      if (!event) return;

      const start = parseApiDate(event.StartTime?.date);

      if (isEventActive(event)) {
        // EventState 1 — downtime still running: live timer counts from StartTime
        mat[cat][wc].activeStart = start;
      } else if (isEventClosed(event)) {
        // EventState 3 — downtime finished: show fixed StopTime − StartTime duration
        const stop = parseApiDate(event.StopTime?.date);
        mat[cat][wc].completedSecs = Math.max(
          0,
          Math.floor((stop.getTime() - start.getTime()) / 1000)
        );
      }
    });
  });

  // Step 6 — return derived data for the table renderer
  return { categories, workCenters, matrix: mat };
}

// ── DowntimeTable ─────────────────────────────────────────────────────────────
// Pure display component. Receives the pre-built matrix and the current
// timestamp (now) so it can compute live elapsed seconds without re-fetching.
// • Splits into chunks of CHUNK_SIZE columns upstream to avoid horizontal overflow.
// • Cells with an activeStart pulse to signal an ongoing downtime event.
function DowntimeTable({
  label,
  matrix,
  categories,
  workCenters,
  now,
}: {
  label?: string;
  matrix: AndonMatrix;
  categories: string[];
  workCenters: string[];
  now: number;
}) {
  return (
    <div className="overflow-x-auto">
      {label && (
        <div className="bg-[#1a2340] text-[#d6de62] font-bold text-sm px-3 py-1">{label}</div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-36 bg-[#1a2340] border border-gray-600 px-4 py-3" />
            {workCenters.map((wc) => (
              <th
                key={wc}
                className="bg-[#05050d] border border-gray-600 px-3 py-3 text-center text-[14px] font-bold text-[#d6de62] min-w-22.5"
              >
                {formatWC(wc)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const style = CATEGORY_STYLE[cat] ?? DEFAULT_STYLE;
            return (
              <tr key={cat}>
                <td
                  className={`${style.header} ${style.text} border border-gray-600 px-4 py-3 text-center text-[13px] font-bold`}
                >
                  {cat}
                </td>
                {workCenters.map((wc) => {
                  const cell = matrix[cat]?.[wc] ?? { completedSecs: 0, activeStart: null };

                  // Live seconds = wall-clock now minus the earliest open-event start
                  const actSecs = cell.activeStart
                    ? Math.max(0, Math.floor((now - cell.activeStart.getTime()) / 1000))
                    : 0;

                  // Total shown = past completed seconds + current live seconds
                  const totalSecs = cell.completedSecs + actSecs;
                  const isActive  = cell.activeStart !== null;

                  // Category colour only for LIVE cells; all others stay blue
                  const cellClass = isActive
                    ? `${style.cell} ${style.text}`
                    : "bg-blue-600 text-white";

                  return (
                    <td
                      key={`${cat}-${wc}`}
                      className={`border border-gray-600 px-2 py-3 text-center text-[13px] font-semibold transition-colors ${cellClass}`}
                    >
                      {secsToHMS(totalSecs)}
                      {isActive && (
                        <span className="block text-[8px] font-bold tracking-widest opacity-90 mt-0.5">
                          ● LIVE
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Max work-center columns per table chunk — keeps each table readable on-screen
const CHUNK_SIZE = 11;

// ── AndonDowntimeDashboard ────────────────────────────────────────────────────
// Root component. Owns three pieces of state:
//   • allEvents  — raw API array, refreshed every POLL_INTERVAL_MS
//   • now        — current timestamp, ticked every second for live cell timers
//   • isLoading  — true only on the very first load (suppresses empty-table flash)
//
// Derived data (categories / workCenters / matrix) is memoised so buildTableData
// only reruns when allEvents actually changes, not on every clock tick.
export default function AndonDowntimeDashboard() {
  const [allEvents, setAllEvents] = useState<AndonEvent[]>([]);
  const [now,       setNow      ] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  // Fetches the full event list and stores it; called on mount and every poll cycle
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const events = await getAndonEvents();
    setAllEvents(events);
    setIsLoading(false);
  }, []);

  // Mount: kick off the initial fetch, then schedule polling + the 1-second clock tick
  useEffect(() => {
    fetchData();
    const pollId = setInterval(fetchData, POLL_INTERVAL_MS); // refresh data
    const tickId = setInterval(() => setNow(Date.now()), 1000); // drive live timers
    return () => {
      clearInterval(pollId);
      clearInterval(tickId);
    };
  }, [fetchData]);

  // Re-derive matrix only when the raw event array changes
  const { categories, workCenters, matrix } = useMemo(() => {
    if (allEvents.length === 0) return { categories: [], workCenters: [], matrix: {} };
    return buildTableData(allEvents);
  }, [allEvents]);

  // Split work-centers into pages of CHUNK_SIZE so each DowntimeTable stays readable
  const wcChunks: string[][] = [];
  for (let i = 0; i < workCenters.length; i += CHUNK_SIZE) {
    wcChunks.push(workCenters.slice(i, i + CHUNK_SIZE));
  }

  return (
    <div className="h-full bg-[#0d1117] flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center justify-between bg-[#1a2340] px-6 py-4">
        <h1 className="text-2xl font-bold text-[#d6de62]">
          Smart Andon System — Downtime Dashboard
        </h1>
        <div className="text-xl font-bold text-green-400">
          {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {isLoading && allEvents.length === 0 && (
          <div className="text-center text-blue-400 font-semibold py-8">Loading data...</div>
        )}

        {wcChunks.map((chunk, idx) => (
          <DowntimeTable
            key={idx}
            matrix={matrix}
            categories={categories}
            workCenters={chunk}
            now={now}
          />
        ))}
      </div>
    </div>
  );
}
