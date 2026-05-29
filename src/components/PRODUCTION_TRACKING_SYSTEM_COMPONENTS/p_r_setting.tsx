import { useState, type ChangeEvent } from 'react';
import type { DashboardData } from './p_r_dashboard';

interface PRSettingProps {
  onDataUpload: (data: DashboardData) => void;
}

function p_r_setting({ onDataUpload }: PRSettingProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    // Mocking the data extraction from your Excel file
    const parsedExcelData: DashboardData = {
      team: "Team 18", buyer: "Pepco", style: "SS25BG127", gauge: "14GG", 
      smv: "14.64", carder: "18", whRh: "10 | --",
      perfEfi: "1%", lineEfi: "0.32%", hourlyTarget: "56 / 0", todayTarget: "1009.8 / 57",
      hourlyBalance: "56", todayBalance: "952.8", uptoNowTarget: "574 / 57", 
      todayCheckQty: "57", uptoNowBalance: "517", totalDefectQty: "0",
      dhu: "0.0%", topDefects: ["1.123", "- -", "- -"]
    };

    onDataUpload(parsedExcelData);
    alert(`File ${file.name} read successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Top Header Panel */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#0A192F]">DAY PLAN UPLOAD</h1>
        <div className="text-sm text-gray-500">
          <span>Settings</span> &gt; <span>Day Plan Upload</span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow-sm p-6 mb-8 flex items-center space-x-4 border border-gray-100">
        <span className="text-gray-500 font-medium text-sm">*.XLSX</span>
        <input 
          type="file" 
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="border border-gray-300 rounded p-1 text-sm file:mr-4 file:py-1.5 file:px-3 file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
        />
        <button 
          onClick={handleUpload}
          className="border border-gray-400 bg-gray-50 hover:bg-gray-100 text-gray-800 py-1.5 px-4 rounded text-sm shadow-sm transition-colors"
        >
          Read and Upload
        </button>
      </div>

      {/* Empty Table Structure */}
      <div className="overflow-x-auto bg-white border border-gray-300 shadow-sm">
        <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
          <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">ID</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Line No</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Resp Employee</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Buyer</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Style</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">GG</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">SMV</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Display WH</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Actual WH</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">PlanTgtPcs</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Per_Hour_Pcs</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Available Cader</th>
              <th className="px-4 py-2 border-r border-gray-300 font-medium">Present Linkers</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={14} className="px-4 py-8 text-center text-gray-400">
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