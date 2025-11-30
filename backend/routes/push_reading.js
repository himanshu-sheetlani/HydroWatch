import { db } from "./firebaseAdmin.js";
import alert from "./alert.js";

export async function push_reading(body){
    console.log("function called");

    try {
    const { ph, tds, turbidity, temperature, timestamp } = body;
    alert({ body });

    const newRef = db.ref("tank/readings").push();
    await newRef.set({
      ph,
      tds,
      turbidity,
      temperature,
      timestamp: timestamp || new Date().toISOString()
    });

    return ({ success: true, id: newRef.key });

  } catch (err) {
    return ({ error: "Internal error" });
  }
}