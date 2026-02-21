import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Gauge from '../components/Gauge.jsx';
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
import AppBackground from "../components/shared/AppBackground";
import BackToHomeButton from '../components/auth/BackToHomeButton.jsx';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Loader from '../components/shared/Loader';

const ReportDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const report = location.state?.report;
  
  const [fetching, setFetching] = useState(!report);
  const [dailyReady, setDailyReady] = useState(false);
  const [error, setError] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const containerRef = useRef();

  // Subscribe to Realtime Database `tank/daily` and keep local dailyData
  useEffect(() => {
    const dailyRef = ref(db, 'tank/daily');
    const unsubscribe = onValue(dailyRef, (snapshot) => {
      const val = snapshot.val();
      let arr = [];
      if (val) {
        if (Array.isArray(val)) arr = val;
        else arr = Object.keys(val).map((k) => ({ id: k, ...val[k] }));
      }
      setDailyData(arr);
      setDailyReady(true);
    }, (err) => {
      console.error('Failed to read tank/daily:', err);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const [selectedMetric, setSelectedMetric] = useState('ph');
  const [hoverPoint, setHoverPoint] = useState(null);

  useGSAP(() => {
    if (!report || fetching || !dailyReady) return;
    
    // Ensure DOM is actually mounted before animating
    if (!document.querySelector(".detail-card-anim")) return;

    const tl = gsap.timeline();

    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 });
    }

    tl.fromTo(".detail-card-anim", 
      { scale: 0.98, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" }
    );

    tl.fromTo(".detail-header-anim", 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
      "-=0.8"
    );

    tl.fromTo(".detail-kpi-anim", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out" },
      "-=0.6"
    );

    tl.fromTo(".detail-chart-anim", 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.7"
    );

    tl.fromTo(".detail-analysis-anim", 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.5"
    );

  }, { scope: containerRef, dependencies: [report, fetching, dailyReady] });

  if (fetching || !dailyReady) {
    return <Loader/>;
  }

  if (!report) {
    return (
      <div className="h-screen w-screen bg-zinc-950 text-gray-100">
        <AppBackground />
        <Navbar />
        <div className="relative z-10 p-10">
          <h1 className="text-xl font-bold">Report Not Found</h1>
          <p className="text-gray-400">The requested report could not be found.</p>
        </div>
      </div>
    );
  }

  // Safely parse AI summary JSON
  let aiSummary = {};
  try {
    const rawSummary = report?.raw?.ai_report?.summary ?? '';
    const cleaned = rawSummary.replace(/```json/g, "").replace(/```/g, "").trim();
    aiSummary = cleaned ? JSON.parse(cleaned) : {};
  } catch (e) {
    console.error('Failed to parse aiSummary for report', id, e);
    aiSummary = {};
  }

  const data = report.raw || {};

  // prefer realtime `dailyData` when available, otherwise fall back to report-provided readings
  const rawDailyReadings = (dailyData && dailyData.length > 0)
    ? dailyData
    : (report.dailyReadings || report.readings || []);

  const parseReadingDate = (r) => {
    if (!r) return null;
    if (r.date) return new Date(r.date);
    if (r.timestamp) return new Date(r.timestamp);
    if (r.time) return new Date(r.time);
    return null;
  };

  let weekStart = report.raw?.weekStart ? new Date(report.raw.weekStart) : null;
  let weekEnd = report.raw?.weekEnd ? new Date(report.raw.weekEnd) : null;
  if (weekStart && !weekEnd) {
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
  }
  if (!weekStart && !weekEnd) {
    weekEnd = new Date();
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
  }

  const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const startNorm = normalizeDate(weekStart);
  const endNorm = normalizeDate(weekEnd);

  const dailyReadings = rawDailyReadings.filter((d) => {
    const dt = parseReadingDate(d);
    if (!dt || isNaN(dt.getTime())) return false;
    const n = normalizeDate(dt);
    return n >= startNorm && n <= endNorm;
  });

  const MetricTabs = () => (
    <div className="flex bg-transparent rounded gap-2">
      {[
        { key: 'ph', label: 'pH' },
        { key: 'tds', label: 'TDS' },
        { key: 'temp', label: 'Temp' },
        { key: 'turbidity', label: 'Turbidity' },
      ].map((m) => (
        <button
          key={m.key}
          onClick={() => setSelectedMetric(m.key)}
          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 ${selectedMetric === m.key ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );

  const SeverityBadge = ({ severity = 'Safe' }) => {
    const s = (severity || '').toLowerCase();
    const colors = {
      critical: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
      moderate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      minor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      safe: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
    };
    const cls = colors[s] || colors.safe;
    return <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${cls}`}>{severity}</div>;
  };

  const Chart = ({ areaData }) => {
    const width = 1000;
    const height = 300;
    
    const ptsFor = (key) => {
      const vals = areaData.map((d) => {
        const v = key === 'temp' ? (d.temperature ?? d.temp) : (key === 'tds' ? (d.tds ?? d.TDS) : (key === 'ph' ? (d.ph ?? d.pH) : (d.turbidity ?? d.turb ?? d.ntu)));
        return Number(v ?? 0);
      });
      const max = Math.max(...vals, 1);
      return vals.map((v, i) => {
        const x = (i / Math.max(1, vals.length - 1)) * (width - 100) + 50;
        const y = height - 50 - ((v / max) * (height - 100));
        return { x, y, v };
      });
    };

    const metrics = [
      { key: 'ph', color: '#06b6d4' },
      { key: 'tds', color: '#3b82f6' },
      { key: 'temp', color: '#8b5cf6' },
      { key: 'turbidity', color: '#10b981' },
    ];

    const currentMetric = metrics.find(m => m.key === selectedMetric) || metrics[0];
    const pts = ptsFor(selectedMetric);

    if (!pts || pts.length === 0) {
      return (
        <div className="w-full h-[300px] flex flex-col items-center justify-center text-zinc-500 font-medium bg-white/[0.02] rounded-3xl border border-white/5 mt-4 gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3"/><path d="M21 5v14c0 1.66-4 3-9 3s-9-1.34-9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34-9-3"/></svg>
          </div>
          <p className="text-sm tracking-widest uppercase font-black opacity-40">No telemetry data for this period</p>
        </div>
      );
    }

    const lineD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaD = `${lineD} L ${pts[pts.length - 1].x} ${height - 50} L ${pts[0].x} ${height - 50} Z`;

    return (
      <div className="relative w-full h-[300px] mt-4">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentMetric.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={currentMetric.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#chartGradient)" />
          <path d={lineD} fill="none" stroke={currentMetric.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="6" fill="#09090b" stroke={currentMetric.color} strokeWidth="3" />
              <text x={p.x} y={height - 20} textAnchor="middle" fill="#52525b" fontSize="12" fontWeight="bold">Day {i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const recSource = aiSummary.recommendations || '';
  let recList = [];
  if (Array.isArray(recSource)) recList = recSource;
  else if (typeof recSource === 'string') {
    const parts = recSource.split(/\r?\n+|(?=\d+\.\s)/);
    recList = parts.map(s => s.replace(/^[-\d\.\)\s]*/, '').trim()).filter(Boolean);
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-transparent relative overflow-x-hidden report-detail-container opacity-0">
      <AppBackground />
      <div className="relative z-10 text-gray-100 pb-20">
        <Navbar />
        <div className="p-4 md:p-10">
          <div className="max-w-7xl mx-auto p-6 md:p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden detail-card-anim">
            {/* Background Accent */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="mb-12 relative z-10 flex flex-col gap-8 detail-header-anim">
              <BackToHomeButton to="/report" label="Back to Reports" />
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight leading-tight">
                  Report Details
                </h1>
                <p className="text-zinc-500 text-sm mt-3 font-medium uppercase tracking-[0.15em]">Weekly System Analysis Profile</p>
              </div>
            </div>
            
            {/* Row 1: KPIs and Stat Cards */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              <div className="w-full lg:w-1/3 detail-kpi-anim">
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 h-full flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="w-full flex items-center justify-center relative z-10">
                    <div className="w-56 h-56 flex flex-col items-center justify-center relative">
                      <Gauge 
                        id="water-quality-index"
                        value={aiSummary.score}
                        max={100}
                        hideText={true}
                        colors={["#06b6d4", "#2563eb"]}
                      />
                      <div className="mt-4 text-center">
                        <div className="text-5xl font-black text-white tracking-tighter">
                          {aiSummary.score ?? '—'}
                        </div>
                        <div className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.2em] mt-1">Water Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {[
                    { key: 'ph', label: 'pH (avg)', field: 'ph_avg', color: '#06b6d4', unit: 'LEVEL' },
                    { key: 'tds', label: 'TDS (avg)', field: 'tds_avg', color: '#3b82f6', unit: 'PPM' },
                    { key: 'temp', label: 'Temp (avg)', field: 'temp_avg', color: '#8b5cf6', unit: '°C' },
                    { key: 'turbidity', label: 'Turbidity (avg)', field: 'turbidity_avg', color: '#10b981', unit: 'NTU' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSelectedMetric(s.key)}
                      className={`detail-kpi-anim p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-start gap-6 group ${selectedMetric === s.key ? 'bg-white/[0.05] border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'}`}
                    >
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] group-hover:text-zinc-400 transition-colors">{s.label}</div>
                      <div className="w-full flex items-center justify-between mt-auto">
                        <div>
                          <div className="text-4xl font-black text-white tracking-tight">{data[s.field] != null ? Number(data[s.field]).toFixed(2) : '—'}</div>
                          <div className="text-[10px] text-zinc-600 font-bold tracking-widest mt-1 opacity-60">{s.unit}</div>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedMetric === s.key ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-500'}`}>
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Main Chart */}
            <div className="mb-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-inner detail-chart-anim">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Temporal Quality Gradient</div>
                <MetricTabs />
              </div>
              <Chart areaData={dailyReadings} />
            </div>

            {/* Row 3: Analysis & Detailed Report */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 border-r border-white/5 pr-0 lg:pr-10 detail-analysis-anim">
                <div className="space-y-10">
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Health Assessment</h4>
                    <SeverityBadge severity={(aiSummary.severity || 'Safe')} />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Actionable Insights</h4>
                    <div className="space-y-4">
                      {recList.map((rec, i) => (
                        <div key={i} className="flex gap-4 text-sm text-zinc-400 bg-white/[0.02] p-5 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all hover:translate-x-1">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_12px_rgba(6,182,212,1)]" />
                          <p className="leading-relaxed font-medium">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 detail-analysis-anim">
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Full Evaluation Summary</h4>
                    <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-zinc-700 font-mono tracking-wider">REF_ID: {id.slice(-6).toUpperCase()}</div>
                  </div>
                  <div className="text-[16px] leading-[1.8] text-zinc-400 text-justify prose prose-invert max-w-none whitespace-pre-wrap font-light">
                    {(() => {
                      const raw = aiSummary.summary ?? 'No detailed analysis provided.';
                      const parts = raw.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
                      return parts.map((p, i) => {
                        if (/^\*\*[^*]+\*\*$/.test(p)) {
                          const inner = p.replace(/^\*\*(.*)\*\*$/, '$1');
                          return <strong key={i} className="font-bold text-white border-b border-cyan-500/20 pb-0.5 mx-0.5">{inner}</strong>;
                        }
                        return <span key={i}>{p}</span>;
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
