import { db } from "./firebaseAdmin.js";
import alert from "./alert.js";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export async function push_reading(body){
    console.log("function called");

    try {
    const { ph, tds, temperature, timestamp } = body;
    const numericTds = Number(tds);
    const tdsRatio = clamp((numericTds - 200) / 300, 0, 1);
    const adjustedTurbidity = Number(
      clamp(1 + tdsRatio * 4 + randomBetween(-0.15, 0.15), 1, 5).toFixed(2)
    );

    const reading = {
      ph: Number(ph),
      tds: numericTds,
      turbidity: adjustedTurbidity,
      temperature: Number(temperature),
      timestamp: timestamp || new Date().toISOString(),
    };

    alert({ body: reading });

    const newRef = db.ref("tank/readings").push();
    await newRef.set(reading);

    return ({ success: true, id: newRef.key });

  } catch (err) {
    return ({ error: "Internal error" });
  }
}
