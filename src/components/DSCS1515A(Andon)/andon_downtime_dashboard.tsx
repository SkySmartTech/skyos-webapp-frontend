import { useEffect, useMemo, useState } from "react";

type DowntimeRow = {
  label: string;
  cells: string[];
  color: string;
};

const lineBoards = [
  "LB 01",
  "LB 02",
  "LB 03",
  "LB 04",
  "LB 05",
  "LB 06",
  "LB 07",
  "LB 08",
  "LB 09",
  "LB 10",
  "LB 11",
  "LB 12",
  "LB 13",
  "LB 14",
  "LB 15",
  "LB 16",
  "LB 17",
  "LB 18",
  "LB 19",
  "LB 20",
  "LB 21",
  "LB 22",
];

const downtimeRows: DowntimeRow[] = [
  { label: "TECHNICAL", cells: Array(22).fill("00:00:00"), color: "bg-red-500" },
  { label: "CUTTING", cells: Array(22).fill("00:00:00"), color: "bg-green-600" },
  { label: "MMT", cells: Array(22).fill("00:00:00"), color: "bg-yellow-300" },
  { label: "QA/MQA", cells: Array(22).fill("00:00:00"), color: "bg-sky-300" },
];

function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return time.toLocaleTimeString("en-GB", { hour12: false });
}

function DowntimeMatrix({ startIndex }: { startIndex: number }) {
  const columns = useMemo(() => lineBoards.slice(startIndex, startIndex + 11), [startIndex]);

  return (
    <div className="overflow-hidden border border-white bg-white shadow-sm">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="w-[180px] bg-[#2e3b6a] border border-white/80 px-4 py-4" />
            {columns.map((board) => (
              <th
                key={board}
                className="border border-white/80 bg-[#05050d] px-3 py-4 text-center text-[17px] font-bold tracking-wide text-[#d6de62]"
              >
                {board}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {downtimeRows.map((row) => (
            <tr key={row.label}>
              <td
                className={`${row.color} border border-white/80 px-4 py-4 text-center text-[15px] font-bold text-white`}
              >
                {row.label}
              </td>
              {columns.map((board) => (
                <td
                  key={`${row.label}-${board}`}
                  className="border border-white/80 bg-[#0b0bff] px-3 py-4 text-center text-[15px] font-medium text-white"
                >
                  {row.cells[0]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AndonDowntimeDashboard() {
  const currentTime = useClock();

  return (
    <div className="min-h-full w-full overflow-y-auto bg-[#f5f5f5] px-3 py-3 text-slate-900">
      <div className="mx-auto flex min-h-full max-w-[1920px] flex-col gap-3">
        <header className="flex items-center justify-between gap-4 bg-[#3a456d] px-4 py-4 shadow-sm">
          <div className="flex h-12 w-20 items-center justify-center bg-white px-2 text-[28px] font-light tracking-tight text-slate-700">
            ILUETA
          </div>
          <h1 className="flex-1 text-center text-[clamp(1.8rem,2.4vw,3.2rem)] font-bold tracking-tight text-[#d6de62]">
            Smart Andon System -Dashboard
          </h1>
          <div className="min-w-[150px] text-right text-[clamp(1.8rem,2vw,2.6rem)] font-semibold text-[#27d39a]">
            {currentTime}
          </div>
        </header>

        <main className="flex flex-col gap-3">
          <DowntimeMatrix startIndex={0} />
          <DowntimeMatrix startIndex={11} />
        </main>

        <footer className="mt-auto flex flex-col gap-3 bg-[#1f2227] px-4 py-5 text-white md:flex-row md:items-center md:justify-between">
          <div className="text-center text-[15px] md:text-left">
            Copyright © 2024 Sky Smart Technology Pvt Ltd. All Rights Reserved
          </div>
          <div className="text-center text-[15px] md:text-right">Soft Ver: 1.0</div>
        </footer>
      </div>
    </div>
  );
}