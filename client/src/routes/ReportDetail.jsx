import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Gauge from '../components/Gauge.jsx';
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";

const ReportDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const report = location.state?.report;
  
  // const [generatedContent, setGeneratedContent] = useState(
  //   report?.generatedContent ?? null
  // );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  // const [reportData, setReportData] = useState([]);


  // Build a prompt from report + daily readings
  // const buildPrompt = useCallback((reportObj, readings) => {
  //   const header = [`Weekly report: ${reportObj.week || 'Unknown week'}`, `Summary: ${reportObj.summary || 'No summary'}`, `Report ID: ${id}`].join('\n');

  //   const readingLines = (readings || []).map((r, idx) => {
  //     const date = r.date || `Day ${idx + 1}`;
  //     const ph = r.ph ?? r.pH ?? '—';
  //     const temp = r.temperature ?? r.temp ?? '—';
  //     const turb = r.turbidity ?? r.turb ?? r.ntu ?? '—';
  //     const tds = r.tds ?? r.TDS ?? '—';
  //     const note = r.note ? ` Note: ${r.note}` : '';
  //     return `- ${date}: pH=${ph}, Temp=${temp}, Turbidity=${turb}, TDS=${tds}.${note}`;
  //   }).join('\n');

  //   return `${header}\n\nDaily readings:\n${readingLines}\n\nInstructions:\nWrite a detailed, human-readable weekly water quality report based on the data above. Include an executive summary, observed anomalies or trends, likely causes, actionable recommendations to improve water quality, and any safety warnings. Keep the tone professional and concise.`;
  // }, [id]);


  
  // Call Gemini generate endpoint. Returns the generated text or throws.
  // const generateWithGemini = useCallback(async (promptText) => {
  //   const res = await fetch('/api/generate', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ prompt: promptText }),
  //   });
  //   console.log(promptText);

  //   if (!res.ok) throw new Error(await res.text());
  //   const json = await res.json();
  //   return json.text || json.raw || 'No content returned';


  // }, [GEMINI_API_KEY, GEMINI_MODEL]);
  
  // const readings = (dailyData && dailyData.length > 0) ? dailyData : (report.dailyReadings || report.readings || []);
  // useEffect(() => {
  //   axios.post(`http://localhost:3000/api/generate`, { promptText: buildPrompt(report, readings) })
  //     .then((response) => {
  //       console.log(response.data);
  //       setReportData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching report data:', error);
  //     });
  // }, [buildPrompt]);

    // if (!report) return;
    // if (generatedContent) return;

    // const prompt = buildPrompt(report, readings);

    // setLoading(true);
    // setError(null);

    // (async () => {
    //   try {
    //     if (GEMINI_API_KEY) {
    //       const text = await generateWithGemini(prompt);
    //       setGeneratedContent(text || 'No content returned');
    //     } else {
    //       const res = await fetch(`/api/generate-report/${id}`);
    //       if (!res.ok) {
    //         const txt = await res.text().catch(() => '');
    //         throw new Error(`Failed to fetch generated report: ${res.status} ${res.statusText} ${txt}`);
    //       }
    //       const data = await res.json();
    //       setGeneratedContent(data.content || 'No content returned');
    //     }
    //   } catch (e) {
    //     setError(e.message || String(e));
    //   } finally {
    //     setLoading(false);
    //   }
    // })();
  // }, [id, report, generatedContent, dailyData, GEMINI_API_KEY, buildPrompt, generateWithGemini]);

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
    }, (err) => {
      console.error('Failed to read tank/daily:', err);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // const regenerate = () => {
  //   setLoading(true);
  //   setError(null);

  //   const readings = (dailyData && dailyData.length > 0) ? dailyData : (report.dailyReadings || report.readings || []);
  //   const prompt = buildPrompt(report, readings);

  //   (async () => {
  //     try {
  //       if (GEMINI_API_KEY) {
  //         const text = await generateWithGemini(prompt);
  //         setGeneratedContent(text || 'No content returned');
  //       } else {
  //         const res = await fetch(`/api/generate-report/${id}/regenerate`, { method: 'POST' });
  //         if (!res.ok) {
  //           const txt = await res.text().catch(() => '');
  //           throw new Error(`Regeneration failed: ${res.status} ${res.statusText} ${txt}`);
  //         }
  //         const data = await res.json();
  //         setGeneratedContent(data.content || 'No content returned');
  //       }
  //     } catch (e) {
  //       setError(e.message || String(e));
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // };
  
  if (!report) {
    return (
      <div className="h-screen w-screen bg-zinc-950 text-gray-100">
        <Navbar />
        <div className="p-10">
          <h1 className="text-xl font-bold">Report Not Found</h1>
          <p className="text-gray-400">The requested report could not be found.</p>
        </div>
      </div>
    );
  }

  // Safely parse AI summary JSON (it may be wrapped in ```json blocks)
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

  // Helper to parse a date from a reading object
  const parseReadingDate = (r) => {
    if (!r) return null;
    if (r.date) return new Date(r.date);
    if (r.timestamp) return new Date(r.timestamp);
    if (r.time) return new Date(r.time);
    return null;
  };

  // Determine week range: prefer explicit weekStart/weekEnd from report.raw, otherwise fallback to last 7 days
  let weekStart = report.raw?.weekStart ? new Date(report.raw.weekStart) : null;
  let weekEnd = report.raw?.weekEnd ? new Date(report.raw.weekEnd) : null;
  if (weekStart && !weekEnd) {
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
  }
  if (!weekStart && !weekEnd) {
    // fallback to the last 7 days (inclusive)
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

  // Chart / UI state
  const [selectedMetric, setSelectedMetric] = useState('ph'); // ph, tds, temp, turbidity
  const [hoverPoint, setHoverPoint] = useState(null);
  // UI state for AI card actions
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedRecs, setCopiedRecs] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const copyToClipboard = async (text, onDone) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      if (onDone) onDone(true);
    } catch (e) {
      if (onDone) onDone(false);
    }
  };

  const MetricTabs = () => (
    <div className="flex bg-transparent rounded">
      {[
        { key: 'ph', label: 'pH' },
        { key: 'tds', label: 'TDS' },
        { key: 'temp', label: 'Temp' },
        { key: 'turbidity', label: 'Turbidity' },
      ].map((m) => (
        <button
          key={m.key}
          onClick={() => setSelectedMetric(m.key)}
          aria-pressed={selectedMetric === m.key}
          className={`px-3 py-1 text-xs rounded-md transition-all duration-150 flex items-center gap-2 ${selectedMetric === m.key ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/10 text-white ring-1 ring-emerald-500/20 scale-105' : 'text-gray-400 hover:bg-zinc-800/60 hover:text-white'}`}
        >
          <span className={`w-2 h-2 rounded-full ${m.key === 'ph' ? 'bg-sky-400' : m.key === 'tds' ? 'bg-pink-400' : m.key === 'temp' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );

  // small severity badge component
  const SeverityBadge = ({ severity = 'Safe' }) => {
    const s = (severity || '').toLowerCase();
    const cls = s === 'critical' ? 'bg-red-900/40 text-red-400 border border-red-700/40' : s === 'moderate' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-600/40' : s === 'minor' ? 'bg-amber-900/30 text-amber-400 border border-amber-600/30' : 'bg-green-900/40 text-green-400 border border-green-600/40';
    return <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${cls}`}>{severity}</div>;
  };

  // Render recommendations: accept string (possibly numbered) or array

  // Prepare detail blocks for the right card using data and aiSummary

  // Simple SVG multi-line chart drawing
  const Chart = ({ areaData }) => {
    const width = 760;
    const height = 160; // reduced height
    // convert readings to points across x axis
    const points = (key) => {
      const vals = areaData.map((d) => {
        const v = key === 'temp' ? (d.temperature ?? d.temp) : (key === 'tds' ? (d.tds ?? d.TDS) : (key === 'ph' ? (d.ph ?? d.pH) : (d.turbidity ?? d.turb ?? d.ntu)));
        return Number(v ?? 0);
      });
      const max = Math.max(...vals, 1);
      return vals.map((v, i) => {
        const x = (i / Math.max(1, vals.length - 1)) * (width - 40) + 20;
        const y = height - 20 - ((v / max) * (height - 40));
        return { x, y, v };
      });
    };

    const metrics = [
      { key: 'ph', color: '#60A5FA' },
      { key: 'tds', color: '#F472B6' },
      { key: 'temp', color: '#F59E0B' },
      { key: 'turbidity', color: '#34D399' },
    ];

    // labels for dates
    const labels = areaData.map((d) => {
      const dt = d.date ? new Date(d.date) : d.timestamp ? new Date(d.timestamp) : null;
      if (!dt) return '';
      return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    const ptsFor = (key) => points(key);

    return (
      <div className="relative overflow-x-auto">
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
          {metrics.map((m) => {
            const pts = ptsFor(m.key);
            const d = pts.map(p => `${p.x},${p.y}`).join(' ');
            const opacity = selectedMetric === m.key ? 1 : 0.18;
            return <polyline key={m.key} fill="none" stroke={m.color} strokeWidth={selectedMetric === m.key ? 2.5 : 1.2} points={d} strokeLinejoin="round" strokeLinecap="round" opacity={opacity} />;
          })}
          {points(selectedMetric).map((p, i) => (
            <g key={i} onMouseEnter={() => setHoverPoint({ x: p.x, y: p.y, v: p.v, label: labels[i], idx: i })} onMouseLeave={() => setHoverPoint(null)}>
              <circle cx={p.x} cy={p.y} r={4.5} fill="#111827" stroke={selectedMetric === 'temp' ? '#F59E0B' : selectedMetric === 'tds' ? '#F472B6' : selectedMetric === 'ph' ? '#60A5FA' : '#34D399'} strokeWidth={2} className="cursor-pointer" />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoverPoint && (
          <div
            className="absolute pointer-events-none z-30 w-max bg-zinc-800/95 border border-zinc-700 px-3 py-2 rounded text-xs text-white shadow"
            style={{ left: `calc(${(hoverPoint.x / width) * 100}% )`, top: `calc(${(hoverPoint.y / height) * 100}% )`, transform: 'translate(-50%, -120%)' }}
          >
            <div className="font-medium">{hoverPoint.label}</div>
            <div className="text-gray-300">{selectedMetric.toUpperCase()}: <span className="font-semibold">{hoverPoint.v}</span></div>
          </div>
        )}
      </div>
    );
  };

  // Prepare AI card text + actions
  const summaryText = (aiSummary.summary || aiSummary.excerpt || '').toString().trim();
  const recSource = aiSummary.recommendations || '';
  let recList = [];
  if (Array.isArray(recSource)) recList = recSource;
  else if (typeof recSource === 'string') {
    recList = recSource.split(/\r?\n+/).map(s => s.replace(/^[-\d\.\)\s]*/, '').trim()).filter(Boolean);
  }
  const summaryPreview = (!showFullSummary && summaryText && summaryText.length > 220) ? (summaryText.slice(0,220) + '...') : summaryText;

  const sendEmail = () => {
    const subject = `Water Report ${id}`;
    const body = `Summary:\n${summaryText}\n\nRecommendations:\n${recList.join('\n')}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar />
      <div className="p-10">
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Report Details</h1>
          <p className="text-gray-400 text-m">Weekly report and generated detailed analysis</p>
        </div>
          {/* Row 1: KPIs and Stat Cards */}
          <div className="flex gap-6 mb-6">
            {/* Left: Score Card (1/3) */}
            <div className="w-1/3">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 h-full flex items-center justify-center">
                <div className="w-full flex items-center justify-center">
                  <div className="w-48 h-48 flex items-center justify-center relative">
                    <div className="w-full h-full flex items-center justify-center">
                      <Gauge 
                        id="water-quality-index"
                        value={aiSummary.score}
                        max={100}
                        hideText={true}
                        colors={["#0092B8", "#006c86ff"]}
                      />
                    </div>
                    <div className="absolute top-27 inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{aiSummary.score ?? '—'}</div>
                        <div className="text-xs font-bold text-gray-400">Water Quality Index</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stat Cards (2/3) */}
            <div className="w-2/3 flex items-center">
              <div className="p-4 rounded-lg bg-zinc-900 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm text-gray-400">Stat Cards</h3>
                    <div className="text-xs text-gray-500">Weekly Averages</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {[
                    { key: 'ph', label: 'pH (avg)', field: 'ph_avg', color: '#60A5FA', unit: '' },
                    { key: 'tds', label: 'TDS (avg)', field: 'tds_avg', color: '#F472B6', unit: 'PPM' },
                    { key: 'temp', label: 'Temp (avg)', field: 'temp_avg', color: '#F59E0B', unit: '°C' },
                    { key: 'turbidity', label: 'Turbidity (avg)', field: 'turbidity_avg', color: '#34D399', unit: 'NTU' },
                  ].map((s) => {
                    const series = dailyReadings.map((d) => {
                      if (s.key === 'ph') return Number(d.ph ?? d.pH ?? 0);
                      if (s.key === 'tds') return Number(d.tds ?? d.TDS ?? 0);
                      if (s.key === 'temp') return Number(d.temperature ?? d.temp ?? 0);
                      return Number(d.turbidity ?? d.turb ?? d.ntu ?? 0);
                    });

                    const sparkW = 78;
                    const sparkH = 28;
                    const max = Math.max(...series, 1);
                    const points = series.map((v, i) => {
                      const x = (i / Math.max(1, series.length - 1)) * (sparkW - 4) + 2;
                      const y = sparkH - 4 - ((v / max) * (sparkH - 6)) + 2;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <button
                        key={s.key}
                        onClick={() => setSelectedMetric(s.key)}
                        onMouseEnter={() => setHoverPoint({ v: data[s.field], label: s.label })}
                        onMouseLeave={() => setHoverPoint(null)}
                        className={`p-3 py-5 rounded-lg border border-zinc-800 bg-gradient-to-b ${selectedMetric === s.key ? 'from-zinc-800/60 to-zinc-900/60 scale-105 ring-1 ring-emerald-600/20' : 'from-transparent to-transparent'} transition-transform transform hover:scale-105 hover:shadow-lg flex flex-col items-start gap-3`}
                        aria-pressed={selectedMetric === s.key}
                      >
                        <div className="w-full flex justify-between items-start">
                          <div className="text-xs text-gray-400">{s.label}</div>
                          {/* no trend indicator; keep label only */}
                        </div>
                        <div className="w-full flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-semibold">{data[s.field] != null ? Number(data[s.field]).toFixed(2) : '—'}</div>
                            <div className="text-xs text-gray-500">{s.unit}</div>
                          </div>
                          <div className="ml-4">
                            <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`} className="inline-block">
                              <polyline fill="none" stroke={s.color} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
                            </svg>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Main Chart (full width) */}
          <div className="mb-6 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-center mb-3">
              <div>
                {/* <h3 className="text-sm font-semibold">Weekly Trends ({data.weekStart ? new Date(data.weekStart).toDateString() : ''} - {data.weekEnd ? new Date(data.weekEnd).toDateString() : ''})</h3> */}
              </div>
              <div className="flex items-center gap-2">
                {/* metric tabs */}
                <MetricTabs />
              </div>
            </div>
            <Chart areaData={dailyReadings} selectedMetricKeyStateHook={null} aiSummary={aiSummary} />
          </div>

          {/* Row 3: Analysis & Detailed Report (split 1/3 left, 2/3 right) */}
          <div className="flex gap-6">
            <div className="w-1/3">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-sm text-gray-400 mb-2">AI Analysis & Recommendations</h4>
                <div className="mb-3">
                  <SeverityBadge severity={(aiSummary.severity || 'Safe')} />
                </div>
                <div className="space-y-3">
                  {aiSummary.recommendations}
                </div>
              </div>
            </div>

            <div className="w-2/3">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-sm font-semibold">Generated Detailed Report</h4>
                  <div className="text-xs text-gray-400">Report ID: {id}</div>
                </div>
                <div className="mt-4 text-sm text-justify prose prose-invert max-w-none whitespace-pre-wrap text-gray-200">
                  {(() => {
                    const raw = aiSummary.summary ?? 'No detailed analysis provided.';
                    // split text into segments that are bold-marked with **word**
                    const parts = raw.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
                    return parts.map((p, i) => {
                      if (/^\*\*[^*]+\*\*$/.test(p)) {
                        const inner = p.replace(/^\*\*(.*)\*\*$/, '$1');
                        return <strong key={i} className="font-semibold">{inner}</strong>;
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
  );
};

export default ReportDetail;
