"use client";

import { useState } from "react";
import Sidebar from "../../../components/PMS-1682(Solar)/sidebar";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EnergyRow {
  id: number;
  serverDateTime: string;
  unit: number;
  meterNo: number;
  thermalEnergyUnit: number;
  chilledWaterFlow: number;
  chilledWaterSupplyTemp: number;
  chilledWaterReturnTemp: number;
  enet: number;
}

const tableData: EnergyRow[] = [
  {
    id: 1,
    serverDateTime: "2026-06-04 13:32:13",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1456,
    chilledWaterFlow: 231,
    chilledWaterSupplyTemp: 14.698,
    chilledWaterReturnTemp: 9.2882,
    enet: 8945862,
  },
  {
    id: 2,
    serverDateTime: "2026-06-04 13:37:13",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1356,
    chilledWaterFlow: 230,
    chilledWaterSupplyTemp: 14.3237,
    chilledWaterReturnTemp: 9.2586,
    enet: 8945976,
  },
  {
    id: 3,
    serverDateTime: "2026-06-04 13:42:13",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1353,
    chilledWaterFlow: 215,
    chilledWaterSupplyTemp: 13.9978,
    chilledWaterReturnTemp: 8.60143,
    enet: 8946089,
  },
  {
    id: 4,
    serverDateTime: "2026-06-04 13:47:13",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1138,
    chilledWaterFlow: 188,
    chilledWaterSupplyTemp: 13.3947,
    chilledWaterReturnTemp: 8.20386,
    enet: 8946188,
  },
  {
    id: 5,
    serverDateTime: "2026-06-04 13:52:13",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1096,
    chilledWaterFlow: 184,
    chilledWaterSupplyTemp: 13.346,
    chilledWaterReturnTemp: 8.24647,
    enet: 8946194,
  },
  {
    id: 6,
    serverDateTime: "2026-06-04 14:18:39",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1031,
    chilledWaterFlow: 238,
    chilledWaterSupplyTemp: 17.0762,
    chilledWaterReturnTemp: 13.3516,
    enet: 8946256,
  },
  {
    id: 7,
    serverDateTime: "2026-06-04 14:23:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1369,
    chilledWaterFlow: 239,
    chilledWaterSupplyTemp: 17.0999,
    chilledWaterReturnTemp: 12.1755,
    enet: 8946359,
  },
  {
    id: 8,
    serverDateTime: "2026-06-04 14:28:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1620,
    chilledWaterFlow: 239,
    chilledWaterSupplyTemp: 16.1921,
    chilledWaterReturnTemp: 10.3771,
    enet: 8946482,
  },
  {
    id: 9,
    serverDateTime: "2026-06-04 14:33:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1474,
    chilledWaterFlow: 238,
    chilledWaterSupplyTemp: 15.3742,
    chilledWaterReturnTemp: 10.0498,
    enet: 8946608,
  },
  {
    id: 10,
    serverDateTime: "2026-06-04 14:38:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1429,
    chilledWaterFlow: 233,
    chilledWaterSupplyTemp: 15.1043,
    chilledWaterReturnTemp: 9.83993,
    enet: 8946723,
  },
  {
    id: 11,
    serverDateTime: "2026-06-04 14:43:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1415,
    chilledWaterFlow: 226,
    chilledWaterSupplyTemp: 14.6625,
    chilledWaterReturnTemp: 9.28031,
    enet: 8946839,
  },
  {
    id: 12,
    serverDateTime: "2026-06-04 14:48:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1361,
    chilledWaterFlow: 220,
    chilledWaterSupplyTemp: 14.3457,
    chilledWaterReturnTemp: 9.03922,
    enet: 8946953,
  },
  {
    id: 13,
    serverDateTime: "2026-06-04 14:53:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1331,
    chilledWaterFlow: 209,
    chilledWaterSupplyTemp: 14.014,
    chilledWaterReturnTemp: 8.54257,
    enet: 8947067,
  },
  {
    id: 14,
    serverDateTime: "2026-06-04 14:58:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1155,
    chilledWaterFlow: 196,
    chilledWaterSupplyTemp: 13.7653,
    chilledWaterReturnTemp: 8.70811,
    enet: 8947170,
  },
  {
    id: 15,
    serverDateTime: "2026-06-04 15:03:43",
    unit: 1,
    meterNo: 2,
    thermalEnergyUnit: 1077,
    chilledWaterFlow: 195,
    chilledWaterSupplyTemp: 13.1223,
    chilledWaterReturnTemp: 8.37728,
    enet: 8947269,
  },
];

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

export default function DetailReports() {
  const [search, setSearch] = useState("");

  const filteredData = tableData.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-2 md:p-3">
      {/* TOP CARD */}
      <div className="overflow-hidden rounded border border-gray-300 bg-[#efefef] shadow-sm">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-300 px-5 py-3">
          <h1 className="text-[18px] font-bold text-[#f0a000]">
            Details Report intimo
          </h1>

          <button className="text-gray-500">
            <span className="text-2xl">−</span>
          </button>
        </div>

        {/* FILTER AREA */}
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          {/* DATE START */}
          <div>
            <label className="mb-2 block text-[15px] font-bold text-black">
              Date Start:
            </label>

            <div className="relative">
              <input
                type="date"
                defaultValue="2026-06-04"
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-[16px] outline-none"
              />

              <CalendarDays
                size={18}
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
                className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-[16px] outline-none"
              />

              <CalendarDays
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button className="w-full rounded bg-[#0d6efd] py-2.5 text-[16px] font-medium text-white hover:bg-blue-700">
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* ENERGY DETAILS */}
      <div className="mt-4 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
        {/* RED TITLE */}
        <div className="bg-[#dc3545] px-6 py-3">
          <h2 className="text-[17px] font-bold text-white">
            Energy Details
          </h2>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          {/* BUTTONS */}
          <div className="flex flex-wrap gap-2">
            {["Copy", "Excel", "CSV", "PDF", "Print"].map((btn) => (
              <button
                key={btn}
                className="rounded bg-[#6c757d] px-4 py-2 text-sm text-white hover:bg-[#5c636a]"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-3">
            <label className="text-[15px] text-black">Search:</label>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[220px] rounded border border-gray-300 px-3 py-2 outline-none"
              />

              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto px-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#17a2b8] text-left text-white">
                {headers.map((header, index) => (
                  <th
                    key={header}
                    className={`border border-[#138496] px-2 py-2 text-[14px] font-bold whitespace-nowrap ${
                      index === 0 ? "w-[50px]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {header}

                      <div className="flex flex-col text-[#59d4e8] leading-none">
                        <span className="-mb-1 text-[10px]">▲</span>
                        <span className="text-[10px]">▼</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={row.id}
                  className={`text-[14px] ${
                    index % 2 === 0
                      ? "bg-[#d6d6d6]"
                      : "bg-[#e5e5e5]"
                  }`}
                >
                  <td className="border border-gray-300 px-2 py-2">
                    {row.id}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.serverDateTime}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.unit}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.meterNo}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.thermalEnergyUnit}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.chilledWaterFlow}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.chilledWaterSupplyTemp}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.chilledWaterReturnTemp}
                  </td>

                  <td className="border border-gray-300 px-2 py-2">
                    {row.enet}.0
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-5 md:flex-row md:items-center">
          <p className="text-[15px] text-gray-700">
            Showing 1 to {filteredData.length} of {filteredData.length} entries
          </p>

          {/* PAGINATION */}
          <div className="flex items-center gap-2">
            <button className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>

            <button className="rounded bg-[#0d6efd] px-4 py-2 text-white">
              1
            </button>

            <button className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}