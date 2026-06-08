"use client";

import { useState } from "react";
import Sidebar from "../../../components/PMS-1682(Solar)/sidebar";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ThermalRow {
  id: number;
  date: string;

  mfmDay: number;
  mfmPeak: number;
  mfmOffPeak: number;

  mfmDayPercent: number;
  mfmPeakPercent: number;
  mfmOffPeakPercent: number;

  mfiDay: number;
  mfiPeak: number;
  mfiOffPeak: number;

  mfiDayPercent: number;
  mfiPeakPercent: number;
  mfiOffPeakPercent: number;

  mfmTotal: number;
  mfiTotal: number;
  total: number;

  mfmPercent: number;
  mfiPercent: number;
}

const tableData: ThermalRow[] = [
  {
    id: 1,
    date: "2026-05-29",
    mfmDay: 12935,
    mfmPeak: 2565,
    mfmOffPeak: 3932,
    mfmDayPercent: 53,
    mfmPeakPercent: 48,
    mfmOffPeakPercent: 42,

    mfiDay: 11374,
    mfiPeak: 2829,
    mfiOffPeak: 5404,
    mfiDayPercent: 47,
    mfiPeakPercent: 52,
    mfiOffPeakPercent: 58,

    mfmTotal: 19432,
    mfiTotal: 19607,
    total: 39039,

    mfmPercent: 50,
    mfiPercent: 50,
  },

  {
    id: 2,
    date: "2026-05-30",
    mfmDay: 710,
    mfmPeak: 15,
    mfmOffPeak: 3179,
    mfmDayPercent: 50,
    mfmPeakPercent: 100,
    mfmOffPeakPercent: 45,

    mfiDay: 708,
    mfiPeak: 0,
    mfiOffPeak: 3928,
    mfiDayPercent: 50,
    mfiPeakPercent: 0,
    mfiOffPeakPercent: 55,

    mfmTotal: 3904,
    mfiTotal: 4636,
    total: 8540,

    mfmPercent: 46,
    mfiPercent: 54,
  },

  {
    id: 3,
    date: "2026-05-31",
    mfmDay: 465,
    mfmPeak: 200,
    mfmOffPeak: 115,
    mfmDayPercent: 15,
    mfmPeakPercent: 17,
    mfmOffPeakPercent: 23,

    mfiDay: 2684,
    mfiPeak: 991,
    mfiOffPeak: 392,
    mfiDayPercent: 85,
    mfiPeakPercent: 83,
    mfiOffPeakPercent: 77,

    mfmTotal: 780,
    mfiTotal: 4067,
    total: 4847,

    mfmPercent: 16,
    mfiPercent: 84,
  },
];

export default function ThermalConsumptionReport() {
  const [search, setSearch] = useState("");

  const filteredData = tableData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4">
        {/* TOP CARD */}
        <div className="overflow-hidden rounded border border-gray-300 bg-[#efefef] shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-300 px-3 sm:px-5 py-2 sm:py-3">
            <h1 className="text-base sm:text-lg md:text-[18px] font-medium text-[#444]">
              Thermal consumption Report
            </h1>

            <button className="text-gray-500 text-lg sm:text-xl hover:text-gray-700">−</button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold">
                Start Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-05-29"
                  className="w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 sm:size-[18px]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-semibold">
                End Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-03"
                  className="w-full rounded border border-gray-300 bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 sm:size-[18px]"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button className="w-full rounded bg-[#0d6efd] py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base text-white hover:bg-blue-700 transition-colors font-medium">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* THERMAL DETAILS */}
        <div className="mt-2 sm:mt-3 md:mt-4 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
          <div className="bg-[#dc3545] px-3 sm:px-5 py-2 sm:py-3">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white">
              Thermal Details
            </h2>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
              {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
                <button
                  key={btn}
                  className="rounded bg-[#6c757d] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white hover:bg-[#5a6268] transition-colors whitespace-nowrap"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <label className="text-xs sm:text-sm whitespace-nowrap">Search:</label>

              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-auto rounded border border-gray-300 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none"
                />

                <Search
                  size={14}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-[16px]"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto px-2 sm:px-3 md:px-4">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse text-[10px] sm:text-xs md:text-sm">
                <thead>
                  <tr>
                    <th colSpan={8} className="bg-yellow-300 border border-gray-300 py-1.5 sm:py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold whitespace-nowrap">
                      Thermal Energy Consumption of MFM
                    </th>

                    <th
                      colSpan={6}
                      className="bg-red-600 text-white border border-gray-300 py-1.5 sm:py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold whitespace-nowrap"
                    >
                      Thermal Energy Consumption of MFI
                    </th>

                    <th
                      colSpan={5}
                      className="bg-yellow-300 border border-gray-300 py-1.5 sm:py-2 px-1 sm:px-2 text-xs sm:text-sm font-bold whitespace-nowrap"
                    >
                      Daily Total Energy Consumption of MFM & MFI
                    </th>
                  </tr>

                  <tr className="bg-cyan-600 text-white">
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">#</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Date</th>

                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Day kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Peak kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Off Peak kWh</th>

                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Day %</th>
                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Peak %</th>
                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Off Peak %</th>

                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Day kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Peak kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Off Peak kWh</th>

                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Day %</th>
                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Peak %</th>
                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Off Peak %</th>

                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">MFM kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">MFI kWh</th>
                    <th className="border border-gray-300 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">Total</th>

                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">MFM %</th>
                    <th className="border border-gray-300 bg-green-500 p-1 sm:p-1.5 text-[9px] sm:text-xs whitespace-nowrap">MFI %</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={
                        index % 2 === 0
                          ? "bg-gray-200"
                          : "bg-gray-100"
                      }
                    >
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.id}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5 whitespace-nowrap">{row.date}</td>

                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfmDay}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfmPeak}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfmOffPeak}</td>

                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfmDayPercent}%
                      </td>
                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfmPeakPercent}%
                      </td>
                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfmOffPeakPercent}%
                      </td>

                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfiDay}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfiPeak}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfiOffPeak}</td>

                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfiDayPercent}%
                      </td>
                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfiPeakPercent}%
                      </td>
                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfiOffPeakPercent}%
                      </td>

                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfmTotal}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.mfiTotal}</td>
                      <td className="border border-gray-300 p-1 sm:p-1.5">{row.total}</td>

                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfmPercent}%
                      </td>
                      <td className="border border-gray-300 bg-green-200 p-1 sm:p-1.5">
                        {row.mfiPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-start justify-between gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 md:flex-row md:items-center">
            <p className="text-xs sm:text-sm">
              Showing 1 to {filteredData.length} of{" "}
              {filteredData.length} entries
            </p>

            <div className="flex items-center gap-1 sm:gap-2">
              <button className="border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={14} className="sm:size-[16px]" />
              </button>

              <button className="bg-[#0d6efd] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm min-w-[2.5rem] sm:min-w-[3rem]">
                1
              </button>

              <button className="border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 transition-colors">
                <ChevronRight size={14} className="sm:size-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}