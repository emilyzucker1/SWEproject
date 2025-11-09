
import admin from '../firebaseAdmin.js'

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).send("Missing or invalid token");

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Canonical identity object
    req.auth = {
      uid: decoded.uid,
      email: decoded.email || null,
      admin: decoded.admin === true || decoded.role === "admin" || false,
      raw: decoded,
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(403).send("Unauthorized");
  }
}

export function ensureSelfParam(param = "uid") {
  return (req, res, next) => {
    if (!req.auth?.uid) return res.status(401).send("Unauthenticated");
    if (req.auth.admin) return next(); // allow admins

    const requested = req.params[param];
    if (requested !== req.auth.uid) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}