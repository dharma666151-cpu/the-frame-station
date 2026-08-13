
import { json, makeSession, pbkdf2Hash, safeText } from "../_lib.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.OWNER_EMAIL || !env.OWNER_PASSWORD_HASH || !env.OWNER_PASSWORD_SALT || !env.SESSION_SECRET) {
    return json({ error: "Owner login is not configured yet." }, 503);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
  const email = safeText(body.email, 200).toLowerCase();
  const password = String(body.password || "");
  if (email !== String(env.OWNER_EMAIL).toLowerCase()) {
    return json({ error: "Invalid email or password." }, 401);
  }
  const hash = await pbkdf2Hash(password, env.OWNER_PASSWORD_SALT);
  if (hash !== env.OWNER_PASSWORD_HASH) {
    return json({ error: "Invalid email or password." }, 401);
  }
  const token = await makeSession(env.SESSION_SECRET, env.OWNER_EMAIL);
  return json({ ok: true }, 200, {
    "set-cookie": `tfs_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
  });
}
