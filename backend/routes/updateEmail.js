import { db } from "./firebaseAdmin.js";

export async function updateEmail(req, res) {
  // support Express-style (req, res) and direct calls like updateEmail({ email })
  const httpMode = typeof res !== 'undefined' && res && typeof res.json === 'function';
  const respond = (payload) => (httpMode ? res.json(payload) : payload);

  try {
    const source = httpMode ? req : (req && req.body ? req : { body: req });
    let { email } = source.body || {};
    const emails = Array.isArray(email)
      ? email.map((e) => String(e).trim()).filter(Boolean)
      : String(email || "")
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);

    // replace the alertEmail node with the emails array/object directly
    const alertRef = db.ref("alertEmail");
    await alertRef.set(emails);
    console.log("alertEmail updated");

    return respond({ success: true, emails });
  } catch (err) {
    return respond({ error: "Internal error" });
  }
}
