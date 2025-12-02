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

          const isPlaceholder = !!val.placeholder;
          return {
            id: key,
            week: weekStr,
            summary,
            // show 'Pending' for placeholder reports
            generatedOn: isPlaceholder ? "Pending" : (val.timestamp ? val.timestamp.split('T')[0] : ""),
            // surface a Pending status for placeholders
            status: isPlaceholder ? 'Pending' : (val.status || 'Generated'),
            isPlaceholder,
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

  // Download a report as PDF. Loads jsPDF from CDN on demand and falls back to JSON.
  const downloadReport = async (report) => {
    if (!report) return;
    console.log(report)
    // Helper: parse AI report summary (may be wrapped code block, JSON string, or plain text)
    const parseAiReportSummary = (rawSummary) => {
      if (!rawSummary) return { summaryText: '', recommendations: [] };
      try {
        const cleaned = String(rawSummary).replace(/```json/g, '').replace(/```/g, '').trim();
        // If cleaned looks like JSON attempt to parse
        if (/^\s*\{/.test(cleaned) || /^\s*\[/.test(cleaned)) {
          const parsed = JSON.parse(cleaned);
          const summaryText = (parsed.summary || parsed.excerpt || parsed.text || '').toString();
          let recs = parsed.recommendations || parsed.recs || parsed.recommendation || '';
          if (Array.isArray(recs)) {
            // ensure strings
            recs = recs.map(r => String(r).trim()).filter(Boolean);
          } else if (typeof recs === 'string') {
            recs = recs.split(/\r?\n+/).map(s => s.replace(/^[-\d\.\)\s]*/, '').trim()).filter(Boolean);
          } else if (recs == null) {
            recs = [];
          } else {
            recs = [String(recs)];
          }
          return { summaryText: summaryText || '', recommendations: recs };
        }

        // Not JSON: try to split plain text into summary + recommendations
        const txt = cleaned;
        const m = txt.match(/recommendations?:?\s*([\s\S]+)$/i);
        if (m) {
          const recBlock = m[1].trim();
          const recs = recBlock.split(/\r?\n+/).map(s => s.replace(/^[-\d\.\)\s]*/, '').trim()).filter(Boolean);
          const summaryText = txt.replace(/recommendations?:[\s\S]+$/i, '').trim();
          return { summaryText, recommendations: recs };
        }

        return { summaryText: txt, recommendations: [] };
      } catch (e) {
        // fallback to raw string
        try {
          const cleaned = String(rawSummary).replace(/```json/g, '').replace(/```/g, '').trim();
          return { summaryText: cleaned, recommendations: [] };
        } catch (e2) {
          return { summaryText: '', recommendations: [] };
        }
      }
    };
    // try to load jspdf UMD bundle if not present
    try {
      if (!window.jspdf) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
          s.onload = () => resolve(true);
          s.onerror = () => resolve(false);
          document.head.appendChild(s);
        });
      }

      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        let y = 40;

        doc.setFontSize(18);
        doc.text(`Weekly Report - ${report.week || report.id || ''}`, margin, y);
        y += 24;

        doc.setFontSize(11);
        doc.setTextColor(90);
        doc.text(`Generated On: ${report.generatedOn || 'N/A'}`, margin, y);
        y += 18;
        doc.text(`Status: ${report.status || 'N/A'}`, margin, y);
        y += 20;

        doc.setTextColor(30);
        const summary = report.summary || '';
        const wrap = doc.splitTextToSize(summary, 520);
        doc.text(wrap, margin, y);
        y += (wrap.length * 14) + 10;

        // include parsed AI analysis & recommendations if available
        const aiRaw = report.raw?.ai_report?.summary;
        const parsedAi = parseAiReportSummary(aiRaw);
        if (parsedAi.summaryText) {
          doc.setFontSize(12);
          doc.setTextColor(30);
          doc.text('AI Analysis Summary:', margin, y);
          y += 16;
          doc.setFontSize(10);
          doc.setTextColor(40);
          const aiLines = doc.splitTextToSize(parsedAi.summaryText, 520);
          doc.text(aiLines, margin, y);
          y += (aiLines.length * 12) + 10;
        }

        if (parsedAi.recommendations && parsedAi.recommendations.length) {
          doc.setFontSize(12);
          doc.setTextColor(30);
          doc.text('Recommendations:', margin, y);
          y += 16;
          doc.setFontSize(10);
          doc.setTextColor(40);
          parsedAi.recommendations.forEach((rec) => {
            const recLines = doc.splitTextToSize('• ' + rec, 500);
            doc.text(recLines, margin + 6, y);
            y += (recLines.length * 12) + 6;
          });
          y += 6;
        }

        // (Removed: raw JSON "Details" section to keep PDFs concise)

        const filename = `${report.id || 'report'}.pdf`;
        doc.save(filename);
        return;
      }
    } catch (e) {
      console.error('PDF generation failed, falling back to JSON download', e);
    }

    // fallback: download JSON file
    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id || 'report'}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download report', e);
    }
  };
  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar/>
      <div className="p-10">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Weekly Reports</h1>
          <p className="text-gray-400 text-m">
            View and download reports
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
                      : report.status === "Pending"
                        ? "bg-zinc-800/40 text-gray-400 border border-zinc-700/40"
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
                  onClick={!report.isPlaceholder ? () => {
                    console.log('View clicked for report:', report.id);
                    navigate(`/report/${report.id}`, { state: { report } });
                  } : undefined}
                  disabled={report.isPlaceholder}
                  className={`flex items-center gap-1 px-3 py-2 rounded bg-zinc-800 text-sm transition ${report.isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'}`}
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={!report.isPlaceholder ? () => downloadReport(report) : undefined}
                  disabled={report.isPlaceholder}
                  className={`flex items-center gap-1 px-3 py-2 rounded bg-blue-900/40 border border-blue-600/30 text-sm transition ${report.isPlaceholder ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                >
                  <Download size={16} /> Download
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
