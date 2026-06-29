import { useTheme } from '../../context/ThemeContext';

// Shape of each processed row fed into the realtime table
type SystemRow = {
  id:       number;
  name:     string;
  status:   string;
  load:     number;
  desc:     string;
  isNormal: boolean; // true when switch key = 0 (off) → plain column, no status colour
};

function SkyOsDashboard() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // Source-of-truth system definitions — all derived views read from here
  const systems = [
    { id: 1, name: 'DSCS1515A',              status: 'Active',     desc: 'Primary industrial control unit.',     load: 85 },
    { id: 2, name: 'WIP032A',                status: 'Monitoring', desc: 'Work-in-progress tracking module.',    load: 60 },
    { id: 3, name: 'Production Tracking',    status: 'Live',       desc: 'Real-time sewing line analytics.',     load: 92 },
    { id: 4, name: 'Solar System',           status: 'Optimal',    desc: 'Energy management and grid status.',   load: 45 },
    { id: 5, name: 'Custom System 1',        status: 'Standby',    desc: 'Auxiliary module integration.',        load: 20 },
    { id: 6, name: 'Custom System 2',        status: 'Offline',    desc: 'Secondary backup controller.',         load: 0  },
  ];

  // Returns Tailwind badge classes for the status pill based on theme and status group
  const statusBadge = (status: string) => {
    const online = ['Active', 'Live', 'Optimal'].includes(status);
    const idle   = ['Monitoring', 'Standby'].includes(status);
    if (dark) {
      if (online) return 'bg-green-500/10 text-green-400 border border-green-500/20';
      if (idle)   return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
    if (online) return 'bg-green-50 text-green-700 border border-green-200';
    if (idle)   return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    return 'bg-red-50 text-red-600 border border-red-200';
  };

  // Returns the progress-bar fill colour class based on system status group
  const barColor = (status: string) => {
    if (['Active', 'Live', 'Optimal'].includes(status))   return 'bg-green-500';
    if (['Monitoring', 'Standby'].includes(status))       return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // ── NEW: Realtime filter ────────────────────────────────────────────────────
  // Sorts systems so actively-loaded ones (switch ON, key > 0) appear first.
  // Systems whose key = 0 (switch OFF) are kept in the array but pushed to the
  // bottom so the table always shows the most relevant data at the top.
  const filterRealtimeData = (data: typeof systems) =>
    [...data].sort((a, b) => b.load - a.load);

  // ── NEW: Build realtime table array ────────────────────────────────────────
  // Converts filtered system objects into flat SystemRow objects for the table.
  // isNormal = true when switch key = 0 (off) → that row renders as a plain
  // "normal" column — no status badge colour, no load-bar colour — preserving
  // the existing statusBadge / barColor logic for every other row untouched.
  const buildRealtimeArray = (filtered: typeof systems): SystemRow[] =>
    filtered.map(sys => ({
      id:       sys.id,
      name:     sys.name,
      status:   sys.status,
      load:     sys.load,
      desc:     sys.desc,
      isNormal: sys.load === 0,   // switch key = 0 → normal column
    }));

  // Derive the table rows once so the JSX stays clean
  const realtimeRows: SystemRow[] = buildRealtimeArray(filterRealtimeData(systems));

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg      = dark ? 'bg-gray-950'                                       : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-orange-300';
  const h1      = dark ? 'text-white'    : 'text-gray-900';
  const sub     = dark ? 'text-gray-400' : 'text-gray-500';
  const name    = dark ? 'text-gray-100' : 'text-gray-900';
  const desc    = dark ? 'text-gray-400' : 'text-gray-500';
  const lbl     = dark ? 'text-gray-500' : 'text-gray-400';
  const pct     = dark ? 'text-gray-300' : 'text-gray-600';
  const barBg   = dark ? 'bg-gray-800'   : 'bg-gray-200';
  const borderT = dark ? 'border-gray-800' : 'border-gray-100';

  // Table-specific theme tokens
  const tblWrap   = dark ? 'bg-gray-900 border-gray-800'                            : 'bg-white border-gray-200';
  const tblHead   = dark ? 'bg-gray-800 text-gray-400'                              : 'bg-gray-50 text-gray-500';
  const tblRow    = dark ? 'border-gray-800 text-gray-200 hover:bg-gray-800/50'     : 'border-gray-100 text-gray-700 hover:bg-slate-50';
  const normalTxt = dark ? 'text-gray-600' : 'text-gray-400'; // plain style for switch-key-0 rows

  return (
    <div className={`p-8 font-sans transition-colors duration-300 ${bg}`}>

      {/* ── Page header ── */}
      <div className="mb-10">
        <h1 className={`text-4xl font-black tracking-tight mb-2 ${h1}`}>SkyOS Command Center</h1>
        <p className={sub}>Engineering Smart Industrial Futures | Real-time System Overview</p>
      </div>

      {/* ── System cards grid (unchanged) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map(sys => (
          <div key={sys.id} className={`border rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between h-60 cursor-pointer ${card}`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className={`text-lg font-bold ${name}`}>{sys.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${statusBadge(sys.status)}`}>
                  {sys.status}
                </span>
              </div>
              <p className={`text-sm ${desc}`}>{sys.desc}</p>
            </div>

            <div className={`mt-4 pt-4 border-t ${borderT}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs uppercase tracking-wide ${lbl}`}>System Load</span>
                <span className={`text-sm font-semibold ${pct}`}>{sys.load}%</span>
              </div>
              <div className={`w-full rounded-full h-1.5 ${barBg}`}>
                <div
                  className={`h-1.5 rounded-full ${barColor(sys.status)} transition-all duration-700`}
                  style={{ width: `${sys.load}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Realtime data table ─────────────────────────────────────────────── */}
      {/* Rows are produced by filterRealtimeData → buildRealtimeArray.         */}
      {/* Rows where isNormal = true (switch key = 0) render as plain columns.  */}
      <div className={`mt-12 border rounded-xl overflow-hidden shadow-sm ${tblWrap}`}>

        {/* Table header bar */}
        <div className={`px-6 py-4 border-b ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-lg font-bold ${h1}`}>Real-time System Feed</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>
            {realtimeRows.filter(r => !r.isNormal).length} active &nbsp;·&nbsp;
            {realtimeRows.filter(r =>  r.isNormal).length} switch-off (key = 0, normal column)
          </p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className={`text-xs uppercase tracking-wide ${tblHead}`}>
              <th className="text-left px-6 py-3">#</th>
              <th className="text-left px-6 py-3">System</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Description</th>
              <th className="text-right px-6 py-3">Load</th>
            </tr>
          </thead>
          <tbody>
            {realtimeRows.map((row, i) => (
              <tr key={row.id} className={`border-t ${tblRow}`}>

                {/* Index — plain when switch key = 0 */}
                <td className={`px-6 py-4 ${row.isNormal ? normalTxt : ''}`}>
                  {i + 1}
                </td>

                {/* System name — plain when switch key = 0 */}
                <td className={`px-6 py-4 font-semibold ${row.isNormal ? normalTxt : ''}`}>
                  {row.name}
                </td>

                {/* Status badge — hidden (dash) when switch key = 0 */}
                <td className="px-6 py-4">
                  {row.isNormal ? (
                    <span className={`text-xs ${normalTxt}`}>—</span>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${statusBadge(row.status)}`}>
                      {row.status}
                    </span>
                  )}
                </td>

                {/* Description — plain when switch key = 0 */}
                <td className={`px-6 py-4 ${row.isNormal ? normalTxt : desc}`}>
                  {row.desc}
                </td>

                {/* Load — plain "0%" when switch key = 0 */}
                <td className="px-6 py-4 text-right">
                  {row.isNormal ? (
                    <span className={`text-xs ${normalTxt}`}>0%</span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-semibold ${pct}`}>{row.load}%</span>
                      <div className={`w-20 rounded-full h-1 ${barBg}`}>
                        <div
                          className={`h-1 rounded-full ${barColor(row.status)} transition-all duration-700`}
                          style={{ width: `${row.load}%` }}
                        />
                      </div>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SkyOsDashboard;
