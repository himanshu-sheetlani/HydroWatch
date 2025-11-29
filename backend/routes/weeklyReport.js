import { db } from "./firebaseAdmin.js";
import { generateAiReport } from "./generateAiReport.js";

// -----------------------------------------
// Week Bounds
// -----------------------------------------
function getWeekBounds(now = new Date()) {
  // Use UTC to avoid timezone shifts that can make a week appear to start on Saturday
  const d = new Date(now);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const date = d.getUTCDate();
  const day = d.getUTCDay(); // 0 = Sunday

  const startOfWeek = new Date(Date.UTC(year, month, date - day, 0, 0, 0, 0));

  const endOfWeek = new Date(startOfWeek.getTime());
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7); // next Sunday
  endOfWeek.setUTCHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek,
    weekId: startOfWeek.toISOString().slice(0, 10),
  };
}

function getPreviousWeekBounds(now = new Date()) {
  const thisWeek = getWeekBounds(now);

  const prevStart = new Date(thisWeek.startOfWeek.getTime());
  prevStart.setUTCDate(thisWeek.startOfWeek.getUTCDate() - 7);
  prevStart.setUTCHours(0, 0, 0, 0);

  const prevEnd = new Date(thisWeek.startOfWeek.getTime() - 1); // just before this week's start

  return {
    startOfWeek: prevStart,
    endOfWeek: prevEnd,
    weekId: prevStart.toISOString().slice(0, 10),
  };
}

// -----------------------------------------
// Weekly Report
// -----------------------------------------
export async function generateWeeklyReport(now = new Date()) {
  try {
    const dailyRef = db.ref("tank/daily");
    const snapshot = await dailyRef.once("value");
    const dailyData = snapshot.exists() ? snapshot.val() : {};

    const {
      startOfWeek: prevStart,
      endOfWeek: prevEnd,
      weekId,
    } = getPreviousWeekBounds(now);

    // Filter previous-week entries
    const weekEntries = Object.entries(dailyData)
      .filter(([date]) => {
        const d = new Date(date);
        return d >= prevStart && d <= prevEnd;
      })
      .map(([, values]) => values);

    const avg = (arr, key) =>
      arr.length === 0
        ? 0
        : arr.reduce((sum, day) => sum + Number(day[key] || 0), 0) / arr.length;

    const phAvg = avg(weekEntries, "ph");
    const tdsAvg = avg(weekEntries, "tds");
    const turbidityAvg = avg(weekEntries, "turbidity");
    const tempAvg = avg(weekEntries, "temperature");

    // Create weekly object (use weekId as key)
    const weeklyReport = {
      weekId,
      id: weekId,
      weekStart: prevStart.toISOString(),
      weekEnd: prevEnd.toISOString(),
      ph_avg: phAvg.toFixed(2),
      tds_avg: tdsAvg.toFixed(2),
      turbidity_avg: turbidityAvg.toFixed(2),
      temp_avg: tempAvg.toFixed(2),
      score: calculateScore(phAvg, tdsAvg, turbidityAvg),
      timestamp: new Date().toISOString(),
    };

    // AI summary
    try {
      const prompt = `You are an expert water quality analyzer. Based on the following weekly averages, generate: 1. A detailed summary. 2. A "severity level" (Safe, Minor, Moderate, Critical). 3. A "score from 0–100" (100 = perfect water, 0 = unsafe). 4. Short recommendations if needed. Strict Rules for Score: - Start score at 100 - Reduce points based on any deviations from ideal values: - minimum score is 0. Return JSON only with these keys: {"summary": "...", "score": 0–100,  "severity": "...",  "recommendations": "..."}. Weekly averages: pH: ${weeklyReport.ph_avg} TDS: ${weeklyReport.tds_avg} Turbidity: ${weeklyReport.turbidity_avg} Temperature: ${weeklyReport.temp_avg} Week Range: ${weeklyReport.weekStart} to ${weeklyReport.weekEnd}`;

      const aiResult = await generateAiReport(prompt);

      weeklyReport.ai_report = { prompt };

      if (!aiResult) weeklyReport.ai_report.error = "no response";
      else if (typeof aiResult === "string")
        weeklyReport.ai_report.summary = aiResult;
      else if (aiResult.error) weeklyReport.ai_report.error = aiResult.error;
      else if (aiResult.text) weeklyReport.ai_report.summary = aiResult.text;
      else weeklyReport.ai_report.summary = JSON.stringify(aiResult);
    } catch (err) {
      console.warn("AI generation failed:", err.message);
    }

    // -----------------------------------------
    // Save weekly report: KEY = weekId (YYYY-MM-DD)
    // -----------------------------------------
    await db.ref(`tank/weekly/${weekId}`).set(weeklyReport);

    const current = getWeekBounds(now);
    const currentKey = current.weekId;

    await db.ref(`tank/weekly/${currentKey}`).set({
      weekId: current.weekId,
      id: current.weekId,
      weekStart: current.startOfWeek.toISOString(),
      weekEnd: current.endOfWeek.toISOString(),
      placeholder: true,
      timestamp: new Date().toISOString(),
    });

    return weeklyReport;
  } catch (err) {
    console.error("generateWeeklyReport error:", err);
    throw err;
  }
}

function calculateScore(ph, tds, turbidity) {
  ph = isNaN(ph) ? 7 : ph;
  tds = isNaN(tds) ? 0 : tds;
  turbidity = isNaN(turbidity) ? 0 : turbidity;

  const phScore = Math.max(0, 100 - Math.abs(ph - 7) * 15);
  const tdsScore = Math.max(0, 100 - (tds / 1000) * 100);
  const turbScore = Math.max(0, 100 - (turbidity / 100) * 100);

  return Number((phScore * 0.4 + tdsScore * 0.3 + turbScore * 0.3).toFixed(0));
}
