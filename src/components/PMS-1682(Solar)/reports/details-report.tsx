"use client";

import { useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EnergyRow {
  id: number;
  serverDateTime: string;
  unit: string;
  meterNo: string;
  thermalEnergyUnit: string;
  chilledWaterFlow: string;
  chilledWaterSupplyTemp: string;
  chilledWaterReturnTemp: string;
  enet: string;
}

const tableData: EnergyRow[] = [];

const headers = [
  "#",
  "ServerDateTime",
  "Unit",
  "Meter No",
  "ThermalEnergyUnit",
  "ChilledWaterFlow",
  "ChilledWaterSupplyTemp",
  "ChilledWaterReturnTemp",
  "ENET",
];

export default function EnergyDetailsReportPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-full bg-[#f1f2f6] p-2 sm:p-4">
      <main className="flex-1">
        {/* MAIN CONTAINER */}
        <div className="rounded-md border border-gray-300 bg-white shadow-sm">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-300 px-3 sm:px-5 py-3 sm:py-4">
            <h1 className="text-base sm:text-lg md:text-[18px] font-bold text-[#f4a000]">
              Details Report
            </h1>

            <button className="text-gray-500 transition hover:text-black">
              <span className="text-xl sm:text-2xl font-light">−</span>
            </button>
          </div>

          {/* FILTER SECTION */}
          <div className="grid grid-cols-1 gap-3 sm:gap-5 p-3 sm:p-4 sm:grid-cols-2 md:grid-cols-4">
            {/* DATE START */}
            <div>
              <label className="mb-2 block text-[15px] font-bold text-black">
                Date Start:
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-04"
                  className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-blue-500"
                />

                <CalendarDays
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                />
              </div>
            </div>

            {/* END START */}
            <div>
              <label className="mb-2 block text-[15px] font-bold text-black">
                End Start:
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-04"
                  className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-[16px] outline-none focus:border-blue-500"
                />

                <CalendarDays
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                />
              </div>
            </div>

            {/* FACTORY */}
            <div>
              <label className="mb-2 block text-[15px] font-bold text-black">
                Factory
              </label>

              <select className="w-full rounded border border-blue-400 bg-white px-4 py-3 text-[16px] outline-none focus:border-blue-600">
                <option>MFI & MFM</option>
                <option>MFI</option>
                <option>MFM</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button className="w-full rounded bg-[#0d6efd] py-3 text-[16px] font-medium text-white transition hover:bg-blue-700">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* ENERGY DETAILS */}
        <div className="mt-3 sm:mt-5 overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
          {/* RED HEADER */}
          <div className="bg-[#dc3545] px-3 sm:px-6 py-2 sm:py-4">
            <h2 className="text-base sm:text-[17px] font-bold text-white">
              Energy Details
            </h2>
          </div>

          {/* TABLE TOOLBAR */}
          <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 p-3 sm:p-6 md:flex-row md:items-center">
            {/* EXPORT BUTTONS */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
                <button
                  key={btn}
                  className="rounded bg-[#5a6268] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-[15px] text-white transition hover:bg-[#4b5257] whitespace-nowrap"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <label className="text-sm sm:text-[16px] text-black whitespace-nowrap">Search:</label>

              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-52 rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />

                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto px-3 sm:px-6">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#11a8c8] text-left text-white">
                  {headers.map((header, index) => (
                    <th
                      key={header}
                      className={`border border-[#0d8faa] px-4 py-3 text-[15px] font-bold whitespace-nowrap ${
                        index === 0 ? "w-[60px]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {header}

                        <div className="flex flex-col leading-none text-[#4dd3eb]">
                          <span className="-mb-1 text-[10px]">▲</span>
                          <span className="text-[10px]">▼</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="border border-gray-300 py-8 text-center text-[18px] text-gray-600"
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  tableData.map((row) => (
                    <tr key={row.id}>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.serverDateTime}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.unit}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.meterNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.thermalEnergyUnit}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.chilledWaterFlow}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.chilledWaterSupplyTemp}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.chilledWaterReturnTemp}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        {row.enet}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-start justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-4 sm:py-6 md:flex-row md:items-center">
            <p className="text-sm sm:text-[16px] text-gray-700">
              Showing 0 to 0 of 0 entries
            </p>

            {/* PAGINATION */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="flex items-center gap-1 sm:gap-2 rounded border border-gray-300 bg-white px-3 sm:px-5 py-2 sm:py-3 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap">
                <ChevronLeft size={16} />
                Previous
              </button>

              <button className="flex items-center gap-1 sm:gap-2 rounded border border-gray-300 bg-white px-3 sm:px-5 py-2 sm:py-3 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap">
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
    </main>
    </div>
  );
}