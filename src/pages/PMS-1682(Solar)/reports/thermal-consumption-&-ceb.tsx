"use client";

import { useState } from "react";
import Sidebar from "../../../components/PMS-1682(Solar)/sidebar";
import {
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ThermalRow {
  id: number;
  date: string;

  mfmDay: number;
  mfmPeak: number;
  mfmOffPeak: number;

  mfiDay: number;
  mfiPeak: number;
  mfiOffPeak: number;

  thermalMfmDay: number;
  thermalMfmPeak: number;
  thermalMfmOffPeak: number;

  thermalMfiDay: number;
  thermalMfiPeak: number;
  thermalMfiOffPeak: number;

  mfmDayPercent: string;
  mfmPeakPercent: string;
  mfmOffPeakPercent: string;

  mfiDayPercent: string;
  mfiPeakPercent: string;
  mfiOffPeakPercent: string;

  totalMfmKwh: number;
  totalMfiKwh: number;
  totalCombined: number;

  finalMfmPercent: string;
  finalMfiPercent: string;
}

const tableData: ThermalRow[] = [
  {
    id: 1,
    date: "2026-06-02",

    mfmDay: 7126,
    mfmPeak: 1835,
    mfmOffPeak: 3352,

    mfiDay: 695,
    mfiPeak: 0,
    mfiOffPeak: 25,

    thermalMfmDay: 11407,
    thermalMfmPeak: 1840,
    thermalMfmOffPeak: 5024,

    thermalMfiDay: 12136,
    thermalMfiPeak: 3549,
    thermalMfiOffPeak: 5283,

    mfmDayPercent: "48 %",
    mfmPeakPercent: "34 %",
    mfmOffPeakPercent: "49 %",

    mfiDayPercent: "52 %",
    mfiPeakPercent: "66 %",
    mfiOffPeakPercent: "51 %",

    totalMfmKwh: 18271,
    totalMfiKwh: 20968,
    totalCombined: 39239,

    finalMfmPercent: "47 %",
    finalMfiPercent: "53 %",
  },

  {
    id: 2,
    date: "2026-06-03",

    mfmDay: -4641861,
    mfmPeak: 0,
    mfmOffPeak: 2810,

    mfiDay: -666557,
    mfiPeak: 0,
    mfiOffPeak: 0,

    thermalMfmDay: -2457430,
    thermalMfmPeak: 0,
    thermalMfmOffPeak: 3819,

    thermalMfiDay: -8919339,
    thermalMfiPeak: 0,
    thermalMfiOffPeak: 4554,

    mfmDayPercent: "22 %",
    mfmPeakPercent: "0 %",
    mfmOffPeakPercent: "46 %",

    mfiDayPercent: "78 %",
    mfiPeakPercent: "0 %",
    mfiOffPeakPercent: "54 %",

    totalMfmKwh: -2453611,
    totalMfiKwh: -8914785,
    totalCombined: -11368396,

    finalMfmPercent: "0 %",
    finalMfiPercent: "0 %",
  },

  {
    id: 3,
    date: "2026-06-04",

    mfmDay: 4660063,
    mfmPeak: 1546,
    mfmOffPeak: 592,

    mfiDay: 668806,
    mfiPeak: 15,
    mfiOffPeak: 6,

    thermalMfmDay: 2489388,
    thermalMfmPeak: 2060,
    thermalMfmOffPeak: 708,

    thermalMfiDay: 8950751,
    thermalMfiPeak: 3162,
    thermalMfiOffPeak: 1241,

    mfmDayPercent: "22 %",
    mfmPeakPercent: "39 %",
    mfmOffPeakPercent: "36 %",

    mfiDayPercent: "78 %",
    mfiPeakPercent: "61 %",
    mfiOffPeakPercent: "64 %",

    totalMfmKwh: 2492156,
    totalMfiKwh: 8955154,
    totalCombined: 11447310,

    finalMfmPercent: "22 %",
    finalMfiPercent: "78 %",
  },
];

export default function ThermalConsumptionReport() {
  const [search, setSearch] = useState("");

  const filteredData = tableData.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#e9ecef]">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto p-2 sm:p-4">
        {/* TOP CARD */}
        <div className="overflow-hidden rounded border border-gray-300 bg-[#efefef] shadow-sm">
          {/* TITLE */}
          <div className="flex items-center justify-between border-b border-gray-300 px-3 py-3 sm:px-5 sm:py-4">
            <h1 className="text-lg sm:text-xl md:text-[22px] font-medium text-[#333]">
              Thermal consumption Report
            </h1>

            <button className="text-xl sm:text-2xl text-gray-500">−</button>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-3">
            {/* START DATE */}
            <div>
              <label className="mb-2 block text-sm sm:text-[15px] font-bold text-black">
                Start Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-02"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 sm:size-[18px]"
                />
              </div>
            </div>

            {/* END DATE */}
            <div>
              <label className="mb-2 block text-sm sm:text-[15px] font-bold text-black">
                End Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-07"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm outline-none"
                />

                <CalendarDays
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 sm:size-[18px]"
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex items-end">
              <button className="w-full rounded bg-[#0d6efd] py-2 sm:py-2.5 text-white text-sm sm:text-base hover:bg-blue-700 transition-colors">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="mt-3 sm:mt-4 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
          {/* HEADER */}
          <div className="bg-[#dc3545] px-3 sm:px-5 py-2 sm:py-3">
            <h2 className="text-base sm:text-lg md:text-[18px] font-bold text-white">
              Thermal Details
            </h2>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col items-start justify-between gap-3 p-2 sm:gap-4 sm:p-4 md:flex-row md:items-center">
            {/* EXPORT BUTTONS */}
            <div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
              {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
                <button
                  key={btn}
                  className="rounded bg-[#6c757d] px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white hover:bg-[#5a6268] transition-colors whitespace-nowrap"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <label className="text-xs sm:text-sm text-black whitespace-nowrap">Search:</label>

              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-[180px] rounded border border-gray-300 px-3 py-2 text-xs sm:text-sm outline-none"
                />

                <Search
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 sm:size-[15px]"
                />
              </div>
            </div>
          </div>

          {/* TABLE WRAPPER */}
          <div className="overflow-x-auto px-2 sm:px-4">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse text-[11px] sm:text-[12px] md:text-[13px]">
              {/* GROUP HEADERS */}
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-yellow-300 px-1 sm:px-2 py-2 sm:py-3 text-xs sm:text-sm">
                    .
                  </th>

                  <th
                    colSpan={3}
                    className="border border-gray-300 bg-lime-400 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm"
                  >
                    Energy meter MFM
                  </th>

                  <th
                    colSpan={3}
                    className="border border-gray-300 bg-lime-400 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm"
                  >
                    Energy meter MFI
                  </th>

                  <th
                    colSpan={6}
                    className="border border-gray-300 bg-yellow-300 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm"
                  >
                    Thermal Energy Consumption of MFM
                  </th>

                  <th
                    colSpan={6}
                    className="border border-gray-300 bg-red-500 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-white text-xs sm:text-sm"
                  >
                    Thermal Energy Consumption of MFI
                  </th>

                  <th
                    colSpan={5}
                    className="border border-gray-300 bg-yellow-300 px-1 sm:px-2 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm"
                  >
                    Daily total energy consumption of MFM & MFI
                  </th>
                </tr>

                {/* SUB HEADERS */}
                <tr className="bg-[#17a2b8] text-white">
                  {[
                    "#",
                    "Date",
                    "Day",
                    "Peak",
                    "Off Peak",
                    "Day",
                    "Peak",
                    "Off Peak",
                    "Day kWh",
                    "Peak kWh",
                    "Off Peak kWh",
                    "Day %",
                    "Peak %",
                    "Off Peak %",
                    "Day kWh",
                    "Peak kWh",
                    "Off Peak kWh",
                    "Day %",
                    "Peak %",
                    "Off Peak %",
                    "MFM kWh",
                    "MFI kWh",
                    "Total",
                    "MFM %",
                    "MFI %",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className={`border border-gray-300 px-1 sm:px-2 py-1.5 sm:py-2 text-xs whitespace-nowrap ${
                        [
                          11,
                          12,
                          13,
                          17,
                          18,
                          19,
                          23,
                          24,
                        ].includes(index)
                          ? "bg-lime-400 text-black"
                          : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-[#d9d9d9]"
                        : "bg-[#ececec]"
                    }`}
                  >
                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.id}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3 whitespace-nowrap">
                      {row.date}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmDay}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmOffPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiDay}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiOffPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfmDay}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfmPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfmOffPeak}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmDayPercent}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmPeakPercent}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfmOffPeakPercent}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfiDay}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfiPeak}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.thermalMfiOffPeak}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiDayPercent}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiPeakPercent}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.mfiOffPeakPercent}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.totalMfmKwh}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.totalMfiKwh}
                    </td>

                    <td className="border border-gray-300 px-1 sm:px-2 py-2 sm:py-3">
                      {row.totalCombined}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.finalMfmPercent}
                    </td>

                    <td className="border border-gray-300 bg-green-200 px-1 sm:px-2 py-2 sm:py-3">
                      {row.finalMfiPercent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-start justify-between gap-3 px-2 sm:gap-4 sm:px-4 py-3 sm:py-5 md:flex-row md:items-center">
            <p className="text-xs sm:text-sm text-gray-700">
              Showing 1 to {filteredData.length} of{" "}
              {filteredData.length} entries
            </p>

            {/* PAGINATION */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="rounded border border-gray-300 bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={16} className="sm:size-[16px]" />
              </button>

              <button className="rounded bg-[#0d6efd] px-3 sm:px-4 py-1.5 sm:py-2 text-white text-sm sm:text-base min-w-[2.5rem] sm:min-w-[3rem]">
                1
              </button>

              <button className="rounded border border-gray-300 bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors">
                <ChevronRight size={16} className="sm:size-[16px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}