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

      <main className="flex-1 overflow-auto p-2 md:p-3">
        {/* TOP CARD */}
        <div className="overflow-hidden rounded border border-gray-300 bg-[#efefef] shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-300 px-5 py-3">
            <h1 className="text-[18px] text-[#444]">
              Thermal consumption Report
            </h1>

            <button className="text-gray-500 text-xl">−</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div>
              <label className="mb-2 block font-semibold">
                Start Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-05-29"
                  className="w-full rounded border border-gray-300 bg-white px-4 py-2"
                />

                <CalendarDays
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                End Date
              </label>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-06-03"
                  className="w-full rounded border border-gray-300 bg-white px-4 py-2"
                />

                <CalendarDays
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button className="w-full rounded bg-[#0d6efd] py-2.5 text-white">
                View Report
              </button>
            </div>
          </div>
        </div>

        {/* THERMAL DETAILS */}
        <div className="mt-4 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
          <div className="bg-[#dc3545] px-5 py-3">
            <h2 className="font-bold text-white">
              Thermal Details
            </h2>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
            <div className="flex flex-wrap gap-2">
              {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
                <button
                  key={btn}
                  className="rounded bg-[#6c757d] px-4 py-2 text-sm text-white"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span>Search:</span>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded border border-gray-300 px-3 py-2"
                />

                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-[1800px] border-collapse text-sm">
              <thead>
                <tr>
                  <th colSpan={8} className="bg-yellow-300 border py-2">
                    Thermal Energy Consumption of MFM
                  </th>

                  <th
                    colSpan={6}
                    className="bg-red-600 text-white border py-2"
                  >
                    Thermal Energy Consumption of MFI
                  </th>

                  <th
                    colSpan={5}
                    className="bg-yellow-300 border py-2"
                  >
                    Daily Total Energy Consumption of MFM & MFI
                  </th>
                </tr>

                <tr className="bg-cyan-600 text-white">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Date</th>

                  <th className="border p-2">Day kWh</th>
                  <th className="border p-2">Peak kWh</th>
                  <th className="border p-2">Off Peak kWh</th>

                  <th className="border p-2 bg-green-500">Day %</th>
                  <th className="border p-2 bg-green-500">Peak %</th>
                  <th className="border p-2 bg-green-500">Off Peak %</th>

                  <th className="border p-2">Day kWh</th>
                  <th className="border p-2">Peak kWh</th>
                  <th className="border p-2">Off Peak kWh</th>

                  <th className="border p-2 bg-green-500">Day %</th>
                  <th className="border p-2 bg-green-500">Peak %</th>
                  <th className="border p-2 bg-green-500">Off Peak %</th>

                  <th className="border p-2">MFM kWh</th>
                  <th className="border p-2">MFI kWh</th>
                  <th className="border p-2">Total</th>

                  <th className="border p-2 bg-green-500">MFM %</th>
                  <th className="border p-2 bg-green-500">MFI %</th>
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
                    <td className="border p-2">{row.id}</td>
                    <td className="border p-2">{row.date}</td>

                    <td className="border p-2">{row.mfmDay}</td>
                    <td className="border p-2">{row.mfmPeak}</td>
                    <td className="border p-2">{row.mfmOffPeak}</td>

                    <td className="border p-2 bg-green-200">
                      {row.mfmDayPercent}%
                    </td>
                    <td className="border p-2 bg-green-200">
                      {row.mfmPeakPercent}%
                    </td>
                    <td className="border p-2 bg-green-200">
                      {row.mfmOffPeakPercent}%
                    </td>

                    <td className="border p-2">{row.mfiDay}</td>
                    <td className="border p-2">{row.mfiPeak}</td>
                    <td className="border p-2">{row.mfiOffPeak}</td>

                    <td className="border p-2 bg-green-200">
                      {row.mfiDayPercent}%
                    </td>
                    <td className="border p-2 bg-green-200">
                      {row.mfiPeakPercent}%
                    </td>
                    <td className="border p-2 bg-green-200">
                      {row.mfiOffPeakPercent}%
                    </td>

                    <td className="border p-2">{row.mfmTotal}</td>
                    <td className="border p-2">{row.mfiTotal}</td>
                    <td className="border p-2">{row.total}</td>

                    <td className="border p-2 bg-green-200">
                      {row.mfmPercent}%
                    </td>
                    <td className="border p-2 bg-green-200">
                      {row.mfiPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <p>
              Showing 1 to {filteredData.length} of{" "}
              {filteredData.length} entries
            </p>

            <div className="flex items-center gap-2">
              <button className="border rounded px-3 py-2">
                <ChevronLeft size={16} />
              </button>

              <button className="bg-[#0d6efd] text-white px-4 py-2 rounded">
                1
              </button>

              <button className="border rounded px-3 py-2">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}