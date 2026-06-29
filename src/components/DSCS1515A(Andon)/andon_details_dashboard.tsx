import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getAndonEvents, type AndonEvent } from "../../api/andonService";

const headerCell =
  "border border-gray-300 bg-[#f3f3f3] px-2 py-2 text-left text-[12px] font-semibold text-[#1f2d3d]";

const bodyCell =
  "border border-gray-300 px-2 py-2 text-[12px] text-[#1f2d3d]";

export default function AndonDetailsDashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [rows, setRows] = useState<AndonEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await getAndonEvents();

      setRows(data);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return dateStr.split(" ")[0];
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    return dateStr.split(" ")[1]?.split(".")[0] ?? "";
  };

  const getDowntime = (start?: string, stop?: string) => {
    if (!start || !stop) return 0;

    const startDate = new Date(start);
    const stopDate = new Date(stop);

    return Math.round(
      (stopDate.getTime() - startDate.getTime()) /
        (1000 * 60)
    );
  };

  const filteredRows = selectedDate
    ? rows.filter(
        (row) =>
          row.ServerDateTime?.date?.split(" ")[0] === selectedDate
      )
    : rows;

  const page = dark
    ? "bg-[#0b1220] text-slate-100"
    : "bg-[#e9ecef] text-gray-800";

  const panel = dark
    ? "bg-[#111827] border-slate-700 shadow-black/20"
    : "bg-white border-gray-300 shadow-sm";

  const panelHeader = dark
    ? "bg-[#182235] border-slate-700 text-slate-100"
    : "bg-[#f3f3f3] border-gray-300 text-[#23354a]";

  const primaryButton = dark
    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
    : "bg-[#1f75cc] hover:bg-[#1a66b0] text-white";

  const field = dark
    ? "bg-slate-950 border-slate-700 text-slate-100"
    : "bg-white border-gray-300 text-gray-700";

  const tableHead = dark
    ? "border-slate-700 bg-slate-800 px-2 py-2 text-left text-[12px] font-semibold text-slate-100"
    : headerCell;

  const tableBody = dark
    ? "border-slate-700 px-2 py-2 text-[12px] text-slate-200"
    : bodyCell;

  return (
    <div className={`h-full w-full overflow-y-auto p-2 ${page}`}>
      <section className={`rounded border ${panel}`}>
        <header className={`border-b px-3 py-2 text-[16px] ${panelHeader}`}>
          Downtime Reports - Details
        </header>

        <div className="flex flex-wrap items-end gap-4 p-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Select Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`h-9 rounded border px-3 ${field}`}
            />
          </div>

          <button
            onClick={() => setSelectedDate("")}
            className={`rounded px-4 py-2 text-[12px] font-semibold ${primaryButton}`}
          >
            Show All
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className={`rounded px-4 py-2 text-[12px] font-semibold ${primaryButton}`}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </section>

      <section className={`mt-3 rounded border ${panel}`}>
        <header className={`border-b px-3 py-2 text-[15px] ${panelHeader}`}>
          Downtime Details
        </header>

        <div className="overflow-x-auto p-3">
          <table className="w-full min-w-[1150px] border-collapse">
            <thead>
              <tr>
                <th className={tableHead}>#</th>
                <th className={tableHead}>Date</th>
                <th className={tableHead}>Line</th>
                <th className={tableHead}>Head No</th>
                <th className={tableHead}>Department</th>
                <th className={tableHead}>Shift</th>
                <th className={tableHead}>Start Time</th>
                <th className={tableHead}>Stop Time</th>
                <th className={tableHead}>Factory</th>
                <th className={tableHead}>Category</th>
                <th className={tableHead}>Downtime (Min)</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row, index) => (
                <tr
                  key={row.ID}
                  className={
                    dark
                      ? "hover:bg-slate-800/50"
                      : "hover:bg-gray-50"
                  }
                >
                  <td className={tableBody}>{index + 1}</td>

                  <td className={tableBody}>
                    {formatDate(row.ServerDateTime?.date)}
                  </td>

                  <td className={tableBody}>
                    {row.WorkCenter?.trim()}
                  </td>

                  <td className={tableBody}>{row.KeyNo}</td>

                  <td className={tableBody}>
                    {row.CategoryName}
                  </td>

                  <td className={tableBody}>{row.Shift}</td>

                  <td className={tableBody}>
                    {formatTime(row.StartTime?.date)}
                  </td>

                  <td className={tableBody}>
                    {formatTime(row.StopTime?.date)}
                  </td>

                  <td className={tableBody}>
                    {row.FactoryCode}
                  </td>

                  <td className={tableBody}>
                    {row.CategoryName}
                  </td>

                  <td className={tableBody}>
                    {getDowntime(
                      row.StartTime?.date,
                      row.StopTime?.date
                    )}
                  </td>
                </tr>
              ))}

              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className={`${tableBody} text-center`}
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-3 flex justify-between text-sm">
            <span>
              Total Records: {filteredRows.length}
            </span>

            {selectedDate && (
              <span>
                Filtered Date: {selectedDate}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}