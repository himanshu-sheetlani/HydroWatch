import express from 'express'
import nodeCron from "node-cron";
import alert from "./routes/alert.js";
import { db } from "./routes/firebaseAdmin.js";
import "./routes/dailySnapshot.js";
// import "./testData.js";
import {generateWeeklyReport} from "./routes/weeklyReport.js";
import { generateAiReport } from './routes/generateAiReport.js';
import { push_reading } from './routes/push_reading.js';
import { apiAuth } from './middlewares/apiAuth.js';
import { updateEmail } from './routes/updateEmail.js';
import { sendNotification } from './routes/Notification.test.js';
import cors from 'cors';

const app=express()
const port=3000

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGINS.split(",") })); // or app.use(cors()) for dev

app.get('/', (req, res) => {
  res.send("HydroWatch backend is running")
})

app.post("/weekly-report", async (req, res) => {
  res.send(await generateWeeklyReport());
});

app.post("/api/alert", alert);

app.post("/api/iot/push_readings", apiAuth, async (req,  res) => {
  res.send(await push_reading(req.body));
});

app.post("/api/update-email", updateEmail);

app.post("/api/notification", sendNotification)

nodeCron.schedule("* * * * *", async () => {
  const readingsRef = db.ref("tank/readings");
  const snapshot = await readingsRef.once("value");

  const now = Date.now();
  const data = snapshot.val();

  if (!data) return;

  Object.entries(data).forEach(([key, value]) => {
    const timestamp = new Date(value.timestamp).getTime();
    // 1 minute = 60,000 ms
    if (now - timestamp > 60_000) {
      readingsRef.child(key).remove();
      console.log(`Deleted old record: ${key}`);
    }
  });
});


// Schedule weekly report generation every Sunday at 00:00 (server time)
nodeCron.schedule("0 0 * * 0", async () => {
// nodeCron.schedule("* * * * *", async () => {
  try {
    console.log("Running scheduled weekly report job (previous week)");
    await generateWeeklyReport();
    console.log("Weekly report job complete");
  } catch (err) {
    console.error("Weekly report job failed:", err);
  }
});

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})