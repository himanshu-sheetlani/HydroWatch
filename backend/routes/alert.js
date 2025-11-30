import nodemailer from "nodemailer";
import "dotenv/config";

export default async function alert(req, res) {
  const { ph, tds, turbidity, temperature } = req.body;
  const alerts = [];
  if (ph < 6.5 || ph > 8.5) alerts.push(`<li>pH out of safe range</li>`);
  if (tds > 500) alerts.push(`<li>High TDS</li>`);
  if (turbidity > 5) alerts.push(`<li>High Turbidity</li>`);

  const alertsHTML = alerts.join("");

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

  if (ph < 6.5 || ph > 8.5 || tds > 500 || turbidity > 5) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.PASSWORD, // MUST be Gmail App Password
    //   },
    // });

    await transporter.sendMail({
      from: `HydroWatch ${process.env.EMAIL}`,
      to: process.env.RECEIVER,
      subject: "⚠️ HydroWatch Alert – Water Quality Threshold Breached",
      html: htmlContent,
    });
    console.log("mail sent");
  }
}
