import { useState } from 'react';
import { Check, AlertCircle, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PRUpdateProps {
  onDataUpdate: (counts: { successCount: number; reworkCount: number; defectCount: number }) => void;
}

function p_r_update({ onDataUpdate }: PRUpdateProps) {
  const [successCount, setSuccessCount] = useState(0);
  const [reworkCount,  setReworkCount]  = useState(0);
  const [defectCount,  setDefectCount]  = useState(0);
  const { theme } = useTheme();
  const dark = theme === 'dark';

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

  const dropdowns = [
    { label: 'Team No',      options: ['Team 01', 'Team 02'] },
    { label: 'Style',        options: ['GJ51S812(Top+Bottom)'] },
    { label: 'Color',        options: ['Green', 'Blue', 'Red'] },
    { label: 'Size',         options: ['L', 'M', 'S', 'XL'] },
    { label: 'Check Point',  options: ['End Line QC', 'In-line QC'] },
  ];

  return (
    <div className={`min-h-screen p-3 pb-24 md:p-6 font-sans transition-colors duration-300 ${bg}`}>
      <div className={`border rounded-xl shadow-sm p-4 md:p-8 transition-colors duration-300 ${card}`}>

        {/* Header Info */}
        <div className={`flex flex-wrap items-center justify-between text-sm font-semibold tracking-wide mb-8 border-b pb-4 ${headerText} ${divider}`}>
          <div>BUYER : Kohl&apos;s</div>
          <div>GG : 7GG</div>
          <div>SMV : 6.97</div>
          <div>PRESENT CARDER : 21</div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
          {dropdowns.map(d => (
            <div key={d.label} className="flex flex-col">
              <label className={`text-xs font-semibold tracking-wide uppercase mb-2 ${label}`}>{d.label}</label>
              <div className="relative">
                <select className={`w-full appearance-none border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-1 cursor-pointer transition-colors ${sel}`}>
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
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{successCount}</div>
            <button
              onClick={() => { const n = successCount + 1; setSuccessCount(n); onDataUpdate({ successCount: n, reworkCount, defectCount }); }}
              className="w-full bg-[#7bc17e] hover:bg-[#6ba96e] transition-colors text-white py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm"
            >
              <Check size={24} /> Success
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{reworkCount}</div>
            <button
              onClick={() => { const n = reworkCount + 1; setReworkCount(n); onDataUpdate({ successCount, reworkCount: n, defectCount }); }}
              className="w-full bg-[#edc05c] hover:bg-[#d8ae4f] transition-colors text-[#2c2c2c] py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm"
            >
              <AlertCircle size={22} /> Rework
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-light mb-4 leading-none ${val}`}>{defectCount}</div>
            <button
              onClick={() => { const n = defectCount + 1; setDefectCount(n); onDataUpdate({ successCount, reworkCount, defectCount: n }); }}
              className="w-full bg-[#d64152] hover:bg-[#bd3846] transition-colors text-white py-4 md:py-5 rounded-xl flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold shadow-sm"
            >
              <X size={26} /> Defect
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
            {[0,0,0,0,0,0,0].map((_, i) => (
              <div key={i} className={`py-3 md:py-4 text-gray-800 border-r ${hourBorder}`}>0</div>
            ))}
            <div className="py-3 md:py-4 bg-orange-600 text-white font-bold">{successCount}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default p_r_update;
