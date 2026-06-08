type DetailRow = {
  id: number;
  date: string;
  line: string;
  headNo: number;
  department: "MMT" | "CUTTING" | "TECHNICAL";
  shift: number;
  startTime: string;
  stopTime: string;
  shortCode: string;
  reasonCode: string;
  downtime: number;
};

const rows: DetailRow[] = [
  {
    id: 1,
    date: "2026-06-08",
    line: "LB09",
    headNo: 5,
    department: "MMT",
    shift: 1,
    startTime: "06:05:27",
    stopTime: "06:09:30",
    shortCode: "",
    reasonCode: "NA",
    downtime: 4,
  },
  {
    id: 2,
    date: "2026-06-08",
    line: "LB03",
    headNo: 9,
    department: "MMT",
    shift: 1,
    startTime: "06:07:37",
    stopTime: "06:25:15",
    shortCode: "",
    reasonCode: "NA",
    downtime: 18,
  },
  {
    id: 3,
    date: "2026-06-08",
    line: "LB02",
    headNo: 9,
    department: "CUTTING",
    shift: 1,
    startTime: "06:08:30",
    stopTime: "06:19:00",
    shortCode: "CK 01",
    reasonCode: "CUT KIT",
    downtime: 11,
  },
  {
    id: 5,
    date: "2026-06-08",
    line: "LB04",
    headNo: 1,
    department: "MMT",
    shift: 1,
    startTime: "06:08:48",
    stopTime: "06:17:37",
    shortCode: "",
    reasonCode: "NA",
    downtime: 9,
  },
  {
    id: 6,
    date: "2026-06-08",
    line: "LB10",
    headNo: 7,
    department: "CUTTING",
    shift: 1,
    startTime: "06:11:04",
    stopTime: "07:14:28",
    shortCode: "CK 01",
    reasonCode: "CUT KIT",
    downtime: 63,
  },
  {
    id: 7,
    date: "2026-06-08",
    line: "LB04",
    headNo: 7,
    department: "CUTTING",
    shift: 1,
    startTime: "06:11:36",
    stopTime: "06:23:56",
    shortCode: "",
    reasonCode: "NA",
    downtime: 12,
  },
  {
    id: 9,
    date: "2026-06-08",
    line: "LB16",
    headNo: 1,
    department: "MMT",
    shift: 1,
    startTime: "06:17:54",
    stopTime: "06:28:23",
    shortCode: "",
    reasonCode: "NA",
    downtime: 11,
  },
  {
    id: 10,
    date: "2026-06-08",
    line: "LB09",
    headNo: 8,
    department: "MMT",
    shift: 1,
    startTime: "06:18:38",
    stopTime: "06:20:48",
    shortCode: "",
    reasonCode: "NA",
    downtime: 2,
  },
  {
    id: 11,
    date: "2026-06-08",
    line: "LB03",
    headNo: 1,
    department: "TECHNICAL",
    shift: 1,
    startTime: "06:20:14",
    stopTime: "06:24:43",
    shortCode: "",
    reasonCode: "NA",
    downtime: 4,
  },
  {
    id: 12,
    date: "2026-06-08",
    line: "LB10",
    headNo: 6,
    department: "CUTTING",
    shift: 1,
    startTime: "06:22:40",
    stopTime: "06:32:40",
    shortCode: "",
    reasonCode: "NA",
    downtime: 10,
  },
];

const headerCell =
  "border border-gray-300 bg-[#f3f3f3] px-2 py-2 text-left text-[12px] font-semibold text-[#1f2d3d]";
const bodyCell = "border border-gray-300 px-2 py-2 text-[12px] text-[#1f2d3d]";

