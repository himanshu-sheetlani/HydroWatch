import Navbar from "../components/Navbar.jsx"
import React, { useEffect, useState } from "react";
import { Download, Send, Eye } from "lucide-react"; // icons
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
// uuid no longer needed — weekly reports come from the backend
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const generateWeeklyReports = (data) => {
    // This function is preserved for compatibility but the client now
    // reads pre-generated weekly reports from `tank/weekly`.
    if (!data || !data.length) return [];
    return data;
  };

  // processWeek and client-side weekly aggregation removed — backend provides weekly summaries

  useEffect(() => {
    // Subscribe to pre-computed weekly reports stored at `tank/weekly`
    const weeklyRef = ref(db, "tank/weekly");
    onValue(weeklyRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();

        // raw is expected to be an object keyed by weekId. Map into the UI shape.
        const mapped = Object.entries(raw).map(([key, val]) => {
          const start = val.weekStart ? new Date(val.weekStart).toDateString() : "";
          const end = val.weekEnd ? new Date(val.weekEnd).toDateString() : "";
          const weekStr = start && end ? `${start} - ${end}` : key;

          const ph = Number(val.ph_avg || 0).toFixed(2);
          const tds = Number(val.tds_avg || 0).toFixed(2);
          const temp = Number(val.temp_avg || 0).toFixed(2);
          const turb = Number(val.turbidity_avg || 0).toFixed(2);

          const summary = `Avg pH: ${ph}, TDS: ${tds} PPM, Temp: ${temp}°C, Turb: ${turb} NTU. Score: ${val.score ?? "N/A"}`;

          return {
            id: key,
            week: weekStr,
            summary,
            generatedOn: val.timestamp ? val.timestamp.split('T')[0] : "",
            status: val.status || 'Generated',
            raw: val,
          };
        });

        // sort descending by weekStart if available
        mapped.sort((a, b) => new Date(b.raw?.weekStart || 0) - new Date(a.raw?.weekStart || 0));

        const weeklyReports = generateWeeklyReports(mapped);
        setReports(weeklyReports);
      } else {
        setReports([]);
      }
    });
  }, []);
  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar/>
      <div className="p-10">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Weekly Reports</h1>
          <p className="text-gray-400 text-m">
            View, download, and send reports to authorities
          </p>
        </div>

        <div className="grid gap-5">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow hover:shadow-lg hover:bg-zinc-800 transition"
            >

              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{report.week}</h2>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    report.status === "Approved"
                      ? "bg-green-900/40 text-green-400 border border-green-600/40"
                      : "bg-yellow-900/40 text-yellow-400 border border-yellow-600/40"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-2">{report.summary}</p>
              <p className="text-xs text-gray-400 mb-4">
                📅 Generated On: {report.generatedOn}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('View clicked for report:', report.id);
                    navigate(`/report/${report.id}`, { state: { report } });
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm transition"
                >
                  <Eye size={16} /> View
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded bg-blue-900/40 border border-blue-600/30 hover:bg-blue-800 text-sm transition">
                  <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded bg-green-900/40 border border-green-600/30 hover:bg-green-800 text-sm transition">
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
