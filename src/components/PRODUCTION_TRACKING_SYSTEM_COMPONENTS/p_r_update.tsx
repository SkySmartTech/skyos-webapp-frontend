import React, { useState } from 'react';
import { Check, AlertCircle, X, ChevronDown } from 'lucide-react';

interface PRUpdateProps {
  onDataUpdate: (counts: { successCount: number; reworkCount: number; defectCount: number }) => void;
}

function p_r_update({ onDataUpdate }: PRUpdateProps) {
  const [successCount, setSuccessCount] = useState(0);
  const [reworkCount, setReworkCount] = useState(0);
  const [defectCount, setDefectCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#f0f2f5] p-6 font-sans">
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-8">
        
        {/* Top Header Information */}
        <div className="flex flex-wrap items-center justify-between text-gray-600 text-sm font-medium tracking-wide mb-8 border-b border-gray-100 pb-4">
          <div>BUYER : Kohl s</div>
          <div>GG : 7GG</div>
          <div>SMV : 6.97</div>
          <div>PRESENT CARDER : 21</div>
        </div>

        {/* Filters / Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-16">
          
          {/* Team No */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-2">Team No</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>Team 01</option>
                <option>Team 02</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-2">Style</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>GJ51S812(Top+Bottom)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-2">Color</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>Green</option>
                <option>Blue</option>
                <option>Red</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-2">Size</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>L</option>
                <option>M</option>
                <option>S</option>
                <option>XL</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Check Point */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-xs font-semibold tracking-wide uppercase mb-2">Check Point</label>
            <div className="relative">
              <select className="w-full appearance-none border border-gray-300 rounded-md py-2.5 px-4 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
                <option>End Line QC</option>
                <option>In-line QC</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

        </div>

        {/* Big Counters and Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Success Block */}
          <div className="flex flex-col items-center">
            <div className="text-[5rem] font-light text-[#5a6268] mb-4 leading-none">
              {successCount}
            </div>
            <button
              onClick={() => { const n = successCount + 1; setSuccessCount(n); onDataUpdate({ successCount: n, reworkCount, defectCount }); }}
              className="w-full bg-[#7bc17e] hover:bg-[#6ba96e] transition-colors text-white py-5 rounded-md flex items-center justify-center gap-3 text-2xl font-medium shadow-sm"
            >
              <Check size={28} />
              Success
            </button>
          </div>

          {/* Rework Block */}
          <div className="flex flex-col items-center">
            <div className="text-[5rem] font-light text-[#5a6268] mb-4 leading-none">
              {reworkCount}
            </div>
            <button
              onClick={() => { const n = reworkCount + 1; setReworkCount(n); onDataUpdate({ successCount, reworkCount: n, defectCount }); }}
              className="w-full bg-[#edc05c] hover:bg-[#d8ae4f] transition-colors text-[#2c2c2c] py-5 rounded-md flex items-center justify-center gap-3 text-2xl font-medium shadow-sm"
            >
              <AlertCircle size={26} />
              Rework
            </button>
          </div>

          {/* Defect Block */}
          <div className="flex flex-col items-center">
            <div className="text-[5rem] font-light text-[#5a6268] mb-4 leading-none">
              {defectCount}
            </div>
            <button
              onClick={() => { const n = defectCount + 1; setDefectCount(n); onDataUpdate({ successCount, reworkCount, defectCount: n }); }}
              className="w-full bg-[#d64152] hover:bg-[#bd3846] transition-colors text-white py-5 rounded-md flex items-center justify-center gap-3 text-2xl font-medium shadow-sm"
            >
              <X size={28} />
              Defect
            </button>
          </div>

        </div>

        {/* Hourly Table Grid */}
        <div className="border border-gray-200 rounded-sm overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 bg-white border-b border-gray-200 text-center">
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 1</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 2</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 3</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 4</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 5</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 6</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Hour: 7</div>
            <div className="py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hour: 8</div>
          </div>
          
          {/* Values Row */}
          <div className="grid grid-cols-8 text-center bg-[#a6cddc]">
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            <div className="py-4 text-gray-800 border-r border-[#96bac8]">0</div>
            {/* Active/Current Hour Column */}
            <div className="py-4 bg-[#4a8522] text-white font-medium">{successCount}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default p_r_update;