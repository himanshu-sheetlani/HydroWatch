import "dotenv/config";

async function sendRandomData() {
  const data = {
    ph: (Math.random() * (7.0 - 6.8) + 6.8).toFixed(2),
    tds: Math.floor(Math.random() * (250 - 260) + 260),
    turbidity: Math.floor(Math.random() * (2-1) + 1),
    temperature: Math.floor(Math.random() * (23 - 20) + 20),
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(
      "https://hydrowatch1.onrender.com/api/iot/push_readings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "hydro12345",
        },
        body: JSON.stringify(data),
      }
    );

    const text = await res.text();
    console.log("POST status:", res.status, res.statusText);
    console.log("Response:", text);
    console.log("Sent data:", data);
  } catch (err) {
    console.error("Failed to send data:", err);
  }
}

// Send immediately, then every 10 seconds
sendRandomData();
setInterval(() => {
  sendRandomData();
}, 10000);
