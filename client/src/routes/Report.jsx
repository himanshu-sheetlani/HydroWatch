import Navbar from "../components/Navbar.jsx"
import React, { useEffect, useState, useRef } from "react";
import { Download, Send, Eye } from "lucide-react"; // icons
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
import { useNavigate } from 'react-router-dom';
import AppBackground from "../components/shared/AppBackground";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Loader from "../components/shared/Loader";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const containerRef = useRef();

  const generateWeeklyReports = (data) => {
    if (!data || !data.length) return [];
    return data;
  };

  useEffect(() => {
    const weeklyRef = ref(db, "tank/weekly");
    onValue(weeklyRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
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
            generatedOn: isPlaceholder ? "Pending" : (val.timestamp ? val.timestamp.split('T')[0] : ""),
            status: isPlaceholder ? 'Pending' : (val.status || 'Generated'),
            isPlaceholder,
            raw: val,
          };
        });
        mapped.sort((a, b) => new Date(b.raw?.weekStart || 0) - new Date(a.raw?.weekStart || 0));
        setReports(generateWeeklyReports(mapped));
        setLoading(false);
      } else {
        setReports([]);
        setLoading(false);
      }
    });
  }, []);

  useGSAP(() => {
    if (reports.length > 0) {
      if (!containerRef.current) return;

      // 1. Pre-hide the elements while the parent is still visibility: hidden
      gsap.set([".report-header-anim", ".report-card-anim"], { opacity: 0, y: -20 });

      // 2. Reveal the parent container
      gsap.set(containerRef.current, { opacity: 1 });

      // 3. Orchestrate the entrance timeline
      const tl = gsap.timeline();
      
      tl.to(".report-header-anim", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      });

      tl.to(".report-card-anim", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.3");
    }
  }, [reports]);

  const downloadReport = async (report) => {
    if (!report) return;
    const parseAiReportSummary = (rawSummary) => {
      if (!rawSummary) return { summaryText: '', recommendations: [] };
      try {
        const cleaned = String(rawSummary).replace(/```json/g, '').replace(/```/g, '').trim();
        if (/^\s*\{/.test(cleaned) || /^\s*\[/.test(cleaned)) {
          const parsed = JSON.parse(cleaned);
          const summaryText = (parsed.summary || parsed.excerpt || parsed.text || '').toString();
          let recs = parsed.recommendations || parsed.recs || parsed.recommendation || '';
          if (Array.isArray(recs)) recs = recs.map(r => String(r).trim()).filter(Boolean);
          else if (typeof recs === 'string') recs = recs.split(/\r?\n+/).map(s => s.replace(/^[-\d\.\)\s]*/, '').trim()).filter(Boolean);
          return { summaryText: summaryText || '', recommendations: recs || [] };
        }
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
        return { summaryText: String(rawSummary), recommendations: [] };
      }
    };

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

        const aiRaw = report.raw?.ai_report?.summary;
        const parsedAi = parseAiReportSummary(aiRaw);
        if (parsedAi.summaryText) {
          doc.setFontSize(12);
          doc.text('AI Analysis Summary:', margin, y);
          y += 16;
          doc.setFontSize(10);
          const aiLines = doc.splitTextToSize(parsedAi.summaryText, 520);
          doc.text(aiLines, margin, y);
          y += (aiLines.length * 12) + 10;
        }

        if (parsedAi.recommendations?.length) {
          doc.setFontSize(12);
          doc.text('Recommendations:', margin, y);
          y += 16;
          doc.setFontSize(10);
          parsedAi.recommendations.forEach((rec) => {
            const recLines = doc.splitTextToSize('• ' + rec, 500);
            doc.text(recLines, margin + 6, y);
            y += (recLines.length * 12) + 6;
          });
        }
        doc.save(`${report.id || 'report'}.pdf`);
        return;
      }
    } catch (e) {
      console.error('PDF generation failed', e);
    }

    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.id || 'report'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-transparent relative overflow-x-hidden opacity-0">
      <AppBackground />
      <div className="relative z-10 text-gray-100">
        <Navbar/>
        <div className="p-10">
          <div className="mb-6 report-header-anim opacity-0 -translate-y-4">
            <h1 className="text-xl mb-2 font-bold">Weekly Reports</h1>
            <p className="text-gray-400 text-m">View and download reports</p>
          </div>

          <div className="grid gap-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="report-card-anim opacity-0 -translate-y-4 p-5 rounded-xl bg-zinc-900/40 border border-white/5 backdrop-blur-md shadow-xl hover:shadow-cyan-500/5 hover:bg-zinc-800/50 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">{report.week}</h2>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    report.status === "Approved" ? "bg-green-900/40 text-green-400 border border-green-600/40" :
                    report.status === "Pending" ? "bg-zinc-800/40 text-gray-400 border border-zinc-700/40" :
                    "bg-yellow-900/40 text-yellow-400 border border-yellow-600/40"
                  }`}>{report.status}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{report.summary}</p>
                <p className="text-xs text-gray-400 mb-4">📅 Generated On: {report.generatedOn}</p>
                <div className="flex gap-3">
                  <button
                    onClick={!report.isPlaceholder ? () => navigate(`/report/${report.id}`, { state: { report } }) : undefined}
                    disabled={report.isPlaceholder}
                    className={`flex items-center gap-1 px-3 py-2 rounded bg-zinc-800/50 text-sm transition-all hover:bg-zinc-700 ${report.isPlaceholder ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={!report.isPlaceholder ? () => downloadReport(report) : undefined}
                    disabled={report.isPlaceholder}
                    className={`flex items-center gap-1 px-3 py-2 rounded bg-cyan-600/20 border border-cyan-500/20 text-sm transition-all hover:bg-cyan-600/30 ${report.isPlaceholder ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
