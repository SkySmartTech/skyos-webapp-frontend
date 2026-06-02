import { useTheme } from '../../context/ThemeContext';

function SkyOsDashboard() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const systems = [
    { id: 1, name: 'DSCS1515A',              status: 'Active',     desc: 'Primary industrial control unit.',     load: 85 },
    { id: 2, name: 'WIP032A',                status: 'Monitoring', desc: 'Work-in-progress tracking module.',    load: 60 },
    { id: 3, name: 'Production Tracking',    status: 'Live',       desc: 'Real-time sewing line analytics.',     load: 92 },
    { id: 4, name: 'Solar System',           status: 'Optimal',    desc: 'Energy management and grid status.',   load: 45 },
    { id: 5, name: 'Custom System 1',        status: 'Standby',    desc: 'Auxiliary module integration.',        load: 20 },
    { id: 6, name: 'Custom System 2',        status: 'Offline',    desc: 'Secondary backup controller.',         load: 0  },
  ];

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

  const barColor = (status: string) => {
    if (['Active','Live','Optimal'].includes(status)) return 'bg-green-500';
    if (['Monitoring','Standby'].includes(status))    return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const bg   = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card = dark ? 'bg-gray-900 border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-orange-300';
  const h1   = dark ? 'text-white'    : 'text-gray-900';
  const sub  = dark ? 'text-gray-400' : 'text-gray-500';
  const name = dark ? 'text-gray-100' : 'text-gray-900';
  const desc = dark ? 'text-gray-400' : 'text-gray-500';
  const lbl  = dark ? 'text-gray-500' : 'text-gray-400';
  const pct  = dark ? 'text-gray-300' : 'text-gray-600';
  const barBg = dark ? 'bg-gray-800'  : 'bg-gray-200';
  const borderT = dark ? 'border-gray-800' : 'border-gray-100';

  return (
    <div className={`p-8 font-sans transition-colors duration-300 ${bg}`}>
      <div className="mb-10">
        <h1 className={`text-4xl font-black tracking-tight mb-2 ${h1}`}>SkyOS Command Center</h1>
        <p className={sub}>Engineering Smart Industrial Futures | Real-time System Overview</p>
      </div>

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
                <div className={`h-1.5 rounded-full ${barColor(sys.status)} transition-all duration-700`} style={{ width: `${sys.load}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkyOsDashboard;