export default function AndonDetailsDashboard() {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#e9ecef] p-2 text-gray-800">
      <section className="rounded border border-gray-300 bg-white shadow-sm">
        <header className="border-b border-gray-300 bg-[#f3f3f3] px-3 py-2 text-[16px] text-[#23354a]">
          Downtime Reports - Details
        </header>

        <div className="grid grid-cols-1 gap-3 p-3 xl:grid-cols-[1fr_1fr_0.6fr_1fr]">
          <label className="space-y-1">
            <span className="block text-[13px] font-semibold text-[#12263a]">
              Start Date Time:
            </span>
            <input
              type="text"
              defaultValue="06/08/2026 05:00 AM"
              className="h-8 w-full rounded border border-gray-300 px-2 text-[12px]"
            />
          </label>

          <label className="space-y-1">
            <span className="block text-[13px] font-semibold text-[#12263a]">
              End Date Time:
            </span>
            <input
              type="text"
              defaultValue="06/09/2026 10:30 PM"
              className="h-8 w-full rounded border border-gray-300 px-2 text-[12px]"
            />
          </label>

          <label className="space-y-1">
            <span className="block text-[13px] font-semibold text-[#12263a]">
              Shift
            </span>
            <select className="h-8 w-full rounded border border-gray-300 px-2 text-[12px]">
              <option>All</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="block text-[13px] font-semibold text-[#12263a]">
              Category Name
            </span>
            <select className="h-8 w-full rounded border border-gray-300 px-2 text-[12px]">
              <option>All</option>
              <option>MMT</option>
              <option>CUTTING</option>
              <option>TECHNICAL</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3 px-3 pb-4">
          <button className="rounded bg-[#1f75cc] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1a66b0]">
            View Report
          </button>
          <button className="rounded bg-[#1f75cc] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[#1a66b0]">
            Print Report
          </button>
        </div>
      </section>

      <section className="mt-3 rounded border border-gray-300 bg-white shadow-sm">
        <header className="border-b border-gray-300 bg-[#f3f3f3] px-3 py-2 text-[15px] text-[#23354a]">
          Downtime Details
        </header>

        <div className="px-3 py-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <button className="rounded bg-[#6c7a89] px-2.5 py-1 text-[11px] font-semibold text-white">
                Copy
              </button>
              <button className="rounded bg-[#6c7a89] px-2.5 py-1 text-[11px] font-semibold text-white">
                Excel
              </button>
              <button className="rounded bg-[#6c7a89] px-2.5 py-1 text-[11px] font-semibold text-white">
                CSV
              </button>
              <button className="rounded bg-[#6c7a89] px-2.5 py-1 text-[11px] font-semibold text-white">
                PDF
              </button>
              <button className="rounded bg-[#6c7a89] px-2.5 py-1 text-[11px] font-semibold text-white">
                Print
              </button>
            </div>

            <label className="flex items-center gap-2 text-[12px] text-gray-700">
              Search:
              <input className="h-7 w-[140px] rounded border border-gray-300 px-2" />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full border-collapse">
              <thead>
                <tr>
                  <th className={`${headerCell} w-8`}>#</th>
                  <th className={headerCell}>Date</th>
                  <th className={headerCell}>Line</th>
                  <th className={headerCell}>Head No</th>
                  <th className={headerCell}>Department</th>
                  <th className={headerCell}>Shift</th>
                  <th className={headerCell}>Start Time</th>
                  <th className={headerCell}>Stop Time</th>
                  <th className={headerCell}>Short Code</th>
                  <th className={headerCell}>Reason Code</th>
                  <th className={headerCell}>Downtime (Min)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className={bodyCell}>{row.id}</td>
                    <td className={bodyCell}>{row.date}</td>
                    <td className={bodyCell}>{row.line}</td>
                    <td className={bodyCell}>{row.headNo}</td>
                    <td className={bodyCell}>{row.department}</td>
                    <td className={bodyCell}>{row.shift}</td>
                    <td className={bodyCell}>{row.startTime}</td>
                    <td className={bodyCell}>{row.stopTime}</td>
                    <td className={bodyCell}>{row.shortCode || ""}</td>
                    <td className={bodyCell}>{row.reasonCode}</td>
                    <td className={bodyCell}>{row.downtime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-gray-700">
            <p>Showing 1 to 10 of 212 entries</p>

            <div className="flex items-center gap-2">
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-gray-500">
                Previous
              </button>
              <button className="rounded border border-blue-600 bg-blue-600 px-3 py-1 text-[12px] text-white">
                1
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                2
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                3
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                4
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                5
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                ...
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                22
              </button>
              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-[12px] text-blue-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}