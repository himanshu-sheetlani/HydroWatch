import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config.js";
import axios from 'axios';

const ReportDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const report = location.state?.report;
  
  const [generatedContent, setGeneratedContent] = useState(
    report?.generatedContent ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [reportData, setReportData] = useState([]);


  // Build a prompt from report + daily readings
  const buildPrompt = useCallback((reportObj, readings) => {
    const header = [`Weekly report: ${reportObj.week || 'Unknown week'}`, `Summary: ${reportObj.summary || 'No summary'}`, `Report ID: ${id}`].join('\n');

    const readingLines = (readings || []).map((r, idx) => {
      const date = r.date || `Day ${idx + 1}`;
      const ph = r.ph ?? r.pH ?? '—';
      const temp = r.temperature ?? r.temp ?? '—';
      const turb = r.turbidity ?? r.turb ?? r.ntu ?? '—';
      const tds = r.tds ?? r.TDS ?? '—';
      const note = r.note ? ` Note: ${r.note}` : '';
      return `- ${date}: pH=${ph}, Temp=${temp}, Turbidity=${turb}, TDS=${tds}.${note}`;
    }).join('\n');

    return `${header}\n\nDaily readings:\n${readingLines}\n\nInstructions:\nWrite a detailed, human-readable weekly water quality report based on the data above. Include an executive summary, observed anomalies or trends, likely causes, actionable recommendations to improve water quality, and any safety warnings. Keep the tone professional and concise.`;
  }, [id]);


  
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
  
  const readings = (dailyData && dailyData.length > 0) ? dailyData : (report.dailyReadings || report.readings || []);
  useEffect(() => {
    axios.post(`http://localhost:3000/api/generate`, { promptText: buildPrompt(report, readings) })
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching report data:', error);
      });
  }, [buildPrompt]);

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

  const score = report.score ?? (() => {
    const dr = report.dailyReadings || [];
    if (!dr.length) return null;
    const avg = Math.round(dr.reduce((s, r) => s + (r.score || 0), 0) / dr.length);
    return isNaN(avg) ? null : avg;
  })();

  const dailyReadings = (dailyData && dailyData.length > 0)
    ? dailyData
    : (report.dailyReadings || report.readings || []);

  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar />
      <div className="p-10">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Report Details</h1>
          <p className="text-gray-400 text-m">Weekly report and generated detailed analysis</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow flex gap-6">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <h3 className="text-sm text-gray-400">Score Card</h3>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{score ?? '—'}</div>
                  <div className="text-xs text-gray-400">Overall Water Quality Score</div>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${report.status === 'Approved' ? 'bg-green-900/40 text-green-400 border border-green-600/40' : 'bg-yellow-900/40 text-yellow-400 border border-yellow-600/40'}`}>
                    {report.status}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-green-500"
                    style={{ width: `${Math.max(0, Math.min(100, score ?? 0))}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">Score scale: 0 (worst) — 100 (best)</div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 h-[420px] overflow-y-auto">
              <h4 className="text-sm text-gray-300 mb-3">Daily Readings</h4>
              {dailyReadings.length === 0 ? (
                <div className="text-xs text-gray-500">No daily readings available.</div>
              ) : (
                <ul className="space-y-3">
                  {dailyReadings.map((d, i) => (
                    <li key={d.date ?? i} className="p-2 rounded bg-zinc-950/20 border border-zinc-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{d.date ?? `Day ${i + 1}`}</div>
                          <div className="text-xs text-gray-400">{d.note ?? ''}</div>
                        </div>
                        <div className="text-right text-xs space-y-1">
                          <div>pH: <span className="font-semibold">{d.ph ?? '—'}</span></div>
                          <div>Temp: <span className="font-semibold">{d.temperature ?? d.temp ?? '—'}</span></div>
                          <div>Turbidity: <span className="font-semibold">{d.turbidity ?? d.turb ?? d.ntu ?? '—'}</span></div>
                          <div>TDS: <span className="font-semibold">{d.tds ?? d.TDS ?? '—'}</span></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{report.week}</h2>
                  <p className="text-sm text-gray-300">{report.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">📅 Generated On: {report.generatedOn}</p>
                  <p className="text-xs text-gray-400">Report ID: {id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Regenerate</button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 min-h-[360px]">
              <h3 className="text-md font-semibold mb-3">Generated Detailed Report</h3>
              {loading ? (
                <div className="text-sm text-gray-400">Loading generated report...</div>
              ) : error ? (
                <div className="text-sm text-red-400">Error: {error}</div>
              ) : reportData.text ? (
                <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap">{reportData.text}</div>
              ) : (
                <div className="text-sm text-gray-500">No generated content yet.</div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
