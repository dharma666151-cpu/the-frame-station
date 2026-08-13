
import { json, requireAdmin } from "../_lib.js";
export async function onRequestGet(context) {
  const s = await requireAdmin(context);
  return s ? json({ authenticated: true, email: s.email }) : json({ authenticated: false }, 401);
}
