import { db } from "./firebaseAdmin.js";
import dotenv from "dotenv";
dotenv.config();

// in-memory alert state (no filesystem persistence)
let alerted = false;
let lastAlerts = [];
let lastSentAt = null;

async function sendEmail({ subject, html, toEmails }) {
  const mjPublic = process.env.MJ_APIKEY_PUBLIC;
  const mjPrivate = process.env.MJ_APIKEY_PRIVATE;
  if (!mjPublic || !mjPrivate) {
    console.error('Mailjet API keys not configured');
    return { ok: false, error: 'Mailjet keys not configured' };
  }

  // normalize recipients: prefer provided list, then firebase stored, then env
  let recipients = Array.isArray(toEmails) ? toEmails.map(String).filter(Boolean) : [];
  if (!recipients || recipients.length === 0) {
    // fallback will be handled by caller if needed
    recipients = [];
  }


  const payload = {
    Messages: [
      {
        From: { Email: process.env.EMAIL, Name: 'HydroWatch' },
        To: recipients.map((e) => ({ Email: e })),
        Subject: subject,
        HTMLPart: html,
      },
    ],
  };

  try {
    const resp = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${mjPublic}:${mjPrivate}`).toString('base64'),
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Mailjet error', resp.status, text);
      return { ok: false, status: resp.status, error: text };
    }

    const body = await resp.json();
    return { ok: true, body };
  } catch (err) {
    console.error('sendEmail error', err);
    return { ok: false, error: err.message || String(err) };
  }
}

// async function sendPushNotification({ title, body, token, alertsStr }) {
//   const fcmKey = process.env.FCM_SERVER_KEY;
//   const target = token || process.env.RECEIVER_DEVICE_TOKEN;
//   if (!fcmKey || !target) {
//     console.error('FCM key or target token not configured');
//     return { ok: false, error: 'FCM key or token not configured' };
//   }

//   const payload = {
//     to: target,
//     notification: {
//       title,
//       body,
//     },
//     data: {
//       alerts: alertsStr || '',
//     },
//   };

//   try {
//     const resp = await fetch('https://fcm.googleapis.com/fcm/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'key=' + fcmKey,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!resp.ok) {
//       const text = await resp.text();
//       console.error('FCM error', resp.status, text);
//       return { ok: false, status: resp.status, error: text };
//     }

//     const json = await resp.json();
//     return { ok: true, body: json };
//   } catch (err) {
//     console.error('sendPushNotification error', err);
//     return { ok: false, error: err.message || String(err) };
//   }
// }

export default async function alert(req, res) {
  // support Express-style calls (req, res) and direct calls like alert({ body })
  const httpMode = typeof res !== 'undefined' && res && typeof res.json === 'function';
  const respond = (statusOrPayload, maybePayload) => {
    if (httpMode) {
      if (typeof maybePayload === 'undefined') return res.json(statusOrPayload);
      return res.status(statusOrPayload).json(maybePayload);
    }
    return typeof maybePayload === 'undefined' ? statusOrPayload : maybePayload;
  };

  try {
    const source = httpMode ? req : (req && req.body ? req : { body: req });
    const { ph, tds, turbidity, temperature } = source.body;
    const alerts = [];
    if (ph < 6.5 || ph > 8.5) alerts.push('pH out of safe range');
    if (tds > 500) alerts.push('High TDS');
    if (turbidity > 5) alerts.push('High Turbidity');

    // use in-memory state
    const state = { alerted, lastAlerts, lastSentAt };

    // if readings are normal, clear any previous alerted state so future alerts can be sent
    if (alerts.length === 0) {
      if (state.alerted) {
        alerted = false;
        lastAlerts = [];
        lastSentAt = null;
        return respond({ ok: true, sent: false, reset: true });
      }
      return respond({ ok: true, sent: false });
    }

    // if already alerted for an ongoing abnormal state, skip sending again
    if (state.alerted) {
      return respond({ ok: true, sent: false, reason: 'already_sent' });
    }

    const alertsHTML = alerts.map(a => `<li>${a}</li>`).join('');

    const htmlContent = `
      <h2 style="color:#D32F2F;">⚠️ Water Quality Alert – Immediate Attention Required</h2>
      <p>Your HydroWatch system has detected abnormal water quality parameters.</p>

      <h3>🔎 Detected Issues:</h3>
      <ul>${alertsHTML}</ul>

      <h3>📊 Latest Reading:</h3>
      <ul>
        <li><b>pH:</b> ${ph}</li>
        <li><b>TDS:</b> ${tds} mg/L</li>
        <li><b>Turbidity:</b> ${turbidity} NTU</li>
        <li><b>Temperature:</b> ${temperature} °C</li>
      </ul>

      <h3>🛠 Recommended Action:</h3>
      <p>Please inspect the water source immediately.</p>

      <hr>
      <p style="font-size:12px;color:#666;">
        HydroWatch Automated Monitoring System<br>
        This is an automated alert; no reply is necessary.
      </p>
    `;

    // send email using helper
    // read recipients from Firebase alertEmail node
    let toEmails = [];
    try {
      const snap = await db.ref('alertEmail').once('value');
      const val = snap.val();
      if (Array.isArray(val)) toEmails = val.filter(Boolean);
      else if (val && typeof val === 'object') toEmails = Object.values(val).filter(Boolean);
      else if (typeof val === 'string' && val) toEmails = [val];
    } catch (err) {
      console.error('Failed to read alertEmail from db', err);
    }

    if (!toEmails || toEmails.length === 0) {
      console.error('No recipient configured (firebase or env) — skipping email send');
      return respond({ ok: true, sent: false, reason: 'no_recipients' });
    }

    const emailResult = await sendEmail({
      subject: '⚠️ HydroWatch Alert – Water Quality Threshold Breached',
      html: htmlContent,
      toEmails,
    });

    if (!emailResult.ok) {
      console.error('Email send failed', emailResult);
      return respond(500, { ok: false, sent: false, error: emailResult.error || emailResult });
    }

    // attempt push notification (non-blocking for success)
    // const pushResult = await sendPushNotification({
    //   title: '⚠️ HydroWatch Alert',
    //   body: `Issues: ${alerts.join(', ')}`,
    //   alertsStr: alerts.join('|'),
    // });

    // persist in-memory alerted state so we don't re-send until reset
    alerted = true;
    lastAlerts = alerts;
    lastSentAt = new Date().toISOString();
    return respond({ ok: true, sent: true, emailResponse: emailResult, pushResponse: null });
  } catch (err) {
    console.error(err);
    return respond(500, { ok: false, error: err.message || String(err) });
  }
}