export function apiAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.DEVICE_API_KEY) {
    return res.status(403).json({ error: "Unauthorized device" });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(404).json({ error: "Data Not Found" });
  }
  const { ph, tds, turbidity, temperature } = req.body;
  const values = { ph, tds, turbidity, temperature };
  const hasInvalidValue = Object.values(values).some((value) => {
    if (value === undefined || value === null) {
      return true;
    }

    const numericValue = Number(value);
    return Number.isNaN(numericValue);
  });

  if (hasInvalidValue) {
    return res.status(400).json({ error: "Invalid data" });
  }

  req.body = {
    ...req.body,
    ph: Number(ph),
    tds: Number(tds),
    turbidity: Number(turbidity),
    temperature: Number(temperature),
  };
  console.log("API Auth successful");
  next();
}
