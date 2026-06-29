"use client";

import { useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EnergyData {
  id: number;
  serverDateTime: string;
  meterNo: number;
  totalKW: number;
  totalKWh: number;
}

const tableData: EnergyData[] = [];

const headers = [
  "#",
  "ServerDateTime",
  "Meter No",
  "Total_kW",
  "Total_kWh",
];

export default function DetailReportEnergy() {
  const [search, setSearch] = useState("");

  const filteredData = tableData.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#f3f4f6] p-2 sm:p-3 md:p-4">
      <div>
        {/* TOP CARD */}
        <div className="overflow-hidden rounded border border-gray-300 bg-[#efefef] shadow-sm">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-300 px-3 sm:px-5 py-2 sm:py-3">
            <h1 className="text-base sm:text-lg md:text-[18px] font-bold text-[#f0a000]">
              Details Report Energy
            </h1>

            <button className="text-gray-500 text-xl sm:text-2xl hover:text-gray-700">
              <span>−</span>
            </button>
          </div>

          {/* FILTER SECTION */}
          <div className="grid grid-cols-1 gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 md:grid-cols-4">
            {/* DATE START */}
            <div>
              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm md:text-[15px] font-bold text-black">
                Date Start:
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-05"
                  className="w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-[15px] outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-black sm:size-[18px]"
                />
              </div>
            </div>

            {/* DATE END */}
            <div>
              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm md:text-[15px] font-bold text-black">
                Date End:
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-12"
                  className="w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-[15px] outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-black sm:size-[18px]"
                />
              </div>
            </div>

            {/* ENERGY METER */}
            <div>
              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm md:text-[15px] font-bold text-black">
                Energy meter
              </label>

              <select className="w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-[15px] outline-none">
                <option>2</option>
                <option>1</option>
                <option>3</option>
              </select>
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button className="w-full rounded bg-[#0d6efd] py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-[15px] font-medium text-white hover:bg-blue-700 transition-colors">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* ENERGY DETAILS */}
        <div className="mt-2 sm:mt-3 md:mt-4 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
          {/* RED HEADER */}
          <div className="bg-[#dc3545] px-3 sm:px-4 md:px-6 py-2 sm:py-3">
            <h2 className="text-base sm:text-lg md:text-[17px] font-bold text-white">
              Energy Details
            </h2>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 md:flex-row md:items-center">
            {/* EXPORT BUTTONS */}
            <div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
              {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
                <button
                  key={btn}
                  className="rounded bg-[#6c757d] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white hover:bg-[#5c636a] transition-colors whitespace-nowrap"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <label className="text-xs sm:text-sm md:text-[15px] text-black whitespace-nowrap">
                Search:
              </label>

              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-[180px] rounded border border-gray-300 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none"
                />

                <Search
                  size={14}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-[15px]"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto px-2 sm:px-3 md:px-4">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse text-xs sm:text-sm md:text-[14px]">
                <thead>
                  <tr className="bg-[#17a2b8] text-left text-white">
                    {headers.map((header, index) => (
                      <th
                        key={header}
                        className={`border border-[#138496] px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs md:text-[14px] font-bold whitespace-nowrap ${
                          index === 0 ? "w-[40px] sm:w-[60px]" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {header}

                          <div className="flex flex-col leading-none text-[#4ed2e7]">
                            <span className="-mb-1 text-[8px] sm:text-[10px]">▲</span>
                            <span className="text-[8px] sm:text-[10px]">▼</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="border border-gray-300 py-4 sm:py-6 text-center text-sm sm:text-base md:text-[18px] text-gray-700"
                      >
                        No data available in table
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row) => (
                      <tr key={row.id}>
                        <td className="border border-gray-300 px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2">
                          {row.id}
                        </td>

                        <td className="border border-gray-300 px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2 whitespace-nowrap">
                          {row.serverDateTime}
                        </td>

                        <td className="border border-gray-300 px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2">
                          {row.meterNo}
                        </td>

                        <td className="border border-gray-300 px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2">
                          {row.totalKW}
                        </td>

                        <td className="border border-gray-300 px-1.5 sm:px-2.5 md:px-3 py-1.5 sm:py-2">
                          {row.totalKWh}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 md:flex-row md:items-center">
            <p className="text-xs sm:text-sm md:text-[15px] text-gray-700">
              Showing 0 to 0 of 0 entries
            </p>

            {/* PAGINATION */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <button className="flex items-center gap-1 sm:gap-2 rounded border border-gray-300 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
                <ChevronLeft size={14} className="sm:size-[16px]" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button className="flex items-center gap-1 sm:gap-2 rounded border border-gray-300 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={14} className="sm:size-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}