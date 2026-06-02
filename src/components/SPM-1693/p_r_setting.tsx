import { useState, type ChangeEvent } from 'react';
import type { DashboardData } from './p_r_dashboard';
import { useTheme } from '../../context/ThemeContext';

interface PRSettingProps { onDataUpload: (data: DashboardData) => void; }

function p_r_setting({ onDataUpload }: PRSettingProps) {
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const bg      = dark ? 'bg-gray-950'                    : 'bg-slate-100';
  const card    = dark ? 'bg-gray-900 border-gray-800'    : 'bg-white border-gray-200';
  const title   = dark ? 'text-white'                     : 'text-gray-900';
  const sub     = dark ? 'text-gray-500'                  : 'text-gray-500';
  const thClass = dark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700';
  const tdClass = dark ? 'border-gray-800 text-gray-400'  : 'border-gray-300 text-gray-600';
  const btn     = dark
    ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-200'
    : 'border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800';

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) { alert('Please choose a file first.'); return; }
    const parsedExcelData: DashboardData = {
      team: 'Team 18', buyer: 'Pepco', style: 'SS25BG127', gauge: '14GG',
      smv: '14.64', carder: '18', whRh: '10 | --',
      perfEfi: '1%', lineEfi: '0.32%', hourlyTarget: '56 / 0', todayTarget: '1009.8 / 57',
      hourlyBalance: '56', todayBalance: '952.8', uptoNowTarget: '574 / 57',
      todayCheckQty: '57', uptoNowBalance: '517', totalDefectQty: '0',
      dhu: '0.0%', topDefects: ['1.123', '- -', '- -'],
    };
    onDataUpload(parsedExcelData);
    alert(`File ${file.name} read successfully!`);
  };

  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-300 ${bg}`}>

      {/* Header */}
      <div className={`border rounded-xl shadow-sm p-5 flex justify-between items-center mb-6 transition-colors duration-300 ${card}`}>
        <h1 className={`text-xl font-bold ${title}`}>Day Plan Upload</h1>
        <div className={`text-sm ${sub}`}>
          <span>Settings</span> &gt; <span>Day Plan Upload</span>
        </div>
      </div>

      {/* Upload */}
      <div className={`border rounded-xl shadow-sm p-6 mb-8 flex items-center gap-4 transition-colors duration-300 ${card}`}>
        <span className={`font-semibold text-sm ${sub}`}>*.XLSX</span>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:bg-orange-500 file:text-white file:rounded file:font-medium hover:file:bg-orange-600 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          className={`border py-2 px-5 rounded-lg text-sm font-semibold shadow-sm transition-colors ${btn}`}
        >
          Read and Upload
        </button>
      </div>

      {/* Table */}
      <div className={`overflow-x-auto border rounded-xl shadow-sm transition-colors duration-300 ${card}`}>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className={`text-xs border-b ${thClass}`}>
            <tr>
              {['ID','Line No','Resp Employee','Buyer','Style','GG','SMV',
                'Display WH','Actual WH','PlanTgtPcs','Per_Hour_Pcs',
                'Available Cader','Present Linkers','Status'].map(h => (
                <th key={h} className={`px-4 py-3 font-semibold border-r last:border-r-0 ${tdClass}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={14} className={`px-4 py-10 text-center ${sub}`}>
                Upload an Excel file to display the plan data here.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default p_r_setting;
