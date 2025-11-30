export function apiAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.DEVICE_API_KEY) {
    return res.status(403).json({ error: "Unauthorized device" });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(404).json({ error: "Data Not Found" });
  }
  const { ph, tds, turbidity, temperature } = req.body;
  if (!ph || !tds || !turbidity || !temperature) {
    return res.status(400).json({ error: "Invalid data" });
  }
  console.log("API Auth successful");
  next();
}
