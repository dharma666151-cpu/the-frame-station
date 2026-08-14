
import { json, requireAdmin, safeText } from "../../_lib.js";
export async function onRequestPost(context) {
  const s = await requireAdmin(context);
  if (!s) return json({ error: "Unauthorized" }, 401);
  if (!context.env.DB) return json({ error: "D1 binding DB is missing." }, 503);
  let body;
  try { body = await context.request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  const allowed = ["site_title","tagline","hero_title","hero_text","whatsapp","delivery_text","contact_text","location_address","maps_url"];
  const statements = [];
  for (const key of allowed) {
    if (key in body) {
      statements.push(
        context.env.DB.prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
          .bind(key, safeText(body[key], 1000))
      );
    }
  }
  if (statements.length) await context.env.DB.batch(statements);
  return json({ ok: true });
}
